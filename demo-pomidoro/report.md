# FocusFlow - Release report (T-150)

## Co zrobiono

- Zweryfikowano kompletność dokumentacji pod release.
- Uzupełniono `README.md` o sekcje: skróty npm, testowanie manualne, known issues.
- Uporządkowano instrukcje uruchamiania i weryfikacji dla zakresu A-D.

## Podsumowanie decyzji

- Projekt pozostaje statyczny i bez backendu (zgodnie ze spec).
- Utrzymano podejście Vanilla JS + DOM bez frameworków.
- Timer bazuje na `Date.now()` i różnicy czasu, a nie na samych tickach interwału.
- Dane aplikacji pozostają w `localStorage` jako single source of truth po stronie klienta.
- Render danych użytkownika jest realizowany bez `innerHTML` (bezpieczne API DOM).

## Jak uruchomić

1. Wymagany Node.js 20+.
2. Instalacja zależności (jeśli potrzebna):

```bash
npm install
```

3. Uruchom testy:

```bash
npm test
```

4. Uruchom lint:

```bash
npm run lint
```

5. Uruchom build:

```bash
npm run build
```

6. Otwórz `public/index.html` w przeglądarce lub hostuj `public`/`dist` statycznie.

## Jak testować

### Automatycznie

- `npm test`
- `npm run lint`
- `npm run build`

### Manualnie (A-D)

1. A-B: scenariusz `Start -> Pauza -> Wznów -> Reset`; po zakończeniu sesji status `completed`.
2. C: dodanie wpisu z tekstem i timestampem; odrzucenie wpisu pustego/whitespace.
3. D: po zakończeniu sesji rośnie licznik dzienny sesji, po dodaniu wpisu rośnie licznik rozproszeń.
4. D: odświeżenie strony odtwarza stan z `localStorage`.
5. D: export/import JSON odtwarza poprawny stan.

## Known issues

- Dźwięk zakończenia sesji może wymagać wcześniejszej interakcji użytkownika (autoplay policy).
- Dane są lokalne dla przeglądarki i urządzenia; brak synchronizacji między urządzeniami.

## Status

- Etap: RELEASE
- Task domknięty: T-150
