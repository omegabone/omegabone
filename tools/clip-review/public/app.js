/**
 * Review page.
 *
 * The server holds the truth. Every verdict and every pause in typing goes
 * straight to it and the response is what the page then shows, so what is on
 * screen is what is on disk — a review pass that lies about which clips were
 * approved is worse than no review pass.
 */

const $ = (id) => document.getElementById(id);

const el = {
  filters: $('filters'),
  list: $('list'),
  stage: $('stage'),
  empty: $('empty'),
  video: $('video'),
  unrendered: $('unrendered'),
  eyebrow: $('eyebrow'),
  topic: $('topic'),
  meta: $('meta'),
  feedback: $('feedback'),
  facts: $('facts'),
  saved: $('saved'),
  mode: $('mode'),
  hint: $('hint'),
  keys: $('keys'),
};

const FILTERS = [
  ['all', 'All'],
  ['pending', 'Undecided'],
  ['approved', 'Approved'],
  ['rejected', 'Rejected'],
];

const state = {
  clips: [],
  counts: {},
  filter: 'pending',
  currentId: null,
  mode: 'copy',
};

/* ---------- data ---------- */

async function load() {
  const res = await fetch('/api/clips');
  const data = await res.json();

  state.clips = data.clips;
  state.counts = data.counts;
  state.mode = data.mode;

  el.mode.textContent = data.mode === 'move' ? 'moving on approve' : 'copying on approve';
  el.mode.title = `Approved clips go to ${data.approvedDir}`;

  // Open on the first thing worth deciding, not on an empty filter.
  if (!visible().length && state.filter === 'pending') state.filter = 'all';
  if (!state.currentId) state.currentId = visible()[0]?.id ?? null;

  render();
}

