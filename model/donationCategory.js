
/**
 * Created by JASMINE-j on 5/4/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var donCatSchema = new Schema({
    name:'String',
    createdAt : {type : 'date'},
    verifiedAt : {type : 'date'}
});






// on every save, add the date
donCatSchema.pre('save', function (next) {
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
var DonationCat= mongoose.model('donationCat', donCatSchema);
module.exports = DonationCat;
