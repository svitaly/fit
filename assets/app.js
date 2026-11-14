/* Persist set-checkbox state and per-exercise notes for training programs.
   Checkboxes are rendered server-side (class "set-check", one per set cell).
   Notes are textareas (data-ex = exercise index) hidden behind a one-line
   "Заметки…" toggle; they expand on tap and auto-grow with content.
   State is stored in localStorage per page, per device. */
(function () {
  'use strict';

  var boxes = Array.prototype.slice.call(document.querySelectorAll('input.set-check'));
  var wraps = Array.prototype.slice.call(document.querySelectorAll('.ex-note'));
  if (!boxes.length && !wraps.length) return;

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

  function loadNotesData() {
    try { return JSON.parse(localStorage.getItem(notesKey) || '{}'); } catch (e) { return {}; }
  }

  function saveNote(t) {
    var data = loadNotesData();
    var id = t.getAttribute('data-ex');
    if (t.value) data[id] = t.value; else delete data[id];
    try { localStorage.setItem(notesKey, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }

  function autosize(t) {
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  }

  wraps.forEach(function (wrap) {
    var t = wrap.querySelector('.ex-note-input');
    var toggle = wrap.querySelector('.ex-note-toggle');
    if (!t) return;

    var v = loadNotesData()[t.getAttribute('data-ex')];
    if (v) {
      t.value = v;
      wrap.classList.remove('collapsed');
      autosize(t);
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        wrap.classList.remove('collapsed');
        autosize(t);
        t.focus();
      });
    }

    t.addEventListener('input', function () {
      autosize(t);
      saveNote(t);
    });

    t.addEventListener('blur', function () {
      if (!t.value) wrap.classList.add('collapsed');
    });
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
      wraps.forEach(function (wrap) {
        var t = wrap.querySelector('.ex-note-input');
        if (t) {
          t.value = '';
          t.style.height = 'auto';
        }
        wrap.classList.add('collapsed');
      });
      try {
        localStorage.removeItem(ticksKey);
        localStorage.removeItem(notesKey);
      } catch (e) { /* private mode */ }
      updateCount();
    });
  }

  loadTicks();
  updateCount();
})();
