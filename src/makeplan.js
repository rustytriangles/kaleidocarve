// Kaleidocurves © 2020 RustyTriangles LLC

var u = require('../src/util');


function generate_runs(pts, heights) {
    let result = [];

    let i0 = intersect_line(pts[0], pts[1], heights);
    let i1 = intersect_line(pts[1], pts[2], heights);
    let i2 = intersect_line(pts[2], pts[3], heights);
    let i3 = intersect_line(pts[3], pts[4], heights);
    let i4 = intersect_line(pts[4], pts[5], heights);

    result[0] = [[i0[0], i0[1], i4[1], i4[0]]];
    result[1] = [[i0[1], i0[2], i1[2], pts[2], i2[2], i3[2], pts[4], i4[1]]];
    result[2] = [[i0[2], pts[1], i1[2]], [i2[2], pts[3], i3[2]]];

    return result;
}

function intersect_line(p0, p1, heights) {
    let result = [];

    for (let i=0; i<heights.length; i++) {
        let z = Number(heights[i]);
        if ( (p0[2] <= z && p1[2] > z) || (p1[2] <= z && p0[2] > z)) {
            let t = (z - p0[2]) / (p1[2] - p0[2]);
            result[i] = [u.lerp(p0[0], p1[0], t),
                         u.lerp(p0[1], p1[1], t),
                         z];
        } else {
            result[i] = undefined;
        }
    }
    return result;
}

module.exports = { generate_runs, intersect_line };
