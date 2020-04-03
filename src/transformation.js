// Kaleidocurves © 2020 RustyTriangles LLC

var util = require('../src/util');

class Transformation {
    constructor(count, reflect) {
	this.count = count;
	this.reflect = reflect;
    }

    getNumCopies() {
	if (this.reflect) {
	    return 2*this.count;
	} else {
	    return this.count;
	}
    }

    // @todo generators would be nicer
    makeIterator() {
	const firstReflect = this.count;
	const numCopies = this.reflect ? 2*this.count : this.count;
        const step = 2.0 * Math.PI / this.count;
	let count = 0;
	const iterator = {
	    next: function() {
		const angle = count * step;
		const c = Math.cos(angle);
		const s = Math.sin(angle);

		const i = count;
		count++;
		if (i >= numCopies) {
		    return { value: [], done: true};
		} else if (i >= firstReflect) {
		    const t = [-c, s, s, c, 0, 0];
		    return { value: t, done: false };
		} else {
		    const t = [c, -s, s, c, 0, 0];
		    return { value: t, done: false };
		}
	    }
	};
	return iterator;
    }
}

module.exports = { Transformation };
