var DataTypes = require("sequelize").DataTypes;
var _stockindicatorparams = require("./stockindicatorparams");
var _stockindicators = require("./stockindicators");
var _stocklist = require("./stocklist");
var _stockpriceday = require("./stockpriceday");
var _stockpriceintraday = require("./stockpriceintraday");
var _stockstrategy = require("./stockstrategy");
var _stockstrategyperformance = require("./stockstrategyperformance");
var _stockstrategypoints = require("./stockstrategypoints");
var _stockswings = require("./stockswings");
var _stockcandlepatterns = require("./stockcandlepatterns");
var _stocksupportpoints = require("./stocksupportpoints");
var _stockpositions = require("./stockpositions");
var _usercustomizeoptions = require("./usercustomizeoptions")
var _feedsources = require("./feedsources")
var _stocksector = require("./stocksector")
var _usersocialprofile = require("./usersocialprofile")
var _userprofile = require("./userprofile")
var _userstockpositions = require("./userstockpositions")

function initModels(sequelize) {
  var stockindicatorparams = _stockindicatorparams(sequelize, DataTypes);
  var stockindicators = _stockindicators(sequelize, DataTypes);
  var stocklist = _stocklist(sequelize, DataTypes);
  var stockpriceday = _stockpriceday(sequelize, DataTypes);
  var stockpriceintraday = _stockpriceintraday(sequelize, DataTypes);
  var stockstrategy = _stockstrategy(sequelize, DataTypes);
  var stockstrategyperformance = _stockstrategyperformance(sequelize, DataTypes);
  var stockstrategypoints = _stockstrategypoints(sequelize, DataTypes);
  var stockswings = _stockswings(sequelize, DataTypes);
  var stockcandlepatterns = _stockcandlepatterns(sequelize, DataTypes);
  var stocksupportpoints = _stocksupportpoints(sequelize, DataTypes);
  var stockpositions = _stockpositions(sequelize, DataTypes);
  var usercustomizeoptions = _usercustomizeoptions(sequelize, DataTypes);
  var feedsources = _feedsources(sequelize, DataTypes);
  var stocksector = _stocksector(sequelize, DataTypes);
  var usersocialprofile = _usersocialprofile(sequelize, DataTypes);
  var userprofile = _userprofile(sequelize, DataTypes);
  var userstockpositions = _userstockpositions(sequelize, DataTypes);

  return {
    stockindicatorparams,
    stockindicators,
    stocklist,
    stockpriceday,
    stockpriceintraday,
    stockstrategy,
    stockstrategyperformance,
    stockstrategypoints,
    stockswings,
    stockcandlepatterns,
    stocksupportpoints,
    stockpositions,
    usercustomizeoptions,
    feedsources,
    stocksector,
    usersocialprofile,
    userprofile,
    userstockpositions
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
