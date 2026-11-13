/* Persist set-checkbox state for training programs.
   Checkboxes are rendered server-side (class "set-check", one per set cell).
   State is stored in localStorage per page, per device. */
(function () {
  'use strict';

  var boxes = Array.prototype.slice.call(document.querySelectorAll('input.set-check'));
  if (!boxes.length) return;

  var key = 'fit-sets:' + location.pathname;

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

  boxes.forEach(function (cb) { cb.addEventListener('change', save); });

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
