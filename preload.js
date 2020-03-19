// Kaleidocurves © 2020 RustyTriangles LLC

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    const numCopiesRange = document.getElementById('numCopies_id');
    var numCopies = numCopiesRange.value;

    var canvas = document.getElementById('canvas');

    var handler = new MouseHandler();
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
        handler.stop();
        if (handler.valid()) {
            if (handler.getMode() == "draw_curve") {

                const strokeColor = document.getElementById('strokeColor_id');
                var c = handler.createCurve(strokeColor.value);
                const rect = canvas.getBoundingClientRect();

                scene.addCurve(c);

                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                scene.display(ctx, rect.width, rect.height);

            } else if (handler.getMode() == "draw_circle") {
                const strokeColor = document.getElementById('strokeColor_id');
                var c = handler.createCircle(canvas.width, canvas.height, strokeColor.value);
                const rect = canvas.getBoundingClientRect();

                scene.addCurve(c);

                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                scene.display(ctx, rect.width, rect.height);
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

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.display(ctx, canvas.width, canvas.height);
    });

    document.getElementById('clear_id').addEventListener('click', (evt) => {
        scene.clear();

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.display(ctx, canvas.width, canvas.height);
    });

    document.getElementById('curve_id').addEventListener('click', (evt) => {
        handler.setMode('draw_curve');
    });

    document.getElementById('circle_id').addEventListener('click', (evt) => {
        handler.setMode('draw_circle');
    });

    document.getElementById('reflection_id').addEventListener('change', (evt) => {
        scene.setReflection(evt.target.checked);

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.display(ctx, canvas.width, canvas.height);
    });

    window.requestAnimationFrame(renderLoop);
})
