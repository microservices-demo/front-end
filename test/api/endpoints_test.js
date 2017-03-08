(function (){
  'use strict';

  var expect    = require("chai").expect
    , endpoints = require("../../api/endpoints")

  describe("endpoints", function() {
    describe("catalogueUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.catalogueUrl).to.equal("http://catalogue");
      });
    });

    describe("tagsUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.tagsUrl).to.equal("http://catalogue/tags");
      });
    });

    describe("cartsUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.cartsUrl).to.equal("http://carts/carts");
      });
    });

    describe("ordersUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.ordersUrl).to.equal("http://orders");
      });
    });

    describe("customersUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.customersUrl).to.equal("http://user/customers");
      });
    });

    describe("addressUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.addressUrl).to.equal("http://user/addresses");
      });
    });

    describe("cardsUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.cardsUrl).to.equal("http://user/cards");
      });
    });

    describe("loginUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.loginUrl).to.equal("http://user/login");
      });
    });

    describe("registerUrl", function() {
      it("points to the proper endpoint", function() {
        expect(endpoints.registerUrl).to.equal("http://user/register");
      });
    });
  });
}());
