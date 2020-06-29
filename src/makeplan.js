// Kaleidocurves © 2020 RustyTriangles LLC

var u = require('../src/util');

function log_result(result) {
    let mask = "";
    if (result) {
        for (let i=0; i<result.length; i++) {
            if (result[i]) {
                mask = mask + " " + result[i].length;
            } else {
                mask = mask + " null";
            }
        }
    } else {
        mask = "null";
    }
    console.log("result = " + mask);
}

function generate_runs(pts, heights) {
    let result = [];

    let run = [];
    for (let j=0; j<heights.length-1; j++) {
        run[j] = undefined;
    }
    log_result(result);

    for (let i=1; i<pts.length; i++) {
        console.log("process line from pts[" + (i-1) + "] to pts[" + i + "]");

        // intersect line from i-1 to i against all heights
        let li = intersect_line(pts[i-1], pts[i], heights);

        let intersects = [];
        for (let j=0; j<heights.length; j++) {
            intersects[j] = (li[j] != null) ? " 1 " : " 0 ";
        }
        console.log("intersects = " + intersects);

        // loop over heights
        for (let j=0; j<heights.length-1; j++) {
            console.log("process height " + j);

            // if we're starting in a band, we need to save the start point
            if (i == 1 && pts[i-1][2] > heights[j] && pts[i-1][2] <= heights[j+1]) {
                if (run[j]) {
                    // can this happen?
                    run[j].push(pts[i-1]);
                } else {
                    console.log("start run[" + j + "] with pts[" + (i-1) + "]");
                    run[j] = [pts[i-1]];
                }
            }

            // if line doesn't intersect heights[i], then ...
            if (li[j] == null) {
                console.log("li[" + j + "] = null");
                // if we're in a run, and end point is between heights, add the end point
                if (run[j] && pts[i][2] > heights[j] && pts[i][2] <= heights[j+1]) {
//                    console.log("if");
                    if (li[j+1] != null) {
                        console.log("run[" + j + "] - push li[" + (j+1) + "] A");
                        run[j].push(li[j+1]);
                    }
                    console.log("run[" + j + "] - push pts[" + i + "] B");
                    run[j].push(pts[i]);
                }
                else if (li[j+1] != null) {
//                    console.log("else if");
                    console.log("run[" + j + "] - push li[" + (j+1) + "] C");
                    console.log("run[" + j + "] = " + run[j]);
                    console.log("li[" + (j+1) + "] = " + li[j+1]);
                    if (run[j]) {
                        run[j].push(li[j+1]);
                    } else {
                        run[j] = [li[j+1]];
                    }
                }
                // otherwise do nothing
                else {
//                    console.log("else");
                }
            }
            // if line does intersect heights[i], then ...
            else {
                console.log("li[" + j + "] = " + li[j]);
                // if we're in a run, then ...
                if (run[j]) {
                    // push the intersection point
                    if (li[j+1] != null) {
                        console.log("run[" + j + "] - push li[" + (j+1) + "] D");
                        run[j].push(li[j+1]);
                    }
                    console.log("run[" + j + "] - push li[" + j + "] E");
                    run[j].push(li[j]);

                    // move the run onto the results
                    console.log("run[" + j + "] - move to results");
                    if (result[j]) {
                        console.log("result[" + j + "] = " + result[j]);
                        result[j].push(run[j]);
                    } else {
                        result[j] = [run[j]];
                    }

                    console.log("clear run[j]");
                    run[j] = undefined;
                }
                // otherwise, start a run with the intersection point
                else {
                    console.log("run[" + j + "] - start with li[" + j + "] F");
                    run[j] = [li[j]];
                    // if we're in a run, and end point is between heights, add the end point
                    if (run[j] && pts[i][2] > heights[j] && pts[i][2] <= heights[j+1]) {
                        console.log("run[" + j + "] - push pts[" + i + "] G");
                        run[j].push(pts[i]);
                    }
                    else if (li[j+1] != null) {
                        console.log("run[" + j + "] - push li[" + (j+1) + "] H");
                        run[j].push(li[j+1]);
                    }
                }
            }
            console.log("go around again");
//            log_result(result);
        }
    }

    for (let j=0; j<heights.length-1; j++) {
        if (run[j]) {
            console.log("leftover run[" + j + "]");
            if (result[j]) {
                result[j].push(run[j]);
            } else {
                result[j] = [run[j]];
            }
            run[j] = undefined;
        }
    }

    console.log("all done");
    log_result(result);
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
