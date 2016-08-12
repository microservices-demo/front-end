(function (){
  'use strict';
  require("./config");

  var TESTS = 2;

  casper.test.begin("User interacts with the catalogue", TESTS, function(test) {
    casper.start("http://frontend:8080/", function() {
      this.waitForText("Catalogue", function() {
        this.clickLabel("Catalogue");
      }, function() {
        test.error("page not yet initialised");
      }, 2000);
    });

    casper.then(function() {
      this.waitForSelector("#products", function() {
        test.pass("user is taken to the catalogue");
        test.assertElementCount("#products div.product", 6, "user is presented with 6 products by default");
      }, function() {
        test.fail("catalogue page did not load")
      }, 1000);
    });

    casper.run(function() {
      test.done();
    });
  });
}());
