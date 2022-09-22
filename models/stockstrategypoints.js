const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockstrategypoints', {
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
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    close: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    comparedclose1: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    comparedclose2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    notified: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stockstrategypoints',
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
        ]
      },
    ]
  }
  );
};
