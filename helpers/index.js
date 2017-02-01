(function() {
    'use strict';
	//const {HttpHeaders: Header, Annotation, TraceId, None, Some} = require('zipkin');
    var request = require("request");
    const purl = require('url');
    var helpers = {};
    var fetch = require('node-fetch');
    var wrapFetch    = require('zipkin-instrumentation-fetch')
	const {Tracer, ExplicitContext, BatchRecorder} = require('zipkin');
	const {HttpLogger} = require('zipkin-transport-http');
	const ctxImpl = new ExplicitContext();
	const recorder = new BatchRecorder({
	  logger: new HttpLogger({
	    endpoint: "http://zipkin:9411/api/v1/spans"
	  })
	});
	const tracer = new Tracer({ctxImpl, recorder}); // configure your tracer properly here
    helpers.getFetch = function() {
	    return wrapFetch(fetch, {tracer, serviceName: "frontend-fetch"});
	
    }
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
            error: err
        };
        res.status(err.status || 500).send(ret);
    };

    helpers.sessionMiddleware = function(err, req, res, next) {
        if (!req.cookies.logged_in) {
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
    helpers.simpleHttpRequest = function(url, resp, error, next, headers) {
	    var tracer = helpers.tracer
      var host = helpers.getHost(url)
      const zipkinFetch = helpers.getFetch();
      zipkinFetch(url,{headers: headers}).catch(function(err) {
	      error(err);
      }).then(function(res){

	      resp.writeHeader(res.status)
	      return res.text();
      }).then(function(body){
             if (next && typeof next === 'function') {
		console.log("Next set")
		body = next(body)
	      }
	      resp.write(body);
	      resp.end(); 
      })
    }


    helpers.getHost = function(url) {
        return purl.parse(url, false, true).hostname
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
    module.exports = helpers;
}());
