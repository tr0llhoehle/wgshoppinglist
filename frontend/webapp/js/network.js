/*
 * This class contains code to communicate with our server also accesses the 
 * database and so on.
 * This is nothing more than a wrapper around JSON-stuff so we directly work
 * on Javascript-objects in other areas.
 * See /backend/api/apidoc.txt for further details.
 */
function Network(uri) {
	this.getShoppingLists = function(callback) {
		$.getJSON(uri + "/api/getshoppinglists", function(data) {
			var foo = $.parseJSON(data);
			callback(foo);
		});
	}
}
