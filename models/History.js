module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("History", {
        // code:{
        //     type:DataTypes.STRING,
        //     allowNull: false,
        //     unique: true
        // },
        stock:{
            type:DataTypes.STRING
        },
        by:{
            type:DataTypes.STRING
        },
        type:{
            type:DataTypes.STRING
        },
    })
    return History
}