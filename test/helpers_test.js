(function (){
  'use strict';

  var express = require("express")
    , http = require("http")
    , chai = require("chai")
    , chaiHttp = require("chai-http")
    , expect = chai.expect
    , helpers = require("../helpers")
    , app

  describe("helpers", function() {
    before(function() {
      chai.use(chaiHttp);
    });

    beforeEach(function() {
      app = express();
    });

    describe("#respondSuccessBody", function() {
      it("renders the given body with status 200 OK", function(done) {
        app.use(function(req, res) {
          helpers.respondStatusBody(res, 200, "ayylmao");
        });

        chai.request(app).
          get("/").
          end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.text).to.equal("ayylmao");
            done();
          });
      });
    });

    describe("#respondStatusBody", function() {
      it("sets the proper status code & body", function(done) {
        app.use(function(req, res) {
          helpers.respondStatusBody(res, 201, "foo");
        });

        chai.request(app).
          get("/").
          end(function(err, res) {
            expect(res).to.have.status(201);
            expect(res.text).to.equal("foo");
            done();
          });
      });
    });

    describe("#respondStatus", function() {
      it("sets the proper status code", function(done) {
        app.use(function(req, res) {
          helpers.respondStatusBody(res, 404, "");
        });

        chai.request(app).
          get("/").
          end(function(err, res) {
            expect(err).to.not.be.null;
            expect(err.message).to.equal("Not Found");
            expect(res).to.have.status(404);
            expect(res.text).to.equal("");
            done();
          });
      });
    });

    describe("#simpleHttpRequest", function() {
      it("performs a GET request to the given URL");
    });

    describe("#getCustomerId", function() {
      describe("given the environment is development", function() {
        it("returns the customer id from the query string");
      });

      describe("given a customer id set in session", function() {
        it("returns the customer id from the session");
      });

      describe("given no customer id set in the cookies", function() {
        describe("given no customer id set session", function() {
          it("throws a 'User not logged in' error");
        });
      });
    });
  });
 }());