async function patch(id, body) {
  el.saved.classList.remove('error');
  el.saved.textContent = 'Saving…';

  const res = await fetch(`/api/clips/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    el.saved.classList.add('error');
    el.saved.textContent = `Not saved: ${error}`;
    return null;
  }

  const data = await res.json();
  const at = state.clips.findIndex((c) => c.id === id);
  if (at !== -1) state.clips[at] = data.clip;
  state.counts = data.counts;

  el.saved.textContent = 'Saved';
  clearTimeout(patch.clear);
  patch.clear = setTimeout(() => {
    el.saved.textContent = '';
  }, 1600);

  return data.clip;
}

/* ---------- selectors ---------- */

const visible = () =>
  state.filter === 'all' ? state.clips : state.clips.filter((c) => c.status === state.filter);

const current = () => state.clips.find((c) => c.id === state.currentId) ?? null;

/* ---------- render ---------- */

function render() {
  renderFilters();
  renderList();
  renderDetail();
}

function renderFilters() {
  el.filters.replaceChildren(
    ...FILTERS.map(([key, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(state.filter === key));
      button.append(label);

      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = state.counts[key] ?? 0;
      button.append(count);

      button.addEventListener('click', () => {
        state.filter = key;
        // Keep the open clip if it survives the filter; otherwise show the top.
        if (!visible().some((c) => c.id === state.currentId)) {
          state.currentId = visible()[0]?.id ?? null;
        }
        render();
      });
      return button;
    }),
  );
}

function renderList() {
  const clips = visible();
  const nodes = [];
  let lesson = null;

  for (const clip of clips) {
    const heading = clip.lesson || 'Unfiled renders';
    if (heading !== lesson) {
      lesson = heading;
      const head = document.createElement('p');
      head.className = 'list-lesson';
      head.textContent = heading;
      nodes.push(head);
    }
    nodes.push(rowFor(clip));
  }

  el.list.replaceChildren(...nodes);
  el.list.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' });
}

function rowFor(clip) {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'row';
  row.dataset.status = clip.status;
  row.dataset.rendered = String(clip.rendered);
  row.setAttribute('aria-current', String(clip.id === state.currentId));

  const dot = document.createElement('span');
  dot.className = 'dot';

  const title = document.createElement('span');
  title.className = 'title';
  const strong = document.createElement('strong');
  strong.textContent = clip.topic || clip.id;
  const sub = document.createElement('span');
  sub.textContent = [clip.student, clip.awareness].filter(Boolean).join(' · ') || clip.id;
  title.append(strong, sub);

  const tail = document.createElement('span');
  tail.className = 'tail';
  tail.textContent = clip.rendered ? duration(clip.durationSeconds) : 'no file';

  row.append(dot, title, tail);

  if (clip.feedback) {
    const note = document.createElement('span');
    note.className = 'note';
    note.textContent = clip.feedback;
    row.append(note);
  }

  row.addEventListener('click', () => select(clip.id));
  return row;
}

function renderDetail() {
  const clip = current();
  el.stage.hidden = !clip;
  el.empty.hidden = Boolean(clip);
  if (!clip) return;

  el.eyebrow.textContent = [clip.awareness, clip.highValueType].filter(Boolean).join(' · ');
  el.topic.textContent = clip.topic || clip.id;
  el.meta.textContent =
    [clip.student, clip.date, clip.rendered ? duration(clip.durationSeconds) : 'not rendered']
      .filter(Boolean)
      .join(' · ') + (clip.durationEstimated ? ' (estimated)' : '');

  if (clip.rendered) {
    const src = `/media/${encodeURIComponent(clip.file)}`;
    // Only reload the element when the file actually changes, so re-rendering
    // after a save does not restart playback.
    if (!el.video.src.endsWith(src)) el.video.src = src;
    el.video.hidden = false;
    el.unrendered.hidden = true;
  } else {
    el.video.removeAttribute('src');
    el.video.load();
    el.video.hidden = true;
    el.unrendered.hidden = false;
  }

  for (const button of document.querySelectorAll('.verdict button')) {
    button.setAttribute('aria-pressed', String(button.dataset.status === clip.status));
  }

  if (el.feedback.value !== clip.feedback && document.activeElement !== el.feedback) {
    el.feedback.value = clip.feedback;
  }

  renderFacts(clip);
}

function renderFacts(clip) {
  const facts = [
    ['Caption', clip.suggestedCaption],
    ['CTA', clip.cta],
    ['Clip type', clip.clipType],
    ['Why it hooks', clip.whyItHooks],
    ['Quote', clip.quote],
    ['Score', clip.score === null ? '' : String(clip.score)],
    ['File', clip.file ?? ''],
    ['Source', clip.sourceUrl],
  ].filter(([, value]) => value);

  const nodes = [];
  for (const [label, value] of facts) {
    const dt = document.createElement('dt');
    dt.textContent = label;

    const dd = document.createElement('dd');
    if (label === 'Quote') dd.className = 'quote';

    if (label === 'Source') {
      const a = document.createElement('a');
      a.href = value;
      a.textContent = 'open at the clip’s in-point';
      a.target = '_blank';
      a.rel = 'noreferrer';
      dd.append(a);
    } else {
      dd.textContent = value;
    }
    nodes.push(dt, dd);
  }
  el.facts.replaceChildren(...nodes);
}

function duration(seconds) {
  if (seconds === null || seconds === undefined) return '';
  const s = Math.round(seconds);
  return s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`;
}

/* ---------- actions ---------- */

function select(id) {
  if (id === state.currentId) return;
  flushFeedback();
  state.currentId = id;
  render();
}

function step(delta) {
  const clips = visible();
  const at = clips.findIndex((c) => c.id === state.currentId);
  const next = clips[Math.min(Math.max(at + delta, 0), clips.length - 1)];
  if (next) select(next.id);
}

function nextUndecided() {
  const clips = visible();
  const at = clips.findIndex((c) => c.id === state.currentId);
  const after = clips.slice(at + 1).find((c) => c.status === 'pending');
  const found = after ?? state.clips.find((c) => c.status === 'pending');
  if (found) select(found.id);
}

async function setStatus(status) {
  const clip = current();
  if (!clip) return;

  await flushFeedback();
  await patch(clip.id, { status });
  render();

  // A decided clip drops out of the Undecided filter, so land on the next one
  // rather than on nothing.
  if (state.filter === 'pending' && !visible().some((c) => c.id === state.currentId)) {
    state.currentId = visible()[0]?.id ?? null;
    render();
  }
}

let feedbackTimer = null;
let pending = null;

function queueFeedback() {
  const clip = current();
  if (!clip) return;

  pending = { id: clip.id, feedback: el.feedback.value };
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(flushFeedback, 700);
}

async function flushFeedback() {
  clearTimeout(feedbackTimer);
  if (!pending) return;

  const { id, feedback } = pending;
  pending = null;

  const clip = state.clips.find((c) => c.id === id);
  if (!clip || clip.feedback === feedback) return;

  await patch(id, { feedback });
  renderList();
}

/* ---------- wiring ---------- */

for (const button of document.querySelectorAll('.verdict button')) {
  button.addEventListener('click', () => setStatus(button.dataset.status));
}

el.feedback.addEventListener('input', queueFeedback);
el.feedback.addEventListener('blur', flushFeedback);
el.feedback.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') el.feedback.blur();
});

el.hint.addEventListener('click', () => el.keys.showModal());

// Nothing is left unsaved when the tab goes away.
window.addEventListener('pagehide', () => {
  if (!pending) return;
  navigator.sendBeacon?.(
    `/api/clips/${encodeURIComponent(pending.id)}`,
    new Blob([JSON.stringify({ feedback: pending.feedback })], { type: 'application/json' }),
  );
});

document.addEventListener('keydown', (e) => {
  // The feedback box owns every key while it has focus.
  if (e.target.matches('textarea, input') || e.metaKey || e.ctrlKey || e.altKey) return;

  const keys = {
    j: () => step(1),
    arrowdown: () => step(1),
    k: () => step(-1),
    arrowup: () => step(-1),
    a: () => setStatus('approved'),
    r: () => setStatus('rejected'),
    u: () => setStatus('pending'),
    n: nextUndecided,
    f: () => el.feedback.focus(),
    '?': () => el.keys.showModal(),
    ' ': () => (el.video.paused ? el.video.play() : el.video.pause()),
  };

  const action = keys[e.key.toLowerCase()];
  if (!action) return;
  e.preventDefault();
  action();
});

load().catch((err) => {
  el.empty.hidden = false;
  el.empty.textContent = `Could not load clips: ${err.message}`;
});
