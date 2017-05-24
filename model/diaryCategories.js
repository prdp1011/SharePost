/**
 * Created by JASMINE-j on 5/25/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var diaryCatSchema = new Schema({
    category : { type: "string" },
    subcategories:[],
    createdAt : {type : 'date'},
    verifiedAt : {type : 'date'}
});

// on every save, add the date
diaryCatSchema.pre('save', function (next) {
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
var DiaryCategories = mongoose.model('diaryCategories', diaryCatSchema);
module.exports = DiaryCategories;

