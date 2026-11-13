/* Tick boxes for training programs.
   Injects a checkbox into every top-level list item of the article,
   persists state in localStorage (per page, per device). */
(function () {
  'use strict';

  var article = document.querySelector('article');
  if (!article) return;

  var key = 'fit-ticks:' + location.pathname;
  var boxes = [];

  article.querySelectorAll('ol, ul').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (li) {
      if (li.tagName !== 'LI' || li.querySelector(':scope > input[type="checkbox"]')) return;
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      li.classList.add('tick');
      li.insertBefore(cb, li.firstChild);
      cb.addEventListener('change', save);
      boxes.push(cb);
    });
  });

  function save() {
    var state = boxes.map(function (cb) { return cb.checked ? 1 : 0; }).join('');
    try { localStorage.setItem(key, state); } catch (e) { /* private mode */ }
    updateCount();
  }

  function load() {
    var state = null;
    try { state = localStorage.getItem(key); } catch (e) { /* private mode */ }
    if (!state) return;
    boxes.forEach(function (cb, i) { cb.checked = state[i] === '1'; });
  }

  var counter = document.getElementById('tick-count');
  function updateCount() {
    if (!counter) return;
    var done = boxes.filter(function (cb) { return cb.checked; }).length;
    counter.textContent = 'Отмечено: ' + done + ' / ' + boxes.length;
  }

  var reset = document.getElementById('tick-reset');
  if (reset) {
    reset.addEventListener('click', function () {
      boxes.forEach(function (cb) { cb.checked = false; });
      try { localStorage.removeItem(key); } catch (e) { /* private mode */ }
      updateCount();
    });
  }

  load();
  updateCount();
})();
