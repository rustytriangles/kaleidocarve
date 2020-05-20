// Kaleidocurves © 2020 RustyTriangles LLC
var curves = require('../src/curves');

var trns = require('../src/transformation');

class Scene {
    constructor(numCopies) {
        this.numCopies = numCopies;
        this.reflection = false;
        this.curves = [];
    }

    addCurve(curve) {
        this.curves[this.curves.length] = curve;
    }

    getNumCurves() {
        return this.curves.length;
    }

    // returns true if x,y would pick curve[index]
    hittest(x, y, index) {
        const transform = undefined;
        if (index >= 0 && index < this.curves.length) {
            return this.curves[index].hittest(x,y, transform);
        }
        return false;
    }

    // returns true if x,y would hit r = [curve, cpt_index]
    hittestControlPoints(x, y, r) {
        const transform = undefined;
        const index = r[0];
        if (index >= 0 && index < this.curves.length) {
            const e = this.curves[index].hittestControlPoints(x,y, transform);
            if (e && r[0] == e[1]) {
                return true;
            }
        }
        return false;
    }

    pick(x,y) {
        const t = new trns.Transformation(this.numCopies, this.reflection);

        for (let i = 0; i < this.curves.length; i++) {
            if (this.curves[i].hittest(x,y, t)) {
                return i;
            }
        }
        return undefined;
    }

    pickControlPoint(x,y) {
        const t = new trns.Transformation(this.numCopies, this.reflection);

        for (let i = 0; i < this.curves.length; i++) {
            const r = this.curves[i].hittestControlPoints(x,y, t);
            if (r) {
                return [i, r];
            }
        }
        return undefined;
    }

    setNumCopies(numCopies) {
        this.numCopies = numCopies;
    }

    getNumCopies() {
        return this.numCopies;
    }

    setReflection(newValue) {
        this.reflection = newValue;
    }

    getReflection() {
        return this.reflection;
    }

    clear() {
        this.curves = [];
    }

    display(ctx, width, height) {
        const scale = Math.max(width, height) / 2;

        const t = new trns.Transformation(this.numCopies, this.reflection);

        ctx.save();
        let step = 2.0 * Math.PI / this.numCopies;
        for (let i = 0; i < this.curves.length; i++) {
            const c = this.curves[i];

            if (c.isSymmetric()) {
                ctx.setTransform(1, 0, 0, 1, width / 2, height / 2);
                c.display(ctx, scale);
            } else {
                const it = t.makeIterator();
                let result = it.next();
                while (!result.done) {
                    ctx.setTransform(result.value[0], result.value[1],
                                     result.value[2], result.value[3],
                                     width / 2,
                                     height / 2);
                    c.display(ctx, scale);

                    result = it.next();
                }
            }

        }
        ctx.restore();
    }

    highlight(ctx, selection, width, height) {
        let curveIndex = -1;
        let controlPointIndex = undefined;
        if (typeof selection == 'object' && selection.length == 2) {
            curveIndex = selection[0];
            controlPointIndex = selection[1];
        } else if (typeof selection == 'number') {
            curveIndex = selection;
        }

        if (curveIndex >= 0 && curveIndex < this.curves.length) {

            const c = this.curves[curveIndex];
            const t = new trns.Transformation(this.numCopies, this.reflection);

            ctx.save();
            const scale = Math.max(width, height) / 2;
            let step = 2.0 * Math.PI / this.numCopies;

            if (c.isSymmetric()) {
                ctx.setTransform(1, 0, 0, 1, width / 2, height / 2);
                c.highlight(ctx, scale);
            } else {
                const it = t.makeIterator();
                let result = it.next();
                while (!result.done) {
                    ctx.setTransform(result.value[0], result.value[1],
                                     result.value[2], result.value[3],
                                     width / 2,
                                     height / 2);
                    c.highlight(ctx, scale, controlPointIndex);

                    result = it.next();
                }
            }

            ctx.restore();
        }
    }


    generate(ctx) {
        const t = new trns.Transformation(this.numCopies, this.reflection);

        ctx.saveTransform();
        let step = 2.0 * Math.PI / this.numCopies;
        for (let i = 0; i < this.curves.length; i++) {
            ctx.comment('Curve ' + i);
            const c = this.curves[i];

            if (c.isSymmetric()) {
                c.generate(ctx);
            } else {
                const it = t.makeIterator();
                let result = it.next();
                while (!result.done) {
                    ctx.setTransform(result.value[0], result.value[1],
                                     result.value[2], result.value[3],
                                     0, 0);
                    c.generate(ctx);

                    result = it.next();
                }
            }

        }
        ctx.restoreTransform();
    }

    load(data) {
        this.numCopies = data.numCopies;
        this.reflection = data.reflection;
        this.clear();
        for (let c in data.curves) {
            this.addCurve(curves.loadCurve(data.curves[c]));
        }
    }
}

module.exports = { Scene };
