const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usercustomizeoptions', {
        uuid: {
        autoIncrement: false,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
        },
        dashboardoptions: {
        type: DataTypes.JSON,
        allowNull: true
        }
    }, {
    sequelize,
    tableName: 'usercustomizeoptions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
        ]
      },
    ]
  });
};
