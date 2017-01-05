module.exports = {
  withTracer: function(tracer) {
    'use strict';

    const async   = require("async")
      , express   = require("express")
      , request   = require("request")
      , fetch     = require("node-fetch")
      , wrapFetch = require("zipkin-instrumentation-fetch")
      , endpoints = require("../endpoints")
      , helpers   = require("../../helpers")
      , app       = express();

    const zipkinFetch = wrapFetch(fetch, { tracer, serviceName: "front-end", remoteServiceName: "orders" } );

    app.get("/orders", function (req, res, next) {
      console.log("Request received with body: " + JSON.stringify(req.body));
      var logged_in = req.cookies.logged_in;
      if (!logged_in) {
        throw new Error("User not logged in.");
        return
      }

      const custId = req.session.customerId;
      const url = endpoints.ordersUrl + "/orders/search/customerId?sort=date&custId=" + custId; // <-- TODO: potential security issue

      zipkinFetch(url).then(function (reponse) {
        var customerOrders = [];
        if (res.ok) {
          // Just parse, extract the customerOrders and serialize again.
          customerOrders = response.json()._embedded.customerOrders;
        } else if (res.status == 404) {
          console.log("No orders found for user: " + custId);
        }
        helpers.respondStatusBody(res, 201, JSON.stringify(customerOrders));
      }).catch(function (err) {
        next(err);
      });
    });

    app.get("/orders/*", function (req, res, next) {
      var url = endpoints.ordersUrl + req.url.toString();
      request.get(url).pipe(res);
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
            request(endpoints.customersUrl + "/" + custId, function (error, response, body) {
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
            });
          },
          function (order, addressLink, cardLink, callback) {
            async.parallel([
                function (callback) {
                  console.log("GET Request to: " + addressLink);
                  request.get(addressLink, function (error, response, body) {
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
                  });
                },
                function (callback) {
                  console.log("GET Request to: " + cardLink);
                  request.get(cardLink, function (error, response, body) {
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
                  });
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
            var options = {
              uri: endpoints.ordersUrl + '/orders',
              method: 'POST',
              json: true,
              body: order
            };
            console.log("Posting Order: " + JSON.stringify(order));
            request(options, function (error, response, body) {
              if (error) {
                return callback(error);
              }
              console.log("Order response: " + JSON.stringify(response));
              console.log("Order response: " + JSON.stringify(body));
              callback(null, response.statusCode, body);
            });
          }
      ],
      function (err, status, result) {
        if (err) {
          return next(err);
        }
        helpers.respondStatusBody(res, status, JSON.stringify(result));
      });
    });

    return app
  }
};
