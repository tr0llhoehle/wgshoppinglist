/*
 * Contains methods to work on (add, check, uncheck, delete, ...) entries of
 * the list displayed in the UI.
 */

/*
 * Defines one item of the shopping list.
 * The only parameter needed is the name. Other things will be initialised
 * with default values. The properties of an item are:
 ** name can be any string (not unique).
 ** id will be an integer. That integer should be the id given by the
 * server (>0) or if the server doesn't know about that item yet it'll be 
 * = 0.
 ** checked indicates whether the item is checked.
 ** transferring indicates whether the current state of the item is in sync
 * with the server.
 ** date is the javascript-date at which this item was added to the list (gobally).
 */
function Item(name, id, checked, date) {
	self = this;
	self.name = name;
	self.id = (id != undefined) ? id : 0;
	self.checked = (checked != undefined) ? ko.observable(checked) : ko.observable(false);
	self.date = (date != undefined) ? date : new Date();
	self.transferring = ko.observable(false);
	self.dataIconName = ko.computed(function() {
		return self.checked() ? "check" : "gear";
	}, self);
	self.toggleChecked = function() {
		if(self.checked()) {
			self.checked(false);
		} else {
			self.checked(true);
		}
	};
}

/*
 * Defines one shopping list which mainly consists of a number of items
 * (see above) and methods to work on the list.
 */
function ShoppingList(checkedItems, uncheckedItems) {
	self = this;
	self.items = ko.observableArray();
}
