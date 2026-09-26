# Rotland — strona serwera DayZ

Statyczna strona (HTML/CSS/JS, bez backendu) gotowa pod GitHub Pages.

## Struktura

```
index.html          Home
o-serwerze.html      O serwerze
jak-dolaczyc.html    Jak dołączyć
regulamin.html       Regulamin
shop.html            Shop
assets/css/style.css Style
assets/js/main.js    Menu mobilne, przełącznik PL/EN, kopiowanie IP
assets/img/          Grafiki (baner)
```

## Uruchomienie na GitHub Pages

1. Wrzuć całą zawartość tego folderu do repozytorium na GitHubie (np. `rotland-strona`).
2. W ustawieniach repo: **Settings → Pages → Branch: main / (root)** → Save.
3. Po chwili strona będzie dostępna pod `https://twoja-nazwa.github.io/rotland-strona/`.
4. Jeśli chcesz własną domenę (np. `rotland.pl`), dodaj plik `CNAME` z jej nazwą i ustaw rekord DNS `CNAME` na `twoja-nazwa.github.io`.

## Co trzeba podmienić przed publikacją

Szukaj w plikach `.html`:

- `https://discord.gg/TWOJ-LINK` — link do Discorda (kilka miejsc w każdym pliku).
- `136.243.60.212:2491` — adres IP serwera (hero, stopka, strona "Jak dołączyć").
- Bloki oznaczone `DO UZUPEŁNIENIA` / `TO FILL IN` — lista modów, regulamin, opis lokacji, pakiety w sklepie.
- `@asiekdraws`, `@liilgames`, `@xdanql` w stopce — podpisy autorów grafiki, zostaw lub zmień wedle uzgodnień.
- W `shop.html` pakiety mają linki `href="#"` — podepnij realny system płatności (np. Tebex) i zaktualizuj ceny/zawartość.

## Przełącznik PL/EN

Każdy tekst istnieje w dwóch wersjach obok siebie w HTML, oznaczonych `data-lang="pl"` i `data-lang="en"` (ten drugi ma atrybut `hidden`). Skrypt `main.js` przełącza widoczność i zapamiętuje wybór w przeglądarce użytkownika. Dodając nową treść, zawsze dodawaj oba warianty językowe obok siebie.

## Dodawanie nowej podstrony

1. Skopiuj jeden z istniejących plików (np. `o-serwerze.html`) jako szablon.
2. Zaktualizuj `<title>`, opis meta i klasę `active` w nawigacji.
3. Dodaj link do niej w `main-nav` i w stopce na **wszystkich** stronach.

## Grafiki

Baner umieszczony jest w dwóch formatach: `hero-rotland.png` (oryginał) i `hero-rotland.jpg` (skompresowany, używany na stronie dla szybszego ładowania). Dodając kolejne grafiki, trzymaj je w `assets/img/` i kompresuj do JPG/WebP przed wrzuceniem.
