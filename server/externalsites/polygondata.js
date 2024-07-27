const getQuotesForDate = async (forDate) => {
    const fetch = require("node-fetch");
    const moment = require("moment");
    let response = {}
    try{
        await fetch("https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/"+forDate+"?adjusted=true&apiKey="+process.env.API_KEY_POLYGON).then(res => res.json()).then(json => {
            response = json
            response = response["results"].map(obj => ({symbol: obj.T, open:obj.o,high:obj.h, low:obj.l,close:obj.c,adjClose:obj.c,
                volume:obj.v,date:moment(obj.t).subtract(5, 'hours').format('YYYY-MM-DD')}))  
          });
    }catch(err){
        console.log("error in polygon function getQuotesForDate",err)
    }
    return response
}

const getPreviousCloseDay = async () =>{
    const fetch = require("node-fetch");
    const moment = require("moment");
    let response = {}
    try{
        await fetch("https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey="+process.env.API_KEY_POLYGON).then(res => res.json()).then(json => {
            response = json
            response = response["results"][0]["t"]  
          });
    }catch(err){
        console.log("error in polygon function getPreviousCloseDay",err)
    }
    return moment(response).subtract(5, 'hours').format("YYYY-MM-DD")
}

module.exports={getQuotesForDate,getPreviousCloseDay}