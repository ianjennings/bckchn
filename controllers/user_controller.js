// link controller
var
	connect       = require('connect'),
	express       = require('express'),
	step 		    	= require('step'),
  user_model    = require('../models/user_model');

user_controller = {
	
	get: function(key, holla) {
    var holla = holla;
		step(
			function() {
        user_model.get(key, this);
			},
			function(err, data) {
				if (err) throw err;
        // if user === self, keep pass
        delete data.password;
        holla(null, data);
			}
		);
	}
  
}
module.exports = user_controller;