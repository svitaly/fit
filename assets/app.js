/* Persist set-checkbox state and per-exercise notes for training programs.
   Checkboxes are rendered server-side (class "set-check", one per set cell).
   Notes are textareas with data-ex attributes (exercise index).
   State is stored in localStorage per page, per device. */
(function () {
  'use strict';

  var boxes = Array.prototype.slice.call(document.querySelectorAll('input.set-check'));
  var notes = Array.prototype.slice.call(document.querySelectorAll('textarea.ex-note-input'));
  if (!boxes.length && !notes.length) return;

  var ticksKey = 'fit-sets:' + location.pathname;
  var notesKey = 'fit-notes:' + location.pathname;

  /* --- checkboxes --- */

  function saveTicks() {
    var state = boxes.map(function (cb) { return cb.checked ? 1 : 0; }).join('');
    try { localStorage.setItem(ticksKey, state); } catch (e) { /* private mode */ }
    updateCount();
  }

  function loadTicks() {
    var state = null;
    try { state = localStorage.getItem(ticksKey); } catch (e) { /* private mode */ }
    if (!state) return;
    boxes.forEach(function (cb, i) { cb.checked = state[i] === '1'; });
  }

  boxes.forEach(function (cb) { cb.addEventListener('change', saveTicks); });

  /* --- notes --- */

  function loadNotes() {
    var data = {};
    try { data = JSON.parse(localStorage.getItem(notesKey) || '{}'); } catch (e) { /* corrupted */ }
    notes.forEach(function (t) {
      var v = data[t.getAttribute('data-ex')];
      if (v) t.value = v;
    });
  }

  function saveNote(t) {
    var data = {};
    try { data = JSON.parse(localStorage.getItem(notesKey) || '{}'); } catch (e) { /* corrupted */ }
    var id = t.getAttribute('data-ex');
    if (t.value) data[id] = t.value; else delete data[id];
    try { localStorage.setItem(notesKey, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }

  notes.forEach(function (t) {
    t.addEventListener('input', function () { saveNote(t); });
  });

  /* --- counter + reset --- */

  var counter = document.getElementById('tick-count');
  function updateCount() {
    if (!counter || !boxes.length) return;
    var done = boxes.filter(function (cb) { return cb.checked; }).length;
    counter.textContent = 'Отмечено: ' + done + ' / ' + boxes.length;
  }

  var reset = document.getElementById('tick-reset');
  if (reset) {
    reset.addEventListener('click', function () {
      boxes.forEach(function (cb) { cb.checked = false; });
      notes.forEach(function (t) { t.value = ''; });
      try {
        localStorage.removeItem(ticksKey);
        localStorage.removeItem(notesKey);
      } catch (e) { /* private mode */ }
      updateCount();
    });
  }

  loadTicks();
  loadNotes();
  updateCount();
})();
