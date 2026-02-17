# FocusFlow - architektura

## 1. Cel i zakres
Dokument definiuje architekturę aplikacji FocusFlow zgodną ze specyfikacją produktu i acceptance criteria. Zakres obejmuje aplikację frontend działającą w przeglądarce, bez backendu, z lokalnym utrwalaniem danych.

## 2. Mapowanie wymagań A-D

### A. Pomodoro timer
- Odpowiada moduł `timer.js`.
- Odliczanie oparte o `Date.now()` i obliczanie czasu pozostałego z różnicy względem punktu startu oraz sumy pauz.
- UI czasu w formacie `mm:ss` renderowane przez `ui.js`.

### B. Sterowanie sesją
- Odpowiadają moduły `app.js` (orchestracja akcji) i `timer.js` (logika stanów).
- Stany: `idle`, `running`, `paused`, `completed`.
- Akcje: Start, Pause, Resume, Reset.

### C. Distraction Journal
- Odpowiadają moduły `app.js` (walidacja i workflow), `storage.js` (persist), `ui.js` (render listy).
- Wpis: tekst + timestamp lokalny.
- Walidacja: `trim()`, blokada pustych wpisów.
- Render tylko bezpiecznymi API DOM, bez `innerHTML` z danych użytkownika.

### D. Widok dzienny i integralność stanu
- Odpowiadają moduły `storage.js` (single source of truth + localStorage) i `app.js` (agregacja liczników dnia).
- Liczniki dzienne liczone po lokalnej dacie użytkownika.
- Stan odtwarzany po odświeżeniu strony z localStorage.

## 3. Komponenty i moduły

### 3.1 Struktura plików
- `/public/app.js` - inicjalizacja, obsługa zdarzeń UI, koordynacja modułów.
- `/public/timer.js` - silnik timera i przejścia stanów sesji.
- `/public/storage.js` - warstwa odczytu/zapisu localStorage, import/export JSON.
- `/public/ui.js` - render widoków i liczników, bezpieczne mapowanie stanu na DOM.

### 3.2 Odpowiedzialności
- `app.js`:
  - bootstrap aplikacji,
  - podpinanie event listenerów przycisków,
  - wywoływanie API `timer`, `storage`, `ui`,
  - synchronizacja cyklu renderowania i zapisu.
- `timer.js`:
  - zarządzanie stanem sesji i czasem,
  - obliczanie `remainingMs` na bazie `Date.now()`,
  - tick co ~1000 ms (UI cadence),
  - detekcja zakończenia sesji.
- `storage.js`:
  - schema danych i migracja domyślna,
  - atomowe `loadState()` i `saveState(state)`,
  - `exportState()` i `importState(json)` z walidacją struktury.
- `ui.js`:
  - render czasu, statusu sesji, listy wpisów, liczników dnia,
  - aktualizacja tekstu przez `textContent`,
  - mapowanie stanu na aktywność przycisków.

## 4. Interfejsy modułów

### 4.1 timer.js (proponowane API)
- `createTimer(config)` - tworzy instancję timera.
- `start(now = Date.now())`.
- `pause(now = Date.now())`.
- `resume(now = Date.now())`.
- `reset(now = Date.now())`.
- `getSnapshot(now = Date.now())` -> `{ status, remainingMs, durationMs, startedAt, pausedAt, totalPausedMs }`.
- `subscribe(listener)` -> callback na zmianę stanu.
- `dispose()` - cleanup interwałów/listenerów.

### 4.2 storage.js (proponowane API)
- `loadState()` -> pełny stan aplikacji.
- `saveState(state)`.
- `appendJournalEntry(entry)`.
- `incrementCompletedSessions(dateKey)`.
- `exportState()` -> string JSON.
- `importState(rawJson)` -> `{ ok, error? }`.

### 4.3 ui.js (proponowane API)
- `bindControls(handlers)`.
- `renderTimer(snapshot)`.
- `renderJournal(entries)`.
- `renderDailyStats(stats)`.
- `renderStatus(message)`.
- `readJournalInput()`.
- `clearJournalInput()`.

