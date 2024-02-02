module.exports = (sequelize, DataTypes) => {
    const TourOptions = sequelize.define("TourOptions", {
        name:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        child_price:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        adult_price:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        status:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        stock:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        dated:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        timed:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        dates:{
            type:DataTypes.JSON,
        },
        timeSlots:{
            type:DataTypes.JSON,
        },
        transport:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        manual:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        detail:{
            type:DataTypes.TEXT,
        },
        oldPrice:{
            type:DataTypes.STRING
        }
    })
    return TourOptions
}