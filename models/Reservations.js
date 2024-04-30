module.exports = (sequelize, DataTypes) => {
  const Reservations = sequelize.define("Reservations", {
    booking_no: {
      type: DataTypes.INTEGER,
    },
    name:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    email:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    base_price:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    promo:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    final_price:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    payment_intent_client_secret:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        },
        unique: true
    },
    payment_intent:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        },
        unique: true
    },
    site:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    uncheck:{
      type:DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
    },
  })
  return Reservations
}