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

describe('CubicCurve', function () {
    const c0 = [1, 1, 0];
    const c1 = [1, 5, 2];
    const c2 = [5, 5, 2];
    const c3 = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.CubicCurve(c0[0], c0[1], c0[2],
        c1[0], c1[1], c1[2],
        c2[0], c2[1], c2[2],
        c3[0], c3[1], c3[2],
        color);

    it('CubicCurve is not radially symmetric', function() {
        assert.isNotOk(c.isSymmetric());
    });

    it('evaluate(0) should return start point', function () {
        assert.deepEqual(c.evaluate(0), c0);
    });
    it('evaluate(1) should return end point', function () {
        assert.deepEqual(c.evaluate(1), c3);
    });

    it('evaluate(1/2) should return (p0 + 3*p1 + 3*p2 + p3)/8', function () {
        const actual = c.evaluate(0.5);
        var expected = [];
        for (let i = 0; i < 3; i++) {
            expected[i] = (c0[i] + 3 * c1[i] + 3 * c2[i] + c3[i]) / 8;
        }
        assert.deepEqual(actual, expected);
    });

    describe('evaluate(1/4)', function () {
        const actual = c.evaluate(0.25);
        var expected = [];
        for (let i = 0; i < 3; i++) {
            expected[i] = (27 * c0[i] + 9 * 3 * c1[i] + 3 * 3 * c2[i] + c3[i]) / 64;
        }
        assert.deepEqual(actual, expected);
    });

    describe('evaluate(3/4)', function () {
        const actual = c.evaluate(0.75);
        var expected = [];
        for (let i = 0; i < 3; i++) {
            expected[i] = (c0[i] + 3 * 3 * c1[i] + 9 * 3 * c2[i] + 27 * c3[i]) / 64;
        }
        assert.deepEqual(actual, expected);
    });

});

describe('CubicCurve/hittest', function () {
    const c0 = [1, 1, 0];
    const c1 = [1, 5, 2];
    const c2 = [5, 5, 2];
    const c3 = [5, 1, 4];
    const color = '#ff0000';
    var c = new curves.CubicCurve(c0[0], c0[1], c0[2],
        c1[0], c1[1], c1[2],
        c2[0], c2[1], c2[2],
        c3[0], c3[1], c3[2],
        color);

    it('hittest(-5,18) should return false', function() {
        assert.isNotOk(c.hittest(-5,18));
    });

    it('hittest(c1) should return false', function() {
        assert.isNotOk(c.hittest(c1[0], c1[1]));
    });

    it('hittest(c2) should return false', function() {
        assert.isNotOk(c.hittest(c2[0], c2[1]));
    });

    it('hittest(startPoint) should return true', function() {
        assert.isOk(c.hittest(c0[0], c0[1]));
    });

    it('hittest(endPoint) should return true', function() {
        assert.isOk(c.hittest(c3[0], c3[1]));
    });

    const mx = (c0[0] + 3*c1[0] + 3*c2[0] + c3[0]) / 8;
    const my = (c0[1] + 3*c1[1] + 3*c2[1] + c3[1]) / 8;
    it('hittest(midPoint) should return true', function() {
        assert.isOk(c.hittest(mx, my));
    });

    // Transformation(4,false) is 90 degree rotations
    const t = new transform.Transformation(4, false);

    it('hittest(startPoint,transform) should return true', function() {
        assert.isOk(c.hittest( c0[0], c0[1], t));
        assert.isOk(c.hittest(-c0[1], c0[0], t));
        assert.isOk(c.hittest(-c0[0],-c0[1], t));
        assert.isOk(c.hittest( c0[1],-c0[0], t));
    });

    it('hittest(midPoint,transform) should return true', function() {
        assert.isOk(c.hittest( mx, my, t));
        assert.isOk(c.hittest(-my, mx, t));
        assert.isOk(c.hittest(-mx,-my, t));
        assert.isOk(c.hittest( my,-mx, t));
    });

    it('hittest(endPoint,transform) should return true', function() {
        assert.isOk(c.hittest( c3[0], c3[1], t));
        assert.isOk(c.hittest(-c3[1], c3[0], t));
        assert.isOk(c.hittest(-c3[0],-c3[1], t));
        assert.isOk(c.hittest( c3[1],-c3[0], t));
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
