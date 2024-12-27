module.exports = (app) => {
app.post('/api/processsubmsgs/updatestockprice', async (req, res) => {
    let response
    try{
      var masterstkops = require('../server/stockmaster');
      response = await masterstkops.updStockPrices(req.body.stocks)
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/userstockpositions', async (req, res) => {
    let response
    try{
      var masterstkops = require('../server/stockmaster');
      response = await masterstkops.processUserStockPositions(req.body)
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/deluserstockpositions', async (req, res) => {
    let response
    try{
      console.log("before delete.....")
      var masterstkops = require('../server/stockmaster');
      response = await masterstkops.deleteUserStockPosition(req.body)
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/processquotesfromext', async (req, res) => {
    let response
    try{
      console.log("before extractQuotesAndNormalize.....")
      var masterstkops = require('../server/stockmaster');
      response = await masterstkops.extractQuotesAndNormalize()
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/updlatestsecdata', async (req, res) => {
    let response
    try{
      let masterstkops = require('../server/stockmaster');
      //response = await masterstkops.updLatestCompanySecFacts(req.body.stocks)
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/addtocache', async (req, res) => {
    let response = []
    try{
      let cacheProcessor = require('../server/processcache');
      response = await cacheProcessor.initiateCacheLoadProcess(req.body.tocache)
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/initiatepatternrecog', async (req, res) => {
    let response = []
    try{
      var masterstkops = require('../server/processpatterns/patternrecognition');
      response = await masterstkops.startPatternRecognition()
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/initiatepatternrecog', async (req, res) => {
    let response = []
    try{
      var masterstkops = require('../server/processpatterns/patternrecognition');
      response = await masterstkops.startPatternRecognition()
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/updateeodstockprice', async (req, res) => {
    let response
    try{
      var masterstkops = require('../server/stockmaster');
      response = await masterstkops.processAllStockEoDQuotes()
      console.log("responseresponseresponseresponse",response)
    }
    catch (err){
      console.log(err)
      return res.status(500).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/cacheprevclose', async (req, res) => {
    let response
    try{
      var masterstkops = require('../server/stockmaster');
      response = await masterstkops.cachePreviousClose()
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/aggeodsyncup', async (req, res) => {
    let response
    try{
      let stkqts = require('../server/processstockquotes/stockquotes');
      await stkqts.syncDailyStockQuotes()
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/intradaysnaphots', async (req, res) => {
    let response
    try{
      let stkqts = require('../server/processstockquotes/stockquotes');
      stkqts.syncIntraDayStockQuotes()
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/intradaywrkflow', async (req, res) => {
    let response = false
    try{
      let wrkflow = require('../server/intradayworkflow/intradayworkflowmain');
      response = await wrkflow.initiateWrkFlwIntraDay(req.body)
    }
    catch (err){
      console.log(err)
      return res.status(201).send(false);
    }
    return res.status(200).send(response);
  });
  app.post('/api/processsubmsgs/cachebasicstockprice', async (req, res) => {
    let response = false
    try{
      let masterstkops = require('../server/stockmaster');
      response = await masterstkops.cacheBasicStockPrice()
    }
    catch (err){
      console.log(err)
      return res.status(500).send(false);
    }
    return res.status(200).send(response);
  });
}