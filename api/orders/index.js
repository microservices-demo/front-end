(function (){
  'use strict';

  var async     = require("async")
    , express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

  app.get("/orders", function (req, res, next) {
    console.log("Request received with body: " + JSON.stringify(req.body));
    var logged_in = req.cookies.logged_in;
    if (!logged_in) {
      throw new Error("User not logged in.");
      return
    }

    var custId = req.session.customerId;
    async.waterfall([
        function (callback) {
          request(endpoints.ordersUrl + "/orders/search/customerId?sort=date&custId=" + custId, function (error, response, body) {
            if (error) {
              return callback(error);
            }
            console.log("Received response: " + JSON.stringify(body));
            if (response.statusCode == 404) {
              console.log("No orders found for user: " + custId);
              return callback(null, []);
            }
            callback(null, JSON.parse(body)._embedded.customerOrders);
	  }).on("response", helpers.ClientRecv);
        }
    ],
    function (err, result) {
      if (err) {
        return next(err);
      }
      helpers.respondStatusBody(res, 201, JSON.stringify(result));
    });
  });

  app.get("/orders/*", function (req, res, next) {
	  var url = endpoints.ordersUrl + req.url.toString();
	  var headers = {};
	  helpers.ZipkinHeaders(url, headers);
	  request.get({url: url, headers: headers}).pipe(res).on("response", helpers.ClientRecv);
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
	  var headers = {};
	  helpers.ZipkinHeaders(url, headers);
          request({url: url, headers: headers}, function (error, response, body) {
            if (error) {
              callback(error);
              return;
            }
            console.log("Received response: " + JSON.stringify(body));
            var jsonBody = JSON.parse(body);
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
	  }).on("response", helpers.ClientRecv);
        },
        function (order, addressLink, cardLink, callback) {
          async.parallel([
              function (callback) {
                console.log("GET Request to: " + addressLink);
	        var headers = {};
	        helpers.ZipkinHeaders(addressLink, headers);
                request.get({url:addressLink, headers: headers}, function (error, response, body) {
                  if (error) {
                    callback(error);
                    return;
                  }
                  console.log("Received response: " + JSON.stringify(body));
                  var jsonBody = JSON.parse(body);
                  if (jsonBody._embedded.address[0] != null) {
                    order.address = jsonBody._embedded.address[0]._links.self.href;
                  }
                  callback();
		  }).on("response", helpers.ClientRecv);
              },
              function (callback) {
                console.log("GET Request to: " + cardLink);
	        var headers = {};
	        helpers.ZipkinHeaders(cardLink, headers);
                request.get({url:cardLink, headers:headers}, function (error, response, body) {
                  if (error) {
                    callback(error);
                    return;
                  }
                  console.log("Received response: " + JSON.stringify(body));
                  var jsonBody = JSON.parse(body);
                  if (jsonBody._embedded.card[0] != null) {
                    order.card = jsonBody._embedded.card[0]._links.self.href;
                  }
                  callback();
		  }).on("response",helpers.ClientRecv);
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
          var url = endpoints.ordersUrl + '/orders'
	  var headers = {};
	  helpers.ZipkinHeaders(url, headers);
          var options = {
            uri: url,
            method: 'POST',
            json: true,
	    body: order,
            headers: headers
          };
          console.log("Posting Order: " + JSON.stringify(order));
          request(options, function (error, response, body) {
            if (error) {
              return callback(error);
            }
            console.log("Order response: " + JSON.stringify(response));
            console.log("Order response: " + JSON.stringify(body));
            callback(null, response.statusCode, body);
	  }).on("response", helpers.ClientRecv);
        }
    ],
    function (err, status, result) {
      if (err) {
        return next(err);
      }
      helpers.respondStatusBody(res, status, JSON.stringify(result));
    });
  });

  module.exports = app;
}());
