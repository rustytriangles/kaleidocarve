// Kaleidocurves © 2020 RustyTriangles LLC

function dist(x0, x1, y0, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

// Linear curve between 2 points
class LinearCurve {
    constructor(x0, y0, r0, x1, y1, r1, c) {
        this.x0 = x0;
        this.y0 = y0;
        this.r0 = r0;
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.color = c;
    }

    moveStart(x, y) {
        this.x0 += x;
        this.y0 += y;
    }

    moveEnd(x, y) {
        this.x1 += x;
        this.y1 += y;
    }

    display(ctx) {
        ctx.fillStyle = this.color;
        let num_steps = dist(this.x0, this.y0, this.x1, this.y1) / 4;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            let x = lerp(this.x0, this.x1, t);
            let y = lerp(this.y0, this.y1, t);
            let r = lerp(this.r0, this.r1, t);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

// Quadratic curve with 3 control points
class QuadraticCurve {
    constructor(x0, y0, r0, x1, y1, r1, x2, y2, r2, c) {
        this.x0 = x0;
        this.y0 = y0;
        this.r0 = r0;
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.x2 = x2;
        this.y2 = y2;
        this.r2 = r2;
        this.color = c;
    }

    moveStart(x, y) {
        this.x0 += x;
        this.y0 += y;
    }

    moveEnd(x, y) {
        this.x2 += x;
        this.y2 += y;
    }

    display(ctx) {
        ctx.fillStyle = this.color;
        let l = dist(this.x0, this.y0, this.x1, this.y1) + dist(this.x1, this.y1, this.x2, this.y2);
        let num_steps = l / 4;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            let f0 = pow(1 - t, 2);
            let f1 = 2 * (1 - t) * t;
            let f2 = pow(t, 2);
            let x = f0 * this.x0 + f1 * this.x1 + f2 * this.x2;
            let y = f0 * this.y0 + f1 * this.y1 + f2 * this.y2;
            let r = f0 * this.r0 + f1 * this.r1 + f2 * this.r2;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

// Cubic curve with 4 control points
class CubicCurve {
    constructor(x0, y0, r0, x1, y1, r1, x2, y2, r2, x3, y3, r3, c) {
        this.x0 = x0;
        this.y0 = y0;
        this.r0 = r0;
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

    moveStart(x, y) {
        this.x0 += x;
        this.y0 += y;
        this.x1 += x / 2;
        this.y1 += y / 2;
    }

    moveEnd(x, y) {
        this.x2 += x / 2;
        this.y2 += y / 2;
        this.x3 += x;
        this.y3 += y;
    }

    display(ctx) {
        ctx.fillStyle = this.color;
        let l1 = dist(this.x0, this.y0, this.x3, this.y3);
        let l2 = dist(this.x0, this.y0, this.x1, this.y1) + dist(this.x1, this.y1, this.x2, this.y2) + dist(this.x2, this.y2, this.x3, this.y3);
        let l = (l1 + l2) / 2;
        let num_steps = l / 2;
        for (let t = 0; t <= 1; t = t + 1 / num_steps) {
            let f0 = Math.pow(1 - t, 3);
            let f1 = 3 * Math.pow(1 - t, 2) * t;
            let f2 = 3 * (1 - t) * Math.pow(t, 2);
            let f3 = Math.pow(t, 3);
            let x = f0 * this.x0 + f1 * this.x1 + f2 * this.x2 + f3 * this.x3;
            let y = f0 * this.y0 + f1 * this.y1 + f2 * this.y2 + f3 * this.y3;
            let r = f0 * this.r0 + f1 * this.r1 + f2 * this.r2 + f3 * this.r3;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

class Circle {
    constructor(cx, cy, radius, strokewidth, color) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.strokewidth = strokewidth;
        this.color = color;

    }

    display(ctx) {
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
        ctx.stroke();        
    }
}
