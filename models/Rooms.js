module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define("Rooms", {
        adult:{
            type:DataTypes.STRING
        },
        child:{
            type:DataTypes.STRING
        },
        roomType:{
            type:DataTypes.STRING
        },
    })
    return Rooms
}