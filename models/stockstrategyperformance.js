const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockstrategyperformance', {
    stockstrategyid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    sig_close: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    profit_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    profit_per: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    profit_close: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    loss_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    loss_per: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    loss_close: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    profitable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stockid: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stockstrategyperformance',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "stockstrategyid" },
          { name: "date" },
          { name: "symbol" },
          { name: "sig_close" },
          { name: "profit_per" },
          { name: "loss_per" },
        ]
      },
    ]
  });
};
