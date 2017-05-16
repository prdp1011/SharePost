/**
 * Created by JASMINE-j on 5/12/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async=require('async')

// create a schema
var uploadSchema = new Schema({
    userId:{type:mongoose.Schema.Types.ObjectId},
    productId:'Number',
    category:'String',
    price:'String',
    name:'String',
    path:[]
});



uploadSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});


var Upload = mongoose.model('Upload', uploadSchema);

// make this available to our users in our Node applications
module.exports = Upload;
