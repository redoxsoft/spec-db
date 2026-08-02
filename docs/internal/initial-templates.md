# Initial Gallery templates

Lightweight templates for the 80% use case. They lean toward product, tech, and engineering workflows, but stay accessible for project management, design, marketing, and ops.

These are intentionally thin so teams can customize for their domain. Titles marked **- Lite** are deliberately thinner than a full enterprise/spec equivalent.

## Notation

| Marker | Meaning |
| --- | --- |
| *(fixed)* | Exactly one section. Title is static. |
| *(fixed wrapper)* | Exactly one parent that groups children; prefer content in the children, not the wrapper. |
| *(repeatable; title with …)* | One or more instances. Each instance gets a concrete, domain-specific title (never the generic default). |
| *(optional)* | Zero or one. Omit when irrelevant. |
| *(optional repeatable; title with …)* | Zero or more instances when useful. |

**Summary** = catalog / UI blurb for humans.  
**AI guidance** = template-level instructions for generation.  
Leaf bullets = field-level AI guidance only (what to write and how).

Top-level outline nodes are always fixed. Repeatables live under fixed wrappers.

---

### 1. Feature Spec - Lite

**Summary:** A streamlined way to define what to build and why, without heavy enterprise PRD boilerplate.

**AI guidance:** Produce a short, implementation-ready feature brief. Keep scenarios concrete and testable. Prefer measurable success metrics over vague goals. Challenge fuzzy scope. Do not invent backlog fluff or version/changelog sections.

**Outline**

- Overview *(fixed wrapper)*
  - The Problem *(fixed)*: State the core user pain or inefficiency in 2–4 sentences. Name who hurts and what breaks today.
  - Success Metrics *(fixed)*: List 1–3 measurable outcomes that prove the feature worked. Prefer numbers or clear qualitative thresholds.
- User Scenarios *(fixed wrapper)*
  - Scenario *(repeatable; title with the user goal or scenario name, not "Scenario")*
    - Intent *(fixed)*: What the user is trying to accomplish in this scenario.
    - Acceptance Criteria *(fixed)*: Bullet list of specific, testable done-conditions for this scenario.
    - Edge Cases *(optional)*: Bullet list of failure modes, missing data, permissions, or empty states that matter here. Omit if none are known.
- Out of Scope *(fixed)*
  - Exclusions *(fixed)*: Bullet list of what is intentionally deferred or ignored for this iteration.

---

### 2. Tech Design - Lite

**Summary:** A simple architectural sketch for engineering work before writing code.

**AI guidance:** Keep the design sketch short and actionable. Name real components and interfaces. Prefer explicit sequencing for rollout. Call out only material risks. Use code blocks or compact tables for schemas when helpful. Do not expand into a full RFC unless the user asks.

**Outline**

- Context *(fixed)*
  - Background *(fixed)*: Briefly summarize the system being touched, the change goal, and any hard constraints.
- System Components *(fixed wrapper)*
  - Component *(repeatable; title with the service/module/UI name, not "Component")*
    - Responsibilities *(fixed)*: What this component owns and must guarantee.
    - Interfaces *(fixed)*: How it talks to other parts (APIs, events, props, queues). Prefer short bullet lists or a tiny table.
- Data Models *(fixed wrapper)*
  - Entity *(repeatable; title with the entity name, not "Entity")*
    - Attributes *(fixed)*: Key fields and types being stored or changed. Use a small table when there are several fields.
    - Relationships *(fixed)*: How this entity links to existing data.
- Rollout Strategy *(fixed)*
  - Deployment Steps *(fixed)*: Numbered sequencing (e.g., migrate, deploy backend, flip flag). Include rollback only if non-obvious.
  - Risks *(optional)*: Bullet list of material implementation or operational risks and mitigations. Omit if none.

---

### 3. Project Kickoff & Alignment

**Summary:** Get cross-functional teams aligned before a new initiative starts.

**AI guidance:** Optimize for shared understanding, not a detailed plan. Make the why crisp, milestones outcome-based, and risks actionable. Avoid status-report filler and invented dates when unknown—mark unknowns clearly.

**Outline**

- Objective *(fixed wrapper)*
  - The Why *(fixed)*: Primary business or product goal for doing this now.
  - Stakeholders *(fixed)*: Who is involved, who decides, and who must stay informed. Use a short bullet list or table (Name / Role / Involvement).
- Milestones *(fixed wrapper)*
  - Phase *(repeatable; title with the phase or milestone name, not "Phase")*
    - Deliverables *(fixed)*: What is produced in this phase.
    - Target Timeline *(fixed)*: Rough completion expectation. Say "TBD" rather than inventing dates.
