/**
 * Created by JASMINE-j on 5/5/2017.
 */


var express = require('express');

var app = require('../custom/index.js');
var async = require('async');
var router = express.Router();
var distance = require('google-distance');




router.post('/donOtp',function (req,res) {


    Otp.findOne({phoneNumber:req.body.phoneNumber,createdAt:{$gte:Helper.get60secBefore(),$lt: new Date()}},function (err,resOtp) {
        if(resOtp){
            console.log("resOtp",resOtp)

            app.sendError(req,res,"Wait for 45 Seconds")
        }else{
            var getOtp= Math.floor(Math.random() * 9000) + 1000;
            var query={
                otp : getOtp,
                phoneNumber : req.body.phoneNumber,
                message:"Your Otp is :"+getOtp,
                used:0
            }

            Otp.create(query,function (err,resCreate) {
                if(err){console.log(err)}else {
                    console.log("resCreate", resCreate)

                    app.send(req, res, resCreate)
                }
            })
        }



    })




})

router.post('/verifyDon',function (req,res) {

    console.log(req.body)

    Otp.findOne({phoneNumber:req.body.phoneNumber,otp:req.body.otp,used:0,createdAt : { $gt: Helper.get5minBefore()}},function (err,resVer) {
        if(err){console.log(err)}
        if(resVer) {
            console.log("entered")
            Otp.update({phoneNumber: req.body.phoneNumber, used: 0}, {
                used: 1,
                verifiedAt: new Date()
            }, function (err, update) {
                console.log("updated")
                if(err){console.log(err)}
                app.send(req,res,update)
            })
        }else{
            app.sendError(req,res,"Invalid Otp or Otp already Used")
        }
    })

});


router.post('/receiveDonation',function (req,res) {

    Donation.create({
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        message:req.body.message,
        type:req.body.type,
        group:req.body.group,
        groupId:req.body.groupId,
    },function (err,result) {

        if(err){}else{
            app.send(req,res,result)
        }

    })
})


router.post('/ownerDonation',function (req,res) {
    Donation.create({
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        type:req.body.type,
        groupId:req.body.groupId,
    },function (err,result) {

        if(err){}else{
            app.send(req,res,result)
        }

    })

})







router.post('/location',function(req,res){


    console.log(req.body)

    var array=req.body.array
    var sendData=[];
    async.each(array,function(item,callback){
        console.log(""+item+"")
        distance.get(
            {
                index: item,
                origin: '37.772886,-122.423771',
                destination: item
            },
            function(err, data) {
                if (err) return console.log(err);

                sendData.push(data)
                callback()

            })


    },function(err,done){

        app.send(req,res,sendData);

    })
})






router.post('/getDonationCat',function (req,res) {

    DonationCat.find({},function (err,result) {
        if(err){}else{
            app.send(req,res,result)
        }

    })

})

router.post('/bCat',function (req,res) {

    DonationCat.create({name:req.body.name},function (err,result) {

        if(err){}else{
            app.send(req,res,result)
        }

    })


})



module.exports = router;
