// Kaleidocurves © 2020 RustyTriangles LLC

var chai = require('chai');
var assert = chai.assert;
var sh = require('../src/selectionHandler');

describe('SelectionHandler/inital', function() {

    it('init -> replace -> clear', function() {
        let s = new sh.SelectionHandler();
        assert.isUndefined(s.getSelection());
        s.replace(7);
        assert.isDefined(s.getSelection());
        s.clear();
        assert.isUndefined(s.getSelection());
    });
});

describe('SelectionHandler/replace', function() {

    it('init -> replace -> clear', function() {
        let s = new sh.SelectionHandler();
        s.replace(7);
        assert.equal(s.getSelection(), 7);
        s.replace(8);
        assert.equal(s.getSelection(), 8);
        s.clear();
        assert.isUndefined(s.getSelection());
    });
});


describe('SelectionHandler/event', function() {

    it('init -> replace -> clear', function() {
        let fired = 0;
        let s = new sh.SelectionHandler();
        s.on('selectionChanged', function() {
            fired++;
        });

        s.replace(7);
        assert.equal(fired, 1, 'event should fire when replace is called');
        s.replace(8);
        assert.equal(fired, 2, 'event should fire when replace is called');
        s.replace(8);
        assert.equal(fired, 2, 'event should not fire if value is unchanged');
        s.clear();
        assert.equal(fired, 3, 'event should fire on clear');
        s.clear();
        assert.equal(fired, 3, 'event should not fire on clear if selection was already emptry');
    });
});
