(function (){
  'use strict';

  var session      = require("express-session"),
      RedisStore   = require('connect-redis')(session)

  module.exports = {
    session: {
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    },

    session_redis: {
      store: new RedisStore({host: "microservice-cache.vxwa1j.ng.0001.apne1.cache.amazonaws.com"}),
      name: 'microservice-cache',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    }
  };
}());
