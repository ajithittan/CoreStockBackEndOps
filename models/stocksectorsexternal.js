const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocksectorsexternal', {
    idstocksectorsexternal: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sectorsymbol: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    symbol: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stocksectorsexternal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstocksectorsexternal" },
        ]
      },
    ]
  });
};