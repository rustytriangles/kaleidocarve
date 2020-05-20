// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var curves = require('../src/curves');
var sc = require('../src/scene');
var mh = require('../src/mouseHandler');
var gg = require('../src/gcodeGenerator');

class MockContext {
    constructor() {
    }

    comment(str) {
    }

    isArcSupported() {
	return true;
    }

    // move head above [x, y]
    moveAbove(x, y) {
    }

    // drop head until cut width = r
    dropTo(r) {
    }

    // raise cutter
    retract() {
    }

    // cut from current location to [x, y] adjusting depth until width = r
    moveTo(x, y, r) {
    }

    // generate full circle with center at current location + [r, 0]
    xcircle(r) {
    }

    saveTransform() {
    }

    restoreTransform() {
    }

    setTransform(a,b,c,d,e,f) {
    }
}

describe('LinearCurve/generate', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const endPoint = [5, 5, 2];
        const color = '#ff0000';
        var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
                                       endPoint[0], endPoint[1], endPoint[2],
                                       color);

        let ctx = new MockContext();

        c.generate(ctx);
    });
});

describe('LinearCurve/generate', function () {

    it('Count stroke/fill operations', function() {
        const startPoint = [1, 1, 0];
        const endPoint = [5, 5, 2];
        const color = '#ff0000';
        var c = new curves.LinearCurve(startPoint[0], startPoint[1], startPoint[2],
                                       endPoint[0], endPoint[1], endPoint[2],
                                       color);

        let ctx = new MockContext();
        c.generate(ctx);
    });
});

describe('QuadraticCurve/generate', function () {

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
        c.generate(ctx);
    });
});

describe('Scene/generate transformation', function () {

    it('Asymmetric shapes should make oOne call to setTransform for each copy', function() {
        const numCopies = 5;
        const scene = new sc.Scene(numCopies);
        scene.addCurve(new curves.CubicCurve(1, 1, 0,
                                             1, 5, 2,
                                             5, 5, 2,
                                             5, 1, 4,
                                             '#00FF00'));

        let ctx = new MockContext();
        scene.generate(ctx);
    });

    it('Symmetric shapes like circle shouldn not get repeated', function() {
        const numCopies = 5;
        const scene = new sc.Scene(numCopies);
        scene.addCurve(new curves.Circle(0,0,12,2,'#00FF00'));

        let ctx = new MockContext();
        scene.generate(ctx);
    });
});

describe('makeplan', function () {

    // If we don't exceed maxDepth, the output should be
    // the same as the input.
    it('Below max depth', function() {
        let pts = [[ 0, 0, 0],
                   [10, 0, 1],
                   [10,10, 2],
                   [ 0,10, 1],
                   [ 0, 0, 0]];
        let actual = gg.makeplan(pts, 2.5);
        let expected = pts;
        assert.deepEqual(actual, expected);
    });

    it('Multiple passes', function() {
        let pts = [[ 0, 0, 2],
                   [10, 0, 2],
                   [10,10, 2],
                   [ 0,10, 2],
                   [ 0, 0, 2]];
        let actual = gg.makeplan(pts, 2.5);
        let expected = [[ 0, 0, 0  ],
                        [10, 0, 1.5],
                        [10,10, 1.5],
                        [ 0,10, 1.5],
                        [ 0, 0, 1.5],
                        // Should be a retract, move over, move down seq here
                        [ 0, 0, 0],
                        [10, 0, 2.5],
                        [10,10, 2.5],
                        [ 0,10, 2.5],
                        [ 0, 0, 2.5],
                        [ 0, 0, 0] ];

    });

    it('Angled, multiple passes', function() {
        let pts = [[ 0, 0, 0],
                   [10, 0, 1],
                   [10,10, 2],
                   [ 0,10, 1],
                   [ 0, 0, 0]];
        assert.equal(pts.length, 5);
        assert.equal(pts[0].length, 3);

        let actual = gg.makeplan(pts, 1.5);

        // first pass down to 1.5
        assert.deepEqual(actual[0], [ 0, 0, 0]);
        assert.deepEqual(actual[1], [10, 0, 1]);
        assert.deepEqual(actual[2], [10, 5, 1.5]);
        assert.deepEqual(actual[3], [10,10, 1.5]);
        assert.deepEqual(actual[4], [ 5,10, 1.5]);
        assert.deepEqual(actual[5], [ 0,10, 1]);
        assert.deepEqual(actual[6], [ 0, 0, 0]);

        // Should be a retract, move over, move down seq here

        // second pass down to 2
        assert.deepEqual(actual[7], [10, 5, 1.5]);
        assert.deepEqual(actual[8], [10,10, 2]);
        assert.deepEqual(actual[9],[ 5,10, 1.5]);
    });
});
