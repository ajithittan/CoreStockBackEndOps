const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocksector', {
    idstocksector: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sector: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stocks: {
      type: DataTypes.JSON,
      allowNull: false
    },
    iduserprofile: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stocksector',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstocksector" },
        ]
      },
    ]
  });
};
