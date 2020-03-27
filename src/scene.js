// Kaleidocurves © 2020 RustyTriangles LLC

class Scene {
    constructor(numCopies) {
        this.numCopies = numCopies;
        this.reflection = false;
        this.curves = [];
    }

    addCurve(curve) {
        this.curves[this.curves.length] = curve;
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
        var scale = Math.max(width, height) / 2;

        let step = 2.0 * Math.PI / this.numCopies;
        for (let i = 0; i < this.curves.length; i++) {
            ctx.save();
            ctx.translate(width / 2, height / 2);

            for (let j = 0; j < this.numCopies; j++) {
                let c = Math.cos(step);
                let s = Math.sin(step);

                ctx.rotate(step);

                this.curves[i].display(ctx, scale);
            }
            ctx.restore();

            if (this.reflection) {
                ctx.save();
                ctx.translate(width / 2, height / 2);
                ctx.scale(-1, 1);

                for (let j = 0; j < this.numCopies; j++) {
                    let c = Math.cos(step);
                    let s = Math.sin(step);

                    ctx.rotate(step);
                    this.curves[i].display(ctx, scale);
                }
                ctx.restore();
            }
        }
    }
}
