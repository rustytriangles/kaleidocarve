// Kaleidocurves © 2020 RustyTriangles LLC
var util = require('../src/util');
var EventEmitter = require('events');

const Modes = {
    OBJECT: 'object',
    CONTROL_POINT: 'control_point',
    EMPTY: undefined
};

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
        const changed = typeof this.selection !== 'undefined';
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
            return Modes.OBJECT;
        } else if (this.selection && this.selection.length == 2) {
            return Modes.CONTROL_POINT;
        }
        return Modes.EMPTY;
    }

    display(ctx, curves, width, height) {

    }
}

module.exports = { Modes, SelectionHandler };
