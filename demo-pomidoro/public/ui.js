import { formatDuration } from './timer.js';

function createBeep() {
  let audioContext = null;
  return () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }
    if (!audioContext) {
      audioContext = new AudioCtx();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.05;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };
}

export function createUI(doc = document) {
  const elements = {
    timerDisplay: doc.getElementById('timer-display'),
    timerStatus: doc.getElementById('timer-status'),
    startBtn: doc.getElementById('start-btn'),
    pauseBtn: doc.getElementById('pause-btn'),
    resumeBtn: doc.getElementById('resume-btn'),
    resetBtn: doc.getElementById('reset-btn'),
    newSessionBtn: doc.getElementById('new-session-btn'),
    journalInput: doc.getElementById('journal-input'),
    addEntryBtn: doc.getElementById('add-entry-btn'),
    journalError: doc.getElementById('journal-error'),
    journalList: doc.getElementById('journal-list'),
    todaySessions: doc.getElementById('today-sessions'),
    todayDistractions: doc.getElementById('today-distractions'),
    exportBtn: doc.getElementById('export-btn'),
    importBtn: doc.getElementById('import-btn'),
    clearDataBtn: doc.getElementById('clear-data-btn'),
    stateJson: doc.getElementById('state-json'),
  };

  const beep = createBeep();

  function renderTimer(snapshot) {
    elements.timerDisplay.textContent = formatDuration(snapshot.remainingMs);
    elements.timerStatus.textContent = snapshot.status;
    elements.timerStatus.classList.remove('flash');

    const status = snapshot.status;
    elements.startBtn.disabled = status === 'running';
    elements.pauseBtn.disabled = status !== 'running';
    elements.resumeBtn.disabled = status !== 'paused';
    elements.resetBtn.disabled = status === 'idle';
  }

  function renderJournal(entries) {
    while (elements.journalList.firstChild) {
      elements.journalList.removeChild(elements.journalList.firstChild);
    }

    for (const entry of entries) {
      const item = doc.createElement('li');
      const textNode = doc.createElement('span');
      textNode.textContent = entry.text;

      const timeNode = doc.createElement('small');
      const createdAt = new Date(entry.createdAt);
      timeNode.textContent = createdAt.toLocaleTimeString();

      item.appendChild(textNode);
      item.appendChild(timeNode);
      elements.journalList.appendChild(item);
    }
  }

  function renderDailyStats(stats) {
    elements.todaySessions.textContent = String(stats.sessions);
    elements.todayDistractions.textContent = String(stats.distractions);
  }

  function showError(message = '') {
    elements.journalError.textContent = message;
  }

  function readJournalInput() {
    return elements.journalInput.value;
  }

  function clearJournalInput() {
    elements.journalInput.value = '';
  }

  function setStateJson(value) {
    elements.stateJson.value = value;
  }

  function getStateJsonInput() {
    return elements.stateJson.value;
  }

  function signalTransition(message) {
    elements.timerStatus.textContent = message;
    elements.timerStatus.classList.add('flash');
    beep();
  }

  function bindControls(handlers) {
    elements.startBtn.addEventListener('click', handlers.onStart);
    elements.pauseBtn.addEventListener('click', handlers.onPause);
    elements.resumeBtn.addEventListener('click', handlers.onResume);
    elements.resetBtn.addEventListener('click', handlers.onReset);
    elements.newSessionBtn.addEventListener('click', handlers.onNewSession);
    elements.addEntryBtn.addEventListener('click', handlers.onAddEntry);
    elements.exportBtn.addEventListener('click', handlers.onExport);
    elements.importBtn.addEventListener('click', handlers.onImport);
    elements.clearDataBtn.addEventListener('click', handlers.onClearData);
  }

  return {
    renderTimer,
    renderJournal,
    renderDailyStats,
    showError,
    readJournalInput,
    clearJournalInput,
    setStateJson,
    getStateJsonInput,
    signalTransition,
    bindControls,
  };
}