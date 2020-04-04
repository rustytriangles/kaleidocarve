// Kaleidocurves © 2020 RustyTriangles LLC
var mh = require('./src/mouseHandler');
var sh = require('./src/selectionHandler');
var util = require('./src/util');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    const numCopiesRange = document.getElementById('numCopies_id');
    var numCopies = numCopiesRange.value;

    var canvas = document.getElementById('canvas');

    var mouseHandler = new mh.MouseHandler();
    var selectionHandler = new sh.SelectionHandler();
    var scene = new Scene(numCopies);

    function updateStatus(str) {
        var statusElement = document.getElementById("status");
        statusElement.innerHTML = str;
    }

    var paused = true;
    var savedWidth = -1;
    var savedHeight = -1;
    function renderLoop() {
        if (canvas.clientWidth !== savedWidth || canvas.clientHeight != savedHeight) {
            updateStatus('change size to ' + canvas.clientWidth + ', ' + canvas.clientHeight);
            savedWidth = canvas.clientWidth;
            savedHeight = canvas.clientHeight;
            canvas.width = savedWidth;
            canvas.height = savedHeight;
        }

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.display(ctx, rect.width, rect.height);
        scene.highlight(ctx, selectionHandler.getSelection(), canvas.width, canvas.height);
        mouseHandler.display(ctx, rect.width, rect.height);

        if (!paused) {
            window.requestAnimationFrame(renderLoop);
        }
    }

    canvas.addEventListener('mousedown', (evt) => {
        const pt = util.toNDC(canvas, evt.clientX, evt.clientY);

        if (mouseHandler.getMode() == "draw_curve") {
            paused = true;
        }

        if (mouseHandler.getMode() == "select_object") {
            updateStatus('select_object');

            let done = false;
            let changed = false;

            // First, check if we've picked the current
            let i = selectionHandler.getSelection();
            if (i && i >= 0 && i < scene.getNumCurves()) {
                if (scene.hittest(pt[0], pt[1], i)) {
                    updateStatus('picked already selected ' + i);
                    done = true;
                }
            }

            if (!done) {
                const i = scene.pick(pt[0],pt[1]);
                if (typeof i == 'number') {
                    updateStatus('picked ' + i);
                    selectionHandler.replace(i);
                    changed = true;
                } else {
                    updateStatus('picked nothing');
                    if (getSelection()) {
                        selectionHandler.clear();
                        changed = true;
                    }
                }
            }

            if (changed) {
                window.requestAnimationFrame(renderLoop);
            }


        } else if (mouseHandler.getMode() == "select_controlPoint") {
            updateStatus('select_controlPoint');

            let done = false;
            let changed = false;

            // First, check if we've picked the current
            let r = selectionHandler.getSelection();
            if (r && r.length == 2) {
                const i = r[0];
                if (i >= 0 && i < scene.getNumCurves()) {
                    const c = r[1];
                    if (scene.hittestControlPoints(pt[0], pt[1], r)) {
                        updateStatus('picked already selected ' + i);
                        done = true;
                    }
                }
            }
            if (!done) {
                const r = scene.pickControlPoint(pt[0],pt[1]);
                if (r && r.length == 2) {
                    updateStatus('picked ' + r[0] + ', ' + r[1]);
                    selectionHandler.replace(r);
                    changed = true;
                } else {
                    updateStatus('picked nothing ' + typeof r);
                    if (getSelection()) {
                        selectionHandler.clear();
                        changed = true;
                    }
                }
            }

            if (changed) {
                window.requestAnimationFrame(renderLoop);
            }

        } else {
            mouseHandler.start(pt[0], pt[1]);
        }
    });

    canvas.addEventListener('mouseup', (evt) => {
        paused = false;
        mouseHandler.stop();
        if (mouseHandler.valid()) {
            updateStatus('mouseHandler.valid');
            if (mouseHandler.getMode() == "draw_curve") {
                updateStatus('draw_curve');

                const strokeColor = document.getElementById('strokeColor_id');
                const c = mouseHandler.createCurve(strokeColor.value);
                const rect = canvas.getBoundingClientRect();

                scene.addCurve(c);

                window.requestAnimationFrame(renderLoop);

            } else if (mouseHandler.getMode() == "draw_circle") {
                updateStatus('draw_circle');

                const strokeColor = document.getElementById('strokeColor_id');
                updateStatus('strokeColor = ' + strokeColor);
                const c = mouseHandler.createCircle(canvas.width, canvas.height, strokeColor.value);
                updateStatus('c = ' + c);

                scene.addCurve(c);

                window.requestAnimationFrame(renderLoop);
            }

            mouseHandler.clear();
        }
    });

    canvas.addEventListener('mouseleave', (evt) => {
        paused = false;
        mouseHandler.stop();
        mouseHandler.clear();
        window.requestAnimationFrame(renderLoop);
    });

    canvas.addEventListener('mousemove', (evt) => {
        const pt = util.toNDC(canvas, evt.clientX, evt.clientY);
        mouseHandler.addPoint(pt[0], pt[1]);
        mouseHandler.display(canvas.getContext('2d'), savedWidth, savedHeight);
    });

    numCopiesRange.addEventListener('change', (evt) => {
        scene.setNumCopies(numCopiesRange.value);
        window.requestAnimationFrame(renderLoop);
    });

    document.getElementById('clear_id').addEventListener('click', (evt) => {
        scene.clear();
        window.requestAnimationFrame(renderLoop);
    });

    document.getElementById('curve_id').addEventListener('click', (evt) => {
        mouseHandler.setMode('draw_curve');
    });

    document.getElementById('circle_id').addEventListener('click', (evt) => {
        updateStatus('setMode draw_circle');
        mouseHandler.setMode('draw_circle');
    });

    document.getElementById('selobj_id').addEventListener('click', (evt) => {
        updateStatus('setMode select_object');
        mouseHandler.setMode('select_object');
    });

    document.getElementById('selcpt_id').addEventListener('click', (evt) => {
        updateStatus('setMode select_controlPoint');
        mouseHandler.setMode('select_controlPoint');
    });

    document.getElementById('reflection_id').addEventListener('change', (evt) => {
        scene.setReflection(evt.target.checked);
        window.requestAnimationFrame(renderLoop);
    });

    paused = false;
    window.requestAnimationFrame(renderLoop);
})
