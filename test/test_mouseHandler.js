// Kaleidocurves © 2020 RustyTriangles LLC

var assert = require('assert');
var mh = require('../src/mouseHandler');

// assert functions
//  AssertionError
//  deepEqual
//  deepStrictEqual
//  doesNotMatch
//  doesNotReject
//  doesNotThrow
//  equal
//  fail
//  ifError
//  match
//  notDeepEqual
//  notDeepStrictEqual
//  notEqual
//  notStrictEqual
//  ok
//  rejects
//  strict
//  strictEqual
//  throws

describe('MouseHandler/mode', function() {

    it('Initial value', function() {
	var m = new mh.MouseHandler();
	assert.equal(m.getMode(), 'draw_curve');
    });

    it('After setMode', function() {
	var m = new mh.MouseHandler();
	m.setMode('draw_circle');
	assert.equal(m.getMode(), 'draw_circle');
	m.setMode('draw_curve');
	assert.equal(m.getMode(), 'draw_curve');
    });

});

describe('MouseHandler/valid', function() {

    it('Initial value', function() {
	var m = new mh.MouseHandler();
	assert.equal(m.valid(), false);
    });

    it('Without calling start', function() {
	var m = new mh.MouseHandler();

	m.addPoint(1,2);
	m.addPoint(3,4);

	assert.equal(m.valid(), false);
    });

    it('One point', function() {
	var m = new mh.MouseHandler();

	m.start();

	m.addPoint(5,6);

	assert.equal(m.valid(), false);
    });

    it('Two points', function() {
	var m = new mh.MouseHandler();

	m.start();

	m.addPoint(5,6);
	m.addPoint(7,8);

	assert.equal(m.valid(), true);
    });
});
