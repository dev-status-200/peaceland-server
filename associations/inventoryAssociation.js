const { DataTypes } = require('sequelize');

const { TourOptions, Inventory, History } = require("../models");

// ============================ CLIENTS TO ORDERS ASSOCIATIONS ============================ //

TourOptions.hasMany(Inventory,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
Inventory.belongsTo(TourOptions);

TourOptions.hasMany(History,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
History.belongsTo(TourOptions);

module.exports = { Inventory, History }