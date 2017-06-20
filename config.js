(function (){
  'use strict';

  var session      = require("express-session"),
      RedisStore   = require('connect-redis')(session)
      ,redis = require("redis")
  module.exports = {
    session: {
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    },

    session_redis: {
      store: new RedisStore({host: "session-db"}),
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    },
    redis_client: null,
    branding :{
    	set: false,
	values: {
		name: "",
		logo: "",
		company: "",
		street: "",
		city: "",
		zip: "",
		state: "",
		country: "",
	}
    }
  };
}());
