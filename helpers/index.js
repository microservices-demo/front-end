(function (){
  'use strict';

  var  request = require("request")
     , config  = require("../config")
     , fs      = require('fs')
     , redis   = require("redis")
     , helpers = {}

  /* Public: errorHandler is a middleware that handles your errors
   *
   * Example:
   *
   * var app = express();
   * app.use(helpers.errorHandler);
   * */
  helpers.errorHandler = function(err, req, res, next) {
    var ret = {
      message: err.message,
      error:   err
    };
    res.
      status(err.status || 500).
      send(ret);
  };

  helpers.sessionMiddleware = function(err, req, res, next) {
    if(!req.cookies.logged_in) {
      res.session.customerId = null;
    }
  };

  /* Responds with the given body and status 200 OK  */
  helpers.respondSuccessBody = function(res, body) {
    helpers.respondStatusBody(res, 200, body);
  }

  /* Public: responds with the given body and status
   *
   * res        - response object to use as output
   * statusCode - the HTTP status code to set to the response
   * body       - (string) the body to yield to the response
   */
  helpers.respondStatusBody = function(res, statusCode, body) {
    res.writeHeader(statusCode);
    res.write(body);
    res.end();
  }

  /* Responds with the given statusCode */
  helpers.respondStatus = function(res, statusCode) {
    res.writeHeader(statusCode);
    res.end();
  }

  /* Rewrites and redirects any url that doesn't end with a slash. */
  helpers.rewriteSlash = function(req, res, next) {
    if(req.url.substr(-1) == '/' && req.url.length > 1)
      res.redirect(301, req.url.slice(0, -1));
    else
      next();
  }

  /* Public: performs an HTTP GET request to the given URL
   *
   * url  - the URL where the external service can be reached out
   * res  - the response object where the external service's output will be yield
   * next - callback to be invoked in case of error. If there actually is an error
   *        this function will be called, passing the error object as an argument
   *
   * Examples:
   *
   * app.get("/users", function(req, res) {
   *   helpers.simpleHttpRequest("http://api.example.org/users", res, function(err) {
   *     res.send({ error: err });
   *     res.end();
   *   });
   * });
   */
  helpers.simpleHttpRequest = function(url, res, next) {
    request.get(url, function(error, response, body) {
      if (error) return next(error);
      helpers.respondSuccessBody(res, body);
    }.bind({res: res}));
  }

  /* TODO: Add documentation */
  helpers.getCustomerId = function(req, env) {
    // Check if logged in. Get customer Id
    var logged_in = req.cookies.logged_in;

    // TODO REMOVE THIS, SECURITY RISK
    if (env == "development" && req.query.custId != null) {
      return req.query.custId;
    }

    if (!logged_in) {
      if (!req.session.id) {
        throw new Error("User not logged in.");
      }
      // Use Session ID instead
      return req.session.id;
    }

    return req.session.customerId;
  }


  helpers.getBrandingConfig = function(callback) {
    if(process.env.SESSION_REDIS) {
      config.redis_client = redis.createClient("redis://session-db:6379");
      config.redis_client.on("error", function (err) {
        console.log("Redis error encountered", err);
      });

      config.redis_client.on("end", function() {
        console.log("Redis connection closed");
      });

      if(process.env.DEFAULT_BRANDING) {
        var image = "./public/img/weave-logo.png";
        config.branding.set = true;
        config.branding.values.name = "weave";
        config.branding.values.logo = fs.readFileSync(image).toString("base64");
        callback(config.branding);
        return
      } else {
        config.redis_client.get("branding_info", function(err, reply) {
          if (reply !== null) {
            config.branding.values = JSON.parse(reply);
            config.branding.set = true;
            callback(config.branding);
          } else {
            callback(config.branding);
          }
        });
      }
    } else {
      if (fs.existsSync("./branding.json")) {
        config.branding.values = JSON.parse(fs.readFileSync('./branding.json'));
        config.branding.set = true;
        callback(config.branding);
      } else {
        callback(config.branding);
      }
    }
  };

  helpers.setBrandingConfig = function() {
    if(process.env.SESSION_REDIS) {
      if (config.redis_client.connected) {
        config.redis_client.set("branding_info", JSON.stringify(config.branding.values));
      }
    } else {
      fs.writeFile("./branding.json", JSON.stringify(config.branding.values, null, 2), function(err) {
        return err;
      });
    }
  }

  module.exports = helpers;
}());
