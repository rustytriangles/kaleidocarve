// Kaleidocurves © 2020 RustyTriangles LLC

var assert = require('assert');
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

describe('toNDC', function () {
});
