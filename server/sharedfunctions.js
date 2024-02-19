const DBConfig = require("../config/db.config");
const { Op } = require("sequelize");
const conf = new DBConfig()

const Sequelize = require("sequelize");
const sequelize = new Sequelize(conf.DB, conf.USER, conf.PASSWORD, {
    host: conf.HOST,
    dialect: conf.dialect,
    logging: false
  })

const getAllExtSectorsAndStocks = async () => {
    var initModels = require("../models/init-models"); 
    var models = initModels(sequelize);
    var extsectorstks = models.stocksectorsexternal
    let dbresponse = []
    try{
        //there has to be an order to this....
        await extsectorstks.findAll().then(data => dbresponse=data) 
      }catch(error){
        console.log("getAllExtSectorsAndStocks - Error when getAllExtSectorsAndStocks",error)
    }
    return dbresponse
}

const addStockPatterns = async (stock,date,pattern) => {
  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var extsectorstks = models.stockpatternsformed
  let dbresponse = []
  try{
    retval = await extsectorstks.create({'symbol':stock,'date':date,'stockpatterns':pattern})
  }catch(error){
    console.log("addStockPatterns - Error when adding patterns",error)
  }
  return dbresponse
}

module.exports={getAllExtSectorsAndStocks,addStockPatterns}