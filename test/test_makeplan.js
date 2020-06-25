// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var mp = require('../src/makeplan');

var p0 = [0, 0, -0.5];
var p1 = [2, 1, 2.2];
var p2 = [3, -1, 1.6];
var p3 = [4, 1, 2.4];
var p4 = [5, -1, 1.3];
var p5 = [6, 0, -0.5];

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

var tol = 1.e-8;

describe('intersect_line', function () {
    it('P0, P1', function() {

        let actual = mp.intersect_line(p0, p1, heights);

        assert.equal(actual.length, 4);

        assert.closeTo(actual[0][0], pa[0], tol);
        assert.closeTo(actual[0][1], pa[1], tol);
        assert.closeTo(actual[0][2], pa[2], tol);

        assert.closeTo(actual[1][0], pb[0], tol);
        assert.closeTo(actual[1][1], pb[1], tol);
        assert.closeTo(actual[1][2], pb[2], tol);

        assert.closeTo(actual[2][0], pc[0], tol);
        assert.closeTo(actual[2][1], pc[1], tol);
        assert.closeTo(actual[2][2], pc[2], tol);

        assert.isUndefined(actual[3]);
    });

    it('P1, P2', function() {

        let actual = mp.intersect_line(p1, p2, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assert.isUndefined(actual[1]);
        assert.closeTo(actual[2][0], pd[0], tol);
        assert.closeTo(actual[2][1], pd[1], tol);
        assert.closeTo(actual[2][2], pd[2], tol);
        assert.isUndefined(actual[3]);
    });

    it('P2, P3', function() {

        let actual = mp.intersect_line(p2, p3, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assert.isUndefined(actual[1]);
        assert.closeTo(actual[2][0], pe[0], tol);
        assert.closeTo(actual[2][1], pe[1], tol);
        assert.closeTo(actual[2][2], pe[2], tol);
        assert.isUndefined(actual[3]);
    });

    it('P3, P4', function() {

        let actual = mp.intersect_line(p3, p4, heights);

        assert.equal(actual.length, 4);

        assert.isUndefined(actual[0]);
        assert.isUndefined(actual[1]);
        assert.closeTo(actual[2][0], pf[0], tol);
        assert.closeTo(actual[2][1], pf[1], tol);
        assert.closeTo(actual[2][2], pf[2], tol);
        assert.isUndefined(actual[3]);
    });

    it('P4, P5', function() {

        let actual = mp.intersect_line(p4, p5, heights);

        assert.equal(actual.length, 4);

        assert.closeTo(actual[0][0], ph[0], tol);
        assert.closeTo(actual[0][1], ph[1], tol);
        assert.closeTo(actual[0][2], ph[2], tol);
        assert.closeTo(actual[1][0], pg[0], tol);
        assert.closeTo(actual[1][1], pg[1], tol);
        assert.closeTo(actual[1][2], pg[2], tol);
        assert.isUndefined(actual[2]);
        assert.isUndefined(actual[3]);
    });
});

describe('generate_heights', function () {
    it('Angled, multiple passes', function() {

        let actual = mp.generate_runs([p0,p1,p2,p3,p4,p5], heights);

        assert.equal(actual.length, 3);
        assert.equal(actual[0].length, 1);
        assert.equal(actual[0][0].length, 4);
        assert.equal(actual[0][0][0].length, 3);
        assert.equal(actual[0][0][1].length, 3);
        assert.equal(actual[0][0][2].length, 3);
        assert.equal(actual[0][0][3].length, 3);
        assert.closeTo(actual[0][0][0][0], pa[0], tol);
        assert.closeTo(actual[0][0][0][1], pa[1], tol);
        assert.closeTo(actual[0][0][0][2], pa[2], tol);
        assert.closeTo(actual[0][0][1][0], pb[0], tol);
        assert.closeTo(actual[0][0][1][1], pb[1], tol);
        assert.closeTo(actual[0][0][1][2], pb[2], tol);
        assert.closeTo(actual[0][0][2][0], pg[0], tol);
        assert.closeTo(actual[0][0][2][1], pg[1], tol);
        assert.closeTo(actual[0][0][2][2], pg[2], tol);
        assert.closeTo(actual[0][0][3][0], ph[0], tol);
        assert.closeTo(actual[0][0][3][1], ph[1], tol);
        assert.closeTo(actual[0][0][3][2], ph[2], tol);

        assert.equal(actual[1].length, 1);
        assert.equal(actual[1][0].length, 8);
        assert.closeTo(actual[1][0][0][0], pb[0], tol);
        assert.closeTo(actual[1][0][0][1], pb[1], tol);
        assert.closeTo(actual[1][0][0][2], pb[2], tol);
        assert.closeTo(actual[1][0][1][0], pc[0], tol);
        assert.closeTo(actual[1][0][1][1], pc[1], tol);
        assert.closeTo(actual[1][0][1][2], pc[2], tol);
        assert.closeTo(actual[1][0][2][0], pd[0], tol);
        assert.closeTo(actual[1][0][2][1], pd[1], tol);
        assert.closeTo(actual[1][0][2][2], pd[2], tol);
        assert.closeTo(actual[1][0][3][0], p2[0], tol);
        assert.closeTo(actual[1][0][3][1], p2[1], tol);
        assert.closeTo(actual[1][0][3][2], p2[2], tol);
        assert.closeTo(actual[1][0][4][0], pe[0], tol);
        assert.closeTo(actual[1][0][4][1], pe[1], tol);
        assert.closeTo(actual[1][0][4][2], pe[2], tol);
        assert.closeTo(actual[1][0][5][0], pf[0], tol);
        assert.closeTo(actual[1][0][5][1], pf[1], tol);
        assert.closeTo(actual[1][0][5][2], pf[2], tol);
        assert.closeTo(actual[1][0][6][0], p4[0], tol);
        assert.closeTo(actual[1][0][6][1], p4[1], tol);
        assert.closeTo(actual[1][0][6][2], p4[2], tol);
        assert.closeTo(actual[1][0][7][0], pg[0], tol);
        assert.closeTo(actual[1][0][7][1], pg[1], tol);
        assert.closeTo(actual[1][0][7][2], pg[2], tol);

        assert.equal(actual[2].length, 2);
        assert.equal(actual[2][0].length, 3);
        assert.closeTo(actual[2][0][0][0], pc[0], tol);
        assert.closeTo(actual[2][0][0][1], pc[1], tol);
        assert.closeTo(actual[2][0][0][2], pc[2], tol);
        assert.closeTo(actual[2][0][1][0], p1[0], tol);
        assert.closeTo(actual[2][0][1][1], p1[1], tol);
        assert.closeTo(actual[2][0][1][2], p1[2], tol);
        assert.closeTo(actual[2][0][2][0], pd[0], tol);
        assert.closeTo(actual[2][0][2][1], pd[1], tol);
        assert.closeTo(actual[2][0][2][2], pd[2], tol);
        assert.equal(actual[2][1].length, 3);
        assert.closeTo(actual[2][1][0][0], pe[0], tol);
        assert.closeTo(actual[2][1][0][1], pe[1], tol);
        assert.closeTo(actual[2][1][0][2], pe[2], tol);
        assert.closeTo(actual[2][1][1][0], p3[0], tol);
        assert.closeTo(actual[2][1][1][1], p3[1], tol);
        assert.closeTo(actual[2][1][1][2], p3[2], tol);
        assert.closeTo(actual[2][1][2][0], pf[0], tol);
        assert.closeTo(actual[2][1][2][1], pf[1], tol);
        assert.closeTo(actual[2][1][2][2], pf[2], tol);

    });
});
