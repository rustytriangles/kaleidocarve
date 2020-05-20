// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var g = require('../src/grid');
var curves = require('../src/curves');
var sc = require('../src/scene');
var mh = require('../src/mouseHandler');

class MockContext {
    constructor() {
        this.reset();
    }

    reset() {
        this.numFills = 0;
        this.numStrokes = 0;
        this.numMoveTos = 0;
        this.numLineTos = 0;
        this.numSetTransforms = 0;
        this.minRadius = Number.POSITIVE_INFINITY;
        this.maxRadius = Number.NEGATIVE_INFINITY;
	this.fillStyle = '#FF0000';
    }

    arc(x,y,r,start,end) {
        this.minRadius = Math.min(r, this.minRadius);
        this.maxRadius = Math.max(r, this.minRadius);
    }

    beginPath() {
    }

    moveTo(x, y) {
        this.numMoveTos += 1;
    }

    lineTo(x, y) {
        this.numLineTos += 1;
    }

    closePath() {
    }

    stroke() {
        this.numStrokes += 1;
    }

    fill() {
        this.numFills += 1;
    }

    fillText(str, x, y) {
    }

    getNumStrokes() {
        return this.numStrokes;
    }

    getNumFills() {
        return this.numFills;
    }

    save() {
    }

    restore() {
    }

    setTransform(a, b, c, d, e, f) {
        this.numSetTransforms += 1;

        // check that it's a rotation matrix
        const tol = 0.001;
        assert.closeTo(Math.sqrt(a*a+c*c),1,tol);
        assert.closeTo(Math.sqrt(b*b+d*d),1,tol);
    }
}

describe('LinearCurve/display', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const endPoint = [5, 5, 2];
        const color = '#ff0000';
        var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
                                       endPoint[0], endPoint[1], endPoint[2],
                                       color);

        let ctx = new MockContext();
        const scale = 20;
        c.display(ctx, scale);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 29);

        const minRadius = Math.min(startPoint[2],endPoint[2]);
        const maxRadius = Math.max(startPoint[2],endPoint[2]);

        const tol = 0.04;
        assert.closeTo(ctx.minRadius, minRadius, tol);
        assert.closeTo(ctx.maxRadius, maxRadius, tol);
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
        const scale = 20;
        c.highlight(ctx, scale);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 0);
    });
});

describe('QuadraticCurve/display', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const controlPoint = [1, 5, 2];
        const endPoint = [1, 1, 4];
        const color = '#ff0000';
        var c = new curves.QuadraticCurve(startPoint[0], startPoint[1], startPoint[2],
                                          controlPoint[0], controlPoint[1], controlPoint[2],
                                          endPoint[0], endPoint[1], endPoint[2],
                                          color);


        let ctx = new MockContext();
        const scale = 20;
        c.display(ctx, scale);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 40);

        const minRadius = Math.min(startPoint[2],controlPoint[2],endPoint[2]);
        const maxRadius = Math.max(startPoint[2],controlPoint[2],endPoint[2]);

        const tol = 0.1; // @todo Why so large?
        assert.closeTo(ctx.minRadius, minRadius, tol);
        assert.closeTo(ctx.maxRadius, maxRadius, tol);
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
        const scale = 20;
        c.highlight(ctx, scale);

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
        const scale = 20;
        c.display(ctx, scale);

        assert.equal(ctx.getNumStrokes(), 0);
        assert.equal(ctx.getNumFills(), 81);

        const minRadius = Math.min(c1[2],c2[2],c3[2],c4[2]);
        const maxRadius = Math.max(c1[2],c2[2],c3[2],c4[2]);

        const tol = 0.01;
        assert.closeTo(ctx.minRadius, minRadius, tol);
        assert.closeTo(ctx.maxRadius, maxRadius, tol);
    });
});

describe('CubicCurve/highlight', function () {

    it('Count stroke/fill operations', function() {
        const color = '#ff0000';
        var c = new curves.CubicCurve(1, 1, 0,
                                      1, 5, 2,
                                      5, 5, 2,
                                      5, 1, 4,
                                      '#00FF00');

        let ctx = new MockContext();
        const scale = 20;
        c.highlight(ctx, scale);

        assert.equal(ctx.getNumStrokes(), 5);
        assert.equal(ctx.getNumFills(), 0);
    });
});

