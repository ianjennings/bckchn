// auth controller
var 
	express   = require('express'),
	connect   = require('connect'),
  step             = require('step'),
  user_model       = require('../models/user_model'),
  user_controller  = require('../controllers/user_controller');

module.exports =  {
  
  register: function(username, password, email, phone, holla) {
  
    // @todo needs more url validation
  
    // http://www.9lessons.info/2009/03/perfect-javascript-form-validation.html
    ck_username = /^[A-Za-z0-9!@#$%^&*()_]{3,20}$/;	
    ck_password =  /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;			
    ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i 

    var 
      holla = holla,
      err = null,
      username = username,
      password = password,
      email = email,
			phone = Number(phone),
      key = user_model.get_key(username);
    
    step(
      function() {
        if(!ck_username.test(username)){
          this(new Error('Invalid Username'));
        }
        if (!ck_password.test(password)){
          this(new Error('Invalid Password'));
        }
        if (!ck_email.test(email)){
          this(new Error('Invalid Email'));
        }
				if (phone < 1000000000) {
          this(new Error('Invalid Phone Number'));
				}
        user_model.exists(key, this);
      },
      function(err, username_exists){
        if(err) return this(err);
        if(username_exists) {
          this(new Error('Username already taken'));
        }
        this();
      },
      function(err, res) {
        if(err) return this(err);
        user_model.insert(key, username, email, password, this);
      },
      function(err, user_key){
				if (err) return holla(err);
        holla(null, user_key);
      }
    );
  },

	login: function(username, password, holla) {
  
    var
      req = req,
      holla = holla,
      username = username,
      password = password;
    
    var holla = holla;
		step(
			function() {
        if(!username || !password) {
          console.log(username);
          this(new Error('Missing username or password'));
        }
        user_model.get(user_model.get_key(username), this);
			},
			function(err, user) {
				if (err) return this(err);
				user = user;
        if(user.password === user_model.encrypt_pass(password)){
          delete user.password;
          this(null, user);
        } else {
          this(new Error('Invalid Username Password Combo'));
        }
			}, 
      function(err, user) {
				if (err) return holla(err);
        holla(null, user);
      }
		);
	},
  
  logout: function(req, holla) {
    req.session.destroy();
    holla(null);
  }
  
}