// Kaleidocurves © 2020 RustyTriangles LLC
var mh = require('./src/mouseHandler');
var gg = require('./src/gcodeGenerator');
var g = require('./src/grid');
var sh = require('./src/selectionHandler');
var util = require('./src/util');

// @todo
//
// - on selection change, update radius & color inputs
// - dragging control points
// - handle selected in strokeColor_id.onchange
// - undo
// - save/load
// - finish connecting toolDiameter * angle
// - grid
// - zoom
// - no exponential notation
//
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    const radiusRange = document.getElementById('radius_id');

    const numCopiesRange = document.getElementById('numCopies_id');
    var numCopies = numCopiesRange.value;

    var canvas = document.getElementById('canvas');

    var selectionHandler = new sh.SelectionHandler();
    var scene = new Scene(numCopies);
    var grid = new g.Grid(numCopies, 4);

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

        if (document.getElementById('grid_id').checked) {
            grid.display(ctx, rect.width, rect.height);
        }
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

    selectionHandler.on('selectionChanged', function() {
        let i = selectionHandler.getSelection();
        if (typeof i == 'number') {
	    const c = scene.curves[i];
            document.getElementById('strokeColor_id').value = c.color;
	}
    });

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

    document.getElementById('strokeColor_id').addEventListener('change', (evt) => {
        let i = selectionHandler.getSelection();
        if (typeof i == 'number') {
            let c = scene.curves[i];
            c.color = document.getElementById('strokeColor_id').value;
	}
    });

    radiusRange.addEventListener('change', (evt) => {
        const toolDiam = 3.15;
        const newRadius = toolDiam / 2 * radiusRange.value / 100;

        let changed = false;
        let i = selectionHandler.getSelection();
        if (typeof i == 'number') {
            let c = scene.curves[i];
            c.r3 = newRadius;
            changed = true;
        } else if (i && i.length == 2) {
            let c = scene.curves[i[0]];
            switch (i[1]) {
            case 1:
		updateStatus('c.r1 = ' + newRadius);
                c.r1 = newRadius;
                break;
            case 2:
		updateStatus('c.r2 = ' + newRadius);
                c.r2 = newRadius;
                break;
            case 3:
		updateStatus('c.r3 = ' + newRadius);
                c.r3 = newRadius;
                break;
            case 4:
		updateStatus('c.r4 = ' + newRadius);
                c.r4 = newRadius;
                break;
            }
            changed = true;
        } else {
        }
    });

    numCopiesRange.addEventListener('change', (evt) => {
        grid.setNumCopies(numCopiesRange.value);
        scene.setNumCopies(numCopiesRange.value);
        window.requestAnimationFrame(renderLoop);
    });

    document.getElementById('clear_id').addEventListener('click', (evt) => {
        scene.clear();
        selectionHandler.clear();
        window.requestAnimationFrame(renderLoop);
    });

    document.getElementById('generate_id').addEventListener('click', (evt) => {
        const scale = 75;
        const toolDiam = 3.15;
        const angle = 30;
        let gen = new gg.GCodeGenerator(scale, toolDiam, angle);
        scene.generate(gen);
        const fname = document.getElementById('filename_id');
        gen.save(fname.value);
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

    document.getElementById('grid_id').addEventListener('change', (evt) => {
        window.requestAnimationFrame(renderLoop);
    });

    document.addEventListener("keydown", function(event) {
        var KeyID = event.keyCode;
        const backspaceKeyCode = 8;
        const deleteKeyCode = 46;
        if (event.keyCode == backspaceKeyCode || event.keyCode == deleteKeyCode) {
            let i = selectionHandler.getSelection();
            if (typeof i == 'number') {
                scene.curves.splice(i, 1);
                selectionHandler.clear();
                window.requestAnimationFrame(renderLoop);
            }
        }
    });

    paused = false;
    window.requestAnimationFrame(renderLoop);
})
