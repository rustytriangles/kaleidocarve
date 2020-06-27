// Kaleidocurves © 2020 RustyTriangles LLC

var u = require('../src/util');


function generate_runs(pts, heights) {
    let result = [];

    let run = [];
    for (let j=0; j<heights.length-1; j++) {
        run[j] = undefined;
    }

    for (let i=1; i<pts.length; i++) {
//        console.log("process line from pts[" + (i-1) + "] to pts[" + i + "]");

        // intersect line from i-1 to i against all heights
        let li = intersect_line(pts[i-1], pts[i], heights);

        let intersects = [];
        for (let j=0; j<heights.length; j++) {
            intersects[j] = (li[j] != null) ? " 1 " : " 0 ";
        }
//        console.log("intersects = " + intersects);

        // loop over heights
        for (let j=0; j<heights.length-1; j++) {

            // if line doesn't intersect heights[i], then ...
            if (li[j] == null) {
                // if we're in a run, and end point is between heights, add the end point
                if (run[j] && pts[i][2] > heights[j] && pts[i][2] <= heights[j+1]) {
                    if (li[j+1] != null) {
//                        console.log("run[" + j + "] - push li[" + (j+1) + "] A");
                        run[j].push(li[j+1]);
                    }
//                    console.log("run[" + j + "] - push pts[" + i + "] B");
                    run[j].push(pts[i]);
                }
                else if (li[j+1] != null) {
//                    console.log("run[" + j + "] - push li[" + (j+1) + "] C");
                    run[j].push(li[j+1]);
                }
                // otherwise do nothing
                else {

                }
            }
            // if line does intersect heights[i], then ...
            else {
                // if we're in a run, then ...
                if (run[j]) {
                    // push the intersection point
                    if (li[j+1] != null) {
//                        console.log("run[" + j + "] - push li[" + (j+1) + "] D");
                        run[j].push(li[j+1]);
                    }
//                    console.log("run[" + j + "] - push li[" + j + "] E");
                    run[j].push(li[j]);

                    // move the run onto the results
//                    console.log("run[" + j + "] - move to results");
                    if (result[j]) {
                        result[j].push(run[j]);
                    } else {
                        result[j] = [run[j]];
                    }

                    run[j] = undefined;
                }
                // otherwise, start a run with the intersection point
                else {
//                    console.log("run[" + j + "] - start with li[" + j + "] F");
                    run[j] = [li[j]];
                    // if we're in a run, and end point is between heights, add the end point
                    if (run[j] && pts[i][2] > heights[j] && pts[i][2] <= heights[j+1]) {
//                        console.log("run[" + j + "] - push pts[" + i + "] G");
                        run[j].push(pts[i]);
                    }
                    else if (li[j+1] != null) {
//                        console.log("run[" + j + "] - push li[" + (j+1) + "] H");
                        run[j].push(li[j+1]);
                    }
                }
            }
        }
    }

    for (let k=0; k<result.length; k++) {
//        console.log("result[" + k + "].length = " + result[k].length);
        if (result[k]) {
            for (let l=0; l<result[k].length; l++) {
//                console.log("result[" + k + "][" + l + "].length = " + result[k][l].length);
            }
        }
    }

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
