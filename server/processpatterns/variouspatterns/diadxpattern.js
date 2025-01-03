const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkBuyDIADXPattern = async (tp,stock,inpDate,dur,period,range) =>{
    const fetch = require("node-fetch");
    let response = {}
    //try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/adxdi/' + stock + "/" + dur + "/" + period)
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let patrcn = require("../patterncommon")
                let latestPattern = patrcn.getPatternForADate(JSON.parse(json),inpDate)
                let key = "patterns_DI_above_" + period
                let value = latestPattern[key]
                let key1 = "ADX_" + period
                let value1 = latestPattern[key1]
                if (range[0] === value && range[2] >= value1){
                    response.type=tp + "_" + period
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = ["DIAbv","ADX_"+value1]
                    console.log("Latest DIAbv,ADX_ Pattern",response)
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

const mainPattern = async (pattern,stock,inpDate,storefunction) =>{
    let retval = true
    if (pattern && pattern.params.length > 0){
        if (pattern.params[0]["BULLISH"]){
            await checkBuyDIADXPattern(pattern["type"],stock,inpDate,pattern.params[0]["duration"],pattern.params[0]["period"],
            pattern.params[0]["BULLISH"]).then(retval => storefunction(retval)).catch(err => {retval = false})
        return retval
    }}
}

module.exports = {mainPattern}