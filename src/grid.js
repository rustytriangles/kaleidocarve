// Kaleidocurves © 2020 RustyTriangles LLC

var util = require('../src/util');

class Grid {
    constructor(numCopies, scale) {
        this.numCopies = numCopies;
        this.scale = scale;
        this.color = '#66b2a3';
    }

    setNumCopies(numCopies) {
        this.numCopies = numCopies;
    }

    setScale(scale) {
        this.scale = scale;
    }

    display(ctx, width, height) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        const cx = width / 2;
        const cy = height / 2;
        const tickWidth = 6;

        const step = 2*Math.PI / this.numCopies;
        for (let ang = 0; ang < 2*Math.PI; ang += step) {
            ctx.beginPath();
            ctx.moveTo(cx,cy);
            ctx.lineTo(cx + tickWidth * Math.cos(ang),
                       cy + tickWidth * Math.sin(ang));
            ctx.stroke();
        }

        for (let i = 25; i < 100; i += 25) {
            if (i*this.scale > util.dist(0,0,width/2,height/2)) {
                break;
            }

            for (let ang = 0; ang < 2*Math.PI; ang += step) {
                const r = i * this.scale;

                ctx.fillText(i, width/2,height/2 - i * this.scale);
                ctx.beginPath();
                ctx.arc(width/2, height/2, r, ang - step/8, ang + step/8);
                ctx.stroke();

                ctx.beginPath();
                const r1 = r-tickWidth;
                const r2 = r+tickWidth;
                ctx.moveTo(width/2 + r1*Math.cos(ang),
                           height/2 + r1*Math.sin(ang));
                ctx.lineTo(width/2 + r2*Math.cos(ang),
                           height/2 + r2*Math.sin(ang));
                ctx.stroke();
            }
        }
    }
}

module.exports = { Grid };
