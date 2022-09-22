module.exports = (app) => {
app.post('/api/processsubmsgs/updatestockprice', async (req, res) => {
    console.log("asdfsdfsadfasd")
    let response
    try{
      console.log("req.body",req.body)
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