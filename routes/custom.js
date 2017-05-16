/**
 * Created by JASMINE-j on 5/5/2017.
 */


var express = require('express');

var app = require('../custom/index.js');
var async = require('async');
var router = express.Router();
var distance = require('google-distance');






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




module.exports = router;
