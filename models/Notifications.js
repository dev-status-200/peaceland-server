module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define("Notifications", {
        description:{
            type:DataTypes.STRING
        },
        checked:{
            type:DataTypes.STRING
        },
        type:{
            type:DataTypes.STRING
        }
    })
    return Notifications
}