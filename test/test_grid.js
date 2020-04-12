// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var g = require('../src/grid');

describe('Grid', function () {

    it('numCopies', function() {
	let grid = new g.Grid(5);

        assert.equal(grid.numCopies, 5);

	grid.setNumCopies(7);
	assert.equal(grid.numCopies, 7);

    });
});
