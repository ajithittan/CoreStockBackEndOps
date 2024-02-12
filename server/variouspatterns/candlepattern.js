const URLConfig = require("../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBullishCandlePattern = async (stock,dur,tp) =>{
    const bullishPatterns = [
                            "CDLHAMMER","CDLINVERTEDHAMMER","CDLENGULFING","CDLPIERCING","CDLMORNINGSTAR",
                            "CDLMORNINGDOJISTAR","CDLTRISTAR","CDLHARAMI","CDLHARAMICROSS","CDLDOJI","CDLABANDONEDBABY",
                            "CDLBREAKAWAY","CDL3INSIDE","CDL3OUTSIDE","CDLKICKING","CDLUNIQUE3RIVER","CDLCONCEALBABYSWALL",
                            "CDLSTICKSANDWICH","CDLHOMINGPIGEON","CDLLADDERBOTTOM"]
    const fetch = require("node-fetch");
    let response = {}
    try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/candle/' + stock + "/" + dur + "/ALL")
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let latestPattern = JSON.parse(json).pop()
                let matchedPatterns = []
                bullishPatterns.forEach(item =>{
                    if (latestPattern[item] > 0){
                        matchedPatterns.push(item)
                        console.log("found pattern > 0" , latestPattern[item], item,stock)
                    }
                })        
                if (matchedPatterns.length > 0){
                    response.type=tp
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = matchedPatterns
                }
            }
        });
    }
    catch (err){
      console.log(err)
    }
    return response
}

const checkBearishCandlePattern = (stock) =>{

}

const checkForACandlePattern = (stock) =>{

}

const mainPattern = async (pattern,stock,storefunction) =>{
    let duration = 1
    if (pattern && pattern.params.length > 0){
            pattern.params.forEach(async element => {
            if (element === "BULLISH"){
                checkBullishCandlePattern(stock,duration,pattern.type).then(retval => storefunction(retval))
            }
        });
    }
    return true
}

module.exports = {mainPattern}