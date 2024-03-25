module.exports = (sequelize, DataTypes) => {
    const MyOffers = sequelize.define("MyOffers", {
        description:{
            type:DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
    })
    return MyOffers
}