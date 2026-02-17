# FocusFlow - specyfikacja produktu

## 1. Cel
Celem jest dostarczenie małego demo aplikacji web FocusFlow: Pomodoro + Distraction Journal, działającego w całości po stronie klienta, bez backendu.

## 2. Zakres
- Jednostronicowa aplikacja statyczna.
- Implementacja w Vanilla JS + DOM.
- Minimalny CSS, bez frameworków UI.
- Kompatybilność ze statycznym hostingiem (w tym GitHub Pages).

## 3. Non-goals
- Brak backendu i API sieciowego.
- Brak frameworków (React/Vue/Angular itp.).
- Brak funkcji poza wymaganiami A-D.

## 4. Wymagania funkcjonalne

### A. Pomodoro timer
- Użytkownik może uruchomić sesję skupienia o domyślnej długości 25 minut.
- Timer odlicza stabilnie na podstawie Date.now() i różnicy czasu, a nie na samym inkrementowaniu `setInterval`.
- UI pokazuje pozostały czas w formacie mm:ss.
- Po zakończeniu sesji timer przechodzi do stanu zakończonego i komunikuje koniec sesji w UI.

### B. Sterowanie sesją
- Dostępne są akcje: Start, Pauza, Wznów, Reset.
- Pauza zatrzymuje upływ czasu bez utraty już odliczonego postępu.
- Wznowienie kontynuuje od wartości z pauzy.
- Reset przywraca stan początkowy bieżącej sesji (25:00, status bez aktywnego odliczania).

### C. Distraction Journal
- Użytkownik może dodać wpis o rozproszeniu podczas sesji (krótki tekst).
- Każdy wpis zawiera tekst i znacznik czasu utworzenia (lokalny czas klienta).
- Wpisy są prezentowane jako lista w kolejności dodawania.
- Dodawanie pustych wpisów lub wpisów z samymi spacjami jest blokowane walidacją.

### D. Widok dzienny i integralność stanu
- Aplikacja pokazuje licznik ukończonych sesji w bieżącym dniu.
- Aplikacja pokazuje liczbę wpisów rozproszeń w bieżącym dniu.
- Dane sesji i wpisów przechowywane lokalnie (localStorage) i odtwarzane po odświeżeniu strony.
- Dane są ograniczone do kontekstu bieżącej przeglądarki i pochodzą z jednego źródła stanu po stronie klienta.

## 5. Wymagania niefunkcjonalne
- Wydajność: aktualizacja timera co 1s bez zauważalnych przycięć na typowym laptopie biurowym.
- Prostota: kod podzielony na małe funkcje odpowiedzialne za timer, journal i render.
- Przenośność: uruchomienie przez otwarcie statycznych plików lub hosting statyczny.
- Utrzymywalność: czytelne nazwy funkcji i brak ukrytych zależności globalnych poza celowym stanem aplikacji.

## 6. Bezpieczeństwo
- Zakaz używania innerHTML do renderowania danych pochodzących od użytkownika.
- Dane user input renderowane wyłącznie przez textContent lub bezpieczne API DOM.
- Walidacja i trim inputu przed zapisem do stanu.
- Brak wykonywania kodu z danych użytkownika.

## 7. Testowalność
- Funkcje timera muszą być testowalne przez kontrolowanie czasu referencyjnego (Date.now i obliczenia różnic).
- Walidacja journal musi mieć przypadki pozytywne i negatywne.
- Odtwarzanie stanu z localStorage musi być sprawdzalne testem jednostkowym lub integracyjnym.
- Aplikacja musi mieć możliwe do uruchomienia komendy: test, lint, build.

## 8. Kryteria DONE (dla T-001)
- Plik acceptance.json istnieje i zawiera testowalne AC dla wymagań A-D oraz kontroli jakości.
- Każde AC ma ID, opis, metodę weryfikacji (automatyczna/manual), komendy i oczekiwany rezultat.
- AC obejmują co najmniej: test, lint i build.
- status.json istnieje i ma ustawiony current_state na DESIGN po zakończeniu SpecAgent.
- Wymagania bezpieczeństwa i stabilnego timera są jawnie zapisane.
