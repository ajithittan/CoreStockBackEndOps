const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usersocialprofile', {
      idusersocial: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      socialUniqIdentifier: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      socialprovider: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      iduserprofile:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      additionalinfo: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'usersocialprofile',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idusersocial" },
        ]
      },
    ]
  });
};
