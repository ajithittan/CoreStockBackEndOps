const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockswings', {
    idstockSwings: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    symbol: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    duration_m: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    swingPts: {
      type: DataTypes.JSON,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asofdate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'stockswings',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstockSwings" },
        ]
      },
    ]
  });
};
