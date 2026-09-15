**Goal:** Confirm the mechanism that produces the locked failure, labeling evidence, inference, and unknowns separately.

**Scope:** Diagnose the locked `${BUG_REPORT}` using reproduction evidence and the repository. Follow the SpecX spec `Bug Analysis Guidelines`. Do not implement a fix. Do not change production code. Do not commit, push, open a pull request, publish, or deploy.

**Verification / Definition of Done:** `Bug Analysis Guidelines` was read in full. Root cause is a confirmed mechanism with evidence, or is explicitly unknown. Hypotheses are labeled as hypotheses. The task stopped if that spec could not be found by exact title.

**Instructions:**

- Resolve the SpecX spec `Bug Analysis Guidelines` by exact title. If it cannot be found, stop and report that exact missing title. Do not substitute another document or reconstruct the rules from memory.
- Reread the locked `${BUG_REPORT}` and the reproduction outcome. If either is unavailable, repeat the earlier tasks rather than guessing.
- Follow that spec: separate observed fact, inference, and unknown; confirm a root cause by tracing the failure to a specific line, invariant, or data condition; keep untested explanations as hypotheses; never write a guess in the root-cause field.
- A missing test explains why the bug shipped; it is not the mechanism. Record contributing factors separately from the cause.
- If the cause is still unknown, say so and stop short of a fix strategy that pretends it is known. Report confirmed cause, hypotheses, unknowns, and the regression gap that let the bug ship.
