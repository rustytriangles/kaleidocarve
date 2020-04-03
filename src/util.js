// Kaleidocurves © 2020 RustyTriangles LLC

// Return distance between [x0,y0] and [x1,y1]
function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

// Linear interpolation by t between a and b
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function dot(x0, y0, x1, y1) {
    return x0*x1 + y0*y1;
}

function hitLine(px, py, x0, y0, x1, y1) {
    const tolerance = 0.03;

    if (dist(x0,y0,px,py) < tolerance) {
     	return true;
    }

    if (dist(x1,y1,px,py) < tolerance) {
     	return true;
    }

    const ax = px - x0;
    const ay = py - y0;
    const bx = x1 - x0;
    const by = y1 - y0;
    const t = dot(ax,ay,bx,by)/dot(bx,by,bx,by);

    if (t < 0 || t > 1) {
	return false;
    }

    if (dist(px, py, x0 + t * bx, y0 + t * by) < tolerance) {
	return true;
    } else {
	return false;
    }
}

// Convert point from normalized to device
function toDC(x, y, s, w, h) {
    return [x * s + w / 2, y * s + h / 2];
}

// Convert point from device to normalized
// @todo Change interface to make testing cleaner
function toNDC(canvas, xdc, ydc) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width, rect.height) / 2;
    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    return [(xdc - cx) / w, (ydc - cy) / w];
}

module.exports = {dist, hitLine, lerp, toDC, toNDC};
