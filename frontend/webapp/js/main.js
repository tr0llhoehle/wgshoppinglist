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

$(window).load(function() {
	console.log("finished loading.");
	network = new Network("tr0llhoehle.de:8080");
});
