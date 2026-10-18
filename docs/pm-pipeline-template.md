Your framework is reasonable, and the template is already close to a useful lightweight PRD. I would keep its core approach but fix three things: distinguish uniqueness from mandatory presence, remove unnecessary nesting after promoting headings, and prevent journeys and requirements from becoming competing sources of truth.

## 1. What teams commonly include

There is no universal PRD hierarchy, and public templates do not establish what a statistical majority of teams use. However, the recurring pattern across Atlassian, Productboard, and GitLab is clear:

| Common element | Evidence | Implication for your template |
|---|---|---|
| Problem, audience, and intended outcome | Lenny’s template emphasizes problem, evidence, success, and audience. | Keep these together near the beginning. |
| Goals and success measures | Atlassian and Productboard include goals and success metrics. | Your placement within Context & Scope is reasonable. |
| Requirements or user stories | Atlassian includes requirements with associated stories; Productboard includes prioritized stories. | Keep one primary home for what must be built. |
| Scope exclusions | Both Atlassian and Productboard explicitly include out-of-scope items. | Keep Non-Goals, without requiring elaborate records for every exclusion. |
| Design and acceptance detail | Atlassian includes design; GitLab describes collaboratively developing scenarios, acceptance criteria, and prototypes. | Keep relevant details close to the behavior they explain. |

These are recurring ingredients, not a requirement to copy the layout or administrative fields of those templates. [atlassian](https://www.atlassian.com/software/confluence/templates/product-requirements)

Your proposed outline covers most of this well. The main gaps are not missing administrative sections; they are ambiguous structural rules and a few headings that could steer authors toward unnecessary duplication.

## 2. Review of your framework

### Keep the principles, simplify the rules

| Your rule | Assessment | Recommended adjustment |
|---|---|---|
| Maximum four heading levels | Good as a system constraint. | Make four levels a ceiling, not a depth every item must reach. |
| Every L1 is a fixed singleton | Good for predictable navigation. | Separate “may occur once” from “must occur once.” Required sections are `1..1`; optional sections are `0..1`. |
| Related context stays together | Strong principle. | Require local ownership, not duplication. Shared context may be referenced from multiple items. |
| Complex items use standardized children | Useful for validation and generation. | Define the pattern relative to the parent, not as an absolute L2 → L3 → L4 sequence. |
| Micro-pairs use heading plus body | Useful when items need individual identity. | Do not turn every short bullet into a heading. |
| No auditing bureaucracy | Appropriate for this template. | Keep it. Do not replace the excluded bureaucracy with mandatory placeholders everywhere. |

The important distinction is: **structural** predictability should make documents easier to use, not require every document to contain the same amount of scaffolding.

### Correct the heading model

Because your title is stored separately, the document body starts at L1:

```text
L1: Functional Requirements
  L2: Requirement instance
    L3: Behavior & Rules
    L3: Acceptance Criteria
```

You do not need this:

```text
L1: Functional Requirements
  L2: Requirements
    L3: Requirement instance
      L4: Acceptance Criteria
```

The L1 section already acts as the collection container. A second container would add navigation without adding meaning.

Your framework and outline currently disagree here: the framework describes an L2 collection containing L3 instances, while the outline puts instances directly under the top-level Requirements and Journeys sections. After promotion, direct L2 instances are the cleaner choice.

Also, change “L1 is the document root” to:

> The document root is implicit. L1 headings are its top-level sections; the title is separate metadata.

### Co-location needs an ownership rule

“Keep related information together” is good. “Put everything related inside every relevant node” would create duplication.

I recommend:

> Each rule or acceptance condition has one authoritative home. Place it under the most specific applicable requirement or journey; reference it elsewhere when needed.

For example:

- A requirement owns the rule that an expired invitation cannot be accepted.
- A journey shows where invitation acceptance happens.
- The journey references that requirement rather than restating its expiry rules.
- A genuinely end-to-end acceptance condition can belong to the journey.

This is a recommendation for your framework, not an assertion that every team organizes acceptance criteria this way. Testable acceptance conditions are the useful part; Atlassian explicitly emphasizes clear, verifiable criteria that can map to executable tests. [atlassian](https://www.atlassian.com/work-management/project-management/acceptance-criteria)

### Headings should represent useful units

Your heading-as-slot pattern is appropriate when an item needs independent navigation, linking, editing, or tracking.

Use a heading for an independently managed decision such as:

```markdown
### DEC-01: Should invitations expire?
```

Do not require one for every sentence in a short list of exclusions.

This is the trade-off: individually addressable nodes help your system, but excessive nodes make the document harder to scan. Use item headings where that addressability is valuable.

## 3. Review of the PRD

### Context & Scope

Keep metrics here. There is no compelling reason to promote them into their own L1 section.

I would make two small adjustments:

- Make users explicit in the heading rather than relying on authors to remember them within an overview.
- Use “Outcomes & Success Measures” instead of “Outcomes & Success Metrics.” This allows quantitative metrics or an observable outcome without implying every feature needs a new telemetry project.

The latter is my lightweight-template recommendation. Conventional templates do emphasize success measures, but that does not mean each small feature needs its own KPI dashboard. [atlassian](https://www.atlassian.com/software/confluence/templates/product-requirements)

Non-Goals should be an optional section with repeatable items when present. Do not demand an ID and detailed rationale for an obvious exclusion unless your system benefits from addressing it independently.

One additional clarification belongs in the framework: requirements define the included scope. Add a separate scope summary only when the boundary is otherwise unclear; do not require authors to duplicate the requirement list.

### User Journeys & Behaviors

Keep this optional, but rename it **User Journeys**.

“Behaviors” overlaps with requirements and makes the distinction less clear:

- A journey describes how a user moves through a scenario.
- A requirement describes behavior the product must satisfy.

Keep a required flow child and an optional journey-level acceptance child. Requiring acceptance criteria in both places invites the same checks to be written twice.

Design references, screenshots, and mockups can live within the relevant journey or requirement. A mandatory top-level UX section is unnecessary for this template, even though design is a recurring ingredient in conventional PRDs. [atlassian](https://www.atlassian.com/software/confluence/templates/product-requirements)

### Functional Requirements

This is the strongest part of your template, but I would change the naming and children.

First, consider renaming it **Requirements**. “Functional Requirements” can leave authors uncertain about where to put feature-specific performance, accessibility, privacy, or security expectations.

Those expectations can be peer requirement items, with the same behavior-and-acceptance structure. Shared quality requirements should reference existing standards where appropriate, rather than copying a company-wide checklist into every PRD.

Second, replace:

```text
User Story & Rules
Acceptance Criteria & Edge Cases
```

with:

```text
Behavior & Rules
Acceptance Criteria
```

Reasons:

- A requirement does not always need an “As a …” story, especially for backend work.
- Business rules and expected behavior deserve a clear home regardless of writing style.
- Edge cases are not a separate category of completion evidence; they can be included in the relevant rules and acceptance checks.
- Shorter, clearer child headings reduce overlap.

User stories remain a useful way to express needs, and GitLab describes using them collaboratively with scenarios and acceptance criteria. They do not need to be the mandatory sentence format for every requirement in your system. [about.gitlab](https://about.gitlab.com/blog/how-we-utilize-user-stories-as-a-collaborative-design-tool/)

### Risks, Dependencies & Open Decisions

Keep one optional L1 section, but separate its item types using fixed L2 collections:

```text
L1: Risks, Dependencies & Open Decisions
  L2: Risks
    L3: Risk instance
  L2: Dependencies
    L3: Dependency instance
  L2: Open Decisions
    L3: Decision instance
```

This is a place where the extra collection layer earns its keep: it distinguishes three different kinds of item.

Avoid “Risk or Dependency” as a shared instance type. A dependency is something needed; a risk is an uncertain adverse possibility. One can cause the other, but combining them makes both authoring and validation less clear.

An unresolved assumption can live with the relevant context or requirement. If it materially threatens delivery or requires a choice, record the corresponding risk or open decision; no mandatory Assumptions section is necessary.

## 4. Recommended structural contract

I would reduce the framework to these rules:

1. The title is separate metadata. Body headings start at L1 and do not exceed L4.
2. Fixed sections have stable identities and appear at most once under their defined parent. Required sections use `1..1`; optional sections use `0..1`.
3. Repeatable items sit directly under their collection. Add a collection heading only when it distinguishes meaningful groups.
4. Complex items use fixed child sections. Simple items use a descriptive heading and body.
5. Required and optional children are defined per item type; not every item must use the maximum depth.
6. Each rule or acceptance condition has one authoritative home. Related sections reference it instead of duplicating it.
7. Micro-fields remain body content, not headings.
8. Optional sections are omitted when unused. An omitted section does not mean the document failed validation.

For the recommended template:

| Node | Parent | Cardinality |
|---|---|---|
| Context & Scope | Document | `1..1` |
| Problem & Users | Context & Scope | `1..1` |
| Outcomes & Success Measures | Context & Scope | `1..1` |
| Non-Goals | Context & Scope | `0..1` |
| Non-goal item | Non-Goals | `0..n` |
| User Journeys | Document | `0..1` |
| Journey item | User Journeys | `1..n` when present |
| Flow & Preconditions | Journey item | `1..1` |
| End-to-End Acceptance Criteria | Journey item | `0..1` |
| Requirements | Document | `1..1` |
| Requirement item | Requirements | `1..n` |
| Behavior & Rules | Requirement item | `1..1` |
| Acceptance Criteria | Requirement item | `1..1` |
| Risks, Dependencies & Open Decisions | Document | `0..1` |
| Risks / Dependencies / Open Decisions | That section | Each `0..1` |
| Corresponding item | Its collection | `1..n` when present |

For drafts, missing or incomplete content can generate warnings rather than forcing invented material. That is separate from enforcing a valid heading structure.

IDs are also best treated as system identity rather than mandatory prose. Your system can maintain stable IDs even when the displayed heading is simply “Accept an invitation.”

## 5. Revised template

The following is the template scaffold, not a completed document. Optional branches should disappear when unused. All headings are promoted as requested; there is no document-title heading.

```markdown
# Context & Scope

## Problem & Users
Describe the problem, affected users, and relevant current behavior.

## Outcomes & Success Measures
State the intended outcomes and how success will be observed.

## Non-Goals
<!-- Optional. Use item headings when exclusions need individual identity;
     otherwise a short list in this section is enough. -->

### [Excluded capability or scope]
Describe the exclusion and, where useful, its boundary or rationale.


# User Journeys
<!-- Optional. Include for useful multi-step, end-to-end flows. -->

## [Journey name]

### Flow & Preconditions
Describe the trigger, starting conditions, and sequence.
Include relevant design references and requirement links.

### End-to-End Acceptance Criteria
<!-- Optional. Include only checks owned by this journey.
     Do not repeat requirement-level criteria. -->


# Requirements

## [Requirement title]

### Behavior & Rules
Describe the required behavior, applicable conditions, and rules.
Include relevant exceptions, constraints, and design references.

### Acceptance Criteria
State observable pass/fail conditions, including relevant edge cases.


# Risks, Dependencies & Open Decisions
<!-- Optional. Include only populated collections below. -->

## Risks

### [Risk title]
Describe the risk and the mitigation or next action, if known.

## Dependencies

### [Dependency title]
Describe what is needed and any relevant constraint or impact.

## Open Decisions

### [Decision needed]
Describe the unresolved choice and what is needed to resolve it.
```

My strongest recommendation is to retain your predictable schema while making the default document shallow: Context & Scope plus Requirements, with Journeys and delivery considerations added only when useful. The four-level limit remains available, but this template does not need to consume it just to look structured.



Finalize the template as agreed, and put the thinking framework in the agent’s operating instructions—not in additional PRD sections. The agent should behave as an opinionated PM partner: propose the smallest coherent feature, expose consequential choices, and distinguish confirmed decisions from recommendations without turning the conversation into a questionnaire.

The key principle is: **completeness** means that important questions have been considered and consequential gaps are visible—not that every question has been answered or every section filled.

## 1. The operating model

I recommend separating three things:

| Layer | Purpose | What belongs here |
|---|---|---|
| PRD | The working specification | Agreed requirements, clearly identified proposals, acceptance criteria, and material open decisions |
| Review framework | Improve the specification | Checks for missing behavior, duplication, complexity, ambiguous boundaries, and testability |
| Conversation state | Help the PM make decisions | Options, recommendations, answers, deferred questions, and what remains unresolved |

Do not put the entire review checklist or conversational history into the PRD.

Your preference for choices is well grounded: recognition is easier than recalling an answer from scratch. Progressive disclosure also supports showing important choices first and revealing less common detail only when relevant. These principles support the interaction model; the specific limits below are my recommended product defaults, not established PRD standards. [nngroup](https://www.nngroup.com/articles/recognition-and-recall/)

The agent should do the preparatory work and ask the PM to make the consequential judgments. It should not ask the PM to discover every missing requirement themselves.

## 2. The thinking framework

Have the agent review these questions internally before drafting and after material changes. Surface findings, not a completed checklist.

| Check | Questions the agent must consider | Expected action |
|---|---|---|
| Purpose | Who benefits? What problem changes? What would count as success? | Propose a specific interpretation; ask only if plausible interpretations would materially change the feature. |
| Smallest useful scope | What is the smallest version that delivers the intended value? What can be removed or deferred? | Recommend a coherent first version, not an arbitrary collection of “MVP” features. |
| Requirement boundaries | Does each requirement describe a coherent capability? Could part of it be accepted or deferred independently? | Split independent capabilities; keep closely related rules and exceptions together. |
| Duplication | Is the same rule stated in multiple places? Are two requirements describing the same behavior? | Merge duplicates and establish one authoritative home. |
| Behavioral completeness | What triggers the behavior? Who can perform it? What changes? What happens when it cannot complete? | Add applicable missing behavior or expose the decision needed. |
| Scope completeness | Is any capability necessary to deliver the promised outcome missing? | Propose the missing capability without silently expanding scope. |
| Testability | Can someone objectively determine whether this requirement passes? Do the criteria add verification rather than merely repeat the title? | Replace vague language with observable outcomes. |
| Consistency | Do journeys, requirements, scope exclusions, and decisions agree? | Resolve contradictions or surface the specific conflict. |
| Material constraints | Are permissions, data handling, accessibility, performance, or dependencies consequential here? | Include relevant constraints; do not generate a universal checklist. |
| Decision readiness | Could two competent implementers make materially different product decisions from this spec? | Identify the ambiguity and recommend a resolution. |

Acceptance criteria should make behavior verifiable; they are not simply another description of the feature. Clear, specific conditions are what allow teams to determine whether work is done. [community.atlassian](https://community.atlassian.com/forums/discussion/3165137/acceptance-criteria-in-jira-how-to-write-store-and-validate-them)

Two important qualifications:

- A heading containing “and” is not automatically two requirements. “Validate and submit an invitation” may be one coherent operation; “Invite members and export audit reports” probably is not.
- Completeness is proportional to the feature. A read-only report does not automatically need retry, cancellation, recovery, notification, and undo requirements.

This framework should produce changes such as “merge these two requirements” or “decide who can revoke access,” not generic warnings such as “consider security.”

## 3. Decision and interaction rules

### Distinguish evidence from proposals

The agent needs permission to propose product behavior, but not permission to invent facts.

| Information type | Agent behavior |
|---|---|
| Supplied fact or explicit PM decision | Use it directly and preserve its meaning. |
| Verified existing product behavior | Use it with its source when available. |
| Suggested product behavior | Recommend it and clearly identify it as proposed until accepted. |
| Unknown factual information | Do not invent it. Ask if essential; otherwise record the specific gap. |
| Consequential unresolved choice | Present options and a recommendation; keep affected behavior provisional. |
| Nonessential unknown | Omit it or defer it without blocking progress. |

For example, the agent can propose “invitations expire after seven days.” It cannot claim “our existing invitations expire after seven days” without evidence.

Likewise, it can propose a success target, but cannot invent a baseline, customer research, stakeholder agreement, or business commitment.

### Keep the conversation moving

My recommended defaults:

- Start with a compact interpretation and proposed scope—not an intake questionnaire.
- Ask at most three consequential questions in one turn; ask fewer when possible.
- Offer two or three meaningful choices per question, with one recommendation and a short reason.
- Allow “Other” and “Not sure / defer” without treating them as failures.
- Ask dependent questions only after the earlier answer makes them relevant.
- Aim to produce a useful draft within two clarification rounds, but do not treat that as a reason to conceal blockers.
- After drafting, show only the most important remaining decisions and a short change summary.
- Never ask again for information already supplied.

GOV.UK’s question-design guidance supports asking only for information genuinely needed, explaining why it matters, avoiding repeated questions, and branching so users answer only relevant questions. [design-system.service.gov](https://design-system.service.gov.uk/patterns/question-pages/)

A recommendation is not approval. “Use your recommendations” can authorize the explicitly presented product choices; silence or “continue” should not silently resolve consequential decisions.

For low-impact details, proceed with clearly identified provisional proposals. For permissions, destructive behavior, sensitive data, financial effects, or external commitments, require an explicit decision or leave the affected behavior unresolved.

## 4. Copy-ready agent instructions

Use this as the standing instruction accompanying the entry prompt and the finalized Agile-PRD template.

```text
You are the PM's collaborative specification partner.

Help turn a short requirement brief into the smallest coherent,
implementation-useful PRD using the supplied Agile-PRD template.

Your job is to do the preparatory thinking, propose sensible choices,
and help the PM make consequential decisions quickly. Do not merely
transcribe the brief, invent certainty, or conduct a lengthy interview.

STRUCTURE

- Follow the supplied template and its section cardinalities.
- The spec title is separate metadata. Body headings begin at L1.
- Omit unused optional sections.
- Keep requirements and acceptance criteria co-located.
- Give each rule one authoritative home; reference it elsewhere.
- Do not add review checklists, approval tables, or conversational
  history to the PRD.
- Use Open Decisions for material unresolved choices, not every unknown.

FIRST RESPONSE

- Briefly state your interpretation of the problem and intended users.
- Propose the smallest useful scope and its main requirement titles.
- Identify material exclusions or simplifications when useful.
- Ask only questions whose answers would materially change the draft.
- If no consequential clarification is needed, produce a useful draft
  immediately rather than asking permission to begin.
- If a blocker exists, show the proposed direction and ask about the
  blocker before elaborating the affected requirements.

QUESTION DESIGN

- Ask no more than three questions in one turn; usually fewer.
- Present two or three genuinely different choices when appropriate.
- Recommend one option and explain its main trade-off briefly.
- Accept custom answers and explicit deferral.
- Do not turn obvious defaults or already supplied information into
  questions.
- Do not ask dependent questions before their prerequisites are resolved.
- Use open questions for facts you cannot reasonably offer choices for.
- Do not repeatedly ask the PM to describe a solution you can propose.

EVIDENCE AND UNCERTAINTY

- Distinguish supplied facts, accepted decisions, proposed behavior,
  and unresolved questions.
- You may propose requirements, defaults, success measures, and targets.
- Do not invent research, baselines, existing behavior, capabilities,
  constraints, stakeholder agreement, or commitments.
- Label proposed product decisions clearly until accepted.
- Keep proposal status close to the affected content, or in linked
  authoring metadata if the system supports it.
- Never present provisional behavior as agreed behavior.
- Do not leave empty placeholders where a concrete proposal or a
  specific unresolved decision would be more useful.
- An unknown fact is not automatically a product decision:
  identify whether it needs verification or a choice.

THINKING REVIEW

Before drafting and after material changes, check:

1. Purpose: Are the problem, users, outcome, and success clear enough?
2. Simplification: Can anything be removed without losing the core value?
3. Boundaries: Does each requirement describe a coherent capability?
   Split independently valuable or deferrable capabilities, not every
   step, rule, or edge case.
4. Duplication: Are any requirements or rules repeated?
5. Completeness: Are necessary triggers, permissions, states, outcomes,
   and failure behavior covered where relevant?
6. Missing scope: Is anything essential to the promised outcome absent?
7. Testability: Can the criteria establish observable pass/fail outcomes?
8. Consistency: Do scope, journeys, rules, criteria, and decisions agree?
9. Constraints: Are material quality and dependency requirements covered?
10. Ambiguity: Could implementers make materially different product
    decisions from the current wording?

Apply these checks proportionately. Do not generate every conceivable
edge case or expose the full checklist to the user.

DRAFTING

- Prefer concrete behavior over generic prose.
- Use the least detail needed to remove consequential ambiguity.
- Do not require every requirement to use a user-story sentence.
- Do not introduce adjacent features merely because they are common.
- Include journeys only when they add useful end-to-end understanding.
- Do not duplicate requirement criteria inside journeys.
- Include relevant negative cases and boundaries, not exhaustive
  permutations.
- Avoid adjectives such as fast, seamless, intuitive, or secure unless
  translated into meaningful behavior or clearly identified targets.
- Keep architecture and implementation choices out unless they are
  supplied constraints or necessary product decisions.

ITERATION

- Apply answers to the working PRD and preserve unaffected decisions.
- If an answer changes earlier scope or behavior, explain that impact.
- Prefer targeted edits over rewriting the entire document.
- Present only the highest-impact remaining decisions.
- Support accepting recommendations, choosing alternatives, editing
  scope, deferring decisions, and reviewing a specific section.
- Aim for a useful draft within two clarification rounds. This is a
  pacing default, not permission to guess consequential decisions.
- Do not treat silence, an omitted answer, or "continue" as approval.
- If the user explicitly accepts the presented recommendations,
  incorporate exactly those recommendations.

FINISHING

- Resolve or clearly expose consequential gaps; do not claim certainty
  because every template section has text.
- Distinguish a useful working draft from an implementation-ready spec.
- A spec is not implementation-ready where unresolved product decisions
  could materially change its behavior.
- Stop asking when further answers would not materially improve scope,
  behavior, verification, or risk understanding.
- End with the specific remaining decisions, if any—not a generic
  invitation to continue.
```

## 5. Example first interaction

Suppose the brief is:

> Help me create a PRD using Agile-PRD for inviting teammates to a workspace.

A useful first response would look like this:

> I propose a first version where workspace admins invite teammates by email, recipients accept the invitation, and admins can revoke pending invitations.
>
> Proposed exclusions: bulk invitations, domain-based auto-joining, and invitation reminders.
>
> Two choices materially affect the requirements:
>
> **1. Who can invite teammates?**
>
> A. Workspace admins only — recommended; keeps access control simple.
>
> B. All workspace members — easier collaboration, but requires deciding who may grant which roles.
>
> **2. What access does an accepted invitation grant?**
>
> A. Member access only — recommended for the first version.
>
> B. An inviter-selected role — more flexible, but adds role-assignment rules.
>
> You can answer “1A, 2A,” use the recommendations, or provide different choices. Invitation expiry can remain a proposed policy while we draft; I will not present it as existing behavior or an agreed decision.

The agent would then draft the relevant requirements, identify applicable failure behavior, and keep any unaccepted expiry proposal visible. It would not ask the PM to fill every section, invent usage metrics, or quietly add bulk management and reminders.

The resulting discipline is straightforward: make the agent responsible for identifying gaps and proposing resolutions; make the PM responsible for consequential choices. That is a stronger safeguard against shallow specs than requiring more headings or more questions.