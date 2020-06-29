// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var mp = require('../src/makeplan');

var p0 = [ 0, 0, -0.5];
var p1 = [ 2, 1, 2.2];
var p2 = [ 3, -1, 1.6];
var p3 = [ 4, 1, 2.4];
var p4 = [ 5, -1, 1.3];
var p5 = [ 6, 0, -0.5];

var p6 = [ 7, 0, 0.7];
var p7 = [ 8, 1, 0.3];
var p8 = [ 9,-1, 1.8];
var p9 = [10, 1, 1.2];
var p10= [11,-1, 0.2];

var heights = [0., 1., 2., 3.];


// -.5 / 2.7
// t = 0.185185185
var pa = [0.370370370, 0.185185185, 0];
// -1.5 / 2.7
// t = 0.555555555
var pb = [1.111111111, 0.555555555, 1];
// -2.5 / 2.7
// t = 0.925925925
var pc = [1.851851851, 0.925925925, 2];
// .2 / .6
// t = 0.333333333
var pd = [2.333333333, 0.333333333, 2];
// .4 / .8
// t = 0.5
var pe = [3.5, 0, 2];
// .4 / 1.1
// t = 0.36363636
var pf = [4.36363636, 0.27272727, 2];
// .3 / 1.8
// t = 0.166666667
var pg = [5.166666667,-0.833333333, 1];
// 1.3 / 1.8
// t = 0.722222222
var ph = [5.72222222,-0.277777778, 0];

// (1 - .3) / (1.8 - .3)
// t = 0.466666667
var pi = [8.466666667, 0.066666667, 1];
// (1 - 1.2) / (.2 - 1.2)
// t = .2
var pj = [10.2, .6, 1];


var tol = 1.e-8;

function assertPointCloseTo(act, exp, tol, msg_in) {
    let msg = msg_in ? (msg_in + " | ") : "";
    assert.closeTo(act[0], exp[0], tol, msg + "X");
    assert.closeTo(act[1], exp[1], tol, msg + "Y");
    assert.closeTo(act[2], exp[2], tol, msg + "Z");
}

