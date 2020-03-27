// Kaleidocurves © 2020 RustyTriangles LLC
var mh = require('./src/mouseHandler');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    const numCopiesRange = document.getElementById('numCopies_id');
    var numCopies = numCopiesRange.value;

    var canvas = document.getElementById('canvas');

    var handler = new mh.MouseHandler();
    var scene = new Scene(numCopies);

    function updateStatus(str) {
        var statusElement = document.getElementById("status");
        statusElement.innerHTML = str;
    }

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
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.display(ctx, rect.width, rect.height);
        mouseHandler.display(ctx, rect.width, rect.height);

        window.requestAnimationFrame(renderLoop);
    }

    function toNDC(canvas, xdc, ydc) {
        const rect = canvas.getBoundingClientRect();
        var w = Math.max(rect.width, rect.height) / 2;
        var cx = (rect.left + rect.right) / 2;
        var cy = (rect.top + rect.bottom) / 2;
        return [(xdc - cx) / w, (ydc - cy) / w];
    }

    canvas.addEventListener('mousedown', (evt) => {

        var pt = toNDC(canvas, evt.clientX, evt.clientY);

        handler.start(pt[0], pt[1]);
    });

    canvas.addEventListener('mouseup', (evt) => {
        updateStatus('mouseup');
        handler.stop();
        if (handler.valid()) {
            updateStatus('handler.valid');
            if (handler.getMode() == "draw_curve") {
                updateStatus('draw_curve');

                const strokeColor = document.getElementById('strokeColor_id');
                var c = handler.createCurve(strokeColor.value);
                const rect = canvas.getBoundingClientRect();

                scene.addCurve(c);

                window.requestAnimationFrame(renderLoop);

            } else if (handler.getMode() == "draw_circle") {
                updateStatus('draw_circle');

                const strokeColor = document.getElementById('strokeColor_id');
                updateStatus('strokeColor = ' + strokeColor);
                var c = handler.createCircle(canvas.width, canvas.height, strokeColor.value);
                updateStatus('c = ' + c);

                scene.addCurve(c);

                window.requestAnimationFrame(renderLoop);
            }
            handler.clear();
        }
    });

    canvas.addEventListener('mouseleave', (evt) => {
        handler.stop();
        handler.clear();
    });

    canvas.addEventListener('mousemove', (evt) => {
        var pt = toNDC(canvas, evt.clientX, evt.clientY);

        handler.addPoint(pt[0], pt[1]);
        handler.display(canvas.getContext('2d'), savedWidth, savedHeight);
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
        handler.setMode('draw_curve');
    });

    document.getElementById('circle_id').addEventListener('click', (evt) => {
        updateStatus('setMode draw_circle');
        handler.setMode('draw_circle');
    });

    document.getElementById('reflection_id').addEventListener('change', (evt) => {
        scene.setReflection(evt.target.checked);
        window.requestAnimationFrame(renderLoop);
    });

    window.requestAnimationFrame(renderLoop);
})
