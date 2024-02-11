module.exports = (sequelize, DataTypes) => {
    const Destination = sequelize.define("Destination", {
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
    return Destination
}