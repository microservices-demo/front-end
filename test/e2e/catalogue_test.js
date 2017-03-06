(function (){
  'use strict';
  require("./config");

  casper.test.begin("User interacts with the catalogue", 2, function(test) {
    casper.start("http://front-end:8080/", function() {
      this.waitForText("Catalogue", function() {
        this.clickLabel("Catalogue");
      }, function() {
        test.error("page not yet initialised");
      }, 3000);
    });

    casper.then(function() {
      this.waitForSelector("#products", function() {
        test.pass("user is taken to the catalogue");
        test.assertElementCount("#products div.product", 6, "user is presented with 6 products by default");
      }, function() {
        test.fail("catalogue page did not load")
      }, 3000);
    });

    casper.run(function() {
      test.done();
    });
  });
}());
