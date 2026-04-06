# Stock Agent (Spring Boot)

Agent działający w tle analizuje wskazane spółki NASDAQ i codziennie wysyła raport e-mail.

## Jak działa
1. Scheduler (`@Scheduled`) uruchamia analizę w dni robocze.
2. Dane dzienne pobierane są ze Stooq (CSV HTTP).
3. Algorytm wylicza score na podstawie:
   - trendu (SMA5 vs SMA20),
   - momentum (ostatnie zamknięcie vs SMA5),
   - wolumenu (bieżący vs średni z 20 dni),
   - płynności (minimalny wolumen).
4. Tworzony jest ranking i raport wysyłany przez SMTP.

## Konfiguracja
Wymagane zmienne środowiskowe:
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `REPORT_RECIPIENT`

Opcjonalne (w `application.yml`):
- `agent.cron` (domyślnie: `0 0 14 * * MON-FRI`)
- `agent.time-zone` (domyślnie: `Europe/Warsaw`)
- `agent.symbols`
- `agent.min-daily-volume`
- `agent.min-score-to-recommend`

## Uruchomienie
```bash
mvn spring-boot:run
```

## Uwaga
To prosty model punktowy (nie jest doradztwem inwestycyjnym). Przed inwestycją zweryfikuj wyniki dodatkowymi analizami fundamentalnymi i ryzykiem.
