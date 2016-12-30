// Keep imports sorted alphabetically
const
    async            = require("async")
  , bodyParser       = require("body-parser")
  , cookieParser     = require("cookie-parser")
  , epimetheus       = require("epimetheus")
  , express          = require("express")
  , morgan           = require("morgan")
  , path             = require("path")
  , request          = require("request")
  , session          = require("express-session")
  , zipkin           = require("zipkin")
  , zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware

  , config       = require("./config")
  , helpers      = require("./helpers")
  , cart         = require("./api/cart")
  , catalogue    = require("./api/catalogue")
  , orders       = require("./api/orders")
  , user         = require("./api/user")
  , app          = express()

// Add zipkin middlware
let zipkinTracer = (function() {
  const {Tracer, ExplicitContext, BatchRecorder, ConsoleRecorder} = zipkin;
  const {HttpLogger} = require('zipkin-transport-http');
  const ctxImpl = new ExplicitContext();
  //const recorder = new ConsoleRecorder();
  const recorder = new BatchRecorder({
    logger: new HttpLogger({endpoint: 'http://zipkin:9411/api/v1/spans'}),
    timeout: 1 * 1000000 /* timeout after 1 second */
  });

  const tracer = new Tracer({ctxImpl, recorder});
  return tracer;
})();

// Setup middleware
app.use(zipkinMiddleware({tracer: zipkinTracer, serviceName: "front-end"}));
epimetheus.instrument(app);
app.use(session(config.session));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.errorHandler);
app.use(helpers.sessionMiddleware);
app.use(morgan("dev", {}));

/* Mount API endpoints */
app.use(express.static("public"));
for (let mod of [cart, catalogue, orders, user]) {
  app.use(mod.withTracer(zipkinTracer));
}

var server = app.listen(process.env.PORT || 8079, function () {
  var port = server.address().port;
  console.log("App now running in %s mode on port %d", app.get("env"), port);
});
