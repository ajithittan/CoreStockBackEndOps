const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBullishCandlePattern = async (stock,dur,inpDate,tp) =>{
    const bullishPatterns = [
                            "CDLHAMMER","CDLINVERTEDHAMMER","CDLENGULFING","CDLPIERCING","CDLMORNINGSTAR",
                            "CDLMORNINGDOJISTAR","CDLTRISTAR","CDLHARAMI","CDLHARAMICROSS","CDLDOJI","CDLABANDONEDBABY",
                            "CDLBREAKAWAY","CDL3INSIDE","CDL3OUTSIDE","CDLKICKING","CDLUNIQUE3RIVER","CDLCONCEALBABYSWALL",
                            "CDLSTICKSANDWICH","CDLHOMINGPIGEON","CDLLADDERBOTTOM"]
    const fetch = require("node-fetch");
    let response = {}
    //try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/candle/' + stock + "/" + dur + "/ALL")
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let patrcn = require("../patterncommon")
                let latestPattern = patrcn.getPatternForADate(JSON.parse(json),inpDate)
                let matchedPatterns = []
                bullishPatterns.forEach(item =>{
                    if (latestPattern[item] > 0){
                        matchedPatterns.push(item)
                        //console.log("found pattern > 0" , latestPattern[item], item,stock)
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
    /***}
    catch (err){
      //console.log(err)
    } */
    return response
}

const checkBearishCandlePattern = (stock) =>{

}

const checkForACandlePattern = (stock) =>{

}

const mainPattern = async (pattern,stock,inpDate,storefunction) =>{
    let retval = true
    if (pattern && pattern.params.length > 0){

        if (pattern.params[0] === "BULLISH"){
            await checkBullishCandlePattern(stock,pattern["duration"],inpDate,pattern.type).then(retval => {storefunction(retval)})
                .catch(err => {retval = false})
        }

            /**
            pattern.params.forEach(async element => {
            if (element === "BULLISH"){
                await checkBullishCandlePattern(stock,duration,inpDate,pattern.type).then(retval => {storefunction(retval);Promise.resolve(retval)})
                    .catch(err => {console.log("in here?") ; Promise.reject(err)})
            }
             
        });*/
        return retval
    }
}

module.exports = {mainPattern}