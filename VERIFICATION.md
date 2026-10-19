# Verification — 2026-10-20

Environment: Windows / Node.js 24.14.0. App running on http://127.0.0.1:4173.

## Passed

- 8 Node test cases, 0 failures (`node --test --test-isolation=none tests/app.test.mjs`).
- Server and browser JavaScript syntax checks.
- Real local HTTP server started and loaded in the Codex browser.
- Narrow mobile viewport visually inspected; original geometry and responsive navigation render.
- All five languages selected in the browser; interface labels change.
- Question example fills the textarea; attempting analysis without a key produces the localized no-key error and no fabricated result.
- User's Russian input remains unchanged when switching to Czech.
- Italian council renders 60 translated role checkboxes.
- Ukrainian search filters roles; selecting a role updates selection count from 6 to 7.
- English provider selector changes model default from OpenRouter to Groq.
- Reduced-motion checkbox changes state; restored to default after testing.
- Empty history renders correctly. No synthetic analysis was inserted into user history.
- Russian interface and OpenRouter restored for handoff.

## Automated coverage

Localization key equality and nonempty translations; 60 unique roles per language; Unicode input; invalid input and paid OpenRouter model rejection; complete five-dimension schema; graph endpoint validation; a single upstream call with selected roles; fixed provider URLs; language instruction; missing key; session separation; HttpOnly/SameSite cookie; origin rejection; key removal; six-per-minute limit; sensitive error sanitization; provider failure statuses; network/timeout/malformed response; history serialization; Markdown/JSON export fidelity.

## Not verified / limitations

- No live AI-provider generation: no API key was supplied. Provider requests and successful responses are tested with injected synthetic transport fixtures only.
- Full result display, node interactions, downloads and reopening real history were not exercised end-to-end in the browser with a real model response. Their underlying response validation and export/record functions pass automated tests.
- Desktop/tablet layouts are implemented with responsive CSS but were not separately browser-tested at those viewport sizes. The available preview rendered a narrow mobile viewport.
- No formal WCAG audit, screen-reader audit or performance benchmark was run.
- Desktop 3D is CSS perspective applied to the SVG graph; it is not WebGL, a force simulation or a truly volumetric network.
- No public deployment. This is a loopback-only local MVP. See README for SaaS deployment boundaries.

Synthetic fixtures appear only in tests. Production UI has no mock analysis fallback.
