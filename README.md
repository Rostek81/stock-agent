# Stock Agent (Node.js)

Agent działający w tle w **Node.js** analizuje wskazane spółki NASDAQ i codziennie wysyła raport e-mail.

## Co robi agent
1. Działa cyklicznie na podstawie CRON (`node-cron`).
2. Pobiera dzienne notowania spółek z NASDAQ ze Stooq (CSV HTTP).
3. Liczy score dla każdej spółki na podstawie:
   - trendu (SMA5 vs SMA20),
   - momentum (ostatnie zamknięcie vs SMA5),
   - wolumenu (bieżący vs średni z 20 sesji),
   - płynności (minimalny wolumen).
4. Ocenia, czy danego dnia bardziej „KUP” czy „OBSERWUJ”.
5. Wysyła raport na e-mail przez SMTP.

## Instalacja
```bash
npm install
cp .env.example .env
```

Uzupełnij `.env` o dane SMTP i e-mail odbiorcy.

## Uruchomienie
```bash
npm start
```

## Najważniejsze zmienne środowiskowe
- `REPORT_RECIPIENT` – odbiorca raportu.
- `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM` – konfiguracja SMTP.
- `AGENT_CRON` – harmonogram (domyślnie: `0 14 * * 1-5`, czyli dni robocze 14:00).
- `AGENT_TIMEZONE` – strefa czasowa (domyślnie `Europe/Warsaw`).
- `AGENT_SYMBOLS` – tickery NASDAQ oddzielone przecinkami.

## Uwagi
To narzędzie edukacyjne, nie stanowi porady inwestycyjnej.
