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
	
	app.get('/api/getshoppinglist/:id', common.ensureAuthenticatedAPI, function(req, res){
		connection.query('SELECT * FROM shopping_lists WHERE shopping_list_id = '+connection.escape(req.params.id)+' LIMIT 1', function(err, rows, fields) {
			if(rows[0] != null) {
				if(rows[0].wg_id == req.user.wg) {
					connection.query('SELECT * FROM items WHERE shopping_list_id = '+connection.escape(req.params.id), function(err, itemrows, fields) {
						function shoppinglistitem(description,insert_date,checked,user_id,purchase_id)
						{
							this.description=description;
							this.insert_date=insert_date;
							this.checked=checked;
							this.user_id=user_id;
							this.purchase_id=purchase_id;
						}
						var items = [];
						for(var item in itemrows) {
							items[item] = new shoppinglistitem(itemrows[item].description,itemrows[item].insert_date,itemrows[item].checked,itemrows[item].user_id,itemrows[item].purchase_id);
						}
						//update user update time
						req.user.date = new Date();
						//return all shoppinglist items in json
						res.send(JSON.stringify(items));
					});
				}
			} else {
				res.send('[]')
			}
		});
	});
	
	app.get('/api/getshoppinglistupdates/:id', common.ensureAuthenticatedAPI, function(req, res){
		connection.query('SELECT * FROM shopping_lists WHERE shopping_list_id = '+connection.escape(req.params.id)+' LIMIT 1', function(err, rows, fields) {
			if(rows[0] != null) {
				if(rows[0].wg_id == req.user.wg) {
					connection.query('SELECT * FROM items WHERE shopping_list_id = '+connection.escape(req.params.id)+' AND update_date > '+connection.escape(req.user.date), function(err, itemrows, fields) {
						function shoppinglistitem(description,insert_date,checked,user_id,purchase_id)
						{
							this.description=description;
							this.insert_date=insert_date;
							this.checked=checked;
							this.user_id=user_id;
							this.purchase_id=purchase_id;
						}
						var items = [];
						for(var item in itemrows) {
							items[item] = new shoppinglistitem(itemrows[item].description,itemrows[item].insert_date,itemrows[item].checked,itemrows[item].user_id,itemrows[item].purchase_id);
						}
						//update user update time
						req.user.date = new Date();
						//return all shoppinglist items in json
						res.send(JSON.stringify(items));
					});
				}
			} else {
				res.send('[]')
			}
		});
	});
	
	app.post('/api/checkentries', common.ensureAuthenticatedAPI, function(req, res) {
		// parsed now containes all entries that should be checked
		var parsed = JSON.parse(req.body.entries);
		connection.query('SELECT * FROM shopping_lists WHERE shopping_list_id = '+connection.escape(parsed.shoppinglist)+' LIMIT 1', function(err, rows, fields) {
			if(rows[0] != null) {
				if(rows[0].wg_id == req.user.wg) {
					for(var i in parsed.entries) {
						connection.query('UPDATE items SET checked = 1,update_date=NOW() WHERE item_id ='+connection.escape(parsed.entries[i]), function(err, itemrows, fields) {
						});
					}
				}
			}
		});
		res.send('done');
	});	
	
	app.post('/api/uncheckentries', common.ensureAuthenticatedAPI, function(req, res) {
		// parsed now containes all entries that should be unchecked
		var parsed = JSON.parse(req.body.entries);
		connection.query('SELECT * FROM shopping_lists WHERE shopping_list_id = '+connection.escape(parsed.shoppinglist)+' LIMIT 1', function(err, rows, fields) {
			if(rows[0] != null) {
				if(rows[0].wg_id == req.user.wg) {
					for(var i in parsed.entries) {
						connection.query('UPDATE items SET checked = 0,update_date=NOW() WHERE item_id ='+connection.escape(parsed.entries[i]), function(err, itemrows, fields) {
						});
					}
				}
			}
		});
		res.send('done');
	});	
	
	app.post('/api/addentries', common.ensureAuthenticatedAPI, function(req, res) {
		// parsed now containes all entries that should be added
		var parsed = JSON.parse(req.body.entries);
		connection.query('SELECT * FROM shopping_lists WHERE shopping_list_id = '+connection.escape(parsed.shoppinglist)+' LIMIT 1', function(err, rows, fields) {
			if(rows[0] != null) {
				if(rows[0].wg_id == req.user.wg) {
					for(var i in parsed.entries) {
						connection.query('INSERT INTO items (item_id,description,shopping_list_id,insert_date,update_date,checked,deleted,user_id,purchase_id) VALUES (NULL, '+connection.escape(parsed.entries[i].description)+', '+connection.escape(parsed.shoppinglist)+', NOW() , NOW(), 0, 0, '+req.user.id+', NULL)', function(err, itemrows, fields) {
						});
					}
				}
			}
		});
		res.send('done');
	});	

}

