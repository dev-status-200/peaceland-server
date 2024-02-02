const routes = require('express').Router();
const Sib = require('sib-api-v3-sdk');
const key = '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';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Promos, Customers } = require('../../models');
const { MyOffers } = require('../../associations/bookingaccociations');
const moment = require("moment");
const stripe = require('stripe')('sk_test_51LLnm5AckUCD1b2U12xLKiqgm0IfjVzDmqPfS84MYtmTwNjUgUMx6c0PTMNjhWvbjBPhriAuHwe7ozzCjUgO8xvk00aHtMtqoC');

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

routes.get("/get", async(req, res)=>{
    try {
        const result = await Promos.findAll({
            order: [['updatedAt', 'DESC']]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/sendOffer", async(req, res) => {
    try {
        let temparray = [...req.body.list];
        temparray.forEach((x)=>{
            x.description = req.body.content
        })
        await MyOffers.bulkCreate(temparray);
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
            }
        })
        //console.log(moment().diff("2023-02-06T12:09:36.000Z", 'days'))
        //console.log(moment().isBetween(result.createdAt, result.validity, undefined, '[]'))
        res.json({status:'success', result:result})
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