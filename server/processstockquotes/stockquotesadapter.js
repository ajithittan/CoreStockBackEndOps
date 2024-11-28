 const getDailyStockQuotes = async (fromInpDate) =>{
  let retval = {}   
  try{
    var polygondata = require('../../server/externalsites/polygondata');
    retval = await polygondata.getQuotesForDate(fromInpDate)
  }
  catch (err){
    console.log(err)
  } 
  return retval
 }

 const getIntraDayStockQuotes = async () =>{
  let retval = []  
  try{
    if (!await checkIfMarketIsClosed()){
      var polygondata = require('../../server/externalsites/polygondata');
      retval = await polygondata.getCurrentSnapShotQuotesAllStocks()  
    }
  }
  catch (err){
    console.log("Error in getIntraDayStockQuotes fn",err)
  } 
  return retval
 }

 const checkIfMarketIsClosed = async () =>{
  const moment = require("moment");
  const today = moment().format('YYYY-MM-DD');
  var polygondata = require('../../server/externalsites/polygondata');
  return await polygondata.isMarketClosed(today)
 }

module.exports = {getDailyStockQuotes,getIntraDayStockQuotes};