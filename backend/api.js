var common = require('./functions');

exports.initAPI = function(app) {
	// public api calls
	app.get('/api', function(req, res){
  		res.send('api test');
	});
	
	//restricted api calls
	app.get('/apirestricted', common.ensureAuthenticatedAPI, function(req, res){
		res.send('restricted api test');
	});
}

