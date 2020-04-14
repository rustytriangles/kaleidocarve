// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var curves = require('../src/curves');
var transform = require('../src/transformation');

describe('LinearCurve', function () {

    const startPoint = [1, 1, 0];
    const endPoint = [5, 5, 2];
    const color = '#ff0000';
    var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
        endPoint[0], endPoint[1], endPoint[2],
        color);

    it('LinearCurve is not radially symmetric', function() {
        assert.isNotOk(c.isSymmetric());
    });

    it('evaluate(0) should return start point', function () {
        assert.deepEqual(c.evaluate(0), startPoint);
    });
    it('evaluate(1) should return end point', function () {
        assert.deepEqual(c.evaluate(1), endPoint);
    });

    it('evaluate(1/2) should return mid point', function () {
        assert.deepEqual(c.evaluate(0.5), [(startPoint[0] + endPoint[0]) / 2,
        (startPoint[1] + endPoint[1]) / 2,
        (startPoint[2] + endPoint[2]) / 2]);
    });

    it('get/set radius', function () {
	assert.isUndefined(c.getRadius(0));
	assert.equal(c.getRadius(1), startPoint[2]);
	assert.equal(c.getRadius(2), endPoint[2]);
	assert.isUndefined(c.getRadius(3));

	const r1 = 17;
	const r2 = 12;
	c.setRadius(1, r1);
	c.setRadius(2, r2);

	assert.equal(c.getRadius(1), r1);
	assert.equal(c.getRadius(2), r2);
    });
});

describe('LinearCurve/hittest', function () {

    const startPoint = [1, 2, 0];
    const endPoint = [4, 5, 2];
    const color = '#ff0000';
    var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
        endPoint[0], endPoint[1], endPoint[2],
                                   color);

    it('hittest(-5,18) should return false', function() {
        assert.isNotOk(c.hittest(-5,18));
    });

    it('hittest(startPoint) should return true', function() {
        assert.isOk(c.hittest(startPoint[0], startPoint[1]));
    });

    it('before start should return false', function() {
        assert.isNotOk(c.hittest(0,0));
    });

    it('after end should return false', function() {
        assert.isNotOk(c.hittest(0,0));
    });

    it('hittest(endPoint) should return true', function() {
        assert.isOk(c.hittest(endPoint[0], endPoint[1]));
    });

    const mx = (startPoint[0]+endPoint[0])/2;
    const my = (startPoint[1]+endPoint[1])/2;
    it('hittest(midPoint) should return true', function() {
        assert.isOk(c.hittest(mx,my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittest(-5,18, transform) should return false', function() {
        assert.isNotOk(c.hittest(-5,18, t));
    });

    it('hittest(startPoint, transform) should return true', function() {
        assert.isOk(c.hittest( startPoint[0], startPoint[1], t));
        assert.isOk(c.hittest(-startPoint[1], startPoint[0], t));
        assert.isOk(c.hittest(-startPoint[0],-startPoint[1], t));
        assert.isOk(c.hittest( startPoint[1],-startPoint[0], t));
    });

    it('hittest(midPoint, transform) should return true', function() {
        assert.isOk(c.hittest( mx, my, t));
        assert.isOk(c.hittest(-my, mx, t));
        assert.isOk(c.hittest(-mx,-my, t));
        assert.isOk(c.hittest( my,-mx, t));
    });

    it('hittest(endPoint, transform) should return true', function() {
        assert.isOk(c.hittest( endPoint[0], endPoint[1], t));
        assert.isOk(c.hittest(-endPoint[1], endPoint[0], t));
        assert.isOk(c.hittest(-endPoint[0],-endPoint[1], t));
        assert.isOk(c.hittest( endPoint[1],-endPoint[0], t));
    });

});

describe('LinearCurve/hittestControlPoints', function () {

    const startPoint = [1, 2, 0];
    const endPoint = [4, 5, 2];
    const color = '#ff0000';
    var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
        endPoint[0], endPoint[1], endPoint[2],
                                   color);

    it('hittestControlPoints(-5,18) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(-5,18));
    });

    it('hittestControlPoints(startPoint) should return 1', function() {
        assert.equal(c.hittestControlPoints(startPoint[0], startPoint[1]), 1);
    });

    it('before start should return false', function() {
        assert.isNotOk(c.hittestControlPoints(0,0));
    });

    it('after end should return false', function() {
        assert.isNotOk(c.hittestControlPoints(0,0));
    });

    it('hittestControlPoints(endPoint) should return 2', function() {
        assert.equal(c.hittestControlPoints(endPoint[0], endPoint[1]), 2);
    });

    const mx = (startPoint[0]+endPoint[0])/2;
    const my = (startPoint[1]+endPoint[1])/2;
    it('hittestControlPoints(midPoint) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(mx,my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittestControlPoints(-5,18, transform) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(-5,18, t));
    });

    it('hittestControlPoints(startPoint, transform) should return 1', function() {
        assert.equal(c.hittestControlPoints( startPoint[0], startPoint[1], t), 1);
        assert.equal(c.hittestControlPoints(-startPoint[1], startPoint[0], t), 1);
        assert.equal(c.hittestControlPoints(-startPoint[0],-startPoint[1], t), 1);
        assert.equal(c.hittestControlPoints( startPoint[1],-startPoint[0], t), 1);
    });

    it('hittestControlPoints(midPoint, transform) should return false', function() {
        assert.isNotOk(c.hittestControlPoints( mx, my, t));
        assert.isNotOk(c.hittestControlPoints(-my, mx, t));
        assert.isNotOk(c.hittestControlPoints(-mx,-my, t));
        assert.isNotOk(c.hittestControlPoints( my,-mx, t));
    });

    it('hittestControlPoints(endPoint, transform) should return 2', function() {
        assert.equal(c.hittestControlPoints( endPoint[0], endPoint[1], t), 2);
        assert.equal(c.hittestControlPoints(-endPoint[1], endPoint[0], t), 2);
        assert.equal(c.hittestControlPoints(-endPoint[0],-endPoint[1], t), 2);
        assert.equal(c.hittestControlPoints( endPoint[1],-endPoint[0], t), 2);
    });

});

