(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , headers   = require("../headers")
    , app       = express()

  app.get("/catalogue/images*", function (req, res, next) {
    var options = {
      uri: endpoints.catalogueUrl + req.url.toString()
    };
    helpers.addHeader(options, req, headers.channelHeader);

    request.get(options)
        .on('error', function(e) { next(e); })
        .pipe(res);
  });

  app.get("/catalogue*", function (req, res, next) {
    var options = {
      uri: endpoints.catalogueUrl + req.url.toString()
    };
    helpers.addHeader(options, req, headers.channelHeader);

    helpers.simpleHttpRequest(options, res, next);
  });

  app.get("/tags", function(req, res, next) {
    var options = {
      uri: endpoints.tagsUrl
    };
    helpers.addHeader(options, req, headers.channelHeader);

    helpers.simpleHttpRequest(options, res, next);
  });

  module.exports = app;
}());
