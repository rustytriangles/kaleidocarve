// Kaleidocurves © 2020 RustyTriangles LLC

var util = require('../src/util');

// Linear curve between 2 points
class LinearCurve {
    constructor(x1, y1, r1, x2, y2, r2, c) {
        this.type = "linear";
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.x2 = x2;
        this.y2 = y2;
        this.r2 = r2;
        this.color = c;
    }

    isSymmetric() {
        return false;
    }

    getRadius(i) {
        switch (i) {
        case 1:
            return this.r1;
        case 2:
            return this.r2;
        }
        return undefined;
    }

    setRadius(i, r) {
        switch (i) {
        case 1:
            this.r1 = r;
            break;
        case 2:
            this.r2 = r;
            break;
        }
    }

    setPoint(i, x, y) {
        switch (i) {
        case 1:
            this.x1 = x;
            this.y1 = y;
            break;
        case 2:
            this.x2 = x;
            this.y2 = y;
            break;
        }
    }

    evaluate(t) {
        return [util.lerp(this.x1, this.x2, t),
        util.lerp(this.y1, this.y2, t),
        util.lerp(this.r1, this.r2, t)];
    }

    hittest(x,y, transform) {
        // if there's a transform, recurse repeatedly
        if (transform) {
            const it = transform.makeIterator();
            let result = it.next();
            while (!result.done) {
                const p0 = util.transformPoint(this.x1,this.y1,result.value);
                const p1 = util.transformPoint(this.x2,this.y2,result.value);
                const cNew = new LinearCurve(p0[0], p0[1], this.r1,
                                             p1[0], p1[1], this.r2,
                                             this.color);
                if (cNew.hittest(x,y)) {
                    return true;
                }

                result = it.next();
            }
            return false;
        }

        return util.hitLine(x, y, this.x1, this.y1, this.x2, this.y2);
    }

    hittestControlPoints(x, y, transform) {
        const tolerance = 0.03;

        // if there's a transform, recurse repeatedly
        if (transform) {
            const it = transform.makeIterator();
            let result = it.next();
            while (!result.done) {
                const p0 = util.transformPoint(this.x1,this.y1,result.value);
                const p1 = util.transformPoint(this.x2,this.y2,result.value);
                const cNew = new LinearCurve(p0[0], p0[1], this.r1,
                                             p1[0], p1[1], this.r2,
                                             this.color);
                const r = cNew.hittestControlPoints(x,y);
                if (r) {
                    return r;
                }

                result = it.next();
            }
            return false;
        }

        if (util.dist(this.x1,this.y1,x,y) < tolerance) {
            return 1;
        }

        if (util.dist(this.x2,this.y2,x,y) < tolerance) {
            return 2;
        }

        return false;
    }

