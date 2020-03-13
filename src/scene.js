// Kaleidocurves © 2020 RustyTriangles LLC

class Scene {
    constructor(numCopies) {
        this.numCopies = numCopies;
        this.curves = [];
    }

    addCurve(curve) {
        this.curves[this.curves.length] = curve;
    }

    setNumCopies(numCopies) {
        this.numCopies = numCopies;
    }

    clear() {
        this.curves = [];
    }

    display(ctx, width, height) {
        let step = 2.0 * Math.PI / this.numCopies;
        for (let i = 0; i < this.curves.length; i++) {
            ctx.save();
            for (let j = 0; j < this.numCopies; j++) {
                let c = Math.cos(step);
                let s = Math.sin(step);
                ctx.translate(width / 2, height / 2);
                ctx.transform(c, s, -s, c, 0, 0);
                ctx.translate(-width / 2, -height / 2);
                this.curves[i].display(ctx);
            }
            ctx.restore();
        }
    }
}