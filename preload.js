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
            const strokeColor = document.getElementById('strokeColor_id');
            var c = handler.createCurve(strokeColor.value);
            const rect = canvas.getBoundingClientRect();

            scene.addCurve(c);

            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            scene.display(ctx, rect.width, rect.height);
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
        handler.display(canvas.getContext('2d'));
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

})