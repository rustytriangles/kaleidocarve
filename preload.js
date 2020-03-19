// Kaleidocurves © 2020 RustyTriangles LLC

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    const numCopiesRange = document.getElementById('numCopies_id');
    var numCopies = numCopiesRange.value;

    const canvas = document.getElementById('canvas');

    var handler = new MouseHandler();
    var scene = new Scene(numCopies);

    canvas.addEventListener('mousedown', (evt) => {
        const rect = canvas.getBoundingClientRect();
        handler.start(evt.clientX - rect.left, evt.clientY - rect.top);
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
        }

        handler.clear();
    });

    canvas.addEventListener('mouseleave', (evt) => {
        handler.stop();
        handler.clear();
    });

    canvas.addEventListener('mousemove', (evt) => {
        const rect = canvas.getBoundingClientRect();
        handler.addPoint(evt.clientX - rect.left, evt.clientY - rect.top);

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        scene.display(ctx, rect.width, rect.height);
        handler.display(ctx, rect.width, rect.height);
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
        handler.setMode("draw_curve");
    });

    document.getElementById('circle_id').addEventListener('click', (evt) => {
        handler.setMode("draw_circle");
    });

    document.getElementById('selobj_id', (evt) => {
        handler.setMode("select_object");
    });

    document.getElementById('selcpt_id', (evt) => {
        handler.setMode("select_control_point");
    });
})