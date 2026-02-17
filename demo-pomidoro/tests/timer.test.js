import test from 'node:test';
import assert from 'node:assert/strict';
import { createTimer, formatDuration } from '../public/timer.js';

test('timer startuje i odlicza na bazie now', () => {
  const timer = createTimer({ durationMs: 10_000, autoTick: false });
  timer.start(1_000);
  const snapshot = timer.getSnapshot(4_000);
  assert.equal(snapshot.status, 'running');
  assert.equal(snapshot.remainingMs, 7_000);
  timer.dispose();
});

test('pause zatrzymuje pozostały czas', () => {
  const timer = createTimer({ durationMs: 10_000, autoTick: false });
  timer.start(1_000);
  timer.pause(5_000);
  const s1 = timer.getSnapshot(6_000);
  const s2 = timer.getSnapshot(9_000);
  assert.equal(s1.status, 'paused');
  assert.equal(s1.remainingMs, 6_000);
  assert.equal(s2.remainingMs, 6_000);
  timer.dispose();
});

test('resume kontynuuje od miejsca pauzy', () => {
  const timer = createTimer({ durationMs: 10_000, autoTick: false });
  timer.start(1_000);
  timer.pause(5_000);
  timer.resume(8_000);
  const snapshot = timer.getSnapshot(10_000);
  assert.equal(snapshot.status, 'running');
  assert.equal(snapshot.remainingMs, 4_000);
  timer.dispose();
});

test('reset przywraca stan idle i pełny czas', () => {
  const timer = createTimer({ durationMs: 10_000, autoTick: false });
  timer.start(1_000);
  timer.reset(3_000);
  const snapshot = timer.getSnapshot(7_000);
  assert.equal(snapshot.status, 'idle');
  assert.equal(snapshot.remainingMs, 10_000);
  timer.dispose();
});

test('timer przechodzi do completed i remaining=0', () => {
  const timer = createTimer({ durationMs: 5_000, autoTick: false });
  timer.start(1_000);
  const snapshot = timer.getSnapshot(7_000);
  assert.equal(snapshot.status, 'completed');
  assert.equal(snapshot.remainingMs, 0);
  timer.dispose();
});

test('onComplete wywołuje się raz', () => {
  let completedCalls = 0;
  const timer = createTimer({
    durationMs: 3_000,
    autoTick: false,
    onComplete: () => {
      completedCalls += 1;
    },
  });
  timer.start(1_000);
  timer.getSnapshot(5_000);
  timer.getSnapshot(8_000);
  assert.equal(completedCalls, 1);
  timer.dispose();
});

test('restoreFromState przywraca timer running', () => {
  const timer = createTimer({ durationMs: 10_000, autoTick: false });
  timer.restoreFromState({
    durationMs: 10_000,
    status: 'running',
    startedAt: 1_000,
    pausedAt: null,
    totalPausedMs: 0,
  }, 2_000);
  const snapshot = timer.getSnapshot(4_000);
  assert.equal(snapshot.status, 'running');
  assert.equal(snapshot.remainingMs, 7_000);
  timer.dispose();
});

test('formatDuration poprawnie formatuje mm:ss', () => {
  assert.equal(formatDuration(150_000), '02:30');
  assert.equal(formatDuration(1_000), '00:01');
  assert.equal(formatDuration(0), '00:00');
});