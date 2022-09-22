const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocksupportpoints', {
    idstocksupportpoints: {
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
    }
  }, {
    sequelize,
    tableName: 'stocksupportpoints',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstocksupportpoints" },
        ]
      },
    ]
  });
};
