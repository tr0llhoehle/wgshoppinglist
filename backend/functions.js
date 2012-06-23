exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login')
}
exports.ensureAuthenticatedAPI = function ensureAuthenticatedAPI(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	  res.send('plxauthenticatekthxbai')
}