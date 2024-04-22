const routes = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Tours, Reservations, Customers, PackageBooking } = require('../../models');
const { TourOptions, BookedTours, BookedToursOptions } = require('../../associations/bookingaccociations');
const { Inventory, History } = require('../../associations/inventoryAssociation');
const cloudinary = require('cloudinary').v2;
const moment = require("moment");

cloudinary.config({ 
    cloud_name: 'abdullah7c', 
    api_key: '588918314875928', 
    api_secret: 'Ebgb2OJhP4aqm7ZiF7tJvtk9q-s',
    secure: true
});

const createPackages = (arrz, id) => {
    let results = [];
    arrz.forEach((x)=>{
        if(x.id==""){
            results.push({
                name:x.name, child_price:x.child_price, adult_price:x.adult_price, status:x.status , stock:x.stock, TourId:id,
                dated:x.dated, timed:x.timed, dates:x.dates, timeSlots:x.timeSlots, detail:x.detail, oldPrice:x.oldPrice
            })
        }
    })
    return results;
}

const createupdatedPackages = (arrz, id) => {
    let results = [];
    arrz.forEach((x)=>{
        if(x.id!=""){
            results.push({...x, TourId:id})
        }
    })
    console.log(results)
    return results;
}

const findDifference = (a,b) => {
    const isSameUser = (a, b) => a.code === b.code;
    const onlyInLeft = (left, right, compareFunction) => 
    left.filter(leftValue =>
        !right.some(rightValue => 
        compareFunction(leftValue, rightValue)));

    const onlyInA = onlyInLeft(a, b, isSameUser);
    const onlyInB = onlyInLeft(b, a, isSameUser);

    const result = [...onlyInA, ...onlyInB];
    return result;
}

const setRecords = (data, user) => {
    let temp = [];
    data.forEach((x,i)=>{
        if(i==0){
            temp.push({
                TourOptionId:x.TourOptionId,
                stock:1,
                by:user
            })
        }else{
            if(temp[temp.length-1].TourOptionId==x.TourOptionId){
                temp[temp.length-1].stock = temp[temp.length-1].stock+1
            }else{
                temp.push({
                    TourOptionId:x.TourOptionId,
                    stock:1,
                    by:user
                })  
            }
        }
    })
    console.log(temp);
    return temp;
}

