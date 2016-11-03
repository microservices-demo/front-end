(function() {
    'use strict';

    var async = require("async"), express = require("express"), request = require("request"), endpoints = require("../endpoints"), helpers = require("../../helpers"), app = express()

    function requestCallback(service) {
        return function(callback) {
            var options = {
                uri: 'http://' + service + '/health',
                method: 'GET',
                json: true,
            };
            request(options, function(error, response, body) {
                var obj = {};
                if (error) {
                    obj.health = [{}];
                    obj.health[0].service = service;
                    obj.health[0].status = "DOWN";
                    obj.health[0].date = new Date().toJSON();
                } else {
                    obj = response.body;
                }
                return callback(null, obj);
            });
        };
    }

    app.get("/health", function (req, res, next) {
        if (typeof req.query.nodes !== 'undefined' && req.query.nodes !== "") {
            var nodes = req.query.nodes.split(",");
            var healthFunctions = nodes.map(function(el, idx, arr) {
                return requestCallback(el)
            });
            async.parallel(healthFunctions, function(err, results) {
                var allPass = true;
                var fin = [];

                results.forEach(function(el, index) {
                    el.health.forEach(function(el, index) {
                        fin.push(el);
                        if (allPass === true) {
                            allPass = el.status === "OK" ? true : false;
                        }
                    });
                });

                if (allPass) {
                    helpers.respondSuccessBody(res, JSON.stringify(fin));
                } else {
                    helpers.respondStatusBody(res, 500, JSON.stringify(fin));
                }
            });
        } else {
            helpers.respondStatusBody(res, 500, "No nodes specified.");
        }
    });

    module.exports = app;
}());
