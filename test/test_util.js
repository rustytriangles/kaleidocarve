// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var util = require('../src/util');

describe('dist', function () {

    it('0,0,0,0 should equal 0', function () {
        assert.equal(util.dist(0,0,0,0), 0);
    });

    it('one step from origin in each direction should equal 1', function () {
        [[1,0], [0,-1], [-1,0], [0,1]].forEach(function fcn(pt) {
            assert.equal(util.dist(0,0,pt[0],pt[1]), 1);
        });
    });

    it('one step diagonals should equal sqrt(2)', function () {
        [[1,1], [1,-1], [-1,-1], [-1,1]].forEach(function fcn(pt) {
            assert.equal(util.dist(0,0,pt[0],pt[1]), Math.sqrt(2));
        });
    });

});

describe('lerp', function () {

    it('0 should return start point', function() {
        assert.equal(util.lerp(3,5,0), 3);
    });

    it('1 should return end point', function() {
        assert.equal(util.lerp(3,5,1), 5);
    });


    it('1/2 should return mid point', function() {
        assert.equal(util.lerp(3,5,.5), 4);
    });

    it('two coincident points should always return the same thing', function () {
        [0, .25, .5, .75, 1].forEach(function fcn(t) {
            assert.equal(util.lerp(3,3,t), 3);
        });
    });
});

describe('toDC', function () {
    const w = 512;
    const h = 370;
    const s = 256;

    it('[0,0] should return mid point', function() {
        assert.deepEqual(util.toDC(0,0,s,w,h), [256, 185]);
    });

    it('[1,0] should return right mid point', function() {
        assert.deepEqual(util.toDC(1,0,s,w,h), [w, 185]);
    });

    it('[-1,0] should return left mid point', function() {
        assert.deepEqual(util.toDC(-1,0,s,w,h), [0, 185]);
    });

    it('[0,1] should return s above top mid point', function() {
        assert.deepEqual(util.toDC(0,1,s,w,h), [256, 185 + 256]);
    });

    it('[0,-1] should return s below bottom mid point', function() {
        assert.deepEqual(util.toDC(0,-1,s,w,h), [256, 185 - 256]);
    });

});

describe('toNDC', function () {
    const cx = 320;
    const cy = 240;
    const s = 128;

    it('[cx,cy] should return [0,0]', function() {
        assert.deepEqual(util.toNDC(cx,cy,s,cx,cy), [0, 0]);
    });

    it('[cx+s,cy] should return [1,0]', function() {
        assert.deepEqual(util.toNDC(cx+s,cy,s,cx,cy), [1, 0]);
    });

    it('[cx-s,cy] should return [-1,0]', function() {
        assert.deepEqual(util.toNDC(cx-s,cy,s,cx,cy), [-1, 0]);
    });

    it('[cx,cy+s] should return [0,1]', function() {
        assert.deepEqual(util.toNDC(cx,cy+s,s,cx,cy), [0, 1]);
    });

    it('[cx,cy-s] should return [0,-1]', function() {
        assert.deepEqual(util.toNDC(cx,cy-s,s,cx,cy), [0,-1]);
    });

});

describe('radiusToDepth', function() {
    it('0 should return 0', function() {
        assert.equal(util.radiusToDepth(0, 3.15, 30), 0);
    });

    it('1.575 should return 10', function() {
        assert.closeTo(util.radiusToDepth(1.575, 3.15, 30), -5.878, 0.001);
    });
});

describe('sliderValueToRadius', function() {
    const toolDiameter = 3.15;

    it('0 should return 0', function() {
        assert.equal(util.sliderValueToRadius(0, toolDiameter), 0);
    });

    it('100 should return diam/2', function() {
        assert.equal(util.sliderValueToRadius(100, 3.15), toolDiameter/2);
    });
});

describe('radiusToSliderValue', function() {
    const toolDiameter = 3.15;

    it('0 should return 0', function() {
        assert.equal(util.radiusToSliderValue(0, toolDiameter), 0);
    });

    it('diam/2 should return 100', function() {
        assert.equal(util.radiusToSliderValue(toolDiameter/2, 3.15), 100);
    });
});

describe('formatNumber', function () {

    it('string in', function() {
	const input = '45.5';
	const output = util.formatNumber(input);
	assert.isString(output);
	const expected = '45.500';
	assert.strictEqual(output, expected);
    });

    it('float in', function() {
	const input = 45.5;
	const output = util.formatNumber(input);
	assert.isString(output);
	const expected = '45.500';
	assert.equal(output, expected);
    });

    it('exp', function() {
	const input = 1.0665e-15;
	const output = util.formatNumber(input);
	assert.isString(output);
	const expected = '0.000';
	assert.equal(output, expected);
    });

    it('negative', function() {
	const input = -32.3;
	const output = util.formatNumber(input);
	assert.isString(output);
	const expected = '-32.300';
	assert.equal(output, expected);
    });

    it('pi', function() {
	const input = Math.PI;
	const output = util.formatNumber(input);
	assert.isString(output);
	const expected = '3.142';
	assert.equal(output, expected);
    });

    it('big', function() {
	const input = 1.e10;
	const output = util.formatNumber(input);
	assert.isString(output);
	const expected = '10000000000.000';
	assert.equal(output, expected);
    });
});
