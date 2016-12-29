(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

  const wrapFetch = require('zipkin-instrumentation-fetch');

  app.get("/catalogue/images*", function (req, res, next) {
    var url = endpoints.catalogueUrl + req.url.toString();
    request.get(url)
        .on('error', function(e) { next(e); })
        .pipe(res);
  });

  app.get("/catalogue*", function (req, res, next) {
    var url = req.url.toString();
    var traceName = (/\/[0-9]+/.test(url) ? "GET /catalogue/{id}" : "GET /catalogue");
    helpers.simpleHttpRequest("", endpoints.catalogueUrl + url, res, next);
  });

  app.get("/tags", function(req, res, next) {
    helpers.simpleHttpRequest("", endpoints.tagsUrl, res, next);
  });

  module.exports = app;
}());
