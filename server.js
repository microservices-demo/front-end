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

// Setup middleware
epimetheus.instrument(app);
app.use(session(config.session));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.errorHandler);
app.use(helpers.sessionMiddleware);
app.use(morgan("dev", {}));

/* Mount API endpoints */
app.use(express.static("public"));
app.use(cart);
app.use(catalogue);
app.use(orders);
app.use(user);

var server = app.listen(process.env.PORT || 8079, function () {
  var port = server.address().port;
  console.log("App now running in %s mode on port %d", app.get("env"), port);
});
