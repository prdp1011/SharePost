/**
 * Created by JASMINE-j on 5/12/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async=require('async')

// create a schema
var categoriesSchema = new Schema({
    name:'String',
    type:'String',
    updatedAt:'Date',
    createdAt:'Date'
});



categoriesSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});


var Categories = mongoose.model('categories', categoriesSchema);

// make this available to our users in our Node applications
module.exports = Categories;
