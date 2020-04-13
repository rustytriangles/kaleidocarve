// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var curves = require('../src/curves');
var mh = require('../src/mouseHandler');

describe('MouseHandler/mode', function() {

    it('Initial value', function() {
	let m = new mh.MouseHandler();
	assert.equal(m.getMode(), 'draw_curve');
    });

    it('After setMode', function() {
	let m = new mh.MouseHandler();
	m.setMode('draw_circle');
	assert.equal(m.getMode(), 'draw_circle');
	m.setMode('draw_curve');
	assert.equal(m.getMode(), 'draw_curve');
    });

});

describe('MouseHandler/valid', function() {

    it('Initial value', function() {
	let m = new mh.MouseHandler();
	assert.equal(m.valid(), false);
    });

    it('Without calling start', function() {
	let m = new mh.MouseHandler();

	m.addPoint(1,2);
	m.addPoint(3,4);

	assert.equal(m.valid(), false);
    });

    it('One point', function() {
	let m = new mh.MouseHandler();

	m.start();

	m.addPoint(5,6);

	assert.equal(m.valid(), false);
    });

    it('Two points', function() {
	let m = new mh.MouseHandler();

	m.start();

	m.addPoint(5,6);
	m.addPoint(7,8);

	assert.equal(m.valid(), true);
    });
});

describe('MouseHandler/createCurve', function() {

    it('Two points', function() {
	let m = new mh.MouseHandler();

	m.start();

	const startPoint = [5, 6];
	const endPoint = [7, 8];
	m.addPoint(startPoint[0], startPoint[1]);
	m.addPoint(endPoint[0], endPoint[1]);

	const c = m.createCurve('#00ff00');
	assert.instanceOf(c, curves.LinearCurve);

	assert.deepEqual(c.evaluate(0), [startPoint, 0].flat());
	assert.deepEqual(c.evaluate(1), [endPoint, 1.5].flat());

	const expectedMidPoint = [(5+7)/2, (6+8)/2, 0.75];
	assert.deepEqual(c.evaluate(0.5), expectedMidPoint);
    });

    it('Four points', function() {
	let m = new mh.MouseHandler();

	m.start();

	const startPoint = [1, 2];
	const endPoint = [7, 8];
	m.addPoint(startPoint[0], startPoint[1]);
	m.addPoint(3, 4);
	m.addPoint(5, 6);
	m.addPoint(endPoint[0], endPoint[1]);

	const c = m.createCurve('#00ff00');
	assert.instanceOf(c, curves.CubicCurve);

	assert.deepEqual(c.evaluate(0), [startPoint, 0].flat());
	assert.deepEqual(c.evaluate(1), [endPoint, 0.75].flat());

	const expectedMidPoint = [(1+3*3+3*5+7)/8, (2+3*4+3*6+8)/8, 1.03125];
	assert.deepEqual(c.evaluate(0.5), expectedMidPoint);
    });
});

describe('MouseHandler/createCircle', function() {

    let m = new mh.MouseHandler();

    m.start();
    m.addPoint(3, 4);
    const c = m.createCircle('#00ff00');
    assert.instanceOf(c, curves.Circle);

    assert.equal(c.radius, 5);
});
