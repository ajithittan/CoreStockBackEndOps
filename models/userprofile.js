const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userprofile', {
    iduserprofile: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      fname: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      lname: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      allowsms: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: "0"
      },
      uniqueUUID: {
        type: DataTypes.STRING(500),
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'userprofile',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "iduserprofile" },
        ]
      },
    ]
  });
};
