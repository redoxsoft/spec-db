**Goal:** Add separated Jest unit tests and Mocha integration tests that match the quality bar.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `quality`, `known-friction`, and `user-output`. Work only under the locked `project_root`.

**Definition of Done:** Jest and Mocha configs match the spec. `healthService.test.ts`, `healthStatus.test.ts`, and `Home.test.tsx` exist. Progress `tests` is checked and this task printed `PROGRESS tests done`.

Actions:

- If `boilerplate-lock.md` is missing, print `BLOCKED` and stop.
- If `tests` is already checked, print `PROGRESS tests done` and skip.
- Print `WORKING ON tests` before writing files.
- Write `jest.config.cjs` and `.mocharc.cjs` from `quality`. Do not merge the runners.
- Follow `known-friction` for ESM ts-jest, Mocha `tsx/esm`, and the jsdom Home test.
- `healthStatus.test.ts` asserts the three status strings and tones.
- `Home.test.tsx` uses `@jest-environment jsdom`, mocks `health.ts`, and asserts `data-section` values `hero`, `status`, `structure`, `pending`, `next` in that order plus the display name in `hero`. Assert `<code>` on `apps/frontend`, `.env`, and `DB_HOST`, and `<a href>` on the two Next URLs.
- Unit tests must not require Docker, PostgreSQL, or network.
- Integration tests must not fail solely because placeholder credentials cannot connect.
- Check `tests`. Print:

```text
PROGRESS tests done
```