describe('QuadraticCurve', function () {
    const startPoint = [1, 1, 0];
    const controlPoint = [1, 5, 2];
    const endPoint = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.QuadraticCurve(startPoint[0], startPoint[1], startPoint[2],
        controlPoint[0], controlPoint[1], controlPoint[2],
        endPoint[0], endPoint[1], endPoint[2],
        color);

    it('QuadraticCurve is not radially symmetric', function() {
        assert.isNotOk(c.isSymmetric());
    });

    it('evaluate(0) should return start point', function () {
        assert.deepEqual(c.evaluate(0), startPoint);
    });
    it('evaluate(1) should return end point', function () {
        assert.deepEqual(c.evaluate(1), endPoint);
    });

    it('get/set radius', function () {
	assert.isUndefined(c.getRadius(0));
	assert.equal(c.getRadius(1), startPoint[2]);
	assert.equal(c.getRadius(2), controlPoint[2]);
	assert.equal(c.getRadius(3), endPoint[2]);
	assert.isUndefined(c.getRadius(4));

	const r1 = 17;
	const r2 = 12;
	const r3 = 9;
	c.setRadius(1, r1);
	c.setRadius(2, r2);
	c.setRadius(3, r3);

	assert.equal(c.getRadius(1), r1);
	assert.equal(c.getRadius(2), r2);
	assert.equal(c.getRadius(3), r3);
    });
});

