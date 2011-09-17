// user model
var
	express   = require('express'),
	redis     = require('redis'),
  redisc    = redis.createClient(),
  crypto    = require('crypto'),
  config    = require('../config/index'),
  step      = require('step');
  
var user_model = {
  
  get_key: function(username){
    return config.redis_namespace + '_user_' + username;
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

  list: function(lower, upper, holla) {
    redisc.lrange('users', lower, upper, holla);
  },

  insert: function(key, username, email, password, holla){
  
    var 
      holla = holla,
      email = email,
      clean_mail = email.toString().toLowerCase(),
      email_hash = 
        crypto.createHash('md5').update(clean_mail).digest('hex'),
      password = user_model.encrypt_pass(password),
      data = {
        type: 'user',
        key: user_model.get_key(username),
        username: username,
        email: clean_mail,
        email_hash: email_hash,
        password: password,
        date_created: Date.now(),
        karma: 1
      };
      
    step(
      function() {
        redisc.hmset(key, data, this);
      },
      function(err, res) {
				if (err) return this(err);
        redisc.sadd('users', data.key, this);
      },
      function(err, res) {
        if(err) holla(err);
        holla(null, data.key);
      }
    );
  },
  
  encrypt_pass: function(password){
    return crypto.createHash('sha256').update('pass_' + password).update(config.password_salt).digest('hex');
  },
  
  // username and password match
  auth: function(username, password, holla){
  
    user_model.user.get(user_model.get_key(username), function(err, result){
      if(b00st.user.encrypt_pass(password) == result.password){
        holla(err, true);
      }
      holla(err);
    });
    
  }
  
}

module.exports = user_model;
	