routes.post("/create", async(req, res)=>{
    let data = req.body;
    data.status=1
    try {
        const result = await Tours.create({...data, destination:'uae', slug:`${data.title}`.toLowerCase().replace(/\s+/g, '-')});
        await TourOptions.bulkCreate(createPackages(data.packages, result.id))
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/createPackageBooking", async(req, res)=>{
    try {
        console.log({...req.body})
        const result = await PackageBooking.create({...req.body})
        .catch((x)=>{
            console.log(x)
        })
        res.json({status:'success', result})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getPackageBooking", async(req, res)=>{
    try {
        const result = await PackageBooking.findAll({
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

routes.post("/togglePackage", async(req, res) => {
    try {
        await PackageBooking.update({status:req.body.status},{ where:{id:req.body.id} })
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.post("/bulkCreate", async(req, res)=>{
    try {
        let data = req.body;
        await Tours.bulkCreate(data);
        res.json({status:'success', result:'result'})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.post("/edit", async(req, res) => {
    let data = req.body;
    try {
        if(data.prev_img!=''){
            // cloudinary.uploader.destroy(data.prev_img.slice(62,-4), function(error,result) {
            // console.log(result, error) });
        }
        if(data.deleted_images.length>0){
            data.deleted_images.forEach((x)=>{
                // cloudinary.uploader.destroy(x.slice(62,-4), function(error,result) {
                // console.log(result, error) });
            });
        }
        await Tours.update({...data, slug:`${data.title}`.toLowerCase().replace(/\s+/g, '-')}, {where:{id:data.id}})
        await TourOptions.bulkCreate(createupdatedPackages(data.packages, data.id), {
            updateOnDuplicate: ["name", "child_price", "adult_price", "status", "dates", "dated", "timed", "timeSlots", "transport", "manual", "oldPrice", "detail"],
        });
        await TourOptions.bulkCreate(createPackages(data.packages, data.id))
        const resultTwo = await Tours.findOne({
            where:{id:data.id},
            include:[{
                model:TourOptions
            }]
        })
        res.json({status:'success', result:resultTwo})
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/get", async(req, res)=>{
    try {
        console.log()
        let type = req.headers.type
        const result = await Tours.findAll({
            where:{package:type=="package"?"1":"0"},
            attributes:['id', 'main_image', 'title', 'category', 'status']
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getPackagesClient", async(req, res)=>{
    try {
        const result = await Tours.findAll({
            where:{package:"1", status:'1'},
            attributes:[
                'id', 'main_image', 'title', 'packageTravel',
                'packageCountry', 'packageCity', 'packageDescription',
                'packageIncludes', 'prevPrice', 'slug'
            ]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getByCategory", async(req, res)=>{
    try {
        const result = await Tours.findAll({
            limit:5,
            where:{advCategory:req.headers.category, status:"1"},
            attributes:["id", "main_image", "title", "slug", "city"],
            include:[{
                model:TourOptions,
                attributes:["adult_price"],
            }]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getByBasicCategory", async(req, res)=>{
    try {
        const result = await Tours.findAll({
            where:{category:req.headers.category},
            attributes:["id", "main_image", "title"],
            include:[{
                model:TourOptions,
                attributes:["adult_price"],
            }]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getById", async(req, res)=>{
    try {
        const result = await Tours.findOne({
            where:{id:req.headers.id},
            attributes:[
                'id', 'title' , 'availability', 'duration', 'time_slot', 'confirmation',
                'refund', 'voucher', 'lang','city','destination', 'prevPrice',
                'main_image', 'departure', 'reporting', 'cutOff'
            ]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getBySlug", async(req, res)=>{
    try {
        const result = await Tours.findOne({
            where:{slug:req.headers.id},
            attributes:[
                'id', 'title' , 'availability', 'duration', 'time_slot', 'confirmation',
                'refund', 'voucher', 'lang','city','destination',
                'main_image', 'departure', 'reporting', 'slug'
            ]
        }).catch((x)=>{
            console.log(x)
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getDetailsById", async(req, res)=>{
    try {
        const includes = req.headers.type=="product"? [{ model:TourOptions, where:{status:"1"} }]:[]
        const result = await Tours.findOne({
            where:{id:req.headers.id},
            attributes:[
                'cancellation_polices', 'more_images', 'main_image', 'advCategory', 'category',
                'policies', 'imp_infos' , 'why_shoulds', 'inclusions', 'tour_detail', 'prevPrice',
                'travelDetail', 'packageIncludes', 'packageDescription', 'packageCity', 'packageCountry',
                'packageTravel', 'cutOff'
            ],
            include:includes
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getAllIds", async(req, res)=>{
    try {
        const result = await Tours.findAll({
            attributes:['id'],
        });
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getAllSlugs", async(req, res)=>{
    try {
        const type = req.headers.type
        console.log(type)
        const result = await Tours.findAll({
            where:{
                package:type=="package"?'1':'0',
                status:'1'
            },
            attributes:['slug', 'id'],
        });
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/createInventory", async(req, res)=>{
    try {
        const old = await Inventory.findAll({where:{code:req.body.codes}});
        let difference = await findDifference(old, req.body.inventory);
        let temp = difference.length>0? setRecords(difference, req.body.username):[];

        await Inventory.bulkCreate(difference, {
            updateOnDuplicate: ["code"],
        })
        await History.bulkCreate(temp)
        res.json({status:'success', result:difference});
    } catch (error) {
        res.json({status:'error', result:error});
    }
});

routes.get("/getTourInventoryStatus", async(req, res)=>{
    try {
        const result = await Tours.findAll({
            attributes:['id', 'title', 'main_image'],
            include:[{
                model:TourOptions,
                attributes:['id', 'name', 'status'],
                include:[
                    {
                        model:Inventory,
                        where:{used:false}
                    },
                    {
                        order: [
                            ["createdAt", "DESC"],
                        ],
                        limit:1,
                        model:History
                    }
                ]
            }]
        });
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.post("/removeInventory", async(req, res)=>{
    try {
        const result = await Inventory.destroy({
            where:{code:req.body}
        });
        res.json({
            status:'success', 
            result:result
        });
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getAllHistories", async(req, res)=>{
    try {
        const result = await History.findAll({
            order: [
                ["createdAt", "DESC"],
            ],
            include:[
                {
                    model:TourOptions,
                    attributes:['name'],
                    include:[
                        {
                            model:Tours,
                            attributes:['title']
                        }
                    ]
                }
            ]
        });
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/searchTourPeaceland", async(req, res) => {
  try {
    let obj = {
            status:'1'
    };
    req.headers.destination?obj.destination = req.headers.destination:null;
    req.headers.category?obj.category = req.headers.category:null;
    req.headers.city?obj.city = req.headers.city:null;
    const result = await Tours.findAll({
            attributes:['id','title','main_image','category','advCategory', 'slug', 'city', 'destination', 'duration'],
            where:obj,
            include:[{
                model:TourOptions,
                limit:1,
                attributes:['id','adult_price']
            }]
    });
    res.json({status:'success', result:result});
  } catch (error) {
    res.json({status:'error', result:error})
  }
});

routes.get("/searchTour", async(req, res) => {
    try {
        let obj = { status:'1' };
        if(req.headers.date!=""){
          obj = {
            dates:{
              [Op.contains]:[{ date: req.headers.date }]
            }
          }
        }
        const result = await Tours.findAll({
            attributes:['id', 'title', 'main_image', 'category', 'advCategory', 'duration', 'slug'],
            where:{
                destination:req.headers.destination,
                city:req.headers.city
            },
            include:[{
                model:TourOptions,
                limit:1,
                where: obj,
                attributes:['id','adult_price','dates']
            }]
        });
        let ids = []; //result[0].TourOptions[0];
        result.forEach((x)=>{
            ids.push(`${x.id}`);
        })
        const options = await BookedTours.findAll({
            where:{tourId:ids},
            attributes:['tourId'],
            include:[{
                model:BookedToursOptions,
                where:{reviewed:"1", allowed:"1"},
                attributes:['rating']
            }]
        })
        res.json({status:'success', result:result, options:options});
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/getInsights", async(req, res) => {
    try {
        const tours = await Tours.findAll({attributes:['id']});
        const reserves = await Reservations.findAll({attributes:['final_price']});
        const customs = await Customers.findAll({attributes:['id']});
        const booked = await BookedToursOptions.findAll({attributes:['assigned']});

        res.json({status:'success', result:{tours, reserves, customs, booked}});
    } catch (error) {
        res.json({status:'error', result:error})
    }
});

routes.get("/getReviews", async(req, res)=>{
    try {
        const result = await TourOptions.findAll({
            raw:true,
            where:{TourId:req.headers.id},
            attributes:[],
            include:[{
                model:BookedToursOptions,
                where:{allowed:'1'},
                attributes:['review', 'rating'],
                include:[{
                    model:BookedTours,
                    attributes:['CustomerId', 'createdAt'],
                    include:[{
                        attributes:['name', 'image'],
                        model:Customers
                    }]
                }]
            }]
        });
        res.json({status:'success', result:result});
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/getTourForEdit", async(req, res)=>{
    try {
        const result = await Tours.findOne({
            where:{id:req.headers.id},
            include:[{
                model:TourOptions
            }]
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

routes.get("/tourSearch", async(req, res)=>{
    try {
        console.log(req.headers)
        const result = await Tours.findAll({
            where:{
                [Op.or]: [
                    { title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + req.headers.search.toLowerCase() + '%') }, 
                ],
            },
            attributes:['title', 'slug']
        })
        res.json({status:'success', result:result})
    } catch (error) {
        res.json({status:'error'})
    }
});

module.exports = routes;