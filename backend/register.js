var crypto = require('crypto');

exports.registerUser = function(username,password,connection) {
	var iterations = 4096;
	var keylen = 256;
	var salt = new Buffer(crypto.randomBytes(256)).toString('hex');
	
	crypto.pbkdf2(password, salt, iterations, keylen, function(err,derivedKey){
		derivedKey = new Buffer(derivedKey).toString('base64');
		
		connection.query('INSERT INTO users SET username = '+connection.escape(username)+',password='+connection.escape(derivedKey)+',salt='+connection.escape(salt)+';', function(err, rows, fields) {
  			if (err) throw err;
		});

	});	
}