var 
	express   = require('express'),
	connect   = require('connect'),
  redisce   = require('connect-redis')(express),
	redis     = require('redis'),
	step 			= require('step'),
	
	config 		= require('./config/index.js'),
  
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
		cookie: {maxAge: 60000}}));
  app.use(connect.bodyParser());
  
  // static files
  app.use('/static', connect.static(__dirname + '/public/static'));
  
  // template system
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/public/views');
  
});

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

app.get("/", function(req, res) {
	res.render('pages/channel', {title: 'My Site'});
});

app.listen(8080); 
var everyone = require("now").initialize(app);