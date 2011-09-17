var 
	config 		= require('../config/index.js'),
	crypto		= require('crypto'),
	redis     = require('redis'),
  redisc    = redis.createClient(),
	step			= require('step');
	
message_model = {
	
  get_key: function(username) {

		var
			message_key = 
				crypto
					.createHash('md5')
					.update(Date.now().toString())
					.update(username)
					.digest('hex'),
			key =
				config.redis_namespace+'_' +
				'message_' + 
				message_key;
			
		return key;
		
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
	
	insert: function(key, channel_key, message, user_key, holla) {
	
		var
			data = {
				type: 'message',
				date: Date.now(),
				message: message,
				user_key: user_key,
				key: key,
				channel_key: channel_key,
			};
		
		redisc.hmset(data.key, data, holla);
	
	}
	
}
module.exports = message_model;