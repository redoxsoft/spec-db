**Goal:** Add Docker, Compose, and the README so another person can run the scaffold.

**Scope:** Apply SpecX spec `Node.js Application Development Standards` sections `containers`, `documentation`, `security`, and `user-output`. Work only under the locked `project_root`. Do not start containers.

**Definition of Done:** Docker files match the spec. README follows `documentation`. Progress `containers-and-docs` is checked and this task printed `PROGRESS containers-and-docs done`.

Actions:

- If `boilerplate-lock.md` is missing, print `BLOCKED` and stop.
- If `containers-and-docs` is already checked, print `PROGRESS containers-and-docs done` and skip.
- Print `WORKING ON containers-and-docs` before writing files.
- Write Dockerfile, `.dockerignore`, and Compose from `containers`. Pass `VITE_API_BASE_URL` as a Compose **build arg**. Do not set it as runtime env on the frontend service. Do not publish the `postgres` host port.
- Write `README.md` in the `documentation` order. Use the lock-file display name.
- Check `containers-and-docs`. Print:

```text
PROGRESS containers-and-docs done
```
