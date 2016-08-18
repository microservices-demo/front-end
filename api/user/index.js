(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

  app.get("/user/customers/:id", function (req, res, next) {
    helpers.simpleHttpRequest(endpoints.customersUrl + "/" + req.params.id, res, next);
  });

  // Create Customer - TO BE USED FOR TESTING ONLY (for now)
  app.post("/user/customers", function(req, res, next) {
    var options = {
      uri: endpoints.userCustUrl,
      method: 'POST',
      json: true,
      body: req.body
    };

    console.log("Posting Customer: " + JSON.stringify(req.body));

    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({res: res}));
  });

  // Create Address - TO BE USED FOR TESTING ONLY (for now)
  app.post("/user/addresses", function(req, res, next) {
    var options = {
      uri: endpoints.userAddrUrl,
      method: 'POST',
      json: true,
      body: req.body
    };
    console.log("Posting Address: " + JSON.stringify(req.body));
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({res: res}));
  });

  // Create Card - TO BE USED FOR TESTING ONLY (for now)
  app.post("/user/cards", function(req, res, next) {
    var options = {
      uri: endpoints.userCardUrl,
      method: 'POST',
      json: true,
      body: req.body
    };
    console.log("Posting Card: " + JSON.stringify(req.body));
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({res: res}));
  });

  // Delete Customer - TO BE USED FOR TESTING ONLY (for now)
  app.delete("/user/customers/:id", function(req, res, next) {
    console.log("Deleting Customer " + req.params.id);
    var options = {
      uri: endpoints.userCustUrl + "/" + req.params.id,
      method: 'DELETE'
    };
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({res: res}));
  });

  // Delete Address - TO BE USED FOR TESTING ONLY (for now)
  app.delete("/user/addresses/:id", function(req, res, next) {
    console.log("Deleting Address " + req.params.id);
    var options = {
      uri: endpoints.userAddrUrl + "/" + req.params.id,
      method: 'DELETE'
    };
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({res: res}));
  });

  // Delete Card - TO BE USED FOR TESTING ONLY (for now)
  app.delete("/user/cards/:id", function(req, res, next) {
    console.log("Deleting Card " + req.params.id);
    var options = {
      uri: endpoints.userCardUrl + "/" + req.params.id,
      method: 'DELETE'
    };
    request(options, function (error, response, body) {
      if (error) {
        return next(error);
      }
      helpers.respondSuccessBody(res, JSON.stringify(body));
    }.bind({res: res}));
  });

  app.get("/user/login", function (req, res, next) {
    console.log("Received login request");

    async.waterfall([
        function (callback) {
          var options = {
            headers: {
              'Authorization': req.get('Authorization')
            },
            uri: endpoints.userLogUrl
          };
          request(options, function (error, response, body) {
            if (error) {
              callback(error);
              return;
            }
            if (response.statusCode == 200 && body != null && body != "") {
              console.log(body);
              var customerId = JSON.parse(body).user.id;
              console.log(customerId);
              callback(null, customerId);
              return;
            }
            console.log(response.statusCode);
            callback(true);
          });
        },
        function (custId, callback) {
          var sessionId = req.session.id;
          console.log("Merging carts for customer id: " + custId + " and session id: " + sessionId);

          var options = {
            uri: endpoints.cartsUrl + "/" + custId + "/merge" + "?sessionId=" + sessionId,
            method: 'GET'
          };
          request(options, function (error, response, body) {
            if (error) {
              callback(error);
              return;
            }
            console.log('Carts merged.');
            callback(null, custId);
          });
        }
    ],
    function (err, custId) {
      if (err) {
        console.log("Error with log in: " + err);
        res.status(401);
        res.end();
        return;
      }
      res.status(200);
      res.cookie(cookie_name, custId, {maxAge: 3600000}).send('Cookie is set');
      console.log("Sent cookies.");
      res.end();
      return;
    });
  });

  module.exports = app;
}());
