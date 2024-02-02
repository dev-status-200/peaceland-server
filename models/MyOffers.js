module.exports = (sequelize, DataTypes) => {
    const MyOffers = sequelize.define("MyOffers", {
        description:{
            type:DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    })
    return MyOffers
}