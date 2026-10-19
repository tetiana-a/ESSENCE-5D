# ESSENCE 5D — Beyond the Obvious

Working local MVP of an AI observatory. Original spectral geometry, five analytical dimensions, 60 selectable virtual IT perspectives, five UI languages, browser-local history, JSON/Markdown export and a server-side bring-your-own-key integration.

## Run

Requires Node.js 22.6+ (verified with 24.14.0). No dependencies, install step, build service, or external assets.

```sh
npm start
```

Open http://127.0.0.1:4173. Alternatively run `node server.mjs`. On Windows, `start.cmd` launches it from the correct directory. Stop with Ctrl+C.

Choose **AI connection**, choose a provider, enter your own API key, and choose **Connect**. Keys are never included in source, localStorage, logs, results or exports. Configuration is not key verification; a real analysis verifies the provider. The app has no demo analysis mode.

Optional: copy `.env.example` to `.env` and set server-only keys. `npm start` loads this file. Environment keys take precedence only when a session key is absent. Removing a session key does not remove environment credentials. Restart after changing `.env`. Never commit or share this file.

## User instructions / Uživatelský návod / Istruzioni / Инструкция / Інструкція

**English:** Connect your provider with your API key. Select one or more virtual experts. Enter text in any language and choose Explore in 5D. Results are requested in the selected interface language. Inspect Data, Context, Connections, Blind spots and Action, select graph nodes, and export Markdown or JSON. History stays on this browser/device. Without a key, no AI request is made. Provider failures do not create results. Treat output as hypotheses to verify.

**Čeština:** Připojte poskytovatele pomocí svého API klíče. Vyberte alespoň jednu virtuální expertní roli. Zadejte text v libovolném jazyce a zvolte Prozkoumat v 5D. Odpověď je požadována v jazyce rozhraní. Projděte Data, Kontext, Souvislosti, Slepá místa a Akce, vyberte uzly grafu a exportujte Markdown nebo JSON. Historie zůstává v tomto prohlížeči a zařízení. Bez klíče se AI nevolá. Chyby nevytvářejí výsledky. Výstup jsou hypotézy k ověření.

**Italiano:** Collega il fornitore con la tua chiave API. Seleziona almeno un ruolo virtuale. Inserisci testo in qualsiasi lingua e scegli Esplora in 5D. La risposta viene richiesta nella lingua dell’interfaccia. Esamina Dati, Contesto, Connessioni, Punti ciechi e Azione, seleziona i nodi del grafo ed esporta Markdown o JSON. La cronologia resta nel browser sul dispositivo. Senza chiave non viene fatta alcuna richiesta AI. Gli errori non generano risultati. Verifica le ipotesi del modello.

**Русский:** В разделе «Подключение AI» выберите провайдера и введите свой API-ключ. Выберите хотя бы одну виртуальную роль. Введите текст на любом языке и нажмите «Исследовать в 5D». Ответ запрашивается на языке интерфейса. Изучите данные, контекст, связи, слепые зоны и действия; выберите узлы графа и экспортируйте Markdown или JSON. История остаётся в этом браузере на этом устройстве. Без ключа вызов AI не выполняется; ошибка не подменяется вымышленным результатом. Проверяйте гипотезы модели.

**Українська:** У розділі «Підключення AI» виберіть провайдера та введіть власний API-ключ. Виберіть хоча б одну віртуальну роль. Введіть текст будь-якою мовою та натисніть «Дослідити в 5D». Відповідь запитується мовою інтерфейсу. Дослідіть дані, контекст, зв’язки, сліпі зони та дії; виберіть вузли графа й експортуйте Markdown або JSON. Історія залишається в цьому браузері на цьому пристрої. Без ключа AI не викликається; помилка не замінюється вигаданим результатом. Перевіряйте гіпотези моделі.

## What is implemented

