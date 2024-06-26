const routes = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Sib = require('sib-api-v3-sdk');
// const key = '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'; <Ticketsvalley Key
const key = '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';
const { BookedTours, BookedToursOptions, MyOffers } = require('../../associations/bookingaccociations');
const { Reservations, Customers, ContactUs, Notifications } = require('../../models');
const moment = require("moment");

const sendMail = (reciever, sub, content) => {
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = key;
    const transEmailApi = new Sib.TransactionalEmailsApi();

    const sender = { email:'support@ticketsvalley.com', name:'Tickets Valley' }
    const recievers = [ { email:reciever, }, ];
    console.log(recievers)
    transEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject:sub,
      htmlContent:content,
    }).then((x)=>console.log(x))
    .catch((e)=>console.log(e));
}

routes.get("/getCustomers", async(req, res)=>{
    try {
        const result = await Customers.findAll({
            include:[
                {
                    model:BookedTours,
                    include:[
                        {
                            model:Reservations
                        },
                        {
                            model:BookedToursOptions
                        }
                    ],
                },
                {
                    model:MyOffers,
                    attributes:['createdAt'],
                    limit:1,
                    order: [
                        ["createdAt", "DESC"],
                    ],
                }
            ]
        });
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/createNewsLetterCustomer", async(req, res)=>{
    try {
        console.log(req.body.email)
        await Customers.create({
            email:req.body.email
        }).catch((x)=>{
            console.log(x)
        })
        res.json({status:'success'});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/sendReviewRequest", async(req, res)=>{
    try {
        console.log(req.body)
        const result = await BookedToursOptions.update({ reviewsSent:"1" }, {where:{id:req.body.id}});
        const content = 
        `
        <p>Dear Customer</p>
        <p>Please Take The time to review your experience</p>
        <p>Your feedback is highly appreciated</p>
        <a href="https://ticketsvalley.com/ticketPage?id=${req.body.reserveId}">Open this link to review</a>
        <br/>
        <p>Regards</p>
        <p>Tickets Valley Team</p>`;
        await sendMail(req.body.email, 'Tour Review', content);
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getAllReservationReviews", async(req, res)=>{
    try {
        const result = await BookedToursOptions.findAll({
            attributes:['id', 'date', 'assigned', 'review', 'allowed' , 'reviewsSent', 'reviewed', 'tourOptName', 'rating'],
            include:[{
                model:BookedTours,
                attributes:['id'],
                include:[{
                    model:Reservations,
                    attributes:['id', 'email' ,'name']
                }]
            }]
        });
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/postCustomerReview", async(req, res) => {
    try {
        const result = await BookedToursOptions.update({ reviewed:"1", rating:req.body.rating, review:req.body.review }, {where:{id:req.body.id}});
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/allowReview", async(req, res)=>{
    try {
        const result = await BookedToursOptions.update({ allowed:req.body.allowed }, {where:{id:req.body.id}});
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/contactUs", async(req, res)=>{
    try {
        await ContactUs.create({...req.body});
        Notifications.create({
            description:"A Contact Us Form has been submitted",
            checked:"0",
            type:'message'
        })
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getContactUsMessages", async(req, res)=>{
    try {
        const result = await ContactUs.findAll({
            where:{
                createdAt: {
                    [Op.gte]: moment(req.headers.from).toDate(),
                    [Op.lte]: moment(req.headers.to).add(1, 'days').toDate(),
                }
            },
            order: [
                ["createdAt", "DESC"],
            ],
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/toggleMessages", async(req, res)=>{
    try {
        await ContactUs.update({ status:req.body.status }, { where:{ id:req.body.id } })
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

module.exports = routes;