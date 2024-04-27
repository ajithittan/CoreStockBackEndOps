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
    console.log("stksym",stksym)
    let response=[]
    let enddt = new Date()
    let dow = enddt.getDay()
    let promisesinLoop = []

    if (dow === 1 || dow === 2 || dow === 3 || dow === 4 || dow === 5){
      enddt.setDate(enddt.getDate() - 1)
    }
    const yahooFinance = require('./externalsites/yahooquotes')
    for(let i=0;i<stksym.length;i++){
      promisesinLoop.push(yahooFinance.getQuotesWithDates(stksym[i],frmdate,enddt).then(result => response=result))
    }
  
    await Promise.all(promisesinLoop)
                 .then(result => response = result)
                 .catch(err => console.log("getDatesinBatch fn error",err))
    
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
          console.log("updateAllStockPrices - Error when updateAllStockPrices",error,stockprice)
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
    try{
      let compDtls = await getCompanyDetails(stkSym)
      let sector = compDtls.sector || "UNKOWN"
      await insertIntoStkMaster(stkSym,compDtls.companyName,sector,1)  
    }catch{
      console.log("error in function checkAndInsertIntoStockMaster", stkSym)
    }
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
      console.log("insertIntoStkMaster - Error",stksym,error)
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
      await delay(_.random(2000, 5000))
    }

    return retval

 }

 const getExistingPositions = async (userId,stkSym) => {
    var initModels = require("../models/init-models"); 
    var models = initModels(sequelize);
    var usrPrflio = models.userportfolio
    let response = []
    try{
      await usrPrflio.findAll({where: {
          symbol: {
            [Op.eq] : stkSym
          },iduserprofile: {
            [Op.eq] : userId
          }
        }
      }).then(data => response = data) 
    }catch (err){
        console.log("error in function - getExistingPositions",err)
    }
    return response
 }

 const insertorUpdPortfolio = async (userId,stksym,positon) =>{

    var initModels = require("../models/init-models"); 
    var models = initModels(sequelize);
    var usrPrflio = models.userportfolio
    try{
        await usrPrflio.upsert({'iduserprofile': userId,
                              'symbol':stksym,
                              'positions':positon,
                              'create_dt':Date.now()})
    }catch (error) {
        console.log("insertIntoPortfolio - Error",error)
    }
 }

 const deleteStockPortfolio = async (userId,stkSym) =>{

  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var usrPrflio = models.userportfolio
  try{
      await usrPrflio.destroy({where: {
        symbol: {
          [Op.eq] : stkSym
        },iduserprofile: {
          [Op.eq] : userId
        }
      }
    })
  }catch (error) {
      console.log("deleteStockPortfolio - Error",error)
  }
}

 const processUserStockPositions = async (inpData) => {
    let existingpos = await getExistingPositions(inpData.userId,inpData.stock)
    let positionsToInsert = []
    if (existingpos && existingpos.length > 0){
        positionsToInsert = existingpos[0].positions
    }
    positionsToInsert.push(inpData.position) 
    insertorUpdPortfolio(inpData.userId,inpData.stock,positionsToInsert)
 }

 const deleteUserStockPosition = async (inpData) =>{
    let existingpos = await getExistingPositions(inpData.userId,inpData.stock)
    let filteredVal = existingpos[0].positions.filter(item => !(item.date === inpData.position.date 
                                                                && item.close === inpData.position.close))
    if (filteredVal.length > 0 ){
      insertorUpdPortfolio(inpData.userId,inpData.stock,filteredVal)
    }else{
      deleteStockPortfolio(inpData.userId,inpData.stock)
    }
 }

 const getCompanyName = async (stkSym) =>{
    let initModels = require("../models/init-models"); 
    let models = initModels(sequelize);
    let stkcik = models.stockcik
    let response = {}
    try{
        await stkcik.findAll({where: {
          symbol: {
            [Op.eq] : stkSym
          }}
        }).then(data => response = data[0]) 
    }catch (error) {
        console.log("getCompanyName - Error",error)
    }
    return response
 }

 const enrichCacheWithData = async (inpVal) =>{
    let compName = await getCompanyName(inpVal["symbol"])
    if (compName){
      inpVal.companyname = compName.title
    }
    return inpVal
 }

 const writeToCache = async (inpQuotes) =>{
    let cacheitems = require("../servercache/cacheitemsredis")
    for(let i=0;i<inpQuotes.length;i++){
      let cacheKey = process.env.STOCK_INFO + inpQuotes[i]["symbol"].toUpperCase()
      enrichCacheWithData(inpQuotes[i]).then(retval => cacheitems.setCacheWithTtl(cacheKey,retval,36000))
    }
    return true
 }

 const clearBatchFromCache = (inpKey) =>{
  let cacheitems = require("../servercache/cacheitemsredis")
  cacheitems.delCachedKey(inpKey)
 }

 const extractQuotesAndNormalize = async() => {
    const fetch = require("node-fetch");
    let arrOfUrlAppends = JSON.parse(process.env.EXT_QUOTE_TYPES)
    for (let j=0;j<arrOfUrlAppends.length;j++){
      for (let i=0;i<10;i++){
        let url = urlconf.EXTERNAL_QUOTES + arrOfUrlAppends[j] + i;
        console.log("url",url)
        fetch(url)
        .then(res => res.json())
        .then(out =>{
          writeToCache(JSON.parse(out["data"]))
          clearBatchFromCache(process.env.CACHE_EXT_STK_QT + arrOfUrlAppends[j] + i)
        })
        .catch(err => { console.log("error not a json") });
      }  
    }
 }

 const updateEachStockSECData = async (stkSym) =>{
    const fetch = require("node-fetch");
    let response
    try{
      await fetch(urlconf.HOST + 'extsrcs/companyfacts/recordonlinefacts/' + stkSym , {method:'post', 
      headers: { 'Content-Type': 'application/json' }})
      .then(res => res.json())
      .then(json => {response=json});
    }
    catch (err){
      console.log(err)
    } 
 }

 const delay = ms => new Promise(res => setTimeout(res, ms));

 const updLatestCompanySecFacts = async (stocks) => {
    console.log("updLatestCompanySecFacts - for processing",stocks)
    for (let i=0;i<stocks.length;i++){
      updateEachStockSECData(stocks[i])
      if (i%parseInt(process.env.LIMIT_OF_SEC_REQUESTS) === 0){
        await delay(4000)
      }
    }
 }

module.exports = {updStockPrices,processUserStockPositions,deleteUserStockPosition,extractQuotesAndNormalize,updLatestCompanySecFacts};