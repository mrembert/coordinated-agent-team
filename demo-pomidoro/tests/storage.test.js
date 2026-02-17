import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  addJournalEntry,
  createDefaultState,
  createMemoryStorage,
  exportState,
  getDailyStats,
  importState,
  incrementCompletedSessions,
  loadState,
  sanitizeEntryText,
  saveState,
} from '../public/storage.js';

test('sanitizeEntryText trimuje i odrzuca puste', () => {
  assert.equal(sanitizeEntryText('   abc  '), 'abc');
  assert.equal(sanitizeEntryText('   '), '');
});

test('loadState zwraca domyślny stan gdy storage pusty', () => {
  const storage = createMemoryStorage();
  const state = loadState(storage);
  assert.deepEqual(state, createDefaultState());
});

test('saveState i loadState persistują dane', () => {
  const storage = createMemoryStorage();
  let state = createDefaultState();
  state = incrementCompletedSessions(state, '2026-02-17');
  saveState(state, storage);
  const loaded = loadState(storage);
  assert.equal(loaded.stats.sessionsCompletedByDate['2026-02-17'], 1);
});

test('addJournalEntry dodaje poprawny wpis', () => {
  const state = createDefaultState();
  const now = new Date('2026-02-17T10:00:00.000Z');
  const result = addJournalEntry(state, 'Rozproszenie', now);
  assert.equal(result.ok, true);
  assert.equal(result.state.journal.length, 1);
  assert.equal(result.state.journal[0].text, 'Rozproszenie');
});

test('addJournalEntry blokuje puste wpisy', () => {
  const state = createDefaultState();
  const result = addJournalEntry(state, '   ', new Date());
  assert.equal(result.ok, false);
  assert.equal(result.state.journal.length, 0);
});

test('incrementCompletedSessions zwiększa licznik dla dnia', () => {
  const state = createDefaultState();
  const next = incrementCompletedSessions(state, '2026-02-17');
  assert.equal(next.stats.sessionsCompletedByDate['2026-02-17'], 1);
});

test('getDailyStats zwraca poprawne liczniki dnia', () => {
  let state = createDefaultState();
  state = incrementCompletedSessions(state, '2026-02-17');
  const entry = addJournalEntry(state, 'A', new Date('2026-02-17T10:00:00.000Z'));
  state = entry.state;
  const stats = getDailyStats(state, '2026-02-17');
  assert.equal(stats.sessions, 1);
  assert.equal(stats.distractions, 1);
});

test('exportState i importState roundtrip zachowują dane', () => {
  let state = createDefaultState();
  state = incrementCompletedSessions(state, '2026-02-17');
  state = addJournalEntry(state, 'X', new Date('2026-02-17T11:00:00.000Z')).state;
  const raw = exportState(state);
  const imported = importState(raw);
  assert.equal(imported.ok, true);
  assert.equal(imported.state.stats.sessionsCompletedByDate['2026-02-17'], 1);
  assert.equal(imported.state.journal.length, 1);
});

test('importState odrzuca niepoprawny JSON', () => {
  const imported = importState('{broken');
  assert.equal(imported.ok, false);
});

test('loadState fallbackuje do default przy uszkodzonym storage', () => {
  const storage = createMemoryStorage({ [STORAGE_KEY]: '{bad' });
  const state = loadState(storage);
  assert.deepEqual(state, createDefaultState());
});