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

    var selectionHandler = new sh.SelectionHandler();
    var scene = new Scene(numCopies);

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

    const renderCallback = function() {
        if (!paused) {
            window.requestAnimationFrame(renderLoop);
        }
    }

    var mouseHandler = new mh.MouseHandler(scene, selectionHandler, renderCallback);

    function updateStatus(str) {
        var statusElement = document.getElementById("status");
        statusElement.innerHTML = str;
    }

    canvas.addEventListener('mousedown', (evt) => {
        if (mouseHandler.getMode() == "draw_curve") {
            paused = true;
        }

        updateStatus('selected = ' + selectionHandler.getSelection());
        mouseHandler.mouseDownCallback(evt);
    });

    canvas.addEventListener('mouseup', (evt) => {
        paused = false;
        const strokeColor = document.getElementById('strokeColor_id');
        mouseHandler.mouseUpCallback(evt, strokeColor.value);
    });

    canvas.addEventListener('mouseleave', (evt) => {
        paused = false;
        mouseHandler.mouseLeaveCallback(evt);
    });

    canvas.addEventListener('mousemove', (evt) => {
        mouseHandler.mouseMoveCallback(evt);
        mouseHandler.display(canvas.getContext('2d'), savedWidth, savedHeight);
    });

    numCopiesRange.addEventListener('change', (evt) => {
        scene.setNumCopies(numCopiesRange.value);
        window.requestAnimationFrame(renderLoop);
    });

    document.getElementById('clear_id').addEventListener('click', (evt) => {
        scene.clear();
        selectionHandler.clear();
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
