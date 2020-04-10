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

// (T1  D=3.15 CR=0 - ZMIN=-3 - flat end mill)
// G90 G94                Absolute coordinates ; Feedrate per minute
// G17                    XY plane
// G21                    Units millimeters
// G28 G91 Z0             Home ; Incremental coordinates ; 
// G90                    Absolute coordinates
//
// (2D Pocket Hex 1)
// T1 M6                  Tool 1 ; Automatic tool change
// S5000 M3               Spindle 5000 ; Spindle on
// G54                    Work coordinate system
// G0 X39.263 Y29.976     Rapid positioning
// Z15
// Z5
// G1 Z2.815 F1000

class GCodeGenerator {
    constructor(filename, scale, angle) {
        this.filename = filename;
        this.scale = scale;
        this.retractZ = 10;
        this.transform = [1, 0, 0, 1, 0, 0];
        this.savedTransformStack = [];

        this.toolDiameter = 3.15
        this.toolAngle = angle;
        this.feedRate = 1000;
        this.spindleRate = 5000;

        fs.writeFile(this.filename,
                     '(Kaleidocarve GCode)\n',
                     handleErr);

        // Tool description
        fs.appendFileSync(this.filename,
                          '(T1 D=' + fmt(this.toolDiameter) + ' V-Mill)\n',
                          handleErr);

        // Absolute coordinates ; Feedrate per minute
        fs.appendFileSync(this.filename,
                          'G90 G94\n',
                          handleErr);

        // XY plane
        fs.appendFileSync(this.filename,
                          'G17\n',
                          handleErr);

        // Units millimeters
        fs.appendFileSync(this.filename,
                          'G21\n',
                          handleErr);

        // Spindle on
        fs.appendFileSync(this.filename,
                          'S' + this.spindleRate + ' M3\n',
                          handleErr);
    }

    comment(str) {
        fs.appendFileSync(this.filename,
                          '(' + str + ')\n',
                          handleErr);
    }

    // move head above [x, y]
    moveAbove(x, y) {
        const [gx, gy] = xfm(x, y, this);
        fs.appendFileSync(this.filename,
                          'G00 X' + fmt(gx) + ' Y' + fmt(gy) + '\n',
                          handleErr);
    }

    // drop head until cut width = r
    dropTo(r) {
        const gz = computeZ(r, this);
        fs.appendFileSync(this.filename,
                          'Z' + fmt(gz) + '\n',
                          handleErr);
    }

    // raise cutter
    retract() {
        const gz = fmt(this.retractZ);
        fs.appendFileSync(this.filename,
                          'Z' + gz + '\n',
                          handleErr);
    }

    // cut from current location to [x, y] adjusting depth until width = r
    moveTo(x, y, r) {
        const [gx, gy] = xfm(x, y, this);
        const gz = computeZ(r, this);
        fs.appendFileSync(this.filename,
                          'G01 X' + fmt(gx) +  ' Y' + fmt(gy) + ' Z' + fmt(gz) + '\n',
                          handleErr);
    }

    // generate full circle with center at current location + [r, 0]
    xcircle(r) {
        // current point is on circle
        // [I, J] is vector to center
        const [gi, gj] = xfm(r, 0, this);
        fs.appendFileSync(this.filename,
                          'G02 I' + fmt(gi) + ' J' + fmt(gj) + '\n',
                          handleErr);
    }

    saveTransform() {
        this.savedTransformStack.push(this.transform);
    }

    restoreTransform() {
        this.transform = this.savedTransformStack[this.savedTransformStack.length-1];
        this.savedTransformStack.pop();
    }

    setTransform(a,b,c,d,e,f) {
        this.transform = [a, b, c, d, e, f];
    }

}

module.exports = { GCodeGenerator };
