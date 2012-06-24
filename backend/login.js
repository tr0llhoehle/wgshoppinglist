var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;

exports.initLogin = function(connection,passport) {
	
var users = new Array();

function findById(id, fn) {
  if (users[id] != null) {
    fn(null, users[id]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

function checkPassword(username, password, givenSalt, givenKey, callback) {
	var iterations = 4096;
	var keylen = 256;
	crypto.pbkdf2(password, givenSalt, iterations, keylen, function(err,derivedKey){
		var derivedKeyBase64 = new Buffer(derivedKey).toString('base64');
		if(givenKey == derivedKeyBase64) {
			console.log('password match');
			callback(true);
		} else {
			callback(false);
		}
	});
	
}


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
	
	var givenSalt;
    var givenKey;

	connection.query('SELECT * FROM users WHERE username = '+connection.escape(username), function(err, rows, fields) {
  		if (err) throw err;
  		if (rows[0] != null) {
  			console.log('Query result: ', rows);
  			givenSalt = rows[0].salt;
  			givenKey = rows[0].password;
  			checkPassword(username,password,givenSalt,givenKey,function(success){
  				if(success) {
      				console.log("login successful");
      				var user = { id: rows[0].user_id, username: username, password: 'n/a', email: rows[0].email, wg: rows[0].wg_id, date: new Date() };
      				users[rows[0].user_id] = user;
      				return done(null, user);
    			} else {
    				console.log("login failed");
    				return done(null, false, { message: 'Unkown user ' + username });
    			}
  			});
  		} else {
  			console.log("login failed");
    		return done(null, false, { message: 'Unkown user ' + username });
  		}    
	});
    });
  }
));

}

