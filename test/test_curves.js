// Kaleidocurves © 2020 RustyTriangles LLC

var assert = require('assert');
var curves = require('../src/curves');

describe('LinearCurve', function() {

    const startPoint = [1, 1, 0];
    const endPoint = [5, 5, 2];
    const color = '#ff0000';
    var c = new curves.LinearCurve(startPoint[0],startPoint[1],startPoint[2],
				   endPoint[0],endPoint[1],endPoint[2],
				   color);

    it('evaluate(0) should return start point', function() {
	assert.deepEqual(c.evaluate(0), startPoint);
    });
    it('evaluate(1) should return end point', function() {
	assert.deepEqual(c.evaluate(1), endPoint);
    });

    it('evaluate(1/2) should return mid point', function() {
	assert.deepEqual(c.evaluate(0.5), [(startPoint[0]+endPoint[0])/2,
					   (startPoint[1]+endPoint[1])/2,
					   (startPoint[2]+endPoint[2])/2]);
    });
});

describe('QuadraticCurve', function() {
    const startPoint = [1, 1, 0];
    const controlPoint = [1, 5, 2];
    const endPoint = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.QuadraticCurve(startPoint[0],startPoint[1],startPoint[2],
				  controlPoint[0], controlPoint[1], controlPoint[2],
				  endPoint[0],endPoint[1],endPoint[2],
				  color);
    it('evaluate(0) should return start point', function() {
	assert.deepEqual(c.evaluate(0), startPoint);
    });
    it('evaluate(1) should return end point', function() {
	assert.deepEqual(c.evaluate(1), endPoint);
    });
});

describe('CubicCurve', function() {
    const c0 = [1, 1, 0];
    const c1 = [1, 5, 2];
    const c2 = [5, 5, 2];
    const c3 = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.CubicCurve(c0[0],c0[1],c0[2],
				  c1[0], c1[1], c1[2],
				  c2[0], c2[1], c2[2],
				  c3[0],c3[1],c3[2],
				  color);

    it('evaluate(0) should return start point', function() {
	assert.deepEqual(c.evaluate(0), c0);
    });
    it('evaluate(1) should return end point', function() {
	assert.deepEqual(c.evaluate(1), c3);
    });

    it('evaluate(1/2) should return (p0 + 3*p1 + 3*p2 + p3)/8', function() {
	const actual = c.evaluate(0.5);
	var expected = [];
	for (let i=0; i<3; i++) {
	    expected[i] = (c0[i] + 3*c1[i] + 3*c2[i] + c3[i])/8;
	}
	assert.deepEqual(actual, expected);
    });

    describe('evaluate(1/4)', function() {
	const actual = c.evaluate(0.25);
	var expected = [];
	for (let i=0; i<3; i++) {
	    expected[i] = (27*c0[i] + 9*3*c1[i] + 3*3*c2[i] + c3[i])/64;
	}
	assert.deepEqual(actual, expected);
    });

    describe('evaluate(3/4)', function() {
	const actual = c.evaluate(0.75);
	var expected = [];
	for (let i=0; i<3; i++) {
	    expected[i] = (c0[i] + 3*3*c1[i] + 9*3*c2[i] + 27*c3[i])/64;
	}
	assert.deepEqual(actual, expected);
    });

});
