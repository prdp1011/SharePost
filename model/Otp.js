/**
 * Created by JASMINE-j on 5/4/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var otpSchema = new Schema({
    otp : {type :'number'},
    phoneNumber : { type: "string" },
    message: {type: 'string'},
    used: {type: 'number', defaultsTo : 0, required: true},
    createdAt : {type : 'date'},
    verifiedAt : {type : 'date'}
});


otpSchema.statics.getMessage =  function(otp){
    return otp + ' is your Be U Salons verification code.';
};



// on every save, add the date
otpSchema.pre('save', function (next) {
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
var Otp = mongoose.model('otp', otpSchema);
module.exports = Otp;
