
const getFunctionForPattern = (patternType) => {
    if (patternType === "CANDLE"){
        const patternFn = require("./variouspatterns/candlepattern")
        return patternFn
    }
}

const getPatternsToRun = async () =>{
    return [{"type":"CANDLE","params":["BULLISH","BEARISH"]}]
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const startPatternRecognition = async () =>{
    let shrdFns = require("./sharedfunctions")
    let extSecStks = await shrdFns.getAllExtSectorsAndStocks()
    let patterns = await getPatternsToRun()
    if (extSecStks && extSecStks.length > 0){
        patterns.forEach(async element => {
            for(let i=0;i<extSecStks.length;i++){
                await delay(1000)
                await checkAndRunPattern(element,extSecStks[i].symbol)
            }
        })
    }
}

const storePattern = async (patternToStore) =>{
    if (patternToStore?.type){
        let cacheKey = "PATTERNS_" + patternToStore.stock
        let cacheitems = require("../servercache/cacheitemsredis")
        let currcache = await cacheitems.getCache(cacheKey)    
        if (currcache){
            currcache = currcache.filter(item => item.type !== patternToStore.type)
            currcache.push(patternToStore)
            console.log("cache xists",currcache)
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