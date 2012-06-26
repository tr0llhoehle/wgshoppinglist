/*
 * This file contains code to put everything together and make it work.
 * It uses methods for network-communication defined in network.js and
 * uses methods to display items in the list with methods defined in 
 * shoppingList.js.
 */

/*
 * Things to do when the page has finished loading:
 */

var network; 
var shoppingList;

$(window).load(function() {
	console.log("finished loading.");
	shoppingList = new ShoppingList();
	ko.applyBindings(shoppingList);
});
