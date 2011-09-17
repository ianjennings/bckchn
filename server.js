var 
	express   = require('express'),
	connect   = require('connect'),
	redis     = require('redis'),
  redisc    = redis.createClient(),
  redisce   = require('connect-redis')(express),
	step 			= require('step');
	
	config 		= require('./config/index.js');
	
var app = express.createServer();

app.configure(function() {
  
  // authentication
	app.use(connect.cookieParser());
	app.use(connect.session({
		store: new redisce(), 
		secret: 'pennapps', 
		cookie: { maxAge: 60000 }}));
  app.use(connect.bodyParser());
  
  // static files
  app.use('/static', connect.static(__dirname + '/public/static'));
  
  // template system
  app.set('view engine', 'ejs');
  
})

var app = express.createServer(); 
app.listen(3000); 
var everyone = require("now").initialize(app);