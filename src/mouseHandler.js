// Kaleidocurves © 2020 RustyTriangles LLC
var curves = require('../src/curves');
var util = require('../src/util');

class MouseHandler {
    constructor(scene, selectionHandler, requestFrame) {
        this.x = [];
        this.y = [];
        this.collecting = false;
        this.mode = "draw_curve";
        this.scene = scene;
        this.selectionHandler = selectionHandler;
        this.requestFrame = requestFrame;
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

    mouseDownCallback(evt) {
        const pt = util.toNDC(canvas, evt.clientX, evt.clientY);

        if (this.getMode() == "select_object") {

            let done = false;
            let changed = false;

            // First, check if we've picked the current
            let i = this.selectionHandler.getSelection();
            if (typeof i == 'number') {
                if (i >= 0 && i < this.scene.getNumCurves()) {
                    if (this.scene.hittest(pt[0], pt[1], i)) {
                        done = true;
                    }
                }
            }

            if (!done) {
                const i = this.scene.pick(pt[0],pt[1]);
                if (typeof i == 'number') {
                    this.selectionHandler.replace(i);
                    changed = true;
                } else {
                    const prev = this.selectionHandler.getSelection();
                    if (typeof prev == 'number') {
                        this.selectionHandler.clear();
                        changed = true;
                    }
                }
            }

            if (changed) {
                this.requestFrame();
            }

        } else if (this.getMode() == "select_controlPoint") {

            let done = false;
            let changed = false;

            // First, check if we've picked the current
            let r = this.selectionHandler.getSelection();
            if (r && r.length == 2) {
                const i = r[0];
                if (i >= 0 && i < this.scene.getNumCurves()) {
                    const c = r[1];
                    if (this.scene.hittestControlPoints(pt[0], pt[1], r)) {
                        done = true;
                    }
                }
            }
            if (!done) {
                const r = this.scene.pickControlPoint(pt[0],pt[1]);
                if (r && r.length == 2) {
                    this.selectionHandler.replace(r);
                    changed = true;
                } else {
                    const prev = this.selectionHandler.getSelection();
                    if (r && r.length == 2) {
                        this.selectionHandler.clear();
                        changed = true;
                    }
                }
            }

            if (changed) {
                this.requestFrame();
            }

        } else {
            this.start(pt[0], pt[1]);
        }
    }

    mouseUpCallback(evt, strokeColor) {
        this.stop();
        if (this.valid()) {
            if (this.getMode() == "draw_curve") {

                const c = this.createCurve(strokeColor);

                this.scene.addCurve(c);

                this.requestFrame();

            } else if (this.getMode() == "draw_circle") {
                const c = this.createCircle(canvas.width, canvas.height, strokeColor);

                this.scene.addCurve(c);

                this.requestFrame();
            }

            this.clear();
        }
    }

    mouseMoveCallback(evt) {
        const pt = util.toNDC(canvas, evt.clientX, evt.clientY);
        this.addPoint(pt[0], pt[1]);
    }

    mouseLeaveCallback(evt) {
        this.stop();
        this.clear();
        this.requestFrame();
    }
}

module.exports = { MouseHandler };
