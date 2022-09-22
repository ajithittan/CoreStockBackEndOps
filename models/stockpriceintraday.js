const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockpriceintraday', {
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
    open: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    high: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    low: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    close: {
      type: DataTypes.FLOAT,
      allowNull: false,
      primaryKey: true
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    asoftime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'stockpriceintraday',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "symbol" },
          { name: "date" },
          { name: "open" },
          { name: "high" },
          { name: "low" },
          { name: "close" },
          { name: "volume" },
        ]
      },
    ]
  });
};
