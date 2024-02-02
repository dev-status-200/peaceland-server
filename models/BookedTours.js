module.exports = (sequelize, DataTypes) => {
    const BookedTours = sequelize.define("BookedTours", {
        name:{
            type:DataTypes.STRING,
        },
        image:{
            type:DataTypes.STRING,
        },
        tourId:{
            type:DataTypes.STRING,
        },
        customerTitle:{
            type:DataTypes.STRING,
        },
        customerName:{
            type:DataTypes.STRING,
        },
        customerContact:{
            type:DataTypes.STRING,
        },
        customerEmail:{
            type:DataTypes.STRING,
        },
    })
    return BookedTours
}