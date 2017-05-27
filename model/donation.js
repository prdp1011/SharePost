
/**
 * Created by JASMINE-j on 5/27/2017.
 */


/**
 * Created by JASMINE-j on 5/4/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var donSchema = new Schema({
    name:'String',
    phoneNumber:'Number',
    message:'String',
    type:'Number',
    group:'String',
    groupId:{type:mongoose.Schema.Types.ObjectId},  // 0-receiver 1- donor
    createdAt : {type : 'date'},
    verifiedAt : {type : 'date'}
});






// on every save, add the date
donSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    this.role = parseInt(this.role);

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});
var Donation= mongoose.model('donation', donSchema);
module.exports = Donation;
