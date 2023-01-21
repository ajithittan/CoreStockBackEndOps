const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userportfolio', {
    iduserprofile: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      symbol: {
        primaryKey: true,  
        type: DataTypes.STRING(45),
        allowNull: false
      },
      positions: {
        type: DataTypes.JSON,
        allowNull: false
      },
      create_dt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'userportfolio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "iduserprofile" },
          { name: "symbol" },
        ]
      },
    ]
  });
};
