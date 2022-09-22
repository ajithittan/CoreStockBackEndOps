const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockindicators', {
    indicatortype: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    indicatordes: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stockindicators',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "indicatortype" },
        ]
      },
    ]
  });
};
