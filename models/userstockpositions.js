const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userstockpositions', {
    idstockpositions: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      positions: {
        type: DataTypes.JSON,
        allowNull: true
      },
      iduserprofile: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'userstockpositions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstockpositions" },
        ]
      },
    ]
  });
};
