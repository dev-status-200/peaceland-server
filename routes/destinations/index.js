const routes = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { City, Destination } = require('../../associations/bookingaccociations');

routes.get("/getAll", async(req, res)=>{
    try {
        const result = await Destination.findAll({
            where:{
                active:'1'
            },
            include:[{
                model:City
            }]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getAllCities", async(req, res)=>{
    try {
        const result = await City.findAll({
            where:{
                active:'1'
            }
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/createCity", async(req, res)=>{
    try {
        const result = await City.create(req.body)
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/deleteCity", async(req, res)=>{
    try {
        const result = await City.destroy({where:{id:req.body.id}})
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

module.exports = routes;