const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBuyADOSCVolPattern = async (tp,stock,inpDate,dur,period,range) =>{
    const fetch = require("node-fetch");
    let response = {}
    //try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/voladosc/' + stock + "/" + dur + "/" + period)
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let patrcn = require("../patterncommon")
                let latestPattern = patrcn.getPatternForADate(JSON.parse(json),inpDate)
                let key = "pattern_vol_adosc_" + period
                let value = latestPattern[key]
                if (range.includes(value)){
                    response.type=tp + "_" + period
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = [value]
                    //console.log("Latest ADOSC Vol Pattern",stock, value)
                }
            }
        });
    /**}
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
            await checkBuyADOSCVolPattern(pattern["type"],stock,inpDate,pattern.params[0]["duration"],pattern.params[0]["period"],pattern.params[0]["BULLISH"]
            ).then(retval => storefunction(retval)).catch(err => {retval = false})}

        return retval
    }
}

module.exports = {mainPattern}