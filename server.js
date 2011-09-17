var 
	express   = require('express'),
	connect   = require('connect'),
  redisce   = require('connect-redis')(express),
	redis     = require('redis'),
	step 			= require('step'),
	
	config 		= require('./config/index.js'),
  
  auth_controller  = require('./controllers/auth_controller'),
  channel_controller  = require('./controllers/channel_controller'),
  message_controller  = require('./controllers/message_controller'),
	
	channel_model = require('./models/channel_model'),
	message_model = require('./models/message_model');
	
var app = express.createServer();

app.configure(function() {
  
  // authentication
	app.use(connect.cookieParser());
	app.use(connect.session({
		store: new redisce(), 
		secret: 'pennapps', 
		cookie: {maxAge: 14400000}}));
  app.use(connect.bodyParser());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
  // static files
  app.use('/static', connect.static(__dirname + '/public/static'));
  
  // template system
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/public/views');
  
});

function auth_web(req, res, next) {
  if (req.session && req.session.me) {
    return next();
  } else {
    return next(new Error('Unauthorized'));
  }
}

step(
	function() {
		channel_controller.create(this);
	},
	function(err, channel) {
		if(err) this(err);
		message_controller.create('ian', channel.key, 'hello', this);
	},
	function(err, message) {
		if(err) throw err;
	}
);

app.post('/register', function(req, res, next) {
  var res = res;
  step(
    function() {
      auth_controller.register(
				req.param('username', null),
				req.param('password', null),
				req.param('email', null),
				req.param('phone', null),
				this);
    },
    function(err, key) {
      if(err) this(err);
      user_controller.get(key, this);	
    },
    function(err, user) {
      if(err) return next(err);
			req.session.me = user;
			res.json(req.session.me);
    }
  );
});

app.post('/login', function(req, res, next) {
	var
		req = req,
		res = res;
  step(
    function() {
			auth_controller.login(
				req.param('username', null),
				req.param('password', null),
				this);
    },
    function(err, user) {
      if(err) return next(err);
			req.session.me = user;
			res.json(req.session.me);
			console.log(req.session);
    }
  );
});

app.get('/me', auth_web, function(req, res){
	res.send(req.session.me);
});

app.get('/logout', auth_web, function(req, res, next) {
  var res = res;
  step(
    function() {
      auth_controller.logout(req, this);
    },
    function(err) {
      if(err) return next(err);
			res.redirect('back');
    }
  );
});
app.get('/login', function(req, res, next) {
	if (req.session.me) {
	  res.redirect('/');
	} else {
		res.render('pages/channel', 
			{prompt: "partials/login",
				me: false});
	}
});
app.get('/register', function(req, res, next) {
	if (req.session.me) {
	  res.redirect('/');
	} else {
		res.render('pages/channel', 
			{prompt: "partials/register",
				me: false});
	}
});

app.get("/", function(req, res, next) {
	res.render('pages/channel', 
		{	prompt: false,
			me: req.session.me
		});
});

app.error(function(err, req, res){
  res.send(err);
});

app.listen(8080); 
var everyone = require("now").initialize(app);

function verify_auth() {

}

everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(message);
};