- Framework-free responsive interface: desktop sidebar, tablet layout, mobile navigation and flat graph; native keyboard controls, focus outlines, semantic labels and status messages.
- All main screens, error messages, 60 roles and user guidance translated into English, Czech, Italian, Russian and Ukrainian. Unicode input preserved; old results retain their original language when the UI language changes.
- One provider call with the selected virtual perspectives. It does not run 60 independent agents or impersonate real experts.
- Five mandatory analysis sections, synthesis, model/token provenance and a validated concept graph. Responses are schema-checked; invalid or truncated JSON is rejected.
- Interactive SVG graph and equivalent accessible concept buttons/relationship list. Desktop “3D” is a lightweight CSS perspective of the 2D graph, **not a WebGL or volumetric graph**. Mobile and reduced motion use flat rendering.
- Last 30 successful analyses in localStorage, reopen/delete/clear, original-language Markdown and complete JSON exports. Storage failures show a warning; the current result remains exportable.
- OpenRouter, Groq and Gemini fixed server-side endpoints, editable model IDs, timeout and distinct no-key/auth/credit/rate-limit/network/invalid-response errors. No automatic paid fallback or retries.
- Session credentials held in server memory, HttpOnly SameSite cookie, one-hour expiry, no request logging; origin/Host checks, CSP, bounded input, per-session 6 requests/minute and one in-flight analysis. The server binds **only to 127.0.0.1**.

## Providers and free-tier limits

OpenRouter defaults to `openrouter/free` and rejects model IDs that are neither this router nor `:free` variants. Groq defaults to `llama-3.3-70b-versatile`; Gemini defaults to `gemini-2.5-flash`. Model availability can change; the field is editable. Free quotas, availability and billing depend on the provider account; the app cannot guarantee free usage for Groq/Gemini or unlimited tokens.

Official integration references consulted:
- [OpenRouter Free Router](https://openrouter.ai/openrouter/free)
- [Groq API reference](https://console.groq.com/docs/api-reference)
- [Gemini OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai)

## Tests and verification

```sh
npm test
npm run check
```

Node's built-in test runner, with no third-party dependencies. `--test-isolation=none` supports sandboxed Windows environments that disallow spawning test child processes. Tests cover localization completeness, roles, Unicode, input validation, structured output and graph integrity, one-call synthesis, all provider adapters, sanitized errors, session isolation, no-key handling, origin rejection, credential deletion, rate limits, history round-trip and exports. Provider transport is injected and mocked **only in tests**; test fixtures are not available through the application server.

Actual provider generation has not been verified: no user API key was supplied. Provider adapters and successful response handling were tested with synthetic fixtures, clearly labeled in test source. The app never presents these fixtures as real AI analysis.

## Project structure

```text
server.mjs             Local HTTP server, sessions and security
lib/analysis.mjs        Validation, schema, prompts and provider adapter
public/index.html      App entry
public/styles.css      Responsive spectral design
public/app.js          UI and interaction state
public/i18n.js         Five complete translation dictionaries
public/roles.js        60 roles in five languages
public/records.js      Saved-record validation and exports
tests/app.test.mjs     Automated regression tests
.env.example          Optional server configuration, no secrets
start.cmd             Windows launcher
```

## MVP boundaries

This is a local single-user product, not an internet-ready SaaS deployment. No cloud accounts, team permissions, cloud history sync, billing or persistent encrypted key vault. Browser history is plaintext and can be cleared in the app. Text is sent only to the selected AI provider on explicit analysis; provider retention policies apply. Keys expire after one hour (cleanup interval up to one extra second), or disappear on server restart. Session rate limiting is a local safeguard, not distributed abuse protection. Public hosting would require authentication, HTTPS/Secure cookies, durable secrets management, distributed limits and an appropriate privacy policy.

No web browsing, fact verification or external retrieval is performed by the analysis. “5D” is the five-part reasoning framework, not a claim of physical dimensions. Graph edges are model hypotheses. Language and quality depend on the selected model. No automatic repair call is made for invalid output. Original geometry is created in SVG; no Pink Floyd artwork, logos, covers or recordings are used.