### 4.4 app.js (proponowane API)
- `initApp()`.
- `handleStart()` / `handlePause()` / `handleResume()` / `handleReset()`.
- `handleAddDistraction()`.
- `handleImport()` / `handleExport()`.

## 5. Model danych i storage

## 5.1 Klucze localStorage
- `focusflow.state` - główny JSON stanu.

## 5.2 Schemat stanu (v1)
```json
{
  "version": 1,
  "timer": {
    "durationMs": 1500000,
    "status": "idle",
    "startedAt": null,
    "pausedAt": null,
    "totalPausedMs": 0,
    "lastTickAt": null
  },
  "journal": [
    {
      "id": "uuid-or-timestamp",
      "text": "string",
      "createdAt": "2026-02-17T10:15:00.000Z",
      "dateKey": "2026-02-17"
    }
  ],
  "stats": {
    "sessionsCompletedByDate": {
      "2026-02-17": 2
    }
  }
}
```

## 5.3 Zasady integralności
- Single source of truth: tylko obiekt stanu w `storage.js`.
- `dateKey` wyliczany lokalnie z daty użytkownika.
- Zapis po każdej zmianie stanu biznesowego (nie po każdym repaint).
- Przy błędnym JSON fallback do bezpiecznego stanu domyślnego.

## 6. Przepływy stanu timera

## 6.1 Start
`idle|completed -> running`
- Ustaw `startedAt = now`, `pausedAt = null`, `totalPausedMs = 0`.
- Oblicz `remainingMs = durationMs - (now - startedAt - totalPausedMs)`.

## 6.2 Pause
`running -> paused`
- Ustaw `pausedAt = now`.
- Zamroź `remainingMs` wyliczane z aktualnego snapshotu.

## 6.3 Resume
`paused -> running`
- Dodaj `now - pausedAt` do `totalPausedMs`.
- Wyzeruj `pausedAt`.

## 6.4 Reset
`running|paused|completed -> idle`
- Przywróć `durationMs` i pola czasowe do wartości początkowych.

## 6.5 Complete
`running -> completed`
- Gdy `remainingMs <= 0`, ustaw `remainingMs = 0`, status `completed`.
- Zwiększ licznik sesji dla `dateKey` bieżącego dnia.

## 7. Bezpieczeństwo i ryzyka

## 7.1 Security
- Ryzyko: XSS przez renderowanie wpisów użytkownika.
- Mitigacja:
  - zakaz `innerHTML` dla danych user input,
  - wyłącznie `textContent` i `createElement`,
  - `trim()` oraz limit długości wpisu (np. 200 znaków) przed zapisem.

## 7.2 Performance
- Ryzyko: dryf timera przy throttlingu kart.
- Mitigacja:
  - obliczanie czasu z `Date.now()`, nie z liczby ticków,
  - `setInterval` traktowany jako sygnał repaint, nie źródło prawdy czasu.

## 7.3 Breaking-change
- Ryzyko: zmiana schematu storage.
- Mitigacja:
  - pole `version` + migracje,
  - walidacja importu i bezpieczny fallback,
  - kompatybilność wsteczna dla v1.

## 8. Strategia testów

## 8.1 Jednostkowe
- `timer.js`:
  - start/pause/resume/reset,
  - poprawne `remainingMs` dla kontrolowanych wartości `now`,
  - zakończenie sesji przy przekroczeniu czasu.
- `storage.js`:
  - `loadState/saveState`,
  - import/export JSON + walidacja,
  - odtwarzanie stanu z localStorage.
- walidacja journal:
  - akceptacja poprawnych wpisów,
  - odrzucanie pustych/whitespace.

## 8.2 Integracyjne
- przepływ UI: Start -> Pause -> Resume -> Reset,
- dodawanie wpisu i render listy,
- przeliczenie liczników dnia,
- odświeżenie strony i odtworzenie stanu.

## 8.3 Quality gates
- `npm test`
- `npm run lint`
- `npm run build`

## 9. Założenia i decyzje
- Aplikacja pozostaje bez backendu i bez frameworków UI.
- Czas dnia oparty o lokalną strefę czasową użytkownika.
- Import/export dotyczy wyłącznie JSON zgodnego ze schematem stanu.