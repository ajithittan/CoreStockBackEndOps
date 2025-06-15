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
    const moment = require("moment");
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
        retval.volumetp = item["min"]["v"]
        //time is in nano seconds and moment needs it in milliseconds - epochtime convert
        retval.date = moment(parseInt(item["updated"])/1000000).format("YYYY-MM-DD")
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

const isMarketClosed = async (inpDate) =>{
    const fetch = require("node-fetch");
    let response = []
    try{
        await fetch("https://api.polygon.io/v1/marketstatus/upcoming?apiKey="+process.env.API_KEY_POLYGON).then(res => res.json()).then(json => {
            response = json.filter(item => item["date"] === inpDate && item["status"] === "closed" && item["exchange"] === "NYSE")
          });
    }catch(err){
        console.log("error in polygon function isMarketClosed",inpDate,err)
    }
    return response.length
}

const getQuotesForDateRange = async (stock,inpFrmDate,inpToDate,inpRange,inpLimit) =>{
    const fetch = require("node-fetch");
    const moment = require("moment");
    let response = []
    let url = "https://api.polygon.io/v2/aggs/ticker/"+stock+"/range/"+inpRange+"/day/"+inpFrmDate+"/"+inpToDate+"?adjusted=true&sort=asc&limit="+inpLimit+"&apiKey="+process.env.API_KEY_POLYGON
    try{
        await fetch(url).then(res => res.json()).then(json => {
            response = json
            response = response["results"].map(obj => ({symbol: stock, open:obj.o,high:obj.h, low:obj.l,close:obj.c,adjclose:obj.c,
                volume:obj.v,date:moment(obj.t).format('YYYY-MM-DD')}))  
          });
    }catch(err){
        console.log("error in polygon function getQuotesForDateRange",err)
        response=[]
    }
    return response
}

module.exports={getQuotesForDate,getPreviousCloseDay,getCurrentSnapShotQuotesAllStocks,isMarketClosed,getQuotesForDateRange}