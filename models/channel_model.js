var 
	config 		= require('../config/index.js'),
	crypto		= require('crypto'),
	redis     = require('redis'),
  redisc    = redis.createClient(),
	step			= require('step');
	
var channel_model = {

	get_key: function(parent_key, parent_type) {
		return config.redis_namespace + '_channel_' + parent_key;
	},
  
  get_value: function(key, field, holla) {
    redisc.hget(key, field, holla);
  },

  get: function(key, holla) {
    redisc.hgetall(key, holla);
  },
  
  exists: function(key, holla){
    redisc.hexists(key, 'key', holla);
  },
	
	insert: function(key, parent_key, user_key, holla) {
	
		var
			holla = holla,
			data = {
				key: key,
				parent_key: parent_key,
				user_key: user_key,
				type: 'channel',
				date: Date.now(),
			};
		
		step(
			function() {
				redisc.hmset(data.key, data, this);
			},
			function(err, res) {
				if(err) this(err);
				redisc.lpush(config.redis_namespace + '_channels', data.key, this);
			},
			function(err, res) {
				if(err) holla(err);
				holla(null, data.key);
			}
		);
	
	}

}
module.exports = channel_model;