module.exports = (sequelize, DataTypes) => {
    const VisaForm = sequelize.define("VisaForm", {
        status:{
            type:DataTypes.STRING,
            allowNull: false,
            defaultValue:"0",
            validate:{
                notEmpty: true
            }
        },
        booking_no: {
            type: DataTypes.INTEGER,
        },
    })
    return VisaForm
}