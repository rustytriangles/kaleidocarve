// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var c = require('../src/curves');
var s = require('../src/scene');

describe('Scene/Initial values', function() {

    it('defaults', function() {
	let scene = new s.Scene(5);

	assert.equal(scene.getNumCurves(), 0);
	assert.equal(scene.getNumCopies(), 5);
	assert.equal(scene.getReflection(), false);
    });
});

describe('Scene/getNumCurves', function() {

    it('Initial value', function() {
	let scene = new s.Scene(5);
	assert.equal(scene.getNumCurves(), 0);
    });

    it('After add', function() {
	let scene = new s.Scene(5);
	scene.addCurve(new c.LinearCurve(0,0,0, 1,1,1, '#FF0000'));
	assert.equal(scene.getNumCurves(), 1);
    });

    it('After clear', function() {
	let scene = new s.Scene(5);
	scene.addCurve(new c.LinearCurve(0,0,0, 1,1,1, '#FF0000'));
	scene.clear();
	assert.equal(scene.getNumCurves(), 0);
    });
});
