/**
 * Created by JASMINE-j on 5/4/2017.
 */




var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.Response = function(){
    var self = {};
    self.status = '';
    self.isError = true;
    self.data = {};
    self.error = null;
    return self;
};

app.ErrorResponse = function(msg, stackTrace){
    var self = app.Response.call();
    self.status = 'err';
    self.msg = msg;
    self.isError = true;
    self.error = stackTrace;
    return self;
};

app.SuccessResponse = function(_data){
    var self = app.Response.call();
    self.data = _data;
    self.status = 'success';
    self.msg = 'success';
    self.isError = false;
    return self;
}

app.sendRaw = function(req, res, data){
    console.log('Response: ' + JSON.stringify(data));
    res.send(data);
};

app.send = function(req, res, data){
    // console.log('Response: ' + JSON.stringify(data));
    res.send(new app.SuccessResponse(data));
};

app.sendError = function(req, res, msg, err){
    console.log('Error: ' + JSON.stringify(err));
    res.send(new app.ErrorResponse(msg, err));
}


module.exports = app;
