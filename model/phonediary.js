/**
 * Created by JASMINE-j on 5/12/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async=require('async')

// create a schema
var phoneDiarySchema = new Schema({
    name:String,
    number:{type:'string'},
    Cat:{type:'string'},
    subCat:{type:'string'},
    updatedAt:'Date',
    createdAt:'Date'
});



phoneDiarySchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});


var phonediary = mongoose.model('phonediary', phoneDiarySchema);

// make this available to our users in our Node applications
module.exports = phonediary;
