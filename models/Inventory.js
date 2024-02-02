module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define("Inventory", {
        code:{
            type:DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        pnr:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        used:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    })
    return Inventory
}