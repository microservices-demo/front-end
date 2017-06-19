var request      = require("request")
  , express      = require("express")
  , morgan       = require("morgan")
  , path         = require("path")
  , bodyParser   = require("body-parser")
  , async        = require("async")
  , cookieParser = require("cookie-parser")
  , session      = require("express-session")
  , config       = require("./config")
  , helpers      = require("./helpers")
  , cart         = require("./api/cart")
  , catalogue    = require("./api/catalogue")
  , orders       = require("./api/orders")
  , user         = require("./api/user")
  , branding     = require("./api/branding")
  , metrics      = require("./api/metrics")
  , fs 		 = require('fs')
  , app          = express()



app.use(function (req, res, next) {
	if (config.branding.set == false) {
		if(process.env.DEFAULT_BRANDING) {
			config.branding.set = true
			config.branding.values.name = "weave"
			image = "./public/img/weave-logo.png"
			config.branding.values.logo = fs.readFileSync(image).toString("base64")
			next()
		} else {
	
			helpers.getBrandingConfig(function(cfg){
				if (!cfg.set) {
					ext = req.url.split('.').pop();
						if ((["js", "css", "png", "map"].indexOf(ext) > -1) || 
							(["/welcome.html", "/branding"].indexOf(req.url) > -1)) {
							next()
							return

						} else {
							res.redirect("/welcome.html")
							return
						}
				} else {
					next()
					return
				}
			});
		}
	} else {
		helpers.setBrandingConfig()
		next()
	}
	return
});

app.use(express.static("public"));
app.use(helpers.rewriteSlash);
app.use(metrics);
if(process.env.SESSION_REDIS) {
    console.log('Using the redis based session manager');
    app.use(session(config.session_redis));

}
else {
    console.log('Using local session manager');
    app.use(session(config.session));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.sessionMiddleware);
app.use(morgan("dev", {}));

var domain = "";
process.argv.forEach(function (val, index, array) {
  var arg = val.split("=");
  if (arg.length > 1) {
    if (arg[0] == "--domain") {
      domain = arg[1];
      console.log("Setting domain to:", domain);
    }
  }
});

/* Mount API endpoints */
app.use(cart);
app.use(catalogue);
app.use(orders);
app.use(user);
app.use(branding);

app.use(helpers.errorHandler);

var server = app.listen(process.env.PORT || 8079, function () {
  var port = server.address().port;
  console.log("App now running in %s mode on port %d", app.get("env"), port);
});
