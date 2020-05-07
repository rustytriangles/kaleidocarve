// Kaleidocurves © 2020 RustyTriangles LLC

// Return distance between [x0,y0] and [x1,y1]
function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}

// Linear interpolation by t between a and b
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

// Return dot product of two vectors
function dot(x0, y0, x1, y1) {
    return x0*x1 + y0*y1;
}

// Return true if [px,py] is on the line segment from [x0,y0] to [x1,y1]
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
function toNDC(xdc, ydc, s, cx, cy) {
    return [(xdc - cx) / s, (ydc - cy) / s];
}

// Return [x, y] transformed by mat
function transformPoint(x, y, mat) {
    const xNew = x*mat[0] + y*mat[2] + mat[4];
    const yNew = x*mat[1] + y*mat[3] + mat[5];
    return [xNew, yNew];
}

function radiusToDepth(radius, toolDiam, toolAngle) {
    const r = Math.max(0,Math.min(radius, toolDiam/2));
    const beta = Math.PI * (90 - toolAngle/2) / 180;
    const z = -r * Math.tan(beta);
    return z;
}

function sliderValueToRadius(value, toolDiam) {
    return toolDiam / 2 * value / 100;
}

function radiusToSliderValue(radius, toolDiam) {
    return 2*100*radius/toolDiam;
}

function formatNumber(x) {
    return Number.parseFloat(x).toFixed(3);
}

module.exports = {dist,
		  hitLine,
		  lerp,
		  toDC,
		  toNDC,
		  transformPoint,
		  radiusToDepth,
		  sliderValueToRadius,
		  radiusToSliderValue,
		  formatNumber};
