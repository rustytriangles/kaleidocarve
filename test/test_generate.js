// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var curves = require('../src/curves');
var sc = require('../src/scene');
var mh = require('../src/mouseHandler');

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