describe('intersect_line', function () {
    it('P0, P1', function() {

        let actual = mp.intersect_line(p0, p1, heights);

        assert.equal(actual.length, 4);

        assertPointCloseTo(actual[0], pa, tol);
        assertPointCloseTo(actual[1], pb, tol);
        assertPointCloseTo(actual[2], pc, tol);
        assert.isUndefined(actual[3]);
    });

    it('P1, P2', function() {

        let actual = mp.intersect_line(p1, p2, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assert.isUndefined(actual[1]);
        assertPointCloseTo(actual[2], pd, tol);
        assert.isUndefined(actual[3]);
    });

    it('P2, P3', function() {

        let actual = mp.intersect_line(p2, p3, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assert.isUndefined(actual[1]);
        assertPointCloseTo(actual[2], pe, tol);
        assert.isUndefined(actual[3]);
    });

    it('P3, P4', function() {

        let actual = mp.intersect_line(p3, p4, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assert.isUndefined(actual[1]);
        assertPointCloseTo(actual[2], pf, tol);
        assert.isUndefined(actual[3]);
    });

    it('P4, P5', function() {

        let actual = mp.intersect_line(p4, p5, heights);

        assert.equal(actual.length, 4);

        assertPointCloseTo(actual[0], ph, tol);
        assertPointCloseTo(actual[1], pg, tol);
        assert.isUndefined(actual[2]);
        assert.isUndefined(actual[3]);
    });


    it('P7, P8', function() {

        let actual = mp.intersect_line(p7, p8, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assertPointCloseTo(actual[1], pi, tol);
        assert.isUndefined(actual[2]);
        assert.isUndefined(actual[3]);
    });

    it('P9, P10', function() {

        let actual = mp.intersect_line(p9, p10, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assertPointCloseTo(actual[1], pj, tol);
        assert.isUndefined(actual[2]);
        assert.isUndefined(actual[3]);
    });
});

describe('generate_heights', function () {

    // first example from README
    it('1 - forward', function() {

        let actual = mp.generate_runs([p0,p1,p2,p3,p4,p5], heights);

        assert.equal(actual.length, 3);
        assert.equal(actual[0].length, 1);
        assert.equal(actual[0][0].length, 4);

        assert.equal(actual[0][0][0].length, 3);
        assert.equal(actual[0][0][1].length, 3);
        assert.equal(actual[0][0][2].length, 3);
        assert.equal(actual[0][0][3].length, 3);
        assertPointCloseTo(actual[0][0][0], pa, tol, "Pa");
        assertPointCloseTo(actual[0][0][1], pb, tol, "Pb");
        assertPointCloseTo(actual[0][0][2], pg, tol, "Pg");
        assertPointCloseTo(actual[0][0][3], ph, tol, "Ph");

        assert.equal(actual[1].length, 1);
        assert.equal(actual[1][0].length, 8);
        assertPointCloseTo(actual[1][0][0], pb, tol, "Pb");
        assertPointCloseTo(actual[1][0][1], pc, tol, "Pc");
        assertPointCloseTo(actual[1][0][2], pd, tol, "Pd");
        assertPointCloseTo(actual[1][0][3], p2, tol, "P2");
        assertPointCloseTo(actual[1][0][4], pe, tol, "Pe");
        assertPointCloseTo(actual[1][0][5], pf, tol, "Pf");
        assertPointCloseTo(actual[1][0][6], p4, tol, "P4");
        assertPointCloseTo(actual[1][0][7], pg, tol, "Pg");

        assert.equal(actual[2].length, 2);
        assert.equal(actual[2][0].length, 3);
        assertPointCloseTo(actual[2][0][0], pc, tol, "Pc");
        assertPointCloseTo(actual[2][0][1], p1, tol, "P1");
        assertPointCloseTo(actual[2][0][2], pd, tol, "Pd");

        assert.equal(actual[2][1].length, 3);
        assertPointCloseTo(actual[2][1][0], pe, tol, "Pe");
        assertPointCloseTo(actual[2][1][1], p3, tol, "P3");
        assertPointCloseTo(actual[2][1][2], pf, tol, "Pf");

    });

    // first case reversed
    it('1 - backward', function() {

        let actual = mp.generate_runs([p5,p4,p3,p2,p1,p0], heights);

        assert.equal(actual.length, 3);
        assert.equal(actual[0].length, 1);
        assert.equal(actual[0][0].length, 4);
        assertPointCloseTo(actual[0][0][0], ph, tol, "Ph");
        assertPointCloseTo(actual[0][0][1], pg, tol, "Pg");
        assertPointCloseTo(actual[0][0][2], pb, tol, "Pg");
        assertPointCloseTo(actual[0][0][3], pa, tol, "Pa");

        assert.equal(actual[1].length, 1);
        assert.equal(actual[1][0].length, 8);
        assertPointCloseTo(actual[1][0][0], pg, tol, "Pg");
        assertPointCloseTo(actual[1][0][1], p4, tol, "P4");
        assertPointCloseTo(actual[1][0][2], pf, tol, "Pf");
        assertPointCloseTo(actual[1][0][3], pe, tol, "Pe");
        assertPointCloseTo(actual[1][0][4], p2, tol, "P2");
        assertPointCloseTo(actual[1][0][5], pd, tol, "Pd");
        assertPointCloseTo(actual[1][0][6], pc, tol, "Pc");
        assertPointCloseTo(actual[1][0][7], pb, tol, "Pb");

        assert.equal(actual[2].length, 2);
        assert.equal(actual[2][0].length, 3);
        assertPointCloseTo(actual[2][0][0], pf, tol, "Pf");
        assertPointCloseTo(actual[2][0][1], p3, tol, "P3");
        assertPointCloseTo(actual[2][0][2], pe, tol, "Pe");

        assert.equal(actual[2][1].length, 3);
        assertPointCloseTo(actual[2][1][0], pd, tol, "Pd");
        assertPointCloseTo(actual[2][1][1], p1, tol, "P1");
        assertPointCloseTo(actual[2][1][2], pc, tol, "Pc");

    });

    // second example from README
    it('2 - forward', function() {

        let actual = mp.generate_runs([p6,p7,p8,p9,p10], heights);
        assert.equal(actual.length, 2);
        assert.equal(actual[0].length, 1);
        assert.equal(actual[0][0].length, 5);
        assertPointCloseTo(actual[0][0][0], p6, tol, "P6");
        assertPointCloseTo(actual[0][0][1], p7, tol, "P7");
        assertPointCloseTo(actual[0][0][2], pi, tol, "Pi");
        assertPointCloseTo(actual[0][0][3], pj, tol, "Pj");
        assertPointCloseTo(actual[0][0][4], p10, tol, "P10");

        assert.equal(actual[1].length, 1);
        assert.equal(actual[1][0].length, 4);
        assertPointCloseTo(actual[1][0][0], pi, tol, "Pi");
        assertPointCloseTo(actual[1][0][1], p8, tol, "P8");
        assertPointCloseTo(actual[1][0][2], p9, tol, "P9");
        assertPointCloseTo(actual[1][0][3], pj, tol, "Pj");
    });

    // second case reversed
    it('2 - backward', function() {

        let actual = mp.generate_runs([p10,p9,p8,p7,p6], heights);
        assert.equal(actual.length, 2);
        assert.equal(actual[0].length, 1);
        assert.equal(actual[0][0].length, 5);
        assertPointCloseTo(actual[0][0][0], p10, tol, "P10");
        assertPointCloseTo(actual[0][0][1], pj, tol, "Pj");
        assertPointCloseTo(actual[0][0][2], pi, tol, "Pi");
        assertPointCloseTo(actual[0][0][3], p7, tol, "P7");
        assertPointCloseTo(actual[0][0][4], p6, tol, "P6");

        assert.equal(actual[1].length, 1);
        assert.equal(actual[1][0].length, 4);
        assertPointCloseTo(actual[1][0][0], pj, tol, "Pj");
        assertPointCloseTo(actual[1][0][1], p9, tol, "P9");
        assertPointCloseTo(actual[1][0][2], p8, tol, "P8");
        assertPointCloseTo(actual[1][0][3], pi, tol, "Pi");
    });
});
