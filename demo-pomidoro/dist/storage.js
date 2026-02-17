export const STORAGE_KEY = 'focusflow.state';
export const MAX_JOURNAL_ENTRY_LENGTH = 200;

export function getLocalDateKey(dateValue = new Date()) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultState() {
  return {
    version: 1,
    timer: {
      durationMs: 25 * 60 * 1000,
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      totalPausedMs: 0,
    },
    journal: [],
    stats: {
      sessionsCompletedByDate: {},
    },
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeTimerState(timer) {
  const fallback = createDefaultState().timer;
  if (!isPlainObject(timer)) {
    return fallback;
  }
  const status =
    timer.status === 'idle' ||
    timer.status === 'running' ||
    timer.status === 'paused' ||
    timer.status === 'completed'
      ? timer.status
      : 'idle';
  return {
    durationMs: Number.isFinite(timer.durationMs) ? Math.max(1000, Math.floor(timer.durationMs)) : fallback.durationMs,
    status,
    startedAt: Number.isFinite(timer.startedAt) ? timer.startedAt : null,
    pausedAt: Number.isFinite(timer.pausedAt) ? timer.pausedAt : null,
    totalPausedMs: Number.isFinite(timer.totalPausedMs) ? Math.max(0, Math.floor(timer.totalPausedMs)) : 0,
  };
}

function normalizeJournalEntry(entry) {
  if (!isPlainObject(entry)) {
    return null;
  }
  const text = sanitizeEntryText(entry.text);
  if (!text) {
    return null;
  }
  const createdAt = typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString();
  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }
  const id = typeof entry.id === 'string' && entry.id.trim() ? entry.id : `${Date.now()}-${Math.random()}`;
  const dateKey = typeof entry.dateKey === 'string' && entry.dateKey.trim() ? entry.dateKey : getLocalDateKey(parsedDate);
  return {
    id,
    text,
    createdAt: parsedDate.toISOString(),
    dateKey,
  };
}

function normalizeState(rawState) {
  const fallback = createDefaultState();
  if (!isPlainObject(rawState)) {
    return fallback;
  }

  const statsRaw = isPlainObject(rawState.stats) ? rawState.stats : fallback.stats;
  const sessionsRaw = isPlainObject(statsRaw.sessionsCompletedByDate)
    ? statsRaw.sessionsCompletedByDate
    : fallback.stats.sessionsCompletedByDate;

  const sessionsCompletedByDate = {};
  for (const [key, value] of Object.entries(sessionsRaw)) {
    if (typeof key === 'string' && Number.isFinite(value) && value >= 0) {
      sessionsCompletedByDate[key] = Math.floor(value);
    }
  }

  const journalRaw = Array.isArray(rawState.journal) ? rawState.journal : [];
  const journal = journalRaw.map(normalizeJournalEntry).filter(Boolean);

  return {
    version: 1,
    timer: normalizeTimerState(rawState.timer),
    journal,
    stats: {
      sessionsCompletedByDate,
    },
  };
}

export function sanitizeEntryText(text) {
  if (typeof text !== 'string') {
    return '';
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.slice(0, MAX_JOURNAL_ENTRY_LENGTH);
}

export function loadState(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return createDefaultState();
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  const normalized = normalizeState(state);
  storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function incrementCompletedSessions(state, dateKey = getLocalDateKey(new Date())) {
  const nextState = normalizeState(state);
  const currentCount = nextState.stats.sessionsCompletedByDate[dateKey] || 0;
  nextState.stats.sessionsCompletedByDate[dateKey] = currentCount + 1;
  return nextState;
}

export function addJournalEntry(state, inputText, now = new Date()) {
  const text = sanitizeEntryText(inputText);
  if (!text) {
    return {
      ok: false,
      error: 'Wpis nie może być pusty.',
      state: normalizeState(state),
    };
  }

  const nextState = normalizeState(state);
  const createdAtDate = now instanceof Date ? now : new Date(now);
  const entry = {
    id: `${createdAtDate.getTime()}-${Math.random().toString(16).slice(2)}`,
    text,
    createdAt: createdAtDate.toISOString(),
    dateKey: getLocalDateKey(createdAtDate),
  };
  nextState.journal.push(entry);

  return {
    ok: true,
    state: nextState,
    entry,
  };
}

export function getDailyStats(state, dateKey = getLocalDateKey(new Date())) {
  const safeState = normalizeState(state);
  const sessions = safeState.stats.sessionsCompletedByDate[dateKey] || 0;
  const distractions = safeState.journal.filter((entry) => entry.dateKey === dateKey).length;
  return {
    sessions,
    distractions,
  };
}

export function exportState(state) {
  return JSON.stringify(normalizeState(state), null, 2);
}

export function importState(rawJson) {
  if (typeof rawJson !== 'string' || !rawJson.trim()) {
    return {
      ok: false,
      error: 'Brak danych JSON do importu.',
    };
  }

  try {
    const parsed = JSON.parse(rawJson);
    const normalized = normalizeState(parsed);
    return {
      ok: true,
      state: normalized,
    };
  } catch {
    return {
      ok: false,
      error: 'Niepoprawny format JSON.',
    };
  }
}

export function clearState(storage = globalThis.localStorage) {
  storage.removeItem(STORAGE_KEY);
}

export function createMemoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    clear() {
      map.clear();
    },
  };
}