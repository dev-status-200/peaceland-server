const routes = require('express').Router();
const Sib = require('sib-api-v3-sdk');
// const key = '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'; <Ticketsvalley Key
const key = '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';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Promos, Customers } = require('../../models');
const { MyOffers } = require('../../associations/bookingaccociations');
const moment = require("moment");

const sendMail = (reciever, sub, content) => {
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = key;
    const transEmailApi = new Sib.TransactionalEmailsApi();

    const sender = { email:'support@ticketsvalley.com', name:'Tickets Valley' }
    const recievers = [ { email:reciever, }, ];
    transEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject:sub,
      htmlContent:content,
    }).then((x)=>console.log(x))
    .catch((e)=>console.log(e));
}

routes.post("/create", async(req, res)=>{
    let data = req.body;
    try {
        delete data.id
        const result = await Promos.create(data)
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.post("/edit", async(req, res) => {
    let data = req.body;
    try {
        const result = await Promos.update(data, {where:{id:data.id}});
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.post("/toggleVisibility", async(req, res) => {
    try {
        const result = await Promos.update({show:req.body.show}, {where:{id:req.body.id}});
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/getPromos", async(req, res)=>{
    try {
        console.log(moment().format("YYYY-MM-DD"))
        const result = await Promos.findAll({
            where:{
                //status:"1",
                validity: {
                    [Op.gte]: moment(moment().format("YYYY-MM-DD")).toDate(),
                    //[Op.lte]: moment("2023-06-20").add(1, 'days').toDate(),
                  }
            },
            order: [
                ["createdAt", "DESC"],
            ],
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getVisiblePromos", async(req, res)=>{
    try {
        const result = await Promos.findAll({
            where:{
                show:"1",
                validity: {
                    [Op.gte]: moment(moment().format("YYYY-MM-DD")).toDate(),
                  }
            },
            order: [
                ["createdAt", "DESC"],
            ],
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getMyPromos", async(req, res)=>{
    try {
        const result = await Customers.findOne({
            where:{email:req.headers.email},
            attributes:['id'],
            include:[{
                model:MyOffers,
                attributes:["description"],
                include:[{
                    model:Promos,
                    where:{
                        status:"1",
                        validity: {
                            [Op.gte]: moment(moment().format("YYYY-MM-DD")).toDate(),
                        }
                    },
                    order: [
                        ["createdAt", "DESC"],
                    ],
                }]
            }]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});
//
routes.get("/get", async(req, res)=>{
    try {
        console.log(req.headers.type)
        const result = await Promos.findAll({
            where:{status:req.headers.type=="active"?'1':'0'},
            order: [['createdAt', 'DESC']]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/sendOffer", async(req, res) => {
    try {
        console.log(req.body.list);
        console.log(req.body.content);

        let temparray = [...req.body.list];
        temparray.forEach((x)=>{
            x.description = req.body.content
        })
        await MyOffers.bulkCreate(temparray).catch((x)=>console.log(x))
        req.body.list.forEach(async(x)=>{
            await sendMail(x.email, "Promotional Offer From Tickets Valley", req.body.content)
        })
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/verifyPromo", async(req, res)=>{
    try {
        const result = await Promos.findOne({
            where:{
                code:req.body.code, status:"1"
            },
        })
        let date1 = moment(result.dataValues.validity).format("MM-DD-yyyy");
        let date2 = moment().format("MM-DD-yyyy");
        let difference = moment(date1).diff(moment(date2), 'days')
        console.log(difference<0?'Not Applicable':'Applicable')
        console.log(date1, 'validity')
        console.log(date2, 'current date')
        res.json({status:'success', result:difference<0?{stock:0}:result})
    } catch (error) {
        res.json({status:'error', error:error})
    }
});

routes.post("/testmail", async(req, res) => {
    try {
        await sendMail("sabdullah369@gmail.com", "Promotional Offer From Tickets Valley", "<p>Test Mail</p>")
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error'})
    }
});

module.exports = routes;