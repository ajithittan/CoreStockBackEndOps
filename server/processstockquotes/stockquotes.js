const DBConfig = require("../../config/db.config");
const { Op } = require("sequelize");
const conf = new DBConfig()

const URLConfig = require("../../config/url.config.js");
const urlconf = new URLConfig()
const CORE_STOCK_MS = urlconf.CORE_STOCK_MS

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

 const cacheIntraDayQuotes = (inpQuotes) =>{
   inpQuotes.map(quote => {
     let cacheitems = require("../../servercache/cacheitemsredis")
     cacheitems.setCacheWithTtl(process.env.CACHE_RT_STK_QT_KEY + quote.symbol,quote,process.env.CACHE_RT_STK_QT_TTL) 
   })
 }

 const syncIntraDayStockQuotes = () => {
    let qtsAdapter = require('./stockquotesadapter');
    qtsAdapter.getIntraDayStockQuotes().then(allQuotes => cacheIntraDayQuotes(allQuotes))
 }

module.exports = {syncDailyStockQuotes,syncIntraDayStockQuotes};