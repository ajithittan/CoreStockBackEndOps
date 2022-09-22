const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockcandlepatterns', {
    idstockcandlepatterns: {
      autoIncrement: false,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    candlepattern: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    patterndesc: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },    
    track: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'stockcandlepatterns',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idstockcandlepatterns" },
        ]
      },
    ]
  });
};
