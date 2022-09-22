const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockpositions', {
    idstockpositions: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    close: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    signaltype: {
      type: DataTypes.JSON,
      allowNull: false
    },
    verdict: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    profit: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stoploss: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    possize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asofdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'stockpositions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstockpositions" },
        ]
      },
    ]
  });
};
