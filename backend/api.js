var common = require('./functions');

exports.initAPI = function(app,connection) {
	// public api calls
	app.get('/api', function(req, res){
  		res.send('api test');
	});
	
	//restricted api calls
	app.get('/apirestricted', common.ensureAuthenticatedAPI, function(req, res){
		res.send('restricted api test');
	});

	app.get('/api/getshoppinglists', common.ensureAuthenticatedAPI, function(req, res){
		connection.query('SELECT * FROM shopping_lists WHERE wg_id = '+connection.escape(req.user.wg), function(err, rows, fields) {
			var shoppinglists = [];
			for(var row in rows) {
				shoppinglists[row] = rows[row].shopping_list_id;
			}
			//return all shoppinglist ids in json
			res.send(JSON.stringify(shoppinglists));
		});
	});
}

