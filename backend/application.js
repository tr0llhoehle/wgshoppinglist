var common = require('./functions');
var register = require('./register');

exports.initApplication = function(app,passport,connection) {
	app.get('/', function(req, res){
	  res.render('index', { user: req.user });
	});
	
	app.get('/account', common.ensureAuthenticated, function(req, res){
	  res.render('account', { user: req.user });
	});
	
	app.get('/login', function(req, res){
	  res.render('login', { user: req.user, message: req.flash('error') });
	});
	
	app.get('/register', function(req, res){
	  res.render('register', { user: req.user });
	});
	
	// POST /login
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	//
	//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
	app.post('/login', 
	  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	  function(req, res) {
	    res.redirect('/');
	  });
	app.post('/register', 
	  function(req, res) {
	  	console.log('pw:'+req.body.password);
	  	register.registerUser(req.body.username,req.body.password,connection);
	    res.redirect('/');
	  });
	
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
}
