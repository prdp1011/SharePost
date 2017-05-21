/**
 * Created by JASMINE-j on 5/21/2017.
 */


var app = require('../custom/index.js');
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var async=require('async');



router.post('/getProduct',function (req,res) {

    console.log(req.body)
    Product.find({userId:req.body.userId},function (err,result) {

            if(result.length>0){

                var result1=_.map(result,function (l) {
                    return{
                        id:l._id,
                        title:l.name,
                        pdata:{"productId" : l.productId,
                            "price" : l.price,
                            "category" : l.category
                        },
                        pImages:_.map(l.path,function (o) {
                            return{
                                url:o
                            }
                        })
                    }

                })


                app.send(req,res,result1)
            }else{
                app.sendError(req,res,"no data found",result)
            }
    })
})
router.post('/getshopkeeper',function (req,res) {
    console.log(req.body)
    Admin.findOne({_id:req.body.userId},function (err,result) {
            if(result){

               app.send(req,res,result)
            }else{
                app.sendError(req,res,"no data found",result)
            }
    })
});
router.post('/removeProduct',function (req,res) {
    console.log(req.body)
        Product.update(
            {_id:req.body.pId},
            { $pull: {"path":req.body.url  } },
            { multi: true }
        ,function (err,result1) {

                if(err)app.sendError(req,res,"error in removing",err)
                else app.send(req,res,result1)

    })
})










module.exports = router;
