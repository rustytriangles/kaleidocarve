var chai = require('chai');
var assert = chai.assert;
var curves = require('../src/curves');
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

describe('MouseHandler/createCurve', function() {

    it('Two points', function() {
	var m = new mh.MouseHandler();

	m.start();

	const startPoint = [5, 6];
	const endPoint = [7, 8];
	m.addPoint(startPoint[0], startPoint[1]);
	m.addPoint(endPoint[0], endPoint[1]);

	var c = m.createCurve('#00ff00');
	assert.instanceOf(c, curves.LinearCurve);
	assert.deepEqual(c.evaluate(0), [startPoint, 0].flat());
	assert.deepEqual(c.evaluate(1), [endPoint, 2].flat());
    });

    it('Four points', function() {
	var m = new mh.MouseHandler();

	m.start();

	const startPoint = [1, 2];
	const endPoint = [7, 8];
	m.addPoint(startPoint[0], startPoint[1]);
	m.addPoint(3, 4);
	m.addPoint(5, 6);
	m.addPoint(endPoint[0], endPoint[1]);

	var c = m.createCurve('#00ff00');
	assert.instanceOf(c, curves.CubicCurve);
	assert.deepEqual(c.evaluate(0), [startPoint, 0].flat());
	assert.deepEqual(c.evaluate(1), [endPoint, 2].flat());
    });
});

describe('MouseHandler/createCircle', function() {

    var m = new mh.MouseHandler();

    m.start();
    m.addPoint(3, 4);
    var c = m.createCircle('#00ff00');
    assert.instanceOf(c, curves.Circle);
    assert.equal(c.getRadius(), 5);

});
