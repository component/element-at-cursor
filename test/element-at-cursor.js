/**
 * Module Dependencies
 */

var selection = window.getSelection;
var element = require('element-at-cursor');
var domify = require('domify');
var assert = require('assert');

/**
 * Tests
 */

describe('element([el])', function() {
  var el = document.createElement('div');
  var sel;

  beforeEach(function() {
    el = el.cloneNode();
    document.body.appendChild(el);
    sel = selection();
    sel.removeAllRanges();
  });

  afterEach(function() {
    document.body.removeChild(el);
  });

  describe('collapsed', function() {
    it('should with simple html', function() {
      var p = domify('<p>hi there</p>');
      el.appendChild(p);
      selectAt(p, 't');

      var elem = element();
      assert(p == elem);
    });

    it('should work with nested elements', function() {
      var p = domify('<p>hi <strong>there</strong>.</p>');
      var strong = p.querySelector('strong');
      el.appendChild(p);
      selectAt(strong, 'h');
      var elem = element();
      assert(strong == elem);
    });
  })

  describe('selection', function() {
    it('should work with simple nested elements', function() {
      var p = domify('<p>hi <strong>there</strong>.</p>');
      var strong = p.querySelector('strong');
      el.appendChild(p);
      selectAt(strong, 't', 'r');
      var elem = element();
      assert(strong == elem);
    });

    it('should work with selections that span elements', function() {
      var p = domify('<p>hi <strong>there</strong> <em>matt</em>.</p>');
      var strong = p.querySelector('strong');
      var em = p.querySelector('em');
      el.appendChild(p);
      selectAt(strong, 'th', 'att', em);
      var elem = element();
      assert(p == elem);
    });

    it('should work with deeply nested elements', function() {
      var p = domify('<p></p>');
      p.innerHTML = 'hi <h2><strong>there</strong> <em>matt</em></h2>.';
      var strong = p.querySelector('strong');
      var em = p.querySelector('em');
      var h2 = p.querySelector('h2');
      el.appendChild(p);
      selectAt(strong, 'th', 'att', em);
      var elem = element();
      assert(h2 == elem);
    });
  })

  describe('setting the root', function() {
    it('should return root for any cursor outside the root', function() {
      var p = domify('<p></p>');
      p.innerHTML = 'hi <h2><strong>there</strong> <em>matt</em></h2>.';
      var h2 = p.querySelector('h2');
      el.appendChild(p);
      selectAt(p, 'i');
      var elem = element(h2);
      assert(h2 == elem);
    })

    it('should return root for any selection outside the root', function() {
      var p = domify('<p></p>');
      p.innerHTML = 'hi <h2><strong>there</strong> <em>matt</em></h2>.';
      var strong = p.querySelector('strong');
      el.appendChild(p);
      selectAt(p, 'i', 'r', strong);
      var elem = element(p.querySelector('h2'));
      assert(p.querySelector('h2') == elem);
    })
  });

  function selectAt(elem, start, end, endel) {
    end = end || start;
    var range = document.createRange();
    var is = elem.textContent.indexOf(start);
    var ie = (endel || elem).textContent.indexOf(end);
    range.setStart(elem.firstChild, is);
    range.setEnd((endel || elem).firstChild, ie);
    sel.addRange(range);
  }
});
