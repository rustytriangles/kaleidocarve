// Kaleidocurves © 2020 RustyTriangles LLC
var util = require('../src/util');

class SelectionHandler {
    constructor() {
    }

    replace(i) {
	this.selection = i;
    }

    clear() {
	this.selection = undefined;
    }

    getSelection() {
	return this.selection;
    }

    display(ctx, curves, width, height) {

    }
}

module.exports = { SelectionHandler };
