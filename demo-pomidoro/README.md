# FocusFlow Demo

Statyczne demo Pomodoro + Distraction Journal w Vanilla JS, bez backendu.

## Quickstart

1. Upewnij się, że masz Node.js 20+.
2. Uruchom testy:

```bash
npm test
```

3. Uruchom lint:

```bash
npm run lint
```

4. Zbuduj artefakt statyczny:

```bash
npm run build
```

5. Otwórz `public/index.html` w przeglądarce (lub hostuj katalog `public`/`dist` na statycznym hostingu).

## Skróty npm

- `npm test` - uruchamia testy jednostkowe (`node --test`)
- `npm run lint` - uruchamia lint projektu
- `npm run build` - waliduje i przygotowuje artefakt statyczny

## Jak testować manualnie

1. Timer: `Start -> Pauza -> Wznów -> Reset` i weryfikacja zmian stanu.
2. Journal: dodanie poprawnego wpisu oraz próba wpisu pustego (powinien być odrzucony).
3. Persistence: odśwież stronę i sprawdź, czy stan wraca z `localStorage`.
4. Dane: wykonaj `Export JSON`, następnie `Import JSON` i sprawdź spójność stanu.

## Funkcje

- Pomodoro 25:00 ze stanami: idle, running, paused, completed.
- Sterowanie: Start, Pauza, Wznów, Reset, Nowa sesja.
- Distraction Journal z walidacją `trim()` i timestampem lokalnym.
- Liczniki dzienne sesji i rozproszeń.
- localStorage persistence + import/export JSON + clear data z potwierdzeniem.

## Skróty klawiaturowe

- `Space` - Start/Pauza/Wznów (zależnie od stanu)
- `R` - Reset sesji
- `N` - Nowa sesja

## Known issues

- Dźwięk zakończenia sesji może nie zagrać bez wcześniejszej interakcji użytkownika (polityki autoplay przeglądarek).
- Dane są lokalne dla przeglądarki i urządzenia, brak synchronizacji między urządzeniami (świadomy non-goal).

## Bezpieczeństwo

- Brak `innerHTML` dla danych użytkownika.
- Render wpisów journal tylko przez bezpieczne API DOM i `textContent`.