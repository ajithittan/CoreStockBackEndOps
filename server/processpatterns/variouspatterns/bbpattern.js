const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBuyBBPattern = async (tp,stock,dur,inpDate,period,range) =>{
    const fetch = require("node-fetch");
    let response = {}
    //try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/bb/' + stock + "/" + dur + "/" + period)
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let patrcn = require("../patterncommon")
                let latestPattern = patrcn.getPatternForADate(JSON.parse(json),inpDate)
                let key = "patterns_bb_priceclose_" + period
                let value = latestPattern[key]
                if (range.includes(value)){
                    response.type=tp + "_" + period
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = [value]
                    //console.log("Latest Bollinger Band Pattern",response)
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
        if (pattern.params[0]["BULLISH"]){
            await checkBuyBBPattern(pattern["type"],stock,pattern.params[0]["duration"],inpDate,pattern.params[0]["period"],
            pattern.params[0]["BULLISH"]).then(retval => storefunction(retval)).catch(err => {retval = false})

        return retval
    }
    }
}

module.exports = {mainPattern}