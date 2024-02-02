const { DataTypes } = require('sequelize');

const { BookedTours, Reservations, TourOptions, Tours, BookedToursOptions, Customers, MyOffers, Promos } = require("../models");

// ============================ CLIENTS TO ORDERS ASSOCIATIONS ============================ //

Reservations.hasMany(BookedTours,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
BookedTours.belongsTo(Reservations);


BookedTours.hasMany(BookedToursOptions,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
BookedToursOptions.belongsTo(BookedTours);


TourOptions.hasMany(BookedToursOptions,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
BookedToursOptions.belongsTo(TourOptions);


Customers.hasMany(BookedTours,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
BookedTours.belongsTo(Customers);

Customers.hasMany(MyOffers,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
MyOffers.belongsTo(Customers);

Promos.hasMany(MyOffers,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
MyOffers.belongsTo(Promos);


Tours.hasMany(TourOptions,{
    foriegnKey:{
        type: DataTypes.INTEGER
    }
});
TourOptions.belongsTo(Tours);


module.exports = { BookedTours, TourOptions, BookedToursOptions, MyOffers }