describe('QuadraticCurve/hittest', function () {
    const startPoint = [1, 1, 0];
    const controlPoint = [1, 5, 2];
    const endPoint = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.QuadraticCurve(startPoint[0], startPoint[1], startPoint[2],
        controlPoint[0], controlPoint[1], controlPoint[2],
        endPoint[0], endPoint[1], endPoint[2],
        color);

    it('0,0 should return false', function() {
        assert.isNotOk(c.hittest(0,0));
    });

    it('hittest(startPoint) should return true', function() {
        assert.isOk(c.hittest(startPoint[0], startPoint[1]));
    });

    it('hittest(endPoint) should return true', function() {
        assert.isOk(c.hittest(endPoint[0], startPoint[1]));
    });

    it('control point should return false', function() {
        assert.isNotOk(c.hittest(controlPoint[0],controlPoint[1]));
    });

    const mx = (startPoint[0] + 2*controlPoint[0] + endPoint[0]) / 4;
    const my = (startPoint[1] + 2*controlPoint[1] + endPoint[1]) / 4;
    it('hittest(midPoint) should return true', function() {
        assert.isOk(c.hittest(mx, my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittest(0,0,transform) should return false', function() {
        assert.isNotOk(c.hittest(0,0, t));
    });

    it('hittest(startPoint, transform) should return true', function() {
        assert.isOk(c.hittest( startPoint[0], startPoint[1], t));
        assert.isOk(c.hittest(-startPoint[1], startPoint[0], t));
        assert.isOk(c.hittest(-startPoint[0],-startPoint[1], t));
        assert.isOk(c.hittest( startPoint[1],-startPoint[0], t));
    });

    it('hittest(midPoint, transform) should return true', function() {
        assert.isOk(c.hittest( mx, my, t));
        assert.isOk(c.hittest(-my, mx, t));
        assert.isOk(c.hittest(-mx,-my, t));
        assert.isOk(c.hittest( my,-mx, t));
    });

    it('hittest(endPoint, transform) should return true', function() {
        assert.isOk(c.hittest( endPoint[0], endPoint[1], t));
        assert.isOk(c.hittest(-endPoint[1], endPoint[0], t));
        assert.isOk(c.hittest(-endPoint[0],-endPoint[1], t));
        assert.isOk(c.hittest( endPoint[1],-endPoint[0], t));
    });

});

describe('QuadraticCurve/hittestControlPoints', function () {
    const startPoint = [1, 1, 0];
    const controlPoint = [1, 5, 2];
    const endPoint = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.QuadraticCurve(startPoint[0], startPoint[1], startPoint[2],
        controlPoint[0], controlPoint[1], controlPoint[2],
        endPoint[0], endPoint[1], endPoint[2],
        color);

    it('0,0 should return false', function() {
        assert.isNotOk(c.hittestControlPoints(0,0));
    });

    it('hittestControlPoints(startPoint) should return 1', function() {
        assert.equal(c.hittestControlPoints(startPoint[0], startPoint[1]), 1);
    });

    it('hittestControlPoints(endPoint) should return 2', function() {
        assert.equal(c.hittestControlPoints(endPoint[0], startPoint[1]), 3);
    });

    it('hittestControlPoints(control point) should return 2', function() {
        assert.equal(c.hittestControlPoints(controlPoint[0],controlPoint[1]), 2);
    });

    const mx = (startPoint[0] + 2*controlPoint[0] + endPoint[0]) / 4;
    const my = (startPoint[1] + 2*controlPoint[1] + endPoint[1]) / 4;
    it('hittestControlPoints(midPoint) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(mx, my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittest(0,0,transform) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(0,0, t));
    });

    it('hittestControlPoints(startPoint, transform) should return 1', function() {
        assert.equal(c.hittestControlPoints( startPoint[0], startPoint[1], t), 1);
        assert.equal(c.hittestControlPoints(-startPoint[1], startPoint[0], t), 1);
        assert.equal(c.hittestControlPoints(-startPoint[0],-startPoint[1], t), 1);
        assert.equal(c.hittestControlPoints( startPoint[1],-startPoint[0], t), 1);
    });

    it('hittestControlPoints(midPoint, transform) should return false', function() {
        assert.isNotOk(c.hittestControlPoints( mx, my, t));
        assert.isNotOk(c.hittestControlPoints(-my, mx, t));
        assert.isNotOk(c.hittestControlPoints(-mx,-my, t));
        assert.isNotOk(c.hittestControlPoints( my,-mx, t));
    });

    it('hittestControlPoints(endPoint, transform) should return 3', function() {
        assert.equal(c.hittestControlPoints( endPoint[0], endPoint[1], t), 3);
        assert.equal(c.hittestControlPoints(-endPoint[1], endPoint[0], t), 3);
        assert.equal(c.hittestControlPoints(-endPoint[0],-endPoint[1], t), 3);
        assert.equal(c.hittestControlPoints( endPoint[1],-endPoint[0], t), 3);
    });

    it('hittestControlPoints(control, transrom)  point should return 2', function() {
        assert.isOk(c.hittestControlPoints( controlPoint[0], controlPoint[1], t));
        assert.isOk(c.hittestControlPoints(-controlPoint[1], controlPoint[0], t));
        assert.isOk(c.hittestControlPoints(-controlPoint[0],-controlPoint[1], t));
        assert.isOk(c.hittestControlPoints( controlPoint[1],-controlPoint[0], t));
    });

});

describe('CubicCurve', function () {
    const c1 = [1, 1, 0];
    const c2 = [1, 5, 2];
    const c3 = [5, 5, 2];
    const c4 = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.CubicCurve(c1[0], c1[1], c1[2],
        c2[0], c2[1], c2[2],
        c3[0], c3[1], c3[2],
        c4[0], c4[1], c4[2],
        color);

    it('CubicCurve is not radially symmetric', function() {
        assert.isNotOk(c.isSymmetric());
    });

    it('evaluate(0) should return start point', function () {
        assert.deepEqual(c.evaluate(0), c1);
    });
    it('evaluate(1) should return end point', function () {
        assert.deepEqual(c.evaluate(1), c4);
    });

    it('evaluate(1/2) should return (p0 + 3*p1 + 3*p2 + p3)/8', function () {
        const actual = c.evaluate(0.5);
        var expected = [];
        for (let i = 0; i < 3; i++) {
            expected[i] = (c1[i] + 3 * c2[i] + 3 * c3[i] + c4[i]) / 8;
        }
        assert.deepEqual(actual, expected);
    });

    describe('evaluate(1/4)', function () {
        const actual = c.evaluate(0.25);
        var expected = [];
        for (let i = 0; i < 3; i++) {
            expected[i] = (27 * c1[i] + 9 * 3 * c2[i] + 3 * 3 * c3[i] + c4[i]) / 64;
        }
        assert.deepEqual(actual, expected);
    });

    describe('evaluate(3/4)', function () {
        const actual = c.evaluate(0.75);
        var expected = [];
        for (let i = 0; i < 3; i++) {
            expected[i] = (c1[i] + 3 * 3 * c2[i] + 9 * 3 * c3[i] + 27 * c4[i]) / 64;
        }
        assert.deepEqual(actual, expected);
    });


    it('get/set radius', function () {
	assert.isUndefined(c.getRadius(0));
	assert.equal(c.getRadius(1), c1[2]);
	assert.equal(c.getRadius(2), c2[2]);
	assert.equal(c.getRadius(3), c3[2]);
	assert.equal(c.getRadius(4), c4[2]);
	assert.isUndefined(c.getRadius(5));

	const r1 = 17;
	const r2 = 12;
	const r3 = 9;
	const r4 = 11;
	c.setRadius(1, r1);
	c.setRadius(2, r2);
	c.setRadius(3, r3);
	c.setRadius(4, r4);

	assert.equal(c.getRadius(1), r1);
	assert.equal(c.getRadius(2), r2);
	assert.equal(c.getRadius(3), r3);
	assert.equal(c.getRadius(4), r4);
    });
});

describe('CubicCurve/hittest', function () {
    const c1 = [1, 1, 0];
    const c2 = [1, 5, 2];
    const c3 = [5, 5, 2];
    const c4 = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.CubicCurve(c1[0], c1[1], c1[2],
        c2[0], c2[1], c2[2],
        c3[0], c3[1], c3[2],
        c4[0], c4[1], c4[2],
        color);

    it('hittest(-5,18) should return false', function() {
        assert.isNotOk(c.hittest(-5,18));
    });

    it('hittest(c2) should return false', function() {
        assert.isNotOk(c.hittest(c2[0], c2[1]));
    });

    it('hittest(c3) should return false', function() {
        assert.isNotOk(c.hittest(c3[0], c3[1]));
    });

    it('hittest(startPoint) should return true', function() {
        assert.isOk(c.hittest(c1[0], c1[1]));
    });

    it('hittest(endPoint) should return true', function() {
        assert.isOk(c.hittest(c4[0], c4[1]));
    });

    const mx = (c1[0] + 3*c2[0] + 3*c3[0] + c4[0]) / 8;
    const my = (c1[1] + 3*c2[1] + 3*c3[1] + c4[1]) / 8;
    it('hittest(midPoint) should return true', function() {
        assert.isOk(c.hittest(mx, my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittest(-5,18,transform) should return false', function() {
        assert.isNotOk(c.hittest(-5,18, t));
    });

    it('hittest(startPoint,transform) should return true', function() {
        assert.isOk(c.hittest( c1[0], c1[1], t));
        assert.isOk(c.hittest(-c1[1], c1[0], t));
        assert.isOk(c.hittest(-c1[0],-c1[1], t));
        assert.isOk(c.hittest( c1[1],-c1[0], t));
    });

    it('hittest(c2,transform) should return false', function() {
        assert.isNotOk(c.hittest( c2[0], c2[1], t));
        assert.isNotOk(c.hittest(-c2[1], c2[0], t));
        assert.isNotOk(c.hittest(-c2[0],-c2[1], t));
        assert.isNotOk(c.hittest( c2[1],-c2[0], t));
    });

    it('hittest(midPoint,transform) should return true', function() {
        assert.isOk(c.hittest( mx, my, t));
        assert.isOk(c.hittest(-my, mx, t));
        assert.isOk(c.hittest(-mx,-my, t));
        assert.isOk(c.hittest( my,-mx, t));
    });

    it('hittest(c3,transform) should return false', function() {
        assert.isNotOk(c.hittest( c3[0], c3[1], t));
        assert.isNotOk(c.hittest(-c3[1], c3[0], t));
        assert.isNotOk(c.hittest(-c3[0],-c3[1], t));
        assert.isNotOk(c.hittest( c3[1],-c3[0], t));
    });

    it('hittest(endPoint,transform) should return true', function() {
        assert.isOk(c.hittest( c4[0], c4[1], t));
        assert.isOk(c.hittest(-c4[1], c4[0], t));
        assert.isOk(c.hittest(-c4[0],-c4[1], t));
        assert.isOk(c.hittest( c4[1],-c4[0], t));
    });

});

describe('CubicCurve/hittestControlPoints', function () {
    const c1 = [1, 1, 0];
    const c2 = [1, 5, 2];
    const c3 = [5, 5, 2];
    const c4 = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.CubicCurve(c1[0], c1[1], c1[2],
        c2[0], c2[1], c2[2],
        c3[0], c3[1], c3[2],
        c4[0], c4[1], c4[2],
        color);

    it('hittestControlPoints(-5,18) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(-5,18));
    });

    it('hittestControlPoints(c2) should return 2', function() {
        assert.equal(c.hittestControlPoints(c2[0], c2[1]), 2);
    });

    it('hittestControlPoints(c3) should return 3', function() {
        assert.equal(c.hittestControlPoints(c3[0], c3[1]), 3);
    });

    it('hittestControlPoints(startPoint) should return 1', function() {
        assert.equal(c.hittestControlPoints(c1[0], c1[1]), 1);
    });

    it('hittestControlPoints(endPoint) should return 4', function() {
        assert.equal(c.hittestControlPoints(c4[0], c4[1]), 4);
    });

    const mx = (c1[0] + 3*c2[0] + 3*c3[0] + c4[0]) / 8;
    const my = (c1[1] + 3*c2[1] + 3*c3[1] + c4[1]) / 8;
    it('hittestControlPoints(midPoint) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(mx, my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittestControlPoints(-5,18,transform) should return false', function() {
        assert.isNotOk(c.hittestControlPoints(-5,18, t));
    });

    it('hittestControlPoints(startPoint,transform) should return 1', function() {
        assert.equal(c.hittestControlPoints( c1[0], c1[1], t), 1);
        assert.equal(c.hittestControlPoints(-c1[1], c1[0], t), 1);
        assert.equal(c.hittestControlPoints(-c1[0],-c1[1], t), 1);
        assert.equal(c.hittestControlPoints( c1[1],-c1[0], t), 1);
    });

    it('hittestControlPoints(c2,transform) should return 2', function() {
        assert.equal(c.hittestControlPoints( c2[0], c2[1], t), 2);
        assert.equal(c.hittestControlPoints(-c2[1], c2[0], t), 2);
        assert.equal(c.hittestControlPoints(-c2[0],-c2[1], t), 2);
        assert.equal(c.hittestControlPoints( c2[1],-c2[0], t), 2);
    });

    it('hittestControlPoints(midPoint,transform) should return false', function() {
        assert.isNotOk(c.hittestControlPoints( mx, my, t));
        assert.isNotOk(c.hittestControlPoints(-my, mx, t));
        assert.isNotOk(c.hittestControlPoints(-mx,-my, t));
        assert.isNotOk(c.hittestControlPoints( my,-mx, t));
    });

    it('hittestControlPoints(c3,transform) should return 3', function() {
        assert.equal(c.hittestControlPoints( c3[0], c3[1], t), 3);
        assert.equal(c.hittestControlPoints(-c3[1], c3[0], t), 3);
        assert.equal(c.hittestControlPoints(-c3[0],-c3[1], t), 3);
        assert.equal(c.hittestControlPoints( c3[1],-c3[0], t), 3);
    });

    it('hittestControlPoints(endPoint,transform) should return 4', function() {
        assert.equal(c.hittestControlPoints( c4[0], c4[1], t), 4);
        assert.equal(c.hittestControlPoints(-c4[1], c4[0], t), 4);
        assert.equal(c.hittestControlPoints(-c4[0],-c4[1], t), 4);
        assert.equal(c.hittestControlPoints( c4[1],-c4[0], t), 4);
    });

});

describe('Circle', function () {
    const cx = 3;
    const cy = 5;
    const r = 7;
    var c = new curves.Circle(cx, cy, r,
                              2, '#00FF00');

    it('Circle is radially symmetric', function() {
        assert.isOk(c.isSymmetric());
    });
});

describe('Circle/hittest', function () {
    const cx = 3;
    const cy = 5;
    const r = 7;
    var c = new curves.Circle(cx, cy, r,
                              2, '#00FF00');

    it('hittest(center) should return false', function() {
        assert.isNotOk(c.hittest(cx,cy));
    });

    it('hittest(center + [r,0]) should return true', function() {
        assert.isOk(c.hittest(cx+r,cy));
    });

    it('hittest(center + [0,r]) should return true', function() {
        assert.isOk(c.hittest(cx,cy+r));
    });

    it('hittest(center - [r,0]) should return true', function() {
        assert.isOk(c.hittest(cx-r,cy));
    });

    it('hittest(center - [0,r]) should return true', function() {
        assert.isOk(c.hittest(cx,cy-r));
    });

    it('hittest(center + r*[sqrt(2)/2,sqrt(2)/2]) should return true', function() {
        const s2 = Math.sqrt(2) / 2;
        assert.isOk(c.hittest(cx+s2*r,cy+s2*r));
    });

    it('hittest(center - r*[sqrt(2)/2,sqrt(2)/2]) should return true', function() {
        const s2 = Math.sqrt(2) / 2;
        assert.isOk(c.hittest(cx-s2*r,cy-s2*r));
    });
});
