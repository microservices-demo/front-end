(function (){
  'use strict';

  var util = require('util');

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

  module.exports = {
    catalogueUrl:  util.format("http://%s", domain),
    tagsUrl:       util.format("http://%s/tags", domain),
    cartsUrl:      util.format("http://%s/carts", domain),
    ordersUrl:     util.format("http://%s", domain),
    customersUrl:  util.format("http://%s/users/customers", domain),
    addressUrl:    util.format("http://%s/users/addresses", domain),
    cardsUrl:      util.format("http://%s/users/cards", domain),
    loginUrl:      util.format("http://%s/users/login", domain),
    registerUrl:   util.format("http://%s/users/register", domain),
  };
}());
