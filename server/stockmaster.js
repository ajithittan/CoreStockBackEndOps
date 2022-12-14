const DBConfig = require("../config/db.config");
const { Op } = require("sequelize");
const conf = new DBConfig()

const URLConfig = require("../config/url.config.js");
const urlconf = new URLConfig()
const CORE_STOCK_MS = urlconf.CORE_STOCK_MS

const Sequelize = require("sequelize");
const sequelize = new Sequelize(conf.DB, conf.USER, conf.PASSWORD, {
    host: conf.HOST,
    dialect: conf.dialect,
    logging: false
  })

const _= require("lodash")  

//regularMarketChange: -2.3899994,
//regularMarketChangePercent: -2.0655081,
//regularMarketTime: 1613666348,
//regularMarketPrice: 113.32,
//regularMarketDayHigh: 115.63,
//regularMarketDayRange: '112.44 - 115.63',
//regularMarketDayLow: 112.44,
//regularMarketVolume: 2706938,
//regularMarketPreviousClose: 115.71,
//bid: 113.55,
//ask: 113.62,

const insertintostkprcday = async (arrofprices) => {

  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var stockpriceday = models.stockpriceday

  let transformedarr = arrofprices.map(item => ({'symbol':item.symbol,'date':item.date,'Open':item.open,
                        'high':item.high,'low':item.low,'close':item.close,'adjclose':item.adjClose,'volume':item.volume}))

  await stockpriceday.bulkCreate(transformedarr, {
        updateOnDuplicate: ["close"] 
  })
  await flushAllCache()
}

 const flushAllCache = async () =>{
  let myCache = require('../servercache/cacheitems')
  console.log("before flushing - ",myCache.getCacheStats())
  let retVal = myCache.flushAll()
  console.log("after flushing - ",myCache.getCacheStats())
  return retVal
 }

 const getStockHistDataMultiple = async (stksym,frmdate) => {
    let response=[]
    let enddt = new Date()
    let dow = enddt.getDay()

    if (dow === 1 || dow === 2 || dow === 3 || dow === 4 || dow === 5){
      enddt.setDate(enddt.getDate() - 1)
    }
    const yahooFinance = require('yahoo-finance');   
    await yahooFinance.historical({
      symbols: stksym,
      from: frmdate,
      to: enddt,
      period: 'd'
    }).then(result => response=result)
    return response
}

const getLastStockDate = async (stksym) =>{
  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var stockpriceday = models.stockpriceday
  let dbresponse = []

  await stockpriceday.findAll({where: {
    symbol: {
      [Op.eq] : stksym
    }},limit: 1,
    order: [['date', 'DESC']]
  }).then(data => dbresponse=data) 

  if (dbresponse.length > 0){
    return {stk:stksym,recentdt:dbresponse[0].date}
  }else{
    return {stk:stksym,recentdt:'1980-01-01'}
  }
}

const getDatesinBatch = async (arrofStks) =>{

  let promisesinLoop = []
  let retval = []

  for(let i=0;i<arrofStks.length;i++){
    promisesinLoop.push(getLastStockDate(arrofStks[i]))
  }

  await Promise.all(promisesinLoop)
               .then(result => retval = result)
               .catch(err => console.log("getDatesinBatch fn error",err))

  console.log("retvalretvalretvalretval",retval)
  return retval
}

 const getStockPrices = async (arrofStks) =>{
    let stkswDates = await getDatesinBatch(arrofStks)
    stkswDates = stkswDates.map(item => new Date(item.recentdt)).sort((a,b) => Date.parse(a) - Date.parse(b))[0]
    console.log("sorted value is ",stkswDates)
    let responsefromextsite = await getStockHistDataMultiple([...arrofStks],stkswDates)
    let count = 0 

    Object.values(responsefromextsite).forEach(async stockprice => {
        try{
          await insertintostkprcday(stockprice)
          await checkAndInsertIntoStockMaster(stockprice[0].symbol)
          count++
        }catch(error){
          console.log("updateAllStockPrices - Error when updateAllStockPrices",error,stockprice[0].symbol)
        }
      }
    )

    return{
      'position': arrofStks,
      'successful' :  count,
      'failed': arrofStks.length - count
    }
 }

 const doesCompanyExist = async (stkSym) =>{

    let retval = false
    var initModels = require("../models/init-models"); 
    var models = initModels(sequelize);
    var mstStkList = models.stocklist

    await mstStkList.findAll({where: {
      symbol: {
        [Op.eq] : stkSym
      }}
    }).then(data => data.length > 0 ? retval = true: null ) 

    return retval
 }

 const checkAndInsertIntoStockMaster = async (stkSym) =>{
    let retval = false

    if (await doesCompanyExist(stkSym)){
      retval = true
    }  
    else{
      let compDtls = await getCompanyDetails(stkSym)
      await insertIntoStkMaster(stkSym,compDtls.companyName,compDtls.sector,1)
    }  
    return retval
 }

 const insertIntoStkMaster = async (stksym,stkName,stkSector,track) =>{

  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var stocklist = models.stocklist
    try{
      await stocklist.create({'symbol':stksym,'name':stkName,'sector':stkSector,'updated_on':Date.now(),'track':track})
    }catch (error) {
      console.log("insertIntoStkMaster - Error",error)
    }
 }

 const getCompanyDetails = async (stkSym) =>{
    const fetch = require("node-fetch");
    let response
    try{
      await fetch(CORE_STOCK_MS + 'api/v2/companydetails/' + stkSym)
      .then(res => res.json())
      .then(json => {response=json});
    }
    catch (err){
      console.log(err)
    }
    return response
 }

 const updStockPrices = async (arrofStks) =>{

    let retval = []

    let arrayofbatches = _.chunk(arrofStks,process.env.BATCH_SIZE_STOCK_QUOTE)

    for(let i=0;i<arrayofbatches.length;i++){
      console.log("processing batch #",i,arrayofbatches[i])
      retval.push(await getStockPrices(arrayofbatches[i]))
    }

    return retval

 }


module.exports = {updStockPrices};