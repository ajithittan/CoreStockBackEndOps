const DBConfig = require("../../config/db.config");
const { Op } = require("sequelize");
const conf = new DBConfig()

const URLConfig = require("../../config/url.config.js");
const urlconf = new URLConfig()
//const PUB_MESSAGES = urlconf.PUB_MESSAGES

const Sequelize = require("sequelize");
const sequelize = new Sequelize(conf.DB, conf.USER, conf.PASSWORD, {
    host: conf.HOST,
    dialect: conf.dialect,
    logging: false
  })

const _= require("lodash")  

const insertintostkprcday = async (arrofprices) => {

  var initModels = require("../../models/init-models"); 
  var models = initModels(sequelize);
  var stockpriceday = models.stockpriceday

  let transformedarr = arrofprices.map(item => ({'symbol':item.symbol,'date':item.date,'Open':item.open,
                        'high':item.high,'low':item.low,'close':item.close,'adjclose':item.adjClose,'volume':item.volume}))
   await stockpriceday.bulkCreate(transformedarr, {
        updateOnDuplicate: ["close"] 
  })
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const getGroupByDateAndStockLatestDate = async () =>{
  let initModels = require("../../models/init-models"); 
  let models = initModels(sequelize);
  let stockpriceday = models.stockpriceday
  let dbresponse = []

  await stockpriceday.findAll({
    attributes: ['symbol', 'date'], 
    limit: 12000,
    order: [['date', 'DESC']],
    group: ['symbol','date']
  }).then(data => dbresponse=data) 
  return dbresponse
}

const getNextProbableTradingDay = (inpDate) => {
  const moment = require("moment");
  let dayIncrement = 1;

  if (moment(inpDate).day() === 5) {
    // set to monday
    dayIncrement = 3;
  } else if (moment(inpDate).day() === 6) {
    // set to monday
    dayIncrement = 2;
  }

  return moment(inpDate).add(dayIncrement, 'd').format("YYYY-MM-DD");
}

const syncDailyStockQuotes = async () =>{
  try{
    const moment = require("moment");
    let grpdates = await getGroupByDateAndStockLatestDate()
    let allrelevantstks = [...new Set(grpdates.map(item => item.symbol))]
    let dateToStart = [...new Set(grpdates.map(item => item.date))].pop()
    console.log("grpdates",dateToStart,allrelevantstks)
    let qtsAdapter = require('./stockquotesadapter');
    let keepgoing = true
    while (keepgoing){
      dateToStart = getNextProbableTradingDay(dateToStart)
      console.log("getting for date - ",dateToStart)
      if(moment().diff(moment(dateToStart)) < 0){
        keepgoing = false
      }else{
        let alldata = await qtsAdapter.getDailyStockQuotes(dateToStart)
        if(alldata && alldata.length > 0){
          alldata = alldata.filter(item => allrelevantstks.includes(item.symbol))
          insertintostkprcday(alldata)
        }  
      }
      await delay(10000)
    }
  }
  catch (err){
    console.log(err)
  } 
 }

 const cacheIntraDayQuotes = async (inpQuotes) =>{
   inpQuotes.map(quote => {
     let cacheitems = require("../../servercache/cacheitemsredis")
     cacheitems.setCacheWithTtl(process.env.CACHE_RT_STK_QT_KEY + quote.symbol,quote,process.env.CACHE_RT_STK_QT_TTL) 
     cacheitems.setCacheWithTtl(process.env.CACHE_RT_STK_QT_FULL_KEY + quote.symbol,quote,process.env.CACHE_RT_STK_QT_FULL_TTL) 
   })
 }

 const publishMessage =  async (type,message) =>{
  let pubMsg = {}
   try{
       pubMsg.channel = type
       pubMsg.message = message
       const fetch = require("node-fetch"); 
       await fetch(urlconf.PUB_MESSAGES, {method:'post', body: JSON.stringify(pubMsg), 
                                         headers: { 'Content-Type': 'application/json' }})
       .then(res => console.log("Message posted to redis queue",type))
   }
   catch (err){
       console.log("error in publishMessage",err)
   }
}

const getAllStocksFromDB = async () => {
  let retval
  let myCache = require('../../servercache/cacheitems')  
  let cacheVal = myCache.getCache(process.env.CACHE_ALL_STOCKS_DB)
  if (cacheVal){
    console.log("found in cache")
    retval = cacheVal
  }else{
      console.log("not found in cache")
      let initModels = require("../../models/init-models"); 
      let models = initModels(sequelize);
      let stocklist = models.stocklist
      await stocklist.findAll({attributes: ['symbol']}).then(data => retval=data) 
      myCache.setCacheWithTtl(process.env.CACHE_ALL_STOCKS_DB,retval,process.env.CACHE_ALL_STOCKS_DB_TTL)
  }
  console.log("retval",retval.map(item => item.symbol))
  return retval
} 

 //send a message to the pub/sub to initiate the flow
 const initiateWorkFlow = async (inpQuotes) =>{
    //const shrdfns = require('../sharedfunctions')
    //let inpvals = inpQuotes.map(function (obj) {return ({"symbol":obj.symbol})})
    //inpvals = await shrdfns.prioritizeAndSeqStks(inpvals)
    let inpstks = await getAllStocksFromDB()
    publishMessage("INITIATE_WORK_FLOW_INTRA_DAY",inpstks)
 }

 const processIntraDayStockQuotes = async () => {
    const moment = require("moment");
    let statusOfProcess = false
    let returnInformation = {}
    let qtsAdapter = require('./stockquotesadapter');
    try {
      let allQuotes = await qtsAdapter.getIntraDayStockQuotes()
      await cacheIntraDayQuotes(allQuotes)
      initiateWorkFlow(allQuotes)  
      statusOfProcess = true
      returnInformation = {'updatedquotes':allQuotes?.length,'date':moment().format("YYYY-MM-DD")}
    } catch (error) {
      returnInformation = {'err':error,'date':moment().format("YYYY-MM-DD")}
      console.log("error in processIntraDayStockQuotes", error)
    }
    return {statusOfProcess,returnInformation}
 }

 const syncIntraDayStockQuotes = async () => {
  let deco = require("../Util/decortorcalctimetaken")
  return await deco.TimeTakenDecorator(processIntraDayStockQuotes,"intradaystockprice")()
}

module.exports = {syncDailyStockQuotes,syncIntraDayStockQuotes};