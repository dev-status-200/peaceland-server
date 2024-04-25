const routes = require('express').Router();
const Sib = require('sib-api-v3-sdk');
// const key = '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'; <Ticketsvalley Key
const key = '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';

const { BookedTours, BookedToursOptions, TourOptions, VisaForm, VisaPersons, HotelForm, Rooms } = require('../../associations/bookingaccociations');
const { Reservations, Customers, Transport, Notifications, Promos } = require('../../models');
const { Inventory } = require('../../associations/inventoryAssociation');
const moment = require("moment");
const stripe = require('stripe')('sk_test_51LLnm5AckUCD1b2U12xLKiqgm0IfjVzDmqPfS84MYtmTwNjUgUMx6c0PTMNjhWvbjBPhriAuHwe7ozzCjUgO8xvk00aHtMtqoC');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sendMail = (reciever, sub, content, site) => {
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = key;
    const transEmailApi = new Sib.TransactionalEmailsApi();

    const sender = { 
      email:site=="peaceland"?'info@peacelandtravel.com':'support@ticketsvalley.com',
      name:site=="peaceland"?"Peaceland Travel":"Ticketsvalley"
    }
    const recievers = [ { email:reciever, }, ];

    transEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject:sub,
      htmlContent:content,
    }).then((x)=>console.log(x))
    .catch((e)=>console.log(e));
};

const createTourReserves = (list, id) => {
    let resultOne = [];
    list.forEach((x, i)=>{
        resultOne.push({
            ...x,
            ReservationId:id
        })
    })
    return resultOne;
};

const createTourOptionReserves = (list, id) => {
    let resultOne = [];
    list.forEach((x, i)=>{
        resultOne.push({
            ...x,
            //tourOptId:x.id,
            TourOptionId:x.id,
            tourOptName:x.name,
            price:x.price.toFixed(2),
            BookedTourId:id
        })
        delete resultOne[i].id
    })
    return resultOne;
};

