module.exports = (sequelize, DataTypes) => {
    const VisaPersons = sequelize.define("VisaPersons", {
        firstName:{ type:DataTypes.STRING },
        lastName:{ type:DataTypes.STRING },
        email:{ type:DataTypes.STRING },
        state:{ type:DataTypes.STRING },
        city:{ type:DataTypes.STRING },
        nationality:{ type:DataTypes.STRING },
        countryCode:{ type:DataTypes.STRING },
        contact:{ type:DataTypes.STRING },
        WAcountryCode:{ type:DataTypes.STRING },
        WAcontact:{ type:DataTypes.STRING },
        dob:{ type:DataTypes.STRING },
        passportDay:{ type:DataTypes.STRING },
        passportMonth:{ type:DataTypes.STRING },
        passportYear:{ type:DataTypes.STRING },
        ApassportDay:{ type:DataTypes.STRING },
        ApassportMonth:{ type:DataTypes.STRING },
        ApassportYear:{ type:DataTypes.STRING },
        entryType:{ type:DataTypes.STRING },
        passport:{ type:DataTypes.STRING },
    })
    return VisaPersons
}