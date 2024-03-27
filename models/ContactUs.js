module.exports = (sequelize, DataTypes) => {
    const ContactUs = sequelize.define("ContactUs", {
        name:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        msg:{
            type:DataTypes.TEXT
        },
        status:{
            type:DataTypes.STRING
        },
    })
    return ContactUs
}