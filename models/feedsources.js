const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feedsources', {
    feedid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      },
    feedtype: {
        autoIncrement: false,
        type: DataTypes.INTEGER,
        allowNull: false,
        },
      feedsource: {
        type: DataTypes.STRING(1000),
        allowNull: true
        }
    }, {
    sequelize,
    tableName: 'feedsources',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "feedid" },
        ]
      },
    ]
  });
};
