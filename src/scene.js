// Kaleidocurves © 2020 RustyTriangles LLC

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

    hittest(x, y, index) {
	const transform = undefined;
        if (index >= 0 && index < this.curves.length) {
            return this.curves[index].hittest(x,y, transform);
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

    setNumCopies(numCopies) {
        this.numCopies = numCopies;
    }

    setReflection(newValue) {
        this.reflection = newValue;
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
        if (typeof selection == 'number' && selection >= 0 && selection < this.curves.length) {

            const c = this.curves[selection];
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
                    c.highlight(ctx, scale);

                    result = it.next();
                }
            }

            ctx.restore();
        }
    }
}
