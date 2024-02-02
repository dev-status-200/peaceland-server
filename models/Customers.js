module.exports = (sequelize, DataTypes) => {
    const Customers = sequelize.define("Customers", {
        name:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        image:{
            type:DataTypes.STRING
        },
    })
    return Customers
}