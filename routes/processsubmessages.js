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
}