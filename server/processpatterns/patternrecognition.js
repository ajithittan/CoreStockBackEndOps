
const getFunctionForPattern = (patternType) => {
    if (patternType === "CANDLE"){
        const patternFn = require("./variouspatterns/candlepattern")
        return patternFn
    }else if(patternType === "RSI"){
        const patternFn = require("./variouspatterns/rsipattern")
        return patternFn
    }else if(patternType === "BB"){
        const patternFn = require("./variouspatterns/bbpattern")
        return patternFn
    }else if(patternType === "MACD"){
        const patternFn = require("./variouspatterns/macdpattern")
        return patternFn
    }else if(patternType === "OBV"){
        const patternFn = require("./variouspatterns/volpattern")
        return patternFn
    }else if(patternType === "DIADX"){
        const patternFn = require("./variouspatterns/diadxpattern")
        return patternFn
    }else if(patternType === "ADOSC"){
        const patternFn = require("./variouspatterns/adoscvolpattern")
        return patternFn
    }else if(patternType === "CLASS_MDL"){
        const patternFn = require("./variouspatterns/classifiermodel")
        return patternFn
    }
}

const getPatternsToRun = async () =>{
    return [
            {"type":"CANDLE","params":["BULLISH","BEARISH"]},
            {"type":"RSI","params":[{"BULLISH":[0,35],"period":14,"duration":12},
                                    {"BEARISH":[70,100],"period":14,"duration":12},]},
            {"type":"BB","params":[{"BULLISH":["lower","middle"],"period":50,"duration":12},
                                    {"BEARISH":["upper"],"period":50,"duration":12},]},
            {"type":"MACD","params":[{"BULLISH":[1,2,3],"period":26,"duration":12},
                                    {"BEARISH":[0],"period":26,"duration":12},]},
            //{"type":"OBV","params":[{"BULLISH":[1],"period":14,"duration":12},
                                    //{"BEARISH":[0],"period":14,"duration":12},]}
            {"type":"ADOSC","params":[{"BULLISH":[-5,-4,-3,-2,-1,1,2],"period":14,"duration":12},
                                    {"BEARISH":[0],"period":14,"duration":12},]}                                    
            ,{"type":"DIADX","params":[{"BULLISH":[1,23],"period":14,"duration":12},
                                    {"BEARISH":[0,23],"period":14,"duration":12},]},
            {"type":"CLASS_MDL","params":{
                'daysAhead': 8, 
                'features': [{'feature': 'BB', 'value': '50'},{'feature': 'MACD', 'value': '14'}, 
                {'feature': 'DI', 'value': '14'},{'feature': 'ADX', 'value': '14'},{'feature': 'CPER'},
                {'feature': 'RSI', 'value': '14'}], 
                'predictlastdays': 60,
                'model':"KNNCLASS"}}                                        
            ]
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const startPatternRecognition = async (inpDate) =>{
    let shrdFns = require("../sharedfunctions")
    let extSecStks = await shrdFns.getAllExtSectorsAndStocks()
    let patterns = await getPatternsToRun()
    if (extSecStks && extSecStks.length > 0){
        patterns.forEach(async (element,indx) => {
            //avoid race condition writing to redis.
            indx == 0 ? delayattr = 1000 : delayattr = 1000 + indx*800
            loopThroughStocks(element,extSecStks,delayattr,inpDate)
        })
    }
}

const loopThroughStocks = async (pattern,extSecStks,delayattr,inpDate) =>{
    console.time('loopThroughStocks' + pattern.type);
    for(let i=0;i<extSecStks.length;i++){
        await delay(delayattr)
        await checkAndRunPattern(pattern,extSecStks[i].symbol,inpDate)
        if (pattern.type ==="CLASS_MDL"){
            await delay(delayattr*8)
        }
    }
    console.timeEnd('loopThroughStocks' + pattern.type);
}

const storePattern = async (patternToStore) =>{
    if (patternToStore?.type){
        let cacheKey = "PATTERNS_" + patternToStore.stock
        let cacheitems = require("../../servercache/cacheitemsredis")
        let currcache = await cacheitems.getCache(cacheKey)
        if (currcache){
            await cacheitems.delCachedKey(cacheKey)
            currcache = currcache.filter(item => item.type !== patternToStore.type)
            currcache.push(patternToStore)
            validateAndAddToWatchList(currcache)
        }else{
            currcache = [patternToStore]
        }
        cacheitems.setCacheWithTtl(cacheKey,currcache,36000)  
    }
}

const addToWatchList = async (patternToAdd) =>{
    let shrdFns = require("../sharedfunctions")
    shrdFns.addStockPatterns(patternToAdd[0].stock,patternToAdd[0].date,patternToAdd)
}

const validateAndAddToWatchList = async (allPatterns) =>{
    const patternRules = require("./patternrules")
    const rules = await patternRules.getPatternRulesToWatch()
    rules.forEach(rule =>{
        patternRules.getPatternRuleFunction(rule.type).then(resFn => resFn(allPatterns,rule)).then((storeData) => {
            if (storeData){
                addToWatchList(storeData)
            }
        })
    })
}

const checkAndRunPattern = async (pattern,stock,inpDate) => {
    const fnToRun = getFunctionForPattern(pattern.type)
    fnToRun.mainPattern(pattern,stock,inpDate,storePattern)
    return true
}

module.exports={startPatternRecognition}