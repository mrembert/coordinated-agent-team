const DEFAULT_DURATION_MS = 25 * 60 * 1000;

function clampMs(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}

function computeRunningRemainingMs(state, now) {
  const elapsedMs = now - state.startedAt - state.totalPausedMs;
  return clampMs(state.durationMs - elapsedMs);
}

export function createTimer(config = {}) {
  const durationMs = Number.isFinite(config.durationMs)
    ? Math.max(1000, Math.floor(config.durationMs))
    : DEFAULT_DURATION_MS;
  const tickMs = Number.isFinite(config.tickMs) ? Math.max(100, Math.floor(config.tickMs)) : 1000;
  const autoTick = config.autoTick !== false;
  const onComplete = typeof config.onComplete === 'function' ? config.onComplete : null;

  const listeners = new Set();
  let intervalId = null;
  let hasCompletedNotified = false;

  const state = {
    status: 'idle',
    durationMs,
    startedAt: null,
    pausedAt: null,
    totalPausedMs: 0,
  };

  function stopTicker() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startTicker() {
    if (!autoTick || intervalId !== null) {
      return;
    }
    intervalId = setInterval(() => {
      emit(Date.now());
    }, tickMs);
  }

  function getRemainingMs(now = Date.now()) {
    if (state.status === 'running') {
      return computeRunningRemainingMs(state, now);
    }
    if (state.status === 'paused' && state.startedAt !== null && state.pausedAt !== null) {
      const elapsedMs = state.pausedAt - state.startedAt - state.totalPausedMs;
      return clampMs(state.durationMs - elapsedMs);
    }
    if (state.status === 'completed') {
      return 0;
    }
    return state.durationMs;
  }

  function complete(now) {
    state.status = 'completed';
    state.pausedAt = null;
    stopTicker();
    if (!hasCompletedNotified && onComplete) {
      hasCompletedNotified = true;
      onComplete({ completedAt: now });
    }
  }

  function getSnapshot(now = Date.now()) {
    let effectiveStatus = state.status;
    let remainingMs = getRemainingMs(now);

    if (effectiveStatus === 'running' && remainingMs <= 0) {
      complete(now);
      effectiveStatus = state.status;
      remainingMs = 0;
    }

    return {
      status: effectiveStatus,
      durationMs: state.durationMs,
      remainingMs,
      startedAt: state.startedAt,
      pausedAt: state.pausedAt,
      totalPausedMs: state.totalPausedMs,
    };
  }

  function emit(now = Date.now()) {
    const snapshot = getSnapshot(now);
    for (const listener of listeners) {
      listener(snapshot);
    }
    return snapshot;
  }

  function start(now = Date.now()) {
    state.status = 'running';
    state.startedAt = now;
    state.pausedAt = null;
    state.totalPausedMs = 0;
    hasCompletedNotified = false;
    startTicker();
    return emit(now);
  }

  function pause(now = Date.now()) {
    if (state.status !== 'running') {
      return getSnapshot(now);
    }
    state.status = 'paused';
    state.pausedAt = now;
    stopTicker();
    return emit(now);
  }

  function resume(now = Date.now()) {
    if (state.status !== 'paused' || state.pausedAt === null) {
      return getSnapshot(now);
    }
    state.totalPausedMs += now - state.pausedAt;
    state.pausedAt = null;
    state.status = 'running';
    startTicker();
    return emit(now);
  }

  function reset(now = Date.now()) {
    state.status = 'idle';
    state.startedAt = null;
    state.pausedAt = null;
    state.totalPausedMs = 0;
    hasCompletedNotified = false;
    stopTicker();
    return emit(now);
  }

  function restoreFromState(timerState, now = Date.now()) {
    if (!timerState || typeof timerState !== 'object') {
      return reset(now);
    }
    const status =
      timerState.status === 'idle' ||
      timerState.status === 'running' ||
      timerState.status === 'paused' ||
      timerState.status === 'completed'
        ? timerState.status
        : 'idle';

    state.durationMs = Number.isFinite(timerState.durationMs)
      ? Math.max(1000, Math.floor(timerState.durationMs))
      : durationMs;
    state.status = status;
    state.startedAt = Number.isFinite(timerState.startedAt) ? timerState.startedAt : null;
    state.pausedAt = Number.isFinite(timerState.pausedAt) ? timerState.pausedAt : null;
    state.totalPausedMs = Number.isFinite(timerState.totalPausedMs)
      ? Math.max(0, Math.floor(timerState.totalPausedMs))
      : 0;
    hasCompletedNotified = status === 'completed';

    if (state.status === 'running') {
      startTicker();
    } else {
      stopTicker();
    }

    return emit(now);
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(getSnapshot(Date.now()));
    return () => listeners.delete(listener);
  }

  function exportState(now = Date.now()) {
    const snapshot = getSnapshot(now);
    return {
      status: snapshot.status,
      durationMs: snapshot.durationMs,
      startedAt: snapshot.startedAt,
      pausedAt: snapshot.pausedAt,
      totalPausedMs: snapshot.totalPausedMs,
    };
  }

  function dispose() {
    stopTicker();
    listeners.clear();
  }

  return {
    start,
    pause,
    resume,
    reset,
    getSnapshot,
    restoreFromState,
    exportState,
    subscribe,
    dispose,
  };
}

export function formatDuration(remainingMs) {
  const totalSeconds = Math.ceil(Math.max(0, remainingMs) / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export { DEFAULT_DURATION_MS };