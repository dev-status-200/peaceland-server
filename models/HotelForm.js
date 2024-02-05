module.exports = (sequelize, DataTypes) => {
    const HotelForm = sequelize.define("HotelForm", {
        name:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        contact:{
            type:DataTypes.STRING
        },
        whatsapp:{
            type:DataTypes.STRING
        },
        nationality:{
            type:DataTypes.STRING
        },
        rating:{
            type:DataTypes.STRING
        },
        destination:{
            type:DataTypes.STRING
        },
        hotel:{
            type:DataTypes.STRING
        },
        currency:{
            type:DataTypes.STRING
        },
        checkin:{
            type:DataTypes.STRING
        },
        checkout:{
            type:DataTypes.STRING
        },
        nights:{
            type:DataTypes.STRING
        },
        done:{
            type:DataTypes.STRING,
            defaultValue: '0'
        },
    })
    return HotelForm
}