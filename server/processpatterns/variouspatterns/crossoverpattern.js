const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const checkCOPattern = async (tp,stock,dur,inpDate,period,params) =>{
    const fetch = require("node-fetch");
    let moment = require("moment-business-days")
    let response = {}
    try{
      await fetch(PRED_PATTERN_URL + 'predictions/patterns/crossovers/' + stock + "/" + params["type1"] + "/" + 
                    params["type2"] + "/" + dur)
      .then(res => res.json())
      .then(json => {
            if (!JSON.parse(json)["error"]){
                let patrcn = require("../patterncommon")
                let latestPattern = patrcn.getPatternForADate(JSON.parse(json),inpDate)
                let key = "patterns_" + params["type1"].toLowerCase() + "_" + params["type2"].toLowerCase()
                let value = latestPattern[key]
                const startDate = moment(latestPattern["date"]); 
                const endDate = moment()
                const businessDaysDiff = startDate.businessDiff(endDate); 
                if (businessDaysDiff <= parseInt(params["success"]) && value > 0){
                    console.log("adding to cache...",businessDaysDiff,stock,params["type1"],params["type2"])
                    response.type=tp.toLowerCase()
                    response.bullish=true
                    response.stock = stock
                    response.duration = dur
                    response.date = latestPattern["date"]
                    response.bullishpatterns = ["CrossOver-" + businessDaysDiff]
                    //console.log("Latest Bollinger Band Pattern",response)
                }
            }
        });
    }
    catch (err){
      console.log(err)
    }
    return response
}

const mainPattern = async (pattern,stock,inpDate,storefunction) =>{
    if (pattern && pattern.params.length > 0){
            pattern.params.forEach(async element => {
            if (element["BULLISH"]){
                checkCOPattern(pattern["type"],stock,element["duration"],inpDate,element["period"],element["BULLISH"]
                ).then(retval => storefunction(retval))
            }
        });
    }
    return true
}

module.exports = {mainPattern}