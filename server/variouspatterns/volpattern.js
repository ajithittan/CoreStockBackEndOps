const URLConfig = require("../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBuyOBVVolPattern = async (tp,stock,dur,period,range) =>{
    const fetch = require("node-fetch");
    let response = {}
    try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/volobv/' + stock + "/" + dur + "/" + period)
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let latestPattern = JSON.parse(json).pop()
                let key = "pattern_vol_obv_" + period
                let value = latestPattern[key]
                if (range.includes(value)){
                    response.type=tp + "_" + period
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = [String(Boolean(value))]
                    console.log("Latest OBV Vol Pattern",Boolean(value))
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
    if (pattern && pattern.params.length > 0){
            pattern.params.forEach(async element => {
            if (element["BULLISH"]){
                checkBuyOBVVolPattern(pattern["type"],stock,element["duration"],element["period"],element["BULLISH"]
                ).then(retval => storefunction(retval))
            }
        });
    }
    return true
}

module.exports = {mainPattern}