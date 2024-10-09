const getQuotesForDate = async (forDate) => {
    const fetch = require("node-fetch");
    const moment = require("moment");
    let response = {}
    try{
        await fetch("https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/"+forDate+"?adjusted=true&apiKey="+process.env.API_KEY_POLYGON).then(res => res.json()).then(json => {
            response = json
            response = response["results"].map(obj => ({symbol: obj.T, open:obj.o,high:obj.h, low:obj.l,close:obj.c,adjclose:obj.c,
                volume:obj.v,date:moment(obj.t).subtract(5, 'hours').format('YYYY-MM-DD')}))  
          });
    }catch(err){
        console.log("error in polygon function getQuotesForDate",err)
        response=[]
    }
    return response
}

const getPreviousCloseDay = async () =>{
    const fetch = require("node-fetch");
    const moment = require("moment");
    let response = {}
    try{
        //This is just using appl stock to get the previous day
        await fetch("https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey="+process.env.API_KEY_POLYGON).then(res => res.json()).then(json => {
            response = json
            response = response["results"][0]["t"]  
          });
    }catch(err){
        console.log("error in polygon function getPreviousCloseDay",err)
    }
    return moment(response).subtract(5, 'hours').format("YYYY-MM-DD")
}

const formatAllSnapShots = (inpData) =>{
    return inpData["tickers"].map(item => {
        let retval = {}
        retval.symbol = item["ticker"]
        retval.close = item["day"]["c"]
        retval.volume = item["day"]["v"]
        retval.perchange = +parseFloat(item["todaysChangePerc"]).toFixed(2)
        retval.prevchange = +parseFloat(item["todaysChange"]).toFixed(2)
        retval.open = item["day"]["o"]
        retval.high = item["day"]["h"]
        retval.low = item["day"]["l"]
        retval.prevclose = item["prevDay"]["c"]
        retval.updated = item["updated"]
        return retval
    })
}

const getCurrentSnapShotQuotesAllStocks = async () =>{
    const fetch = require("node-fetch");
    let response = []
    try{
        await fetch("https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey="+process.env.API_KEY_POLYGON).then(res => res.json()).then(json => {
            response = formatAllSnapShots(json)
          });
    }catch(err){
        console.log("error in polygon function getCurrentSnapShotQuotesAllStocks",err)
    }
    return response
}

module.exports={getQuotesForDate,getPreviousCloseDay,getCurrentSnapShotQuotesAllStocks}