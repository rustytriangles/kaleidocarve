// Kaleidocurves © 2020 RustyTriangles LLC

var util = require('../src/util');
var fs = require('fs');

function fmt(n) {
    return n.toPrecision(5);
}

function computeZ(radius, gen) {
    const r = Math.max(0,Math.min(radius, gen.toolDiameter/2));
    const beta = Math.PI * (90 - gen.toolAngle/2) / 180;
    const z = -r * Math.tan(beta);
    return z;
}

// apply transform
function xfm(xin, yin, gen) {
    const xout = xin * gen.transform[0] + yin * gen.transform[2] + gen.transform[4];
    const yout = xin * gen.transform[1] + yin * gen.transform[3] + gen.transform[5];

    return [xout * gen.scale, yout * gen.scale];
}

// fs error handler
function handleErr(err) {
    if (err) {
        throw err;
    }
}

class GCodeGenerator {
    constructor(scale, angle) {
        this.scale = scale;
        this.retractZ = 10;
        this.transform = [1, 0, 0, 1, 0, 0];
        this.savedTransformStack = [];

        this.toolDiameter = 3.15
        this.toolAngle = angle;
        this.feedRate = 1000;
        this.spindleRate = 5000;

        this.output = [];
        this.output.push('(Kaleidocarve GCode)');

        // Tool description
        this.output.push('(T1 D=' + fmt(this.toolDiameter) + ' V-Mill)');

        // Absolute coordinates ; Feedrate per minute
        this.output.push('G90 G94');

        // XY plane
        this.output.push('G17');

        // Units millimeters
        this.output.push('G21');

        // Spindle on
        this.output.push('S' + this.spindleRate + ' M3');
    }

    // save the buffered output to a file
    save(filename) {
        let writer = fs.createWriteStream(filename,
                                          {flags: 'w'}).on('error', handleErr);
        for (let i = 0; i < this.output.length; i++) {
            writer.write(this.output[i] + '\n')
        }
    }

    // clear the buffered output
    clear() {
        this.output = [];
    }

    // add a comment
    comment(str) {
        this.output.push('(' + str + ')');
    }

    // move head above [x, y]
    moveAbove(x, y) {
        const [gx, gy] = xfm(x, y, this);
        this.output.push('G00 X' + fmt(gx) + ' Y' + fmt(gy));
    }

    // drop head until cut width = r
    dropTo(r) {
        const gz = computeZ(r, this);
        this.output.push('Z' + fmt(gz));
    }

    // raise cutter
    retract() {
        const gz = fmt(this.retractZ);
        this.output.push('Z' + gz);
    }

    // cut from current location to [x, y] adjusting depth until width = r
    moveTo(x, y, r) {
        const [gx, gy] = xfm(x, y, this);
        const gz = computeZ(r, this);
        this.output.push('G01 X' + fmt(gx) +  ' Y' + fmt(gy) + ' Z' + fmt(gz));
    }

    // generate full circle with center at current location + [r, 0]
    xcircle(r) {
        // current point is on circle
        // [I, J] is vector to center
        const [gi, gj] = xfm(r, 0, this);
        this.output.push('G02 I' + fmt(gi) + ' J' + fmt(gj));
    }

    // push the current transform on a stack
    saveTransform() {
        this.savedTransformStack.push(this.transform);
    }

    // revert the current transform to the previous one
    restoreTransform() {
        this.transform = this.savedTransformStack[this.savedTransformStack.length-1];
        this.savedTransformStack.pop();
    }

    // set the current transform
    // xo = xi*a + yi*c + e;
    // yo = xi*b + yi*d + f;
    setTransform(a,b,c,d,e,f) {
        this.transform = [a, b, c, d, e, f];
    }

}

module.exports = { GCodeGenerator };
