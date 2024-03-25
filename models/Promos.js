module.exports = (sequelize, DataTypes) => {
    const Promos = sequelize.define("Promos", {
        name:{
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
        byPercentage:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        amount:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        code:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        validity:{
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
        used:{
            type:DataTypes.STRING,
            defaultValue: '0',
        },
        show:{
            type:DataTypes.STRING,
            defaultValue: '0',
        },
    })
    return Promos
}