var common = require('./functions');

exports.initAPI = function(app) {
	app.get('/api', function(req, res){
  		res.send('api test');
	});
	
	app.get('/apirestricted', common.ensureAuthenticatedAPI, function(req, res){
		res.send('restricted api test');
	});
}

