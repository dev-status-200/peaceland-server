module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define("City", {
        name:{
            type:DataTypes.STRING
        },
        active:{
            type:DataTypes.STRING,
            defaultValue:'1'
        },
        deletable:{
            type:DataTypes.STRING
        },
    })
    return City
}