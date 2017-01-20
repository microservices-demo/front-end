(function (){
  'use strict';

  var async     = require("async")
    , express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()
    , fetch = require('node-fetch')
    , wrapFetch    = require('zipkin-instrumentation-fetch')
  var zipkinFetch = helpers.getFetch()
  app.get("/orders", function (req, res, next) {
    console.log("Request received with body: " + JSON.stringify(req.body));
    var logged_in = req.cookies.logged_in;
    if (!logged_in) {
      throw new Error("User not logged in.");
      return
    }

    var custId = req.session.customerId;
	  var url = endpoints.ordersUrl + "/orders/search/customerId?sort=date&custId=" + custId
	  zipkinFetch(url, {headers: req.headers}).then(resp => resp.json()).then(function(json){
		var body = JSON.stringify(json._embedded.customerOrders)
		console.log(body)  
		  res.write(body)
		res.end()
	  }).catch(next);
    
  });

  app.get("/orders/*", function (req, res, next) {
	  var url = endpoints.ordersUrl + req.url.toString();
	  zipkinFetch(url, {headers: req.headers}).then(resp => resp.body.pipe(res)).catch(next);
  });

  app.post("/orders", function(req, res, next) {
    console.log("Request received with body: " + JSON.stringify(req.body));
    var logged_in = req.cookies.logged_in;
    if (!logged_in) {
      throw new Error("User not logged in.");
      return
    }

    var custId = req.session.customerId;

    async.waterfall([
        function (callback) {
          var url = endpoints.customersUrl + "/" + custId
	  zipkinFetch(url, {headers: req.headers}).then(resp => resp.json()).then(function(body){
            var jsonBody = body;
            var customerlink = jsonBody._links.customer.href;
            var addressLink = jsonBody._links.addresses.href;
            var cardLink = jsonBody._links.cards.href;
            var order = {
              "customer": customerlink,
              "address": null,
              "card": null,
              "items": endpoints.cartsUrl + "/" + custId + "/items"
            };
	    callback(null, order, addressLink, cardLink);
	  }).catch(callback);
        },
        function (order, addressLink, cardLink, callback) {
          async.parallel([
              function (callback) {
                console.log("GET Request to: " + addressLink);
		  zipkinFetch(addressLink, {headers: req.headers}).then(resp => resp.json()).then(function(body){
                    console.log("Received response: " + JSON.stringify(body));
                    var jsonBody = body;
                    if (jsonBody._embedded.address[0] != null) {
                      order.address = jsonBody._embedded.address[0]._links.self.href;
                    }
                    callback();
	  	 }).catch(callback);
              },
              function (callback) {
                console.log("GET Request to: " + cardLink);
		zipkinFetch(cardLink, {headers: req.headers}).then(resp => resp.json()).then(function(body){
                  var jsonBody = body;
                  if (jsonBody._embedded.card[0] != null) {
                    order.card = jsonBody._embedded.card[0]._links.self.href;
                  }
                  callback();
	  	 }).catch(callback);
              }
          ], function (err, result) {
            if (err) {
              callback(err);
              return;
            }
            console.log(result);
            callback(null, order);
          });
        },
	function (order, callback) {
	  console.log(order)
	  var optheaders = req.headers;
	  optheaders['Content-Type'] = 'application/json';
          var url = endpoints.ordersUrl + '/orders'
          var options = {
            method: 'POST',
		  body: JSON.stringify(order),
		  headers: optheaders
	  };
          var status
		zipkinFetch(url, {headers: req.headers}, options).then(function(resp){
			res.writeHeader(resp.status)
			return resp.json()
		}).then(function(body){
            console.log("Order response: " + JSON.stringify(body));
	    res.write(JSON.stringify(body));
	    res.end();
	  }).catch(callback);
        },
	function (err, result) {
	  if (err) {
	    return next(err);
	  }
	 }
    ]);
  });

  module.exports = app;
}());
