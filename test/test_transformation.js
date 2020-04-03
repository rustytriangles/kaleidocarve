// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var tm = require('../src/transformation');

function computeExpected(i, n, r) {
    const angle = 2 * Math.PI * i / n;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    if (r) {
	return [-c, s, s, c, 0, 0];
    } else {
	return [c, -s, s, c, 0, 0];
    }
}

describe('Transformation/getNumCopies', function () {

    it('3,false should return 3', function() {
	const t = new tm.Transformation(3, false);
	assert.equal(t.getNumCopies(), 3);
    })

    it('3,true should return 6', function() {
	const t = new tm.Transformation(3, true);
	assert.equal(t.getNumCopies(), 6);
    })
});

describe('Transformation/iterator', function () {

    it('3,false', function() {
	let actual = [];

	const t = new tm.Transformation(3, false);
	const it = t.makeIterator();
	let result = it.next();
	while (!result.done) {
	    actual.push(result.value);
	    result = it.next();
	}

	assert.lengthOf(actual, 3);

	for (let i = 0; i < 3; i++) {
	    const expected = computeExpected(i, 3, false);
	    assert.deepEqual(actual[i], expected);
	}
    });

    it('3,true', function() {
	let actual = [];

	const t = new tm.Transformation(3, true);
	const it = t.makeIterator();
	let result = it.next();
	while (!result.done) {
	    actual.push(result.value);
	    result = it.next();
	}

	assert.lengthOf(actual, 6);

	for (let i = 0; i < 3; i++) {
	    const expected = computeExpected(i, 3, false);
	    assert.deepEqual(actual[i], expected);
	}

	// for (let i = 3; i < 6; i++) {
	//     const expected = computeExpected(i-3, 3, true);
	//     assert.deepEqual(actual[i], expected);
	// }
    });
});
