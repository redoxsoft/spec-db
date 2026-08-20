**Goal:** Collect exactly one short business idea and three locked A/B preference answers from the user in this chat. Nothing else.

**Scope:** Chat-only intake. Do not invent the idea. Do not write any business plan, outline, or joke pitch in this step. Present everything in the agent chat only — do not append text output to the task and do not attach a file to the task.

**Definition of Done:**
- The user has supplied one business idea in a single line.
- The user has answered all three locked A/B questions (A or B only), in order.
- You have restated the Locked requirements block (below) to the user.
- Only then proceed to the next step.

This step is interactive. Wait for the user's replies before finishing. Do not rush ahead or invent answers.

**Actions:**

1. Ask exactly this (or equivalent wording), then stop and wait:
   > I might make you a millionaire. What business do you want to get into? (short one line only — waiting for your input)

2. If the reply is empty, multi-line, or a long essay, ask again for a **single short line**. Repeat until you get one usable line. Do not proceed.

3. Ask **exactly these three** clarifying questions, **one at a time**, in this order. Each must be closed **A or B** (no free text). Wait for A or B before asking the next. You may lightly tailor the A/B labels to the idea, but you must keep the dimension id, theme, and A/B meaning.

   **Q1 — dimension `customer` (Who is it for?)**
   - A) Everyday consumers
   - B) Businesses / pros

   **Q2 — dimension `money-model` (How do you make money first?)**
   - A) Charge upfront
   - B) Free / freemium, monetize later

   **Q3 — dimension `channel` (Where do you show up first?)**
   - A) Online-first
   - B) Real-world / local-first

   If the user answers anything other than A/B, re-prompt that question only.

4. After all three answers, print this **Locked requirements** block (use these labels exactly):
   - Idea: …
   - customer: A|B (short label you used)
   - money-model: A|B (short label you used)
   - channel: A|B (short label you used)

5. Stop. Do not generate a plan. Proceed to the next step only after Definition of Done is met.

**Hard stops:** Do not invent answers. Do not skip waiting. Do not ask different dimensions. Do not start Plan Generation content in this step.
