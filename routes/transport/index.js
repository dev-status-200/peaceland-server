const routes = require('express').Router();
const { Transport } = require('../../models');

routes.post("/create", async(req, res)=>{
    
    let data = req.body;
    try {
        delete data.id
        const result = await Transport.create({...data, editable:'1'})
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.post("/edit", async(req, res) => {
    let data = req.body;
    try {
        const result = await Transport.update(data, {where:{id:data.id}})
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.post("/disable", async(req, res) => {
    let data = req.body;
    try {
        console.log(data)
        const result = await Transport.update({status:data.data.status}, {where:{id:data.data.id}})
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/get", async(req, res)=>{
    try {
        const result = await Transport.findAll();
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

module.exports = routes;