describe('Scene/display transformation', function () {

    it('Asymmetric shapes should make oOne call to setTransform for each copy', function() {
        const numCopies = 5;
        const scene = new sc.Scene(numCopies);
        scene.addCurve(new curves.CubicCurve(1, 1, 0,
                                             1, 5, 2,
                                             5, 5, 2,
                                             5, 1, 4,
                                             '#00FF00'));

        let ctx = new MockContext();
        scene.display(ctx, 480, 320);

        assert.equal(ctx.numSetTransforms, numCopies);
    });

    it('Symmetric shapes like circle shouldn not get repeated', function() {
        const numCopies = 5;
        const scene = new sc.Scene(numCopies);
        scene.addCurve(new curves.Circle(0,0,12,2,'#00FF00'));

        let ctx = new MockContext();
        scene.display(ctx, 480, 320);

        assert.equal(ctx.numSetTransforms, 1);
    });
});

describe('Scene/highlight transformation', function () {

    it('Asymmetric shapes should make oOne call to setTransform for each copy', function() {
        const numCopies = 5;
        const scene = new sc.Scene(numCopies);
        scene.addCurve(new curves.CubicCurve(1, 1, 0,
                                             1, 5, 2,
                                             5, 5, 2,
                                             5, 1, 4,
                                             '#00FF00'));

        let ctx = new MockContext();
        const selected = 0;
        scene.highlight(ctx, selected, 480, 320);

        assert.equal(ctx.numSetTransforms, numCopies);
    });

    it('Symmetric shapes like circle shouldn not get repeated', function() {
        const numCopies = 5;
        const scene = new sc.Scene(numCopies);
        scene.addCurve(new curves.Circle(0,0,12,2,'#00FF00'));

        let ctx = new MockContext();
        const selected = 0;
        scene.highlight(ctx, selected, 480, 320);

        assert.equal(ctx.numSetTransforms, 1);
    });
});

describe('MouseHandler/display', function () {

    it('draw_curve', function() {
        let mouseHandler = new mh.MouseHandler(undefined, undefined, undefined);
        mouseHandler.setMode(mh.MouseModes.DRAW_CURVE);
        mouseHandler.start();
        mouseHandler.addPoint(0,0);
        mouseHandler.addPoint(5,2);
        mouseHandler.addPoint(10,4);

        let ctx = new MockContext();
        mouseHandler.display(ctx, 420, 360);

        assert.equal(ctx.numStrokes, 1);
        assert.equal(ctx.numMoveTos, 1);
        assert.equal(ctx.numLineTos, 2);
    });

    it('draw_circle', function() {
        let mouseHandler = new mh.MouseHandler(undefined, undefined, undefined);
        mouseHandler.setMode(mh.MouseModes.DRAW_CIRCLE);
        mouseHandler.start();
        mouseHandler.addPoint(5,2);

        const scale = 420 / 2;
        const radiusFirstCircle = scale * Math.sqrt(5*5 + 2*2);

        let ctx = new MockContext();
        mouseHandler.display(ctx, 420, 360);

        assert.equal(ctx.numStrokes, 1);
        assert.closeTo(ctx.minRadius, radiusFirstCircle, 0.001);
        assert.closeTo(ctx.maxRadius, radiusFirstCircle, 0.001);

        ctx.reset();

        mouseHandler.addPoint(10,4);
        const radiusSecondCircle = scale * Math.sqrt(10*10 + 4*4);

        mouseHandler.display(ctx, 420, 360);

        assert.equal(ctx.numStrokes, 1);
        assert.closeTo(ctx.minRadius, radiusSecondCircle, 0.001);
        assert.closeTo(ctx.maxRadius, radiusSecondCircle, 0.001);
    });
});

describe('Grid/display', function () {
    it('draw_circle', function() {
        let grid = new g.Grid(5, 20);

        let ctx = new MockContext();
	grid.display(ctx,420,360);
	assert.equal(ctx.getNumStrokes(), 5);
	assert.equal(ctx.getNumFills(), 0);
    });
});
