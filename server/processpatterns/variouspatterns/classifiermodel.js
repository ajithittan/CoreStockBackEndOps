const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN
const moment = require("moment");

const checkKNNClassifierPattern = async (tp,stock,inpDate,params) =>{
    const fetch = require("node-fetch");
    let response = {}
    try{
        await fetch(PRED_PATTERN_URL + 'predictions/' + stock, {method:'post', body:JSON.stringify(params), 
        headers: { 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(json => {
            let patrcn = require("../patterncommon")
            let latestPattern = patrcn.getPatternForADate(JSON.parse(JSON.parse(json).prediction),inpDate)
            var retval = JSON.parse(json);
            if (retval.modelstats.accuracy > 0.70 && latestPattern.prediction === 1){
                response.type=tp
                response.bullish=true
                response.stock = stock
                response.date = moment(latestPattern["date"]).format(moment.HTML5_FMT.DATE)
                response.bullishpatterns = [retval.upside.toFixed(2)*100 + "%" + "/" + retval.modelstats.accuracy.toFixed(2)*100 + "%"]
                console.log("checkKNNClassifierPattern",stock,response)
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

const mainPattern = async (pattern,stock,inpDate,storefunction) =>{
        checkKNNClassifierPattern(pattern["type"],stock,inpDate,pattern["params"]).then(retval => storefunction(retval))
    return true
}

module.exports = {mainPattern}