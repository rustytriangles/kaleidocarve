// Kaleidocurves © 2020 RustyTriangles LLC
var util = require('../src/util');
var EventEmitter = require('events');

class SelectionHandler extends EventEmitter {

    constructor() {
	super();
    }

    replace(i) {
	const changed = this.selection != i;
	this.selection = i;
	if (changed) {
	    this.emit('selectionChanged');
	}
    }

    clear() {
	const changed = (typeof this.selection !== 'undefined');
	this.selection = undefined;
	if (changed) {
	    this.emit('selectionChanged');
	}
    }

    getSelection() {
	return this.selection;
    }

    getSelectionType() {
	if (typeof this.selection == 'number') {
	    return 'object';
	} else if (this.selection && this.selection.length == 2) {
	    return 'control_point';
	}
	return undefined;
    }

    display(ctx, curves, width, height) {

    }
}

module.exports = { SelectionHandler };
