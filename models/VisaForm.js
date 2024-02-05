module.exports = (sequelize, DataTypes) => {
    const VisaForm = sequelize.define("VisaForm", {
        status:{
            type:DataTypes.STRING,
            allowNull: false,
            defaultValue:"0",
            validate:{
                notEmpty: true
            }
        }
    })
    return VisaForm
}