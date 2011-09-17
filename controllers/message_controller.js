var
	message_model = require('../models/message_model'),
	step = require('step');
	
module.exports = {

	create: function(user_key, channel_key, message, holla) {

		var
			holla = holla,
			key = message_model.get_key('ian');
		
		step(
			function() {
				message_model.insert(key, '', 'hello world', 'user_ian', this);
			},
			function(err, res) {
				if(err) this(err);
				message_model.get(key, this);
			},
			function(err, message) {
				if(err) holla(err);
				holla(null, message);
			}
		);
		
	}
	
}