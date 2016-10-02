(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

  app.get("/catalogue/images*", function (req, res, next) {
    var url = endpoints.catalogueUrl + req.url.toString();
    request.get(url).pipe(res);
  });

  app.get("/catalogue*", function (req, res, next) {
    helpers.simpleHttpRequest(endpoints.catalogueUrl + req.url.toString(), res, next);
  });

  app.get("/tags", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
  });

  app.get("/cycle", function(req, res, next) {
    var usage_time = 5;
    if (req.query.time) {
      console.log("query time passed in");
      usage_time = parseInt(req.query.time);
    }
    blockCpuFor(usage_time * 1000);
    res.status(200)
    res.end();
  });

  module.exports = app;
}());


function blockCpuFor(ms) {
  console.log("Blocking for " + ms + "ms.")
  var now = new Date().getTime();
  var result = 0
  while(true) {
    result += Math.random() * Math.random();
    if (new Date().getTime() > now +ms)
      return;
  } 
}