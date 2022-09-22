const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockindicatorparams', {
    indicatortype: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    indicatorparam: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    indicatorduration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    indicatorparam1: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    indicatorduration1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    indicatorparam2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    indicatorduration2: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stockindicatorparams',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "indicatortype" },
          { name: "indicatorparam" },
          { name: "indicatorduration" },
        ]
      },
    ]
  });
};
