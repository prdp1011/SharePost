/**
 * Created by JASMINE-j on 5/4/2017.
 */
//var app = require('custom');
var app = require('../custom/index.js');
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var async=require('async')

router.get('/login', function (req, res) {
    console.log(req.query);
   Admin.findOne({phoneNumber:req.query.username}).exec(function(err,result){
        if(err) {
            console.log(err);
            app.sendError(req,res,err)}
        if(result) {
            console.log(result)
            if (!(result.password === req.query.password)) {
                app.sendError(req,res,'Wrong user or password');
                return;
            }
            var profile = {
                firstName: result.firstName,
                lasttName: result.lastName,
                emailId: result.emailId,
                address:result.address1,
                phoneNumber: result.phoneNumber,
                id:result._id,
                role:result.role
            };
            console.log({isError: false, data: profile})
            app.send(req, res, profile)
        }else{
            console.log("user not found");
            app.sendError(req, res, "user not found")
        }

    })



    // We are sending the profile inside the token
    // var token = jwt.sign(profile, secret, { expiresIn: 60*5 });
    // console.log(token)
    //
    // res.json({ token: token });
});





router.post('/sendOtp',function (req,res) {

    Admin.findOne({phoneNumber:req.body.phoneNumber},function (err,resUser) {
        if(resUser){
            console.log("resUser",resUser)
            app.sendError(req,res,"already registered")
        }else{
            Otp.findOne({phoneNumber:req.body.phoneNumber,createdAt:{$gte:Helper.get60secBefore(),$lt: new Date()}},function (err,resOtp) {
                if(resOtp){
                    console.log("resOtp",resOtp)

                    app.sendError(req,res,"Wait for 45 Seconds")
                }else{
                    var getOtp= Math.floor(Math.random() * 9000) + 1000;
                    var query={
                        otp : getOtp,
                        phoneNumber : req.body.phoneNumber,
                        message:"Your Otp is -"+getOtp,
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

        }
    })
});

router.post('/verifyOtp',function (req,res) {

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

router.post('/register',function (req,res) {

var query={
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    shopName: req.body.shopName,
    emailId:req.body.emailId,
    tinNumber:req.body.tinNo,
    panNumber:req.body.panNo,
    address1:req.body.address.name,
    category:req.body.cat,
    phoneNumber:req.body.phoneNumber ,
    password: req.body.password,
    role: req.body.role,
    lat: req.body.address.lat,
    long: req.body.address.long
}
Admin.findOne({phoneNumber:query.phoneNumber},function (err,resAdmin) {

    if(resAdmin){

        app.sendError(req,res,"Phone Number already registered",resAdmin)
    }else{
        Admin.create(query,function(err,response){
            app.send(req,res,response)

        })
    }
})






});



module.exports = router;
