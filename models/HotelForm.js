module.exports = (sequelize, DataTypes) => {
    const HotelForm = sequelize.define("HotelForm", {
        rating:{
            type:DataTypes.STRING
        },
        rooms:{
            type:DataTypes.STRING
        },
        adults:{
            type:DataTypes.STRING
        },
        children:{
            type:DataTypes.STRING
        },
        checkin:{
            type:DataTypes.STRING
        },
        checkout:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        done:{
            type:DataTypes.STRING,
            defaultValue: '0'
        },
    })
    return HotelForm
}