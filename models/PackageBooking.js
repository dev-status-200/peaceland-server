module.exports = (sequelize, DataTypes) => {
    const PackageBooking = sequelize.define("PackageBooking", {
        customerContact:{
            type:DataTypes.STRING
        },
        customerEmail:{
            type:DataTypes.STRING
        },
        customerName:{
            type:DataTypes.STRING
        },
        customerTitle:{
            type:DataTypes.STRING
        },
        name:{
            type:DataTypes.STRING
        },
        packageId:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.STRING,
            defaultValue:'0'
        },
    })
    return PackageBooking
}