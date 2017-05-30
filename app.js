
/*
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var home = require('./routes/home');
var signup = require('./routes/signup');
var avatar = require('./routes/avatar');
//var quests = require('./routes/quests');
var stats = require('./routes/stats');
var faq = require('./routes/faq');
// Example route
// var user = require('./routes/user');

var app = express();

var portNumber = process.env.PORT || 3000;

// all environments
app.set('port', portNumber);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Allow on https - necessary to use GPS
if(portNumber != 3000){
	app.get('*',function(req,res,next){
	  if(req.headers['x-forwarded-proto']!='https')
	    res.redirect('https://ferret.herokuapp.com'+req.url)
	  else
	    next() /* Continue to other routes if we're not redirecting */
	});
}

app.get('/', index.view);
app.get('/home', home.view);
app.get('/signup', signup.view);
app.get('/avatar', avatar.view);
//app.get('/quests', quests.view);
app.get('/stats', stats.view);
app.get('/faq', faq.view);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
