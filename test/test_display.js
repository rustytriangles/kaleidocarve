// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var curves = require('../src/curves');

class MockContext {
    constructor() {
        this.numFills = 0;
        this.numStrokes = 0;
    }

    fillStyle = '#FF0000';

    arc(x,y,r,start,end) {
    }

    beginPath() {
    }

    moveTo(x, y) {
    }

    lineTo(x, y) {
    }

    closePath() {
    }

    stroke() {
        this.numStrokes += 1;
    }

    fill() {
        this.numFills += 1;
    }

    getNumStrokes() {
        return this.numStrokes;
    }

    getNumFills() {
        return this.numFills;
    }
};

describe('LinearCurve/display', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const endPoint = [5, 5, 2];
        const color = '#ff0000';
        var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
                                       endPoint[0], endPoint[1], endPoint[2],
                                       color);

        let ctx = new MockContext();
        c.display(ctx, 2);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 3);
    });
});

describe('LinearCurve/highlight', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const endPoint = [5, 5, 2];
        const color = '#ff0000';
        var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
                                       endPoint[0], endPoint[1], endPoint[2],
                                       color);

        let ctx = new MockContext();
        c.highlight(ctx, 2);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 0);
    });
});

describe('QuadraticCurve/display', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const controlPoint = [1, 5, 2];
        const endPoint = [5, 1, 4];
        const color = '#ff0000';
        var c = new curves.QuadraticCurve(startPoint[0], startPoint[1], startPoint[2],
                                          controlPoint[0], controlPoint[1], controlPoint[2],
                                          endPoint[0], endPoint[1], endPoint[2],
                                          color);


        let ctx = new MockContext();
        c.display(ctx, 2);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 5);
    });
});

describe('QuadraticCurve/highlight', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const controlPoint = [1, 5, 2];
        const endPoint = [5, 1, 4];
        const color = '#ff0000';
        var c = new curves.QuadraticCurve(startPoint[0], startPoint[1], startPoint[2],
                                          controlPoint[0], controlPoint[1], controlPoint[2],
                                          endPoint[0], endPoint[1], endPoint[2],
                                          color);


        let ctx = new MockContext();
        c.highlight(ctx, 2);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 0);
    });
});

describe('CubicCurve/display', function () {

    it('Count stroke/fill operations', function() {
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

        let ctx = new MockContext();
        c.display(ctx, 2);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 9);
    });
});

describe('CubicCurve/highlight', function () {

    it('Count stroke/fill operations', function() {
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

        let ctx = new MockContext();
        c.highlight(ctx, 2);

        assert.equal(ctx.getNumStrokes(), 5);
        assert.equal(ctx.getNumFills(), 0);
    });
});
