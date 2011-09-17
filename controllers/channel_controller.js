var
	channel_model = require('../models/channel_model'),
	step = require('step');
	
module.exports = {

	create: function(holla) {
	
		var
			holla = holla,
			key = channel_model.get_key('ian');
	
		step(
			function() {
				channel_model.insert(key, 'parent_key', 'user_ian', this);
			},
			function(err, res) {
				if(err) this(err);
				channel_model.get(key, this);
			},
			function(err, success) {
				if(err) return holla(err);
				holla(null, key);
			}
		);
		
	}
	
}