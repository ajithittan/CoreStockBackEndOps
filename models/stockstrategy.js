const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockstrategy', {
    stockstrategyid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    typedesc: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    startorder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "startorder_UNIQUE"
    },
    typeterm: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    active: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "1"
    }
  }, {
    sequelize,
    tableName: 'stockstrategy',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "stockstrategyid" },
        ]
      },
      {
        name: "startorder_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "startorder" },
        ]
      },
    ]
  });
};
