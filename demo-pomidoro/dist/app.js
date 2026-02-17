import { createTimer } from './timer.js';
import {
  addJournalEntry,
  clearState,
  createDefaultState,
  exportState,
  getDailyStats,
  importState,
  incrementCompletedSessions,
  loadState,
  saveState,
} from './storage.js';
import { createUI } from './ui.js';

const ui = createUI(document);
let appState = loadState();

const timer = createTimer({
  durationMs: appState.timer.durationMs,
  onComplete: () => {
    appState = incrementCompletedSessions(appState);
    persistState();
    ui.signalTransition('completed');
    renderAll();
  },
});

timer.restoreFromState(appState.timer);

function persistState() {
  appState.timer = timer.exportState();
  appState = saveState(appState);
}

function renderAll(snapshot = timer.getSnapshot()) {
  const dailyStats = getDailyStats(appState);
  ui.renderTimer(snapshot);
  ui.renderJournal(appState.journal);
  ui.renderDailyStats(dailyStats);
}

function handleStart() {
  const snapshot = timer.start();
  persistState();
  renderAll(snapshot);
}

function handlePause() {
  const snapshot = timer.pause();
  persistState();
  renderAll(snapshot);
}

function handleResume() {
  const snapshot = timer.resume();
  persistState();
  renderAll(snapshot);
}

function handleReset() {
  const snapshot = timer.reset();
  persistState();
  renderAll(snapshot);
}

function handleNewSession() {
  const snapshot = timer.reset();
  ui.showError('');
  persistState();
  renderAll(snapshot);
}

function handleAddEntry() {
  const inputValue = ui.readJournalInput();
  const result = addJournalEntry(appState, inputValue, new Date());
  if (!result.ok) {
    ui.showError(result.error);
    return;
  }

  ui.showError('');
  ui.clearJournalInput();
  appState = result.state;
  persistState();
  renderAll();
}

function handleExport() {
  ui.setStateJson(exportState(appState));
}

function handleImport() {
  const raw = ui.getStateJsonInput();
  const result = importState(raw);
  if (!result.ok) {
    ui.showError(result.error);
    return;
  }

  appState = result.state;
  timer.restoreFromState(appState.timer);
  persistState();
  ui.showError('');
  renderAll();
}

function handleClearData() {
  const confirmed = window.confirm('Czy na pewno chcesz usunąć wszystkie dane FocusFlow?');
  if (!confirmed) {
    return;
  }

  clearState();
  appState = createDefaultState();
  timer.restoreFromState(appState.timer);
  ui.setStateJson('');
  ui.showError('Dane usunięte.');
  persistState();
  renderAll();
}

function bindKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    const isTextInput =
      event.target instanceof HTMLElement &&
      (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA');

    if (event.code === 'Space') {
      if (!isTextInput) {
        event.preventDefault();
      }
      const status = timer.getSnapshot().status;
      if (status === 'running') {
        handlePause();
      } else if (status === 'paused') {
        handleResume();
      } else {
        handleStart();
      }
      return;
    }

    if (isTextInput) {
      return;
    }

    if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      handleReset();
      return;
    }

    if (event.key.toLowerCase() === 'n') {
      event.preventDefault();
      handleNewSession();
    }
  });
}

ui.bindControls({
  onStart: handleStart,
  onPause: handlePause,
  onResume: handleResume,
  onReset: handleReset,
  onNewSession: handleNewSession,
  onAddEntry: handleAddEntry,
  onExport: handleExport,
  onImport: handleImport,
  onClearData: handleClearData,
});

timer.subscribe((snapshot) => {
  appState.timer = timer.exportState();
  renderAll(snapshot);
  if (snapshot.status !== 'running') {
    persistState();
  }
});

bindKeyboardShortcuts();
renderAll(timer.getSnapshot());