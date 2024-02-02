module.exports = (sequelize, DataTypes) => {
    const BookedToursOptions = sequelize.define("BookedToursOptions", {
        adult:{
            type:DataTypes.STRING,
        },
        adult_price:{
            type:DataTypes.STRING,
        },
        child:{
            type:DataTypes.STRING,
        },
        child_price:{
            type:DataTypes.STRING,
        },
        infant:{
            type:DataTypes.STRING,
        },
        tourOptId:{
            type:DataTypes.STRING,
        },
        tourOptName:{
            type:DataTypes.STRING,
        },
        transfer:{
            type:DataTypes.STRING,
        },
        transportPrice:{
            type:DataTypes.STRING,
        },
        address:{
            type:DataTypes.STRING,
        },
        dated:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dated:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        date:{
            type:DataTypes.STRING,
        },
        timed:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        timeSlot:{
            type:DataTypes.STRING,
        },
        assigned:{
            type:DataTypes.STRING,
            defaultValue: "0",
        },
        codes:{
            type:DataTypes.TEXT('long'),
        },
        reviewed:{
            type:DataTypes.STRING,
            defaultValue: "0",
        },
        review:{
            type:DataTypes.TEXT('long'),
        },
        allowed:{
            type:DataTypes.STRING,
            defaultValue: "0",
        },
        reviewsSent:{
            type:DataTypes.STRING,
            defaultValue: "0",
        },
        rating:{
            type:DataTypes.STRING,
            defaultValue: "0",
        },
    })
    return BookedToursOptions
}