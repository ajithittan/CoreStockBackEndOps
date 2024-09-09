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

module.exports = {getDailyStockQuotes};