routes.post("/create", async(req, res) => {
    try {
        const content = `<p>Dear Customer</p>
        <p>Thank you for using Tickets Valley</p>
        <p>Your Booking Has been recieved you'll shorlty recieve your ticket</p>
        <p>Your Booking No. is <b>${req.body.booking_no}</b></p>
        <br/>
        <p>Regards</p>
        <p>${req.body.site=='ticketsvalley'?'Ticket Valley':'Peaceland Travel'} Team</p>`
        console.log("here 1")
        await sendMail(req.body.user, 'Booking Info', content, req.body.site);
        res.json({status:'success', result:"result"})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/config", async(req, res) => {
    console.log(req.headers.price)
    try {
        res.send({status:'success', publishableKey:'pk_test_51LLnm5AckUCD1b2UQc0c7hoIOFMjxvB3iejNdBWUbd8fmymlHmTCiJQj4nsVrKJd7J4CE5ZLJsyTiJ0Vp96F4UfR00AiE1JJUD'});
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/create-intent", async(req, res) => {
    console.log(req.body)
    try {
        const intent = await stripe.paymentIntents.create({
            currency: "AED",
            amount: req.body.price*100,
            automatic_payment_methods: { enabled: true },
        });
        res.json({status:"success", client_secret: intent.client_secret});
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/createReservation", async(req, res) => {
  try {
    console.log(req.body)
    let promo = req.body.reservation?.promo;
    if(promo!='none'){
      let promoId = JSON.parse(req.body.reservation?.promo).id;
      const promoStock = await Promos.findOne({where:{id:promoId}});
      let stock = parseInt(promoStock.dataValues.stock)-1;
      let used = parseInt(promoStock.dataValues.used)+1||1;
      Promos.update({stock:`${stock}`, used:`${used}`}, { where:{id:promoId} })
    }
    let customer;
    customer = await Customers.findOne({where:{email:req.body.reservation.email}})
    if(customer){ } else {
      let obj = {
      name:req.body.reservation.name,
      image:req.body.reservation.image,
      email:req.body.reservation.email,
      }
      customer = await Customers.create(obj);
    }
    const lastBooking = await Reservations.findOne({ order: [[ 'booking_no', 'DESC' ]], attributes:["booking_no"]});
    const result = await Reservations.create({
      ...req.body.reservation,
      site:req.body.site||'peaceland',
      booking_no:lastBooking==null?`${1}`:`${parseInt(lastBooking.booking_no)+1}`
    }).catch((x)=>console.log(x))
    let temp = createTourReserves(req.body.bookedTours, result.id)
    temp.forEach(async(x)=>{
      const temp = await BookedTours.create({...x, CustomerId:customer.id});
      await BookedToursOptions.bulkCreate(createTourOptionReserves(x.options, temp.id));
    });
    Notifications.create({
      description:"A Tour Booking has been made",
      checked:"0",
      type:'tour'
    })
    res.json({status:"success", result:{id:result.id, no:result.booking_no}});
  } catch (error) {
    res.json({status:'error', result:error})
  }
});

routes.get("/getAllBookings", async(req, res) => {
    try {
        const result = await Reservations.findAll({
            where:{
                createdAt: {
                    [Op.gte]: moment(req.headers.from).toDate(),
                    [Op.lte]: moment(req.headers.to).add(1, 'days').toDate(),
                }
            },
            include:[{
                model:BookedTours,
                include:[
                    {
                        model:BookedToursOptions,
                        include:[{
                            model:TourOptions,
                            attributes:['transport', 'manual']
                        }]
                    }
                ],
            }],
            order: [
                ["createdAt", "DESC"],
            ],
        });
        // For Getting Tickets From Inventory
        let item = [];
        result.forEach((x)=>{
            x.BookedTours.forEach((y)=>{
                y.BookedToursOptions.forEach((z)=>{
                    item.push(z.TourOptionId)
                })
            })
        })
        const resultTwo = await Inventory.findAll({
            where:{TourOptionId:item, used:false}
        });
        const transports = await Transport.findAll({
            where:{status:'1'}
        })
        res.json({status:"success", result:result, resultTwo:resultTwo, transports});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getSalesReport", async(req, res) => {
    try {
        const result = await Reservations.findAll({
            where:{
                createdAt: {
                    [Op.gte]: moment(req.headers.from).toDate(),
                    [Op.lte]: moment(req.headers.to).add(1, 'days').toDate(),
                }
            },
            include:[{
                model:BookedTours,
            }],
            order: [
                ["createdAt", "DESC"],
            ],
        });
        res.json({status:"success", result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/getMyBookings", async(req, res) => {
    try {
        const result = await Reservations.findAll({
            where:{ email:req.body.email },
            order: [
                ["createdAt", "DESC"],
            ],
            include:[{
                model:BookedTours,
                include:[{
                    model:BookedToursOptions
                }]
            }]
        });
        res.json({status:"success", result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getTicketage", async(req, res) => {
    try {
        const result = await Reservations.findOne({
            where:{id:req.headers.id},
            include:[{
                model:BookedTours,
                include:[
                    {
                        model:BookedToursOptions,
                        include:[{ model:TourOptions, attributes:['manual'] }]
                    }
                ]
            }]
        });
        res.json({status:"success", result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/assignTicket", async(req, res) => {
    try {
        console.log(req.body.site, "===================================")
        let codes = "";
        if(!req.body.manual){
            req.body.tickets.forEach((x, i)=>{
                codes = codes + `${x.code}${i==req.body.tickets.length-1?"":", "}`
            })
        }
        const result = await BookedToursOptions.update({assigned:"1", codes:codes},{where:{id:req.body.BookedTourOptionId}})
        if(!req.body.manual){
            req.body.tickets.forEach(async(x)=>{
                await Inventory.upsert(x);
            })
        }
        const content = 
        `
        <p>Dear Customer</p>
        <p>Congratulations!</p>
        <p>Your ticket has been assigned!</p>
        <p>You can view your ticket in the link below!</p>
        <a href="https://${req.body.site=="ticketsvalley"?'ticketsvalley':'peacelandtravel'}.com/ticketPage?id=${req.body.ticketId}">Click this link to get your ticket</a>
        <br/>
        <p>Regards</p>
        <p>${req.body.site=="ticketsvalley"?'Ticket Valley Team':'Peaceland Travel Team'}</p>`;
        console.log("here 2")
        !req.body.manual? sendMail(req.body.email, 'Ticket Assigned', content, req.body.site):null;
        res.json({status:"success", result:result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/reverse", async(req, res) => {
    try {
        await BookedToursOptions.update({assigned:"0"},{where:{id:req.body.id}})
        res.json({status:"success"});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/bookHotel", async(req, res) => {
    try {
        const lastBooking = await HotelForm.findOne({ order: [[ 'booking_no', 'DESC' ]], attributes:["booking_no"]});
        const result = await HotelForm.create({
            ...req.body,
            booking_no:lastBooking==null?`${1}`:`${parseInt(lastBooking.booking_no)+1}`
        });
        req.body.rooms.forEach((x)=>{
            Rooms.create({...x, HotelFormId:result.id});
        });
        Notifications.create({
            description:"A Hotel Booking Created",
            checked:"0",
            type:'hotel'
        })
        res.json({status:"success"});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getHotelForms", async(req, res) => {
    try {
        const result = await HotelForm.findAll({
            where:{
                createdAt: {
                    [Op.gte]: moment(req.headers.from).toDate(),
                    [Op.lte]: moment(req.headers.to).add(1, 'days').toDate(),
                }
            },
            order: [
                ["createdAt", "DESC"],
            ],
            include:[{
                model:Rooms
            }]
        })
        res.json({status:"success", result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/markHotelQueryDOne", async(req, res) => {
    try {
        const result = await HotelForm.update(
            { done:req.headers.status=="1"?'0':'1'}, { where:{id:req.headers.id} }
        )
        res.json({status:"success", result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/createVisaForm", async(req, res) => {
    try {
        //VisaForm, VisaPersons
        const lastBooking = await VisaForm.findOne({ order: [[ 'booking_no', 'DESC' ]], attributes:["booking_no"]});
        const result = await VisaForm.create({
            booking_no:lastBooking==null?1:lastBooking.booking_no+1
        });
        console.log(result)
        req.body.persons.forEach((x)=>{
            VisaPersons.create({
                ...x, VisaFormId:result.id
            })
        });
        Notifications.create({
            description:"A Visa Form Has Been",
            checked:"0",
            type:'visa'
        });
        res.json({status:"success", result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getVisaForms", async(req, res) => {
    try {
        const result = await VisaForm.findAll({
            where:{
                createdAt: {
                    [Op.gte]: moment(req.headers.from).toDate(),
                    [Op.lte]: moment(req.headers.to).add(1, 'days').toDate(),
                }
            },
            include:[{ model:VisaPersons }],
            order: [[ 'createdAt', 'DESC' ]]
        });
        res.json({status:"success", result});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/toggleVisaForms", async(req, res) => {
    try {
        await VisaForm.update({status:req.body.status},{ where:{id:req.body.id} })
        res.json({status:"success"});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/checkNotification", async(req, res) => {
    try {
        console.log(req.body.type)
        const result = await Notifications.update({
            checked:'1'
        }, {where:{
            checked:'0',
            type:req.body.type
        }});
        res.json({status:"success"});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

module.exports = routes;