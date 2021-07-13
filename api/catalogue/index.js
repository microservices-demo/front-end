(function (){
  'use strict';

  var newrelic     = require('newrelic')
    , express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()
    , logger    = require("../../logger")

  app.locals.newrelic = newrelic;

  app.get("/catalogue/images*", function (req, res, next) {
    var url = endpoints.catalogueUrl + req.url.toString();
    var time = Math.ceil(Math.random()*10) === 0 ? 5 : 0;
    logger.info(`${time} secs waiting`);    
    setTimeout(()=>{
    request.get(url)
        .on('error', function(e) { next(e); })
        .pipe(res);
    }, time*1000);
  });

  app.get("/catalogue*", function (req, res, next) {
    helpers.simpleHttpRequest(endpoints.catalogueUrl + req.url.toString(), res, next);
  });

  app.get("/tags", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
  });

  module.exports = app;
}());
