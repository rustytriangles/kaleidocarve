// Kaleidocurves © 2020 RustyTriangles LLC
var mh = require('./src/mouseHandler');
var fs = require('fs');
var gg = require('./src/gcodeGenerator');
var g = require('./src/grid');
var sh = require('./src/selectionHandler');
var util = require('./src/util');


// @todo
//
// - undo
// - zoom
//
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    try {
	let rawdata = fs.readFileSync('./config/config.json');
	var config = JSON.parse(rawdata);
    } catch (err) {
	updateStatus("Error loading config.json");
    }

    const radiusRange = document.getElementById('radius_id');

    const numCopiesRange = document.getElementById('numCopies_id');
    var numCopies = numCopiesRange.value;

    var canvas = document.getElementById('canvas');

    var selectionHandler = new sh.SelectionHandler();
    var scene = new Scene(numCopies);
    var grid = new g.Grid(numCopies, 4);

    let diamField = document.getElementById('diam_id');
    diamField.value = config.toolDiam;
    diamField.addEventListener('change', (evt) => {
	config.toolDiam = Number.parseFloat(diamField.value);
    });

    let angleField = document.getElementById('angle_id');
    angleField.value = config.angle;
    angleField.addEventListener('change', (evt) => {
	config.angle = Number.parseFloat(anglefield.value);
    });

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
        if (selectionHandler.getSelectionType() == 'object') {
            let i = selectionHandler.getSelection();
            const c = scene.curves[i];
            document.getElementById('strokeColor_id').value = c.color;
        } else if (selectionHandler.getSelectionType() == 'control_point') {
            let s = selectionHandler.getSelection();
            const c = scene.curves[s[0]];

            const newRadius = c.getRadius(s[1]);
            const toolDiam = document.getElementById('diam_id').value;
            radiusRange.value = util.radiusToSliderValue(newRadius, toolDiam);
        }
    });

    function updateStatus(str) {
        var statusElement = document.getElementById("status");
        statusElement.innerHTML = str;
    }

    canvas.addEventListener('mousedown', (evt) => {
        if (mouseHandler.getMode() == mh.MouseModes.DRAW_CURVE) {
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
        if (selectionHandler.getSelectionType() == 'object') {
            let i = selectionHandler.getSelection();
            let c = scene.curves[i];
            c.color = document.getElementById('strokeColor_id').value;
        }
    });

    radiusRange.addEventListener('change', (evt) => {
        const toolDiam = document.getElementById('diam_id').value;
        const newRadius = util.sliderValueToRadius(radiusRange.value, toolDiam);

        let changed = false;
        const t = selectionHandler.getSelectionType();
        if (t == 'object') {
            let i = selectionHandler.getSelection();
            let c = scene.curves[i];
            c.r3 = newRadius;
            changed = true;
        } else if (t == 'control_point') {
            let r = selectionHandler.getSelection();
            let c = scene.curves[r[0]];
            c.setRadius(r[1], newRadius);
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

    document.getElementById('save_scene_id').addEventListener('click', (evt) => {
	let filename = document.getElementById('scene_filename_id').value;
	fs.writeFile(filename, JSON.stringify(scene), function(err) {
	    if (err) {
		updateStatus('Error saving scene');
	    }
	});
    });

    document.getElementById('load_scene_id').addEventListener('click', (evt) => {
	try {
	    let filename = document.getElementById('scene_filename_id').value;
	    let rawdata = fs.readFileSync(filename);
	    let data = JSON.parse(rawdata);
	    scene.load(data);
	    numCopiesRange.value = scene.numCopies;
            grid.setNumCopies(numCopiesRange.value);
	    document.getElementById('reflection_id').value = scene.getReflection();
            window.requestAnimationFrame(renderLoop);
	} catch (err) {
	    updateStatus('Error loading scene');
	}
    });

    document.getElementById('generate_id').addEventListener('click', (evt) => {
        const scale = 75;
        const toolDiam = document.getElementById('diam_id').value;
        const angle = document.getElementById('angle_id').value;
        let gen = new gg.GCodeGenerator(scale, toolDiam, angle,
					config.feedRate, config.spindleSpeed,
					config.arcSupport);
        scene.generate(gen);
        const fname = document.getElementById('gcode_filename_id');
        gen.save(fname.value);
    });

    document.getElementById('save_state_id').addEventListener('click', (evt) => {
	fs.writeFile('./config/config.json', JSON.stringify(config), function(err) {
	    if (err) {
		updateStatus('Error saving config.json');
	    }
	});
    });

    document.getElementById('curve_id').addEventListener('click', (evt) => {
        mouseHandler.setMode(mh.MouseModes.DRAW_CURVE);
    });

    document.getElementById('circle_id').addEventListener('click', (evt) => {
        updateStatus('setMode draw_circle');
        mouseHandler.setMode(mh.MouseModes.DRAW_CIRCLE);
    });

    document.getElementById('selobj_id').addEventListener('click', (evt) => {
        updateStatus('setMode select_object');
        mouseHandler.setMode(mh.MouseModes.SELECT_OBJECT);
    });

    document.getElementById('selcpt_id').addEventListener('click', (evt) => {
        updateStatus('setMode select_controlPoint');
        mouseHandler.setMode(mh.MouseModes.SELECT_CONTROLPOINT);
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
            if (selectionHandler.getSelectionType() == 'object') {
                let i = selectionHandler.getSelection();
                scene.curves.splice(i, 1);
                selectionHandler.clear();
                window.requestAnimationFrame(renderLoop);
            }
        }
    });

    paused = false;
    window.requestAnimationFrame(renderLoop);
})
