(function (){
  'use strict';
  require("./config");

  casper.test.begin("User interacts with the cart", 1, function(test) {
    // initial load and login
    casper.start("http://front-end:8080/", function() {
      this.clickLabel("Login");
      this.fill("#login-modal form", {
        "username": "Eve_Berger",
        "password": "duis"
      }, true);
      this.click("#login-modal form button.btn.btn-primary");
      this.waitForText("Logged in", function() {
      }, function() {
        test.fail("login failed");
      }, 3000);
    });

    // access the catalogue
    casper.then(function() {
      this.clickLabel("Catalogue");
    });

    // Add some items to the cart and verify
    casper.then(function() {
      this.waitForText("Add to cart", function() {
        this.clickLabel("Add to cart");
      }, function() {
        test.fail("Catalogue items did not show up");
      }, 3000)

      this.waitForText("1 item(s) in cart", function() {
        test.pass("cart gets updated with user selection");
      }, function() {
        test.fail("cart was not updated");
      }, 3000);
    });


    casper.run(function() {
      test.done();
    });
  });
}());
