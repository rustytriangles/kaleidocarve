// Kaleidocurves © 2020 RustyTriangles LLC
var curves = require('../src/curves');
var util = require('../src/util');

class MouseHandler {
    constructor() {
        this.x = [];
        this.y = [];
        this.collecting = false;
        this.mode = "draw_curve";
    }

    setMode(newMode) {
        this.mode = newMode;
    }

    getMode() {
        return this.mode;
    }

    start() {
        this.collecting = true;
    }

    stop() {
        this.collecting = false;
    }

    addPoint(x, y) {
        if (this.collecting) {
            this.x[this.x.length] = x;
            this.y[this.y.length] = y;
        }
    }

    valid() {
        return this.x.length > 1 && this.y.length > 1;
    }

    createCurve(color) {
        if (this.x.length >= 4 && this.y.length >= 4) {
            let d = [];
            d[0] = 0;
            for (let i = 1; i < this.x.length; i++) {
                d[i] = d[i - 1] + util.dist(this.x[i - 1], this.y[i - 1], this.x[i], this.y[i]);
            }

            const x0 = this.x[0];
            const y0 = this.y[0];

            const x3 = this.x[this.x.length - 1];
            const y3 = this.y[this.y.length - 1];

            const da = d[d.length - 1] / 3;
            let xa = x0;
            let ya = y0;
            const db = 2 * d[d.length - 1] / 3;
            let xb = x0;
            let yb = y0;

            for (let i = 0; i < this.x.length; i++) {
                if (d[i] <= da) {
                    xa = this.x[i];
                    ya = this.y[i];
                }
                if (d[i] <= db) {
                    xb = this.x[i];
                    yb = this.y[i];
                }
            }

            const xq = 27 * xa - 8 * x0 - x3;
            const yq = 27 * ya - 8 * y0 - y3;
            const xr = 27 * xb - x0 - 8 * x3;
            const yr = 27 * yb - y0 - 8 * y3;

            const x1 = (2 * xq - xr) / 18;
            const y1 = (2 * yq - yr) / 18;
            const x2 = (2 * xr - xq) / 18;
            const y2 = (2 * yr - yq) / 18;

            const r0 = 0;
            const r1 = 2;
            const r2 = 4;
            const r3 = 2;
            return new curves.CubicCurve(x0, y0, r0,
                x1, y1, r1,
                x2, y2, r2,
                x3, y3, r3,
                color);

        } else {

            const x0 = this.x[0];
            const y0 = this.y[0];

            const x1 = this.x[this.x.length - 1];
            const y1 = this.y[this.y.length - 1];

            const r0 = 0;
            const r1 = 2;
            return new curves.LinearCurve(x0, y0, r0, x1, y1, r1, color);
        }
    }

    createCircle(width, height, color) {
        if (this.x.length >= 1 && this.y.length >= 1) {
            const x = this.x[this.x.length - 1];
            const y = this.y[this.y.length - 1];
            const r = util.dist(0, 0, x, y);
            return new curves.Circle(0, 0, r, 4, color);
        }
    }

    display(ctx, width, height) {
        if (this.mode == 'draw_curve') {
            if (this.x.length > 1) {
                ctx.beginPath();
                var scale = Math.max(width, height) / 2;
                var pt = util.toDC(this.x[0], this.y[0], scale, width, height);
                ctx.moveTo(pt[0], pt[1]);
                for (let i = 1; i < this.x.length; i++) {
                    pt = util.toDC(this.x[i], this.y[i], scale, width, height);
                    ctx.lineTo(pt[0], pt[1]);
                }
                ctx.stroke();
            }
        } else if (this.mode == 'draw_circle') {
	    if (this.x.length >= 1) {
		let x = this.x[this.x.length - 1];
		let y = this.y[this.y.length - 1];
		let r = dist(0, 0, x, y);
                var scale = Math.max(width, height) / 2;
		ctx.beginPath();
		ctx.arc(width/2,height/2,r * scale,0,2*Math.PI);
		ctx.stroke();
	    }
        }
    }

    clear() {
        this.x = [];
        this.y = [];
    }
}

module.exports = { MouseHandler };
