const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stocklist', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "symbol"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "name"
    },
    sector: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "2020-01-01 00:00:00"
    },
    track: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    groupsector: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'stocklist',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "symbol",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "symbol" },
        ]
      },
    ]
  });
};