    display(ctx, scale) {
        ctx.fillStyle = this.color;
        const num_steps = util.dist(this.x1, this.y1, this.x2, this.y2) * scale / 4;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            const x = util.lerp(this.x1, this.x2, t);
            const y = util.lerp(this.y1, this.y2, t);
            const r = util.lerp(this.r1, this.r2, t);

            ctx.beginPath();
            ctx.arc(x * scale, y * scale, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    highlight(ctx, scale) {
    }

    generate(ctx, scale) {
        ctx.moveAbove(this.x1, this.y1);
        ctx.dropTo(this.r1);
        ctx.moveTo(this.x2, this.y2, this.r2);
        ctx.retract();
    }
}

// Quadratic curve with 3 control points
class QuadraticCurve {
    constructor(x1, y1, r1, x2, y2, r2, x3, y3, r3, c) {
        this.type = "quadratic";
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.x2 = x2;
        this.y2 = y2;
        this.r2 = r2;
        this.x3 = x3;
        this.y3 = y3;
        this.r3 = r3;
        this.color = c;
    }

    isSymmetric() {
        return false;
    }

    getRadius(i) {
        switch (i) {
        case 1:
            return this.r1;
        case 2:
            return this.r2;
        case 3:
            return this.r3;
        }
        return undefined;
    }

    setRadius(i, r) {
        switch (i) {
        case 1:
            this.r1 = r;
            break;
        case 2:
            this.r2 = r;
            break;
        case 3:
            this.r3 = r;
            break;
        }
    }

    setPoint(i, x, y) {
        switch (i) {
        case 1:
            this.x1 = x;
            this.y1 = y;
            break;
        case 2:
            this.x2 = x;
            this.y2 = y;
            break;
        case 3:
            this.x3 = x;
            this.y3 = y;
            break;
        }
    }

    evaluate(t) {
        const f0 = Math.pow(1 - t, 2);
        const f1 = 2 * (1 - t) * t;
        const f2 = Math.pow(t, 2);
        const x = f0 * this.x1 + f1 * this.x2 + f2 * this.x3;
        const y = f0 * this.y1 + f1 * this.y2 + f2 * this.y3;
        const r = f0 * this.r1 + f1 * this.r2 + f2 * this.r3;
        return [x, y, r];
    }

    hittest(x,y, transform) {
        // if there's a transform, recurse repeatedly
        if (transform) {
            const it = transform.makeIterator();
            let result = it.next();
            while (!result.done) {
                const p0 = util.transformPoint(this.x1,this.y1,result.value);
                const p1 = util.transformPoint(this.x2,this.y2,result.value);
                const p2 = util.transformPoint(this.x3,this.y3,result.value);
                const cNew = new QuadraticCurve(p0[0], p0[1], this.r1,
                                                p1[0], p1[1], this.r2,
                                                p2[0], p2[1], this.r3,
                                                this.color);
                if (cNew.hittest(x,y)) {
                    return true;
                }

                result = it.next();
            }
            return false;
        }

        const tolerance = 0.03;
        if (util.dist(x, y, this.x1, this.y1) < tolerance) {
            return true;
        }
        if (util.dist(x, y, this.x3, this.y3) < tolerance) {
            return true;
        }

        let p0 = this.evaluate(0);
        for (let i = 1; i <= 50; i++) {
            const t = i / 50;
            let p1 = this.evaluate(t);
            if (util.hitLine(x, y, p0[0], p0[1], p1[0], p1[1])) {
                return true;
            }
            p0 = p1;
        }

        return false;
    }

    hittestControlPoints(x,y, transform) {
        // if there's a transform, recurse repeatedly
        if (transform) {
            const it = transform.makeIterator();
            let result = it.next();
            while (!result.done) {
                const p0 = util.transformPoint(this.x1,this.y1,result.value);
                const p1 = util.transformPoint(this.x2,this.y2,result.value);
                const p2 = util.transformPoint(this.x3,this.y3,result.value);
                const cNew = new QuadraticCurve(p0[0], p0[1], this.r1,
                                                p1[0], p1[1], this.r2,
                                                p2[0], p2[1], this.r3,
                                                this.color);
                const r = cNew.hittestControlPoints(x,y);
                if (r) {
                    return r;
                }

                result = it.next();
            }
            return false;
        }

        const tolerance = 0.03;

        if (util.dist(x, y, this.x1, this.y1) < tolerance) {
            return 1;

        }

        if (util.dist(x, y, this.x2, this.y2) < tolerance) {
            return 2;
        }

        if (util.dist(x, y, this.x3, this.y3) < tolerance) {
            return 3;
        }

        return false;
    }

    display(ctx, scale) {
        ctx.fillStyle = this.color;
        const l = util.dist(this.x1, this.y1, this.x2, this.y2) +
              util.dist(this.x2, this.y2, this.x3, this.y3);
        const num_steps = l * scale / 4;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            const f0 = Math.pow(1 - t, 2);
            const f1 = 2 * (1 - t) * t;
            const f2 = Math.pow(t, 2);
            const x = f0 * this.x1 + f1 * this.x2 + f2 * this.x3;
            const y = f0 * this.y1 + f1 * this.y2 + f2 * this.y3;
            const r = f0 * this.r1 + f1 * this.r2 + f2 * this.r3;

            ctx.beginPath();
            ctx.arc(x * scale, y * scale, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    highlight(ctx, scale) {
    }

    generate(ctx) {
        ctx.moveAbove(this.x1, this.y1);
        ctx.dropTo(this.r1);
        const l = util.dist(this.x1, this.y1, this.x2, this.y2) +
              util.dist(this.x2, this.y2, this.x3, this.y3);
        //        const num_steps = l * scale / 4;
        const num_steps = 10;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            const f0 = Math.pow(1 - t, 2);
            const f1 = 2 * (1 - t) * t;
            const f2 = Math.pow(t, 2);
            const x = f0 * this.x1 + f1 * this.x2 + f2 * this.x3;
            const y = f0 * this.y1 + f1 * this.y2 + f2 * this.y3;
            const r = f0 * this.r1 + f1 * this.r2 + f2 * this.r3;

            ctx.moveTo(x, y, r);
        }
        ctx.retract();
    }
}

// Cubic curve with 4 control points
class CubicCurve {
    constructor(x1, y1, r1, x2, y2, r2, x3, y3, r3, x4, y4, r4, c) {
        this.type = "cubic";
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.x2 = x2;
        this.y2 = y2;
        this.r2 = r2;
        this.x3 = x3;
        this.y3 = y3;
        this.r3 = r3;
        this.x4 = x4;
        this.y4 = y4;
        this.r4 = r4;
        this.color = c;
    }

    isSymmetric() {
        return false;
    }

    getRadius(i) {
        switch (i) {
        case 1:
            return this.r1;
        case 2:
            return this.r2;
        case 3:
            return this.r3;
        case 4:
            return this.r4;
        }
        return undefined;
    }

    setRadius(i, r) {
        switch (i) {
        case 1:
            this.r1 = r;
            break;
        case 2:
            this.r2 = r;
            break;
        case 3:
            this.r3 = r;
            break;
        case 4:
            this.r4 = r;
            break;
        }
    }

    setPoint(i, x, y) {
        switch (i) {
        case 1:
            this.x1 = x;
            this.y1 = y;
            break;
        case 2:
            this.x2 = x;
            this.y2 = y;
            break;
        case 3:
            this.x3 = x;
            this.y3 = y;
            break;
        case 4:
            this.x4 = x;
            this.y4 = y;
            break;
        }
    }

    evaluate(t) {
        const f0 = Math.pow(1 - t, 3);
        const f1 = 3 * Math.pow(1 - t, 2) * t;
        const f2 = 3 * (1 - t) * Math.pow(t, 2);
        const f3 = Math.pow(t, 3);
        const x = f0 * this.x1 + f1 * this.x2 + f2 * this.x3 + f3 * this.x4;
        const y = f0 * this.y1 + f1 * this.y2 + f2 * this.y3 + f3 * this.y4;
        const r = f0 * this.r1 + f1 * this.r2 + f2 * this.r3 + f3 * this.r4;

        return [x, y, r];
    }

    hittest(x,y, transform) {
        // if there's a transform, recurse repeatedly
        if (transform) {
            const it = transform.makeIterator();
            let result = it.next();
            while (!result.done) {
                const p0 = util.transformPoint(this.x1,this.y1,result.value);
                const p1 = util.transformPoint(this.x2,this.y2,result.value);
                const p2 = util.transformPoint(this.x3,this.y3,result.value);
                const p3 = util.transformPoint(this.x4,this.y4,result.value);
                const cNew = new CubicCurve(p0[0], p0[1], this.r1,
                                            p1[0], p1[1], this.r2,
                                            p2[0], p2[1], this.r3,
                                            p3[0], p3[1], this.r4,
                                            this.color);
                if (cNew.hittest(x,y)) {
                    return true;
                }

                result = it.next();
            }
            return false;
        }

        // @todo bound check first

        let p0 = this.evaluate(0);
        for (let i = 1; i <= 100; i++) {
            const t = i / 100;
            let p1 = this.evaluate(t);

            if (util.hitLine(x, y, p0[0], p0[1], p1[0], p1[1])) {
                return true;
            }
            p0 = p1;
        }

        return false;
    }

    hittestControlPoints(x,y, transform) {
        // if there's a transform, recurse repeatedly
        if (transform) {
            const it = transform.makeIterator();
            let result = it.next();
            while (!result.done) {
                const p0 = util.transformPoint(this.x1,this.y1,result.value);
                const p1 = util.transformPoint(this.x2,this.y2,result.value);
                const p2 = util.transformPoint(this.x3,this.y3,result.value);
                const p3 = util.transformPoint(this.x4,this.y4,result.value);
                const cNew = new CubicCurve(p0[0], p0[1], this.r1,
                                            p1[0], p1[1], this.r2,
                                            p2[0], p2[1], this.r3,
                                            p3[0], p3[1], this.r4,
                                            this.color);
                const r = cNew.hittestControlPoints(x,y);
                if (r) {
                    return r;
                }

                result = it.next();
            }
            return false;
        }

        const tolerance = 0.03;

        if (util.dist(x, y, this.x1, this.y1) < tolerance) {
            return 1;
        }

        if (util.dist(x, y, this.x2, this.y2) < tolerance) {
            return 2;
        }

        if (util.dist(x, y, this.x3, this.y3) < tolerance) {
            return 3;
        }

        if (util.dist(x, y, this.x4, this.y4) < tolerance) {
            return 4;
        }


        return false;
    }

    display(ctx, scale) {
        ctx.fillStyle = this.color;
        const l1 = util.dist(this.x1, this.y1, this.x4, this.y4);
        const l2 = util.dist(this.x1, this.y1, this.x2, this.y2) +
            util.dist(this.x2, this.y2, this.x3, this.y3) +
            util.dist(this.x3, this.y3, this.x4, this.y4);
        const l = (l1 + l2) / 2;
        const num_steps = l * scale / 2;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            const p = this.evaluate(t);
            ctx.beginPath();
            ctx.arc(p[0] * scale, p[1] * scale, p[2], 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    highlight(ctx, scale, index) {
        ctx.strokeWidth = 1;
        ctx.strokeStyle = '#808080';

        const c1x = this.x1 * scale;
        const c1y = this.y1 * scale;
        const c2x = this.x2 * scale;
        const c2y = this.y2 * scale;
        const c3x = this.x3 * scale;
        const c3y = this.y3 * scale;
        const c4x = this.x4 * scale;
        const c4y = this.y4 * scale;
        const r = 5;
        ctx.beginPath();
        ctx.moveTo(c4x, c4y);
        ctx.lineTo(c3x, c3y);
        ctx.moveTo(c2x, c2y);
        ctx.lineTo(c1x, c1y);

        // const l1 = util.dist(this.x1, this.y1, this.x4, this.y4);
        // const l2 = util.dist(this.x1, this.y1, this.x2, this.y2) +
        //     util.dist(this.x2, this.y2, this.x3, this.y3) +
        //     util.dist(this.x3, this.y3, this.x4, this.y4);
        // const l = (l1 + l2) / 2;
        // const num_steps = l * scale / 2;
        // for (let t = 0; t <= 1; t = t + 1 / num_steps) {
        //     const p = this.evaluate(t);
        //     ctx.lineTo(p[0] * scale, p[1] * scale);
        // }

        ctx.stroke();

        ctx.beginPath();
        ctx.arc(c1x, c1y, r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c2x, c2y, r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c3x, c3y, r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c4x, c4y, r, 0, 2*Math.PI);
        ctx.stroke();

        if (index) {
            ctx.fillStyle = '#808080';
            switch (index) {
            case 1:
                ctx.beginPath();
                ctx.arc(c1x, c1y, r, 0, 2*Math.PI);
                ctx.fill();
                break;
            case 2:
                ctx.beginPath();
                ctx.arc(c2x, c2y, r, 0, 2*Math.PI);
                ctx.fill();
                break;
            case 3:
                ctx.beginPath();
                ctx.arc(c3x, c3y, r, 0, 2*Math.PI);
                ctx.fill();
                break;
            case 4:
                ctx.beginPath();
                ctx.arc(c4x, c4y, r, 0, 2*Math.PI);
                ctx.fill();
                break;
            }
        }
    }

    generate(ctx) {
        ctx.moveAbove(this.x1,this.y1);
        ctx.dropTo(this.r1);
        const l1 = util.dist(this.x1, this.y1, this.x4, this.y4);
        const l2 = util.dist(this.x1, this.y1, this.x2, this.y2) +
            util.dist(this.x2, this.y2, this.x3, this.y3) +
            util.dist(this.x3, this.y3, this.x4, this.y4);
        const l = (l1 + l2) / 2;
        //        const num_steps = l * scale / 2;
        const num_steps = 10;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            const p = this.evaluate(t);
            ctx.moveTo(p[0], p[1], p[2]);
        }
        ctx.retract();
    }
}

class Circle {
    constructor(cx, cy, radius, strokeWidth, color) {
        this.type = "circle";
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.strokeWidth = strokeWidth;
        this.color = color;
    }

    isSymmetric() {
        return true;
    }

    getRadius(i) {
        return undefined;
    }

    setRadius(i, r) {
    }

    hittest(x,y, transform) {
        const tolerance = 0.03;
        const r = util.dist(x, y, this.cx, this.cy);
        if (Math.abs(r - this.radius) < tolerance) {
            return true;
        } else {
            return false;
        }
    }

    hittestControlPoints(x,y, transform) {
        return false;
    }

    display(ctx, scale) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.strokeWidth;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * scale, 0, 2 * Math.PI);
        ctx.stroke();
    }

    highlight(ctx, scale) {
        ctx.strokeStyle = "#808080";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * scale, 0, 2 * Math.PI);
        ctx.stroke();
    }

    generate(ctx) {
        if (ctx.isArcSupported()) {
            ctx.moveAbove(-this.radius, 0);
            ctx.dropTo(this.strokeWidth);
            ctx.xcircle(this.radius);
            ctx.retract();
        } else {
            ctx.moveAbove(this.radius, 0);
            ctx.dropTo(this.strokeWidth);
            const numSteps = 200;
            for (let i = 0; i < numSteps; i++) {
                const a = 2 * Math.PI * i / (numSteps - 1);
                const c = Math.cos(a);
                const s = Math.sin(a);
                ctx.moveTo(this.radius * c, this.radius * s, this.strokeWidth);
            }
            ctx.retract();
        }
    }
}

function loadCurve(data) {
    let result = {};

    switch (data.type) {
    case 'linear':
        result = new curves.LinearCurve(data.x1, data.y1, data.r1,
                                        data.x2, data.y2, data.r2,
                                        data.color);
        break;
    case 'quadratic':
        result = new curves.QuadraticCurve(data.x1, data.y1, data.r1,
                                           data.x2, data.y2, data.r2,
                                           data.x3, data.y3, data.r3,
                                           data.color);
        break;
    case 'cubic':
        result = new curves.CubicCurve(data.x1, data.y1, data.r1,
                                       data.x2, data.y2, data.r2,
                                       data.x3, data.y3, data.r3,
                                       data.x4, data.y4, data.r4,
                                       data.color);
        break;
    case 'circle':
        result = new curves.Circle(data.cx, data.cy, data.radius,
                                   data.strokeWidth, data.color);
        break;
    }
    return result;
}

module.exports = { LinearCurve, QuadraticCurve, CubicCurve, Circle, loadCurve };
