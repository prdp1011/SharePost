/**
 * Created by JASMINE-j on 5/12/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async=require('async')

// create a schema
var productSchema = new Schema({
    userId:{type:mongoose.Schema.Types.ObjectId},
    productId:'Number',
    category:'String',
    price:'String',
    name:'String',
    path:[],
    updatedAt:'Date',
    createdAt:'Date'
});



productSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});


var Product = mongoose.model('Product', productSchema);

// make this available to our users in our Node applications
module.exports = Product;
