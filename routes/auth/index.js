const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const verify = require('../../functions/tokenVerification')
const { Users, Notifications } = require('../../models');

routes.post("/login", async(req, res)=>{
    console.log(req.body);
    const { email, password } = req.body
      const users = await Users.findOne({ where:{email:email, password:password} })
    if(users){
      if(password==users.password){
        const payload = { username:users.name, email:users.email, loginId:users.id}
        jwt.sign(payload, 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm',
          {expiresIn:"12h"},
          (err,token) => {
            if(err) return res.json({message: err});
            return res.json({message:"Success", token: "BearerSplit"+token})
          }
        )
      } else { return res.json({message:"Invalid"}) }

    } else { return res.json({message:"Invalid"}) }
});

routes.get("/verifyLogin", verify, (req, res) => { res.json({isLoggedIn:true, username:req.body.username}) });

routes.get("/getNotifications", async(req, res)=>{
  try {
    const result = await Notifications.findAll({
      limit:100,
      order: [
        ["createdAt", "DESC"],
    ],
    });
    res.json({status:'success', result})
  } catch (error) {
    res.json({status:'error'})
  }
});

module.exports = routes;