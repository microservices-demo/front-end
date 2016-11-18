(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , helpers   = require("../../helpers")
    , endpoints = require("../endpoints")
    , app       = express()

  app.get("/deals", function (req, res, next) {
    helpers.simpleHttpRequest(endpoints.dealsUrl + req.url.toString(), res, next);
  });

  module.exports = app;
}());
