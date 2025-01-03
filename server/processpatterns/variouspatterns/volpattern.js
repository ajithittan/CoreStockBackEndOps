const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBuyOBVVolPattern = async (tp,stock,inpDate,dur,period,range) =>{
    const fetch = require("node-fetch");
    let response = {}
    //try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/volobv/' + stock + "/" + dur + "/" + period)
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let patrcn = require("../patterncommon")
                let latestPattern = patrcn.getPatternForADate(JSON.parse(json),inpDate)
                let key = "pattern_vol_obv_" + period
                let value = latestPattern[key]
                if (range.includes(value)){
                    response.type=tp + "_" + period
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = [String(Boolean(value))]
                    //console.log("Latest OBV Vol Pattern",Boolean(value))
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
            await checkBuyOBVVolPattern(pattern["type"],stock,inpDate,pattern.params[0]["duration"],pattern.params[0]["period"]
            ,pattern.params[0]["BULLISH"]).then(retval => storefunction(retval)).catch(err => {retval = false})
        return retval
    }}
}

module.exports = {mainPattern}