- Risks & Unknowns *(fixed wrapper)*
  - Risk *(repeatable; title with the risk itself, not "Risk")*
    - Impact *(fixed)*: What could go wrong or block the project.
    - Mitigation *(fixed)*: How the team will de-risk or handle it.

---

### 4. Meeting Notes & Action Items

**Summary:** Structured notes for syncs, decision meetings, or client calls.

**AI guidance:** Capture decisions and owners, not a transcript. Keep notes terse. Every action item must be concrete and owned. Prefer bullets. Do not invent decisions that were not made—write "None" when empty.

**Outline**

- Context *(fixed wrapper)*
  - Objective *(fixed)*: The single goal of this meeting in one or two sentences.
  - Attendees *(fixed)*: Who was present (names/roles).
- Discussion Topics *(fixed wrapper)*
  - Topic *(repeatable; title with the topic name, not "Topic")*
    - Key Notes *(fixed)*: Important context or updates for this topic. Bullets preferred.
    - Decisions Made *(fixed)*: Finalized agreements for this topic, or "None".
- Action Items *(fixed wrapper)*
  - Task *(repeatable; title with the action verb phrase, not "Task")*
    - Next Steps *(fixed)*: What specifically needs to happen next.
    - Owner *(fixed)*: Who drives it (one primary owner).

---

### 5. User Research / Interview Notes

**Summary:** Standardize feedback from customer calls, usability tests, or sales conversations.

**AI guidance:** Separate observation from interpretation. Prefer direct quotes for evidence. Themes should be patterns, not one-off remarks. Recommendations must be actionable for product/design. Do not anonymize poorly—avoid unnecessary PII.

**Outline**

- Participant Profile *(fixed wrapper)*
  - Background *(fixed)*: Role, company context or segment, and relevant use case.
  - Current Workarounds *(fixed)*: How they solve the problem today and where it breaks.
- Key Themes *(fixed wrapper)*
  - Theme *(repeatable; title with the theme name, not "Theme")*
    - Observations *(fixed)*: What was noticed that supports this theme.
    - Notable Quotes *(fixed)*: Direct quotes that show pain or delight. Use a short bullet list.
- Actionable Takeaways *(fixed)*
  - Recommendations *(fixed)*: What product/design should do with this information. Prefer prioritized bullets.

---

### 6. Incident Post-Mortem - Lite

**Summary:** Blameless capture of what broke, how it was fixed, and how to prevent recurrence.

**AI guidance:** Stay blameless and factual. Focus on user impact, timeline, root cause, and preventive actions. Prefer timestamps and concrete systems over narrative blame. Keep action items owned and specific.

**Outline**

- Incident Summary *(fixed)*
  - User Impact *(fixed)*: What users experienced, severity, and roughly how long it lasted.
- Timeline of Events *(fixed wrapper)*
  - Event *(repeatable; title with a short event label, not "Event")*
    - Timestamp *(fixed)*: When this event occurred (include timezone if known).
    - Action Taken *(fixed)*: What the system or team did at that moment.
- Root Cause & Prevention *(fixed wrapper)*
  - What Went Wrong *(fixed)*: Core technical or process failure (systems and conditions, not people).
  - Follow-ups *(fixed wrapper)*
    - Follow-up *(repeatable; title with the follow-up action, not "Follow-up")*
      - Owner *(fixed)*: Who owns completing it.
      - Intent *(fixed)*: How this prevents the same failure.

---

### 7. Go-To-Market / Launch Brief

**Summary:** Coordinate marketing and release messaging for a new feature or product.

**AI guidance:** Keep the value proposition customer-facing and specific. Channels need a concrete deliverable and timing. KPIs must be measurable. Avoid internal jargon in audience-facing messaging fields.

**Outline**

- Campaign Overview *(fixed wrapper)*
  - Target Audience *(fixed)*: Who needs to hear about this launch and why they care.
  - Value Proposition *(fixed)*: Core external message in plain language.
- Launch Channels *(fixed wrapper)*
  - Channel *(repeatable; title with the channel or asset name, not "Channel")*
    - Deliverables *(fixed)*: What ships on this channel (blog, email, social thread, etc.).
    - Timing *(fixed)*: When this asset goes live. Use relative timing if exact dates are unknown.
- Success Tracking *(fixed)*
  - KPIs *(fixed)*: Measurable signals (clicks, signups, upgrades, engagement). Bullets with targets when known.

---

### 8. Team Retrospective

**Summary:** Cadence template for teams to reflect, celebrate, and improve how they work.

**AI guidance:** Keep feedback specific and kind. Separate wins, friction, and kudos. Action items must be concrete process/tooling changes with owners—not vague aspirations. Do not invent feedback the team did not raise.

**Outline**

- Cycle Context *(fixed)*
  - Focus Area *(fixed)*: Main theme or goal of the recent work period.
- What Went Well *(fixed wrapper)*
  - Win *(repeatable; title with the win in a short phrase, not "Win")*
    - Detail *(fixed)*: What worked and why the team should keep doing it.
- What Could Be Better *(fixed wrapper)*
  - Friction *(repeatable; title with the friction point, not "Friction")*
    - Detail *(fixed)*: What hurt, who it affected, and why it matters.
- Kudos *(optional wrapper)*
  - Shout-out *(optional repeatable; title with the person or team name)*
    - Detail *(fixed)*: Specific help or excellent work worth recognizing.
- Action Items *(fixed wrapper)*
  - Action *(repeatable; title with the improvement step, not "Action")*
    - Improvement Step *(fixed)*: Concrete change to process or tooling.
    - Owner *(fixed)*: Who champions it next cycle.

---

### 9. Idea Refinement - Lite

**Summary:** Turn a raw concept into a testable shape before committing to a full spec.

**AI guidance:** Challenge vague assumptions. Converge on problem-solution fit, who it is for, how to validate, and what to cut from the first version. Prefer crisp statements over brainstorm dumps. Do not expand into a full PRD.

**Outline**

- Core Concept *(fixed wrapper)*
  - Problem Statement *(fixed)*: Exact user pain or inefficiency this idea targets.
  - Proposed Solution *(fixed)*: Core insight and what makes the approach unique.
- Target Audience *(fixed wrapper)*
  - Persona *(repeatable; title with persona name or role, not "Persona")*
    - Needs & Context *(fixed)*: What this persona is trying to achieve and why it is urgent.
    - Current Workarounds *(fixed)*: How they hack a solution today and where it breaks down.
- Validation Path *(fixed wrapper)*
  - Experiment *(repeatable; title with the experiment name, not "Experiment")*
    - Signal Needed *(fixed)*: Qualitative or quantitative signal required to learn.
    - Success Threshold *(fixed)*: Minimum result that justifies building further.
- MVP Scope *(fixed)*
  - Cutline *(fixed)*: What is explicitly left out of the first version to validate faster.
- Open Risks *(optional wrapper)*
  - Risk *(optional repeatable; title with the assumption or risk itself)*
    - Why It Matters *(fixed)*: What goes wrong if this is false.
    - How To De-risk *(fixed)*: Signal, decision, or investigation that reduces uncertainty.

---

### 10. Release Notes - Lite

**Summary:** User-facing summary of what shipped, organized so readers know what to care about.

**AI guidance:** Write for end users, not engineers. Lead with value. Keep feature and fix entries short. No version metadata fields, no internal ticket IDs, no changelog dumps. Prefer plain language.

**Outline**

- Release Overview *(fixed)*
  - Headline *(fixed)*: One sentence on the biggest value delivered in this update.
- New Features *(fixed wrapper)*
  - Feature *(repeatable; title with the feature name, not "Feature")*
    - What It Is *(fixed)*: Brief explanation of the capability.
    - Why It Matters *(fixed)*: How it makes the user's life better or faster.
- Improvements & Fixes *(optional wrapper)*
  - Change *(optional repeatable; title with the fix or improvement name)*
    - What Changed *(fixed)*: What was fixed or smoothed, in user language.

---

### 11. User Guide / How-To - Lite

**Summary:** Knowledge-base article that helps a user complete one specific task.

**AI guidance:** One task per guide. Steps must be actionable and ordered. Pair each action with an expected outcome. Troubleshooting is optional—include only common, real issues. Prefer numbered lists for steps.

**Outline**

- Overview *(fixed wrapper)*
  - The Goal *(fixed)*: What the user will achieve by following this guide.
  - Prerequisites *(fixed)*: What they need to know, have, or configure first. Bullets preferred.
- Step-by-Step Instructions *(fixed wrapper)*
  - Step *(repeatable; title with the step action, not "Step")*
    - Action *(fixed)*: Specific click, command, or input required.
    - Expected Outcome *(fixed)*: What the system should show or do in response.
- Troubleshooting *(optional wrapper)*
  - Common Issue *(optional repeatable; title with the error or symptom, not "Common Issue")*
    - The Problem *(fixed)*: What the user sees or experiences.
    - The Solution *(fixed)*: How to fix it and get back on track.

---

### 12. API Design - Lite

**Summary:** Lightweight contract for adding or changing an API endpoint.

**AI guidance:** Keep the contract deterministic and skim-friendly. Use code blocks for example payloads/schemas. Prefer explicit status codes and trigger conditions. Do not invent auth or pagination details unless stated or clearly required. Avoid full platform-wide API catalogs.

**Outline**

- Context *(fixed)*
  - Objective *(fixed)*: Product or technical need that requires this API change.
- Endpoints *(fixed wrapper)*
  - Endpoint *(repeatable; title with METHOD and path, e.g. "POST /v1/users")*
    - Route & Method *(fixed)*: HTTP method and path, plus a one-line purpose.
    - Request Payload *(fixed)*: Expected input schema or example. Prefer a code block.
    - Response Payload *(fixed)*: Success output schema or example. Prefer a code block.
- Error Handling *(fixed wrapper)*
  - Error State *(repeatable; title with status code and short label, e.g. "404 Not Found")*
    - Status Code *(fixed)*: HTTP error code.
    - Trigger *(fixed)*: Specific condition that causes this error.
    - Error Body *(optional)*: Example error payload if the API returns a structured body. Prefer a code block.

---

### 13. Bug Report

**Summary:** Reproducible issue format so engineers can actually fix the bug.

**AI guidance:** Maximize reproducibility. Contrast expected vs actual clearly. Steps must be an ordered sequence a stranger can follow. Environment details must be concrete. Evidence is links or pasted log snippets only—there is no file-attachment block type. Do not speculate on root cause unless asked.

**Outline**

- Issue Summary *(fixed wrapper)*
  - Expected Behavior *(fixed)*: What the system should have done.
  - Actual Behavior *(fixed)*: What the system did instead.
- Reproduction Steps *(fixed wrapper)*
  - Step *(repeatable; title with the step action, not "Step")*
    - Action *(fixed)*: Exact click, input, or command for this step.
- Environment *(fixed)*
  - Context *(fixed)*: Browser/OS/device/app build or other environment facts where observed.
- Evidence *(optional)*: Links to screenshots, recordings, dashboards, or pasted error log snippets. Prefer bullets with URLs; use a code block for logs.

---

### 14. Event Plan & Run of Show

**Summary:** Organize an offsite, webinar, meetup, or similar event.

**AI guidance:** Make the run of show executable on the day. Roles need clear ownership and a reachable contact. Checklist items need status, not just names. Keep logistics complete but short.

**Outline**

- Event Overview *(fixed wrapper)*
  - The Goal *(fixed)*: Primary purpose or vibe of the event.
  - Logistics *(fixed)*: Date, time, timezone, and location or link.
- Key Personnel *(fixed wrapper)*
  - Role *(repeatable; title with role or person name, not "Role")*
    - Responsibilities *(fixed)*: What this person owns on the day.
    - Contact Info *(fixed)*: How to reach them in an emergency.
- Run of Show *(fixed wrapper)*
  - Schedule Block *(repeatable; title with time + activity label, not "Schedule Block")*
    - Time & Activity *(fixed)*: When it happens and what is happening.
    - Owner *(fixed)*: Who runs this segment.
- Equipment & Vendors *(optional wrapper)*
  - Item *(optional repeatable; title with the vendor or equipment name)*
    - Status *(fixed)*: Needs ordering, confirmed, or ready—plus any critical note.

---

### 15. Standard Operating Procedure (SOP)

**Summary:** Capture how a specific business process is done end to end.

**AI guidance:** Write so a trained newcomer can execute without tribal knowledge. Steps are ordered and concrete. Call out failure-prone details per step. Checklist items are binary verifications. Avoid policy essays—stay procedural.

**Outline**

- Purpose & Scope *(fixed wrapper)*
  - Why It Matters *(fixed)*: Why this process exists and what fails if done incorrectly.
  - Who Owns This *(fixed)*: Role responsible for executing it.
- Step-by-Step Process *(fixed wrapper)*
  - Step *(repeatable; title with the step action, not "Step")*
    - Action Required *(fixed)*: Specific task to perform.
    - Watch Outs *(optional)*: Common mistakes or important details for this step. Omit if none.
- Quality Checklist *(fixed wrapper)*
  - Verification *(repeatable; title with the check item, not "Verification")*
    - Review Item *(fixed)*: What to confirm before the process is complete.

---

### 16. Client Proposal / Statement of Work - Lite

**Summary:** Pitch scope, deliverables, and investment for a client engagement.

**AI guidance:** Be clear on inclusions and exclusions. Keep commercial language professional and specific. Prefer compact tables for timeline and investment when listing several items. Do not invent legal terms, payment schedules, or rates the user did not provide.

**Outline**

- Project Summary *(fixed wrapper)*
  - Client Goals *(fixed)*: What the client is ultimately trying to achieve.
  - Our Approach *(fixed)*: Brief summary of how the work will solve their problem.
- Deliverables *(fixed wrapper)*
  - Deliverable *(repeatable; title with the deliverable or phase name)*
    - What You Get *(fixed)*: Specific output or service provided.
    - Exclusions *(optional)*: What is explicitly not included. Omit if none.
- Timeline *(fixed wrapper)*
  - Milestone *(repeatable; title with the milestone name)*
    - Target Date *(fixed)*: When this milestone is reached, or a relative window if dates are unset.
- Investment Breakdown *(fixed wrapper)*
  - Line Item *(repeatable; title with the service line name)*
    - Service Cost *(fixed)*: Price or pricing basis for this part. Use a small table if multiple components share one line.

---

### 17. Onboarding Checklist - Lite

**Summary:** Structured first-week checklist so a new hire or client gets up to speed without overwhelm.

**AI guidance:** Optimize for clarity and momentum. Contacts should explain when to reach out. Tasks need a clear action plus resources (links). Avoid dumping the entire company wiki—keep week-one scoped.

**Outline**

- Welcome & Objectives *(fixed wrapper)*
  - Success Looks Like *(fixed)*: What good looks like by end of week one.
  - Start Context *(fixed)*: Start date or cohort context, plus any role-specific framing.
- Key Contacts *(fixed wrapper)*
  - Person *(repeatable; title with the person's name, not "Person")*
    - Who They Are *(fixed)*: Name and role.
    - Why Talk To Them *(fixed)*: Questions they can answer or help they provide.
- First Week Checklist *(fixed wrapper)*
  - Task *(repeatable; title with the task action, not "Task")*
    - Action Item *(fixed)*: What to read, configure, or complete.
    - Resources *(fixed)*: Links or documents needed. Prefer bullets with URLs.

---

### 18. Content / Campaign Brief

**Summary:** Outline an article, video, or social campaign before production.

**AI guidance:** One core message. Outline sections should each argue one point with evidence. Assets and distribution need enough detail to produce and publish. Do not draft the full content unless asked—brief for production.

**Outline**

- Overview *(fixed wrapper)*
  - Target Audience *(fixed)*: Who this content is for.
  - Core Message *(fixed)*: Single most important takeaway.
- Outline *(fixed wrapper)*
  - Section *(repeatable; title with the section heading, not "Section")*
    - Key Argument *(fixed)*: Main point of this section.
    - Supporting Evidence *(fixed)*: Data, quotes, or examples to include.
- Assets Needed *(fixed wrapper)*
  - Creative Asset *(repeatable; title with the asset name, e.g. "Hero image")*
    - Description *(fixed)*: What to create and any constraints (size, tone, must-include).
- Distribution *(fixed wrapper)*
  - Channel *(repeatable; title with the platform, not "Channel")*
    - Platform & Timing *(fixed)*: Where it posts and when.

---

### 19. 1:1 Manager & Direct Report Sync

**Summary:** Recurring agenda for managers and reports focused on alignment, not status theater.

**AI guidance:** Center the report's needs. Capture blockers and support asks clearly. Action items must be owned. Keep notes concise. Do not invent personal details or performance judgments.

**Outline**

- Check-In *(fixed wrapper)*
  - Current Mood *(fixed)*: Short pulse on energy, workload, or burnout risk—in the report's words when possible.
  - Top of Mind *(fixed)*: Most pressing topic the report wants to discuss.
- Discussion Topics *(fixed wrapper)*
  - Agenda Item *(repeatable; title with the topic, not "Agenda Item")*
    - Notes *(fixed)*: Key points discussed. Bullets preferred.
    - Decisions *(fixed)*: Agreements made, or "None".
- Roadblocks & Support *(optional wrapper)*
  - Blocker *(optional repeatable; title with the blocker name)*
    - The Issue *(fixed)*: What is slowing the report down.
    - How I Can Help *(fixed)*: What the manager will do to unblock.
- Action Items *(fixed wrapper)*
  - Task *(repeatable; title with the next step, not "Task")*
    - Next Steps *(fixed)*: What happens before the next sync.
    - Owner *(fixed)*: Who owns it.
