/**
 * Created by JASMINE-j on 5/4/2017.
 */


// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async=require('async')
var distance = require('google-distance');


// create a schema
var userSchema = new Schema({
    firstName: String,
    lastName: String,
    shopName: String,
    emailId:String,
    tinNumber:String,
    panNumber:String,
    address1:String,
    address2:String,
    category:String,
    notification:Number,
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: String,
    approved: {type:'number',default:0},
    lat: String,
    long: String,
    createdAt: Date,
    updatedAt: Date,
    distance:String
});





userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});





userSchema.statics.createUser=function(req,callback){

var query={
    name: req.body.name,
    shopName: req.body.shopName,
    emailId:req.body.emailId,
    tinNumber:req.body.tinNumber,
    panNumber:req.body.panNumber,
    address1:req.body.address1,
    address2:req.body.address2,
    category:req.body.category,
    phoneNumber:req.body.phoneNumber ,
    password: req.body.password,
    role: req.body.role,
    lat: req.body.lat,
    long: req.body.lang
}


User.create(query,function(err,response){
    callback(err,response);

})




}




userSchema.statics.getMe=function(req,callback){

var cords=req.body
    console.log(cords)
    var cordss=""+cords.lat+","+cords.long+""
    var finalData=[];
    User.find({},{shopName:1,lat:1,long:1,address1:1}).exec(function(err,response){


        async.each(response,function(item,callback1){

            if(cords==null) {
                console.log("" + item.lat + "," + item.long + "")

                // console.log(cords)
                distance.get(
                    {
                        index: item,
                        origin: cordss,
                        destination: "" + item.lat + "," + item.long + ""
                    },
                    function (err, data) {
                        if (err) return console.log(err);
                        // console.log(data.distance)
                        // console.log(item)
                        item["distance"] = data.distance
                        finalData.push(item)
                        callback1()

                    })
            }else{
                finalData.push(item)
                callback1()
            }

        },function(err,done){

            callback(err,finalData)

        })



    })


}










var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
