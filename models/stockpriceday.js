const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockpriceday', {
    symbol: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    Open: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    high: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    low: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    close: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    adjclose: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stockpriceday',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "symbol" },
          { name: "date" },
        ]
      },
    ]
  });
};
