/**
 * Created by JASMINE-j on 5/19/2017.
 */
/**
 * Created by JASMINE-j on 5/4/2017.
 */
//var app = require('custom');
var app = require('../custom/index.js');
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var async=require('async');

router.post('/delNoti',function (req,res){

 Admin.update({role:1},{$set:{notification:0}},function (err,resp1) {

    app.send(req,res,resp1)

 })

})


router.get('/dashboard',function (req,res) {

    Admin.aggregate([{$group:{_id:{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },count:{$sum:1}}}],function (err,results) {

        var data=_.map(results,function (l) {

            return{
                "label" : l._id ,
                "value" : parseInt(l.count)
            }
        })


        var sendData={
            "key":"ShopKeeper",
            "color":"#D62728",
            "values":data
        }

        app.send(req,res,[sendData])

    })


})

router.post('/shopkeeper',function (req,res) {
    console.log(req.body.id)
 var query={}
    query={role:2},{_id:1,shopName:1}
        if(req.body.id!=0)query={_id:req.body.id}
    Admin.find(query,function (err,result1) {
// console.log(result1)
        app.send(req,res,result1)
    })

})

router.get('/approve',function (req,res) {

    console.log(req.query.approve)
    console.log(req.query.id)
    if(req.query.approve==1){
        console.log("enable")
        Admin.update({_id:req.query.id},{$set:{approved:1}},function (err,resp) {
            app.send(req,res,resp)
        })

    }else{
        console.log("disable")
        Admin.update({_id:req.query.id},{$set:{approved:0}},function (err,resp) {
            app.send(req,res,resp)
        })

    }

})

router.post('/addCat',function (req,res) {

    Category.create({
        name:req.body.name

    },function (err,result) {
        if(err){
            app.sendError(req,res,result)
        }else {
            console.log(result)
            app.send(req, res, result)
        }
    })

})
router.post('/getCat',function (req,res) {

    Category.find({
    },function (err,result) {
        if(err){
            app.sendError(req,res,result)
        }else {
            console.log(result)
            app.send(req, res, result)
        }
    })

})
router.post('/getSubCat',function (req,res) {

    Category.findOne({_id:req.body.id
    },function (err,result) {
        if(err){
            app.sendError(req,res,result)
        }else {
            console.log(result)
            app.send(req, res, result)
        }
    })

})
router.post('/getNotification',function (req,res) {

    Admin.findOne({role:req.body.role
    },{notification:1},function (err,result) {
        if(err){
            app.sendError(req,res,result)
        }else {
            console.log(result)
            app.send(req, res, result)
        }
    })

})
router.post('/notificationLogs',function (req,res) {

   Admin.find({role:2
    },{firstName:1,lastName:1,createdAt:1},function (err,result1) {
        if(err){
            app.sendError(req,res,result1)
        }else {
            Admin.find({role:3
            },{firstName:1,lastName:1,createdAt:1},function (err,result2) {
                if(err){
                    app.sendError(req,res,result2)
                }else {
                    Product.find({
                    },{},{$sort:{createdAt:-1}},function (err,result3) {
                        if (err) {
                            app.sendError(req, res, result3)
                        } else {
                    Admin.find({role:2},function (err,result4) {
                        if (err) {
                            app.sendError(req, res, result3)
                        } else {

                            _.forEach(result3,function (s,key) {
                                _.forEach(result4,function (k) {
                                    if((s.userId).toString()==(k._id).toString()){
                                        console.log("matched")
                                        console.log(key)

                                        result3[key].uploadBy=k.shopName
                                        console.log(result3[key])
                                    }

                                })

                            })
                            app.send(req, res, [result1,result2,result3])


                        }

                    })


                        }
                    })
                }
            })
        }
    })

})
router.post('/addSubCat',function (req,res) {

    Category.update({_id:req.body.id
    },{ $push: { subCategory: { $each: req.body.subCatArray } } },function (err,result) {
        if(err){
            app.sendError(req,res,result)
        }else {
            console.log(result)
            app.send(req, res, result)
        }
    })

})


router.post('/addNumber',function (req,res) {
console.log(req.body)
    var response=[]
async.each(req.body,function (item,callback) {

    Phonediary.create({name:item.name,number:item.number,Cat:item.cat,
    subCat:item.sub},function (err,result) {
        response.push(result)
        callback()
    })


},function (done) {
app.send(req,res,response)
})

})
router.post('/getNumber',function (req,res) {
Phonediary.find({},function (err,result) {
    if(err){app.sendError(req,res,"data not found",err)}else{
        app.send(req,res,result)
    }
})
})

router.post('/saveDcat',function (req,res) {

    async.each(req.body.array,function (item,callback) {
        DiaryCategories.create(item, function (err, result) {
        callback()
        })
    },function (done) {

app.send(req,res,"done")
    })

})

router.post('/getDcat',function (req,res) {
    DiaryCategories.find({},function (err,result) {

        if(err){app.sendError(req,res,"err",err)
        }else {

            app.send(req,res,result)
        }

    })
})


module.exports = router;
