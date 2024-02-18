
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
                                    {"BEARISH":[0],"period":50,"duration":12},]},
            {"type":"OBV","params":[{"BULLISH":[1],"period":10,"duration":12},
                                    {"BEARISH":[0],"period":10,"duration":12},]}]
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const startPatternRecognition = async () =>{
    let shrdFns = require("./sharedfunctions")
    let extSecStks = await shrdFns.getAllExtSectorsAndStocks()
    let patterns = await getPatternsToRun()
    if (extSecStks && extSecStks.length > 0){
        patterns.forEach(async (element,indx) => {
            //avoid race condition writing to redis.
            indx == 0 ? delayattr = 1000 : delayattr = 1000 + indx*800
            loopThroughStocks(element,extSecStks,delayattr)
        })
    }
}

const loopThroughStocks = async (pattern,extSecStks,delayattr) =>{
    for(let i=0;i<extSecStks.length;i++){
        await delay(delayattr)
        await checkAndRunPattern(pattern,extSecStks[i].symbol)
    }
}

const storePattern = async (patternToStore) =>{
    if (patternToStore?.type){
        let cacheKey = "PATTERNS_" + patternToStore.stock
        let cacheitems = require("../servercache/cacheitemsredis")
        let currcache = await cacheitems.getCache(cacheKey)    
        if (currcache){
            await cacheitems.delCachedKey(cacheKey)
            currcache = currcache.filter(item => item.type !== patternToStore.type)
            currcache.push(patternToStore)
        }else{
            currcache = [patternToStore]
        }
        cacheitems.setCacheWithTtl(cacheKey,currcache,36000)  
    }
}

const checkAndRunPattern = async (pattern,stock) => {
    const fnToRun = getFunctionForPattern(pattern.type)
    fnToRun.mainPattern(pattern,stock,storePattern)
    return true
}

module.exports={startPatternRecognition}