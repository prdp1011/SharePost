var express  = require('express');
//var app      = express();
var app = require('./custom/index.js');
var multer=require('multer');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var jwt = require('jsonwebtoken');
var async=require('async')
var expressJwt = require('express-jwt');
var cloudinary = require('cloudinary');
var secret = 'this is the secret secret secret 12356';
var twilio = require('twilio');
var fs = require('fs'),
    http = require('http'),
    https = require('https');


cloudinary.config({
    cloud_name: 'dd5bhht9e',
    api_key: '863976267996873',
    api_secret: 'ngaisokjl2zYtEkZ9wO6X0CP4j8'
});

//---------------------------models------------------------------------
Admin = require('./model/Users');
Product = require('./model/products');
Otp = require('./model/Otp');
Category = require('./model/categories');

//-----------------------------routes----------------------------------
var Users = require('./routes/users');
var Custom = require('./routes/custom');
var admin = require('./routes/admin');
var shopkeeper = require('./routes/shopkeeper');
// ----------------------services-------------------------------------------
Helper = require('./services/helper');


app.use('/users/', Users);
app.use('/custom', Custom);
app.use('/admin', admin);
app.use('/shopkeeper', shopkeeper);

//|_____________________

mongoose.connect('mongodb://pahwa:pahwa@ds131151.mlab.com:31151/pahwa');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("database connected")
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});




// app.use('/api', expressJwt({secret: secret}));
// app.use(function(err, req, res, next){
//     // console.log(err);
//     if (err.constructor.name === 'UnauthorizedError') {
//
//         res.status(401).send('Unauthorized');
//     }
// });

app.use('/',express.static(__dirname + '/website'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());




// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         var datetimestamp = Date.now();
//         cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
//     }
// });

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()+'.jpg');
    }
});

var upload = multer({ storage : storage }).array('files');



//cloudinary.uploader.upload("my_picture.jpg", function(result) {
//    console.log(result)
//});


app.post('/upload', function(req, res) {
    //console.log(req.body);
    upload(req,res,function(err) {
        console.log(req.body);
        console.log(req.files);
        if(err) {
           console.log(err);
        }else{


 Admin.findOne({_id:req.body.userId},function (err,result) {

     if(result){
         var imgpath=[];
         async.each(req.files,function (m,callback) {

             cloudinary.uploader.upload(m.path, function(result) {
                 // console.log(result)
                 imgpath.push(result.url);
                 callback()
             })

         },function(done){
             Product.findOne({userId:req.body.userId},{},{sort:{productId:-1}},function (err,w) {
                     if (err) console.log(err)
                     var productId = w ? w.productId + 1 : 1
                     console.log(imgpath)
                     Product.create({
                         userId: req.body.userId,
                         productId: productId,
                         path: imgpath,
                         price: req.body.price,
                         category: req.body.category,
                         name: req.body.name
                     }, function (err, s) {
                         if (err) console.log(err)

                         app.send(req, res, s)
                         console.log("database uploaded")
                     })

             })
         })
     }else{

         app.sendError(req,res,"no id found",err)
     }
 });

     }

 })


});






app.get('/sendSms',function(req,res){

    var plivo = require('plivo');

    var api = plivo.RestAPI({
        authId: 'MAZJBLODRMYWJJNMU1M2',
        authToken: 'NTNiYzk1ZDc2MjZmY2UwOTliNzQ3YzUxZDdkMTU1',
    });




    var params = {
        'src': '+918447050567', // Sender's phone number with country code
        'dst' : '+918447050567', // Receiver's phone Number with country code
        'text' : "Hi, message from Plivo", // Your SMS Text Message - English

    };

   api.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });










})



process.on('uncaughtException', function (err) {

    console.log(err)
});



app.listen( (process.env.PORT || 4242), function(){
console.log("Express server listening on port " + (process.env.PORT || 4242));
})
