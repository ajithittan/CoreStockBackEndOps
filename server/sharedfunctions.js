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

const checkIfPatternExistsForDay = async (stock,date) => {
  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var extsectorstks = models.stockpatternsformed
  let dbresponse = []
  try{
    await extsectorstks.findAll({where: {
      symbol: {[Op.eq] : stock},
      date: {[Op.eq] : date}
        },raw : true
    }).then(data => dbresponse=data)
  }catch(error){
    console.log("addStockPatterns - Error when adding patterns",stock,date,error)
  }
  return dbresponse.length
}

const addStockPatterns = async (stock,date,pattern) => {
  var initModels = require("../models/init-models"); 
  var models = initModels(sequelize);
  var extsectorstks = models.stockpatternsformed
  let dbresponse = []
  try{
    let checkIfdataexists = await checkIfPatternExistsForDay(stock,date)
    if (checkIfdataexists){
      console.log("UPDATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",stock,date)
      await extsectorstks.update({'stockpatterns':pattern},{where:{'symbol':stock,'date':date}})
    }else{
      retval = await extsectorstks.create({'symbol':stock,'date':date,'stockpatterns':pattern})
    }
  }catch(error){
    console.log("addStockPatterns - Error when adding patterns",error)
  }
  return dbresponse
}

const prioritizeAndSeqStks = async (inpStks) =>{
  let stks = await getAllExtSectorsAndStocks()
  stks = stks.map(item => item.symbol)
  let retval = [...inpStks.filter(item => stks.includes(item.symbol)),...inpStks.filter(item => !stks.includes(item.symbol))]
  return retval
}

module.exports={getAllExtSectorsAndStocks,addStockPatterns,prioritizeAndSeqStks}