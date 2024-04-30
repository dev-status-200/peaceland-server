module.exports = (sequelize, DataTypes) => {
    const Tours = sequelize.define("Tours", {
        title:{ type:DataTypes.STRING },
        slug:{ type:DataTypes.STRING },
        availability:{ type:DataTypes.STRING },
        duration:{ type:DataTypes.STRING },
        time_slot:{ type:DataTypes.STRING },
        confirmation:{ type:DataTypes.STRING },
        refund:{ type:DataTypes.STRING },
        voucher:{ type:DataTypes.STRING },
        lang:{ type:DataTypes.STRING },
        tour_detail:{
            type:DataTypes.TEXT('long'),
        },
        inclusions:{
            type:DataTypes.TEXT('long'),
        },
        exclusions:{
            type:DataTypes.TEXT('long'),
        },
        why_shoulds:{
            type:DataTypes.TEXT('long'),
        },
        departure:{
            type:DataTypes.STRING,
        },
        reporting:{
            type:DataTypes.STRING,
        },
        imp_infos:{
            type:DataTypes.TEXT('long'),
        },
        policies:{
            type:DataTypes.TEXT('long'),
        },
        category:{
            type:DataTypes.STRING 
        },
        advCategory:{
            type:DataTypes.STRING 
        },
        main_image:{
            type:DataTypes.TEXT('long'),
        },
        more_images:{
            type:DataTypes.TEXT('long'),
        },
        cancellation_polices:{
            type:DataTypes.TEXT('long'),
        },
        status:{
            type:DataTypes.STRING
        },
        prevPrice:{
            type:DataTypes.STRING,
        },
        destination:{
            type:DataTypes.STRING,
        },
        city:{
            type:DataTypes.STRING,
        },
        package:{
            type:DataTypes.STRING,
            defaultValue: '1'
        },
        packageTravel:{
            type:DataTypes.STRING,
            defaultValue: '1'
        },
        packageCountry:{
            type:DataTypes.STRING,
            defaultValue: '1'
        },
        packageCity:{
            type:DataTypes.STRING,
            defaultValue: '1'
        },
        packageDescription:{
            type:DataTypes.TEXT,
        },
        packageIncludes:{
            type:DataTypes.TEXT,
        },
        travelDetail:{
            type:DataTypes.TEXT,
        },
        cutOff:{
            type:DataTypes.STRING,
        },
    })
    return Tours
}