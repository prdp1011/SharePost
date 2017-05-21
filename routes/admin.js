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

module.exports = router;
