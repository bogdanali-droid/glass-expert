# 📋 SHARED PROTOCOLS — Glass Expert Pod

**Status:** Inherited from AXA IT  
**Owner:** @Glass (Glass Expert COO)  
**Synchronization:** All protocols align with ai-team shared values  
**Date:** 2026-06-02  

---

## 🎯 Core Protocols (Obligatory for All Agents)

### 1. **Escalation Protocol** — P0/P1/P2/P3 Routing
**File:** `escalation-protocol.md` (To be created)

**Summary:**
- 🔴 **P0 (Critical):** System down, data loss → **DIRECT TO BOGDAN + @ana**, <5 min
- 🟠 **P1 (High):** Major blocker → **@Glass or @glass-lead**, <15 min response
- 🟡 **P2 (Medium):** Bug/issue → **Pod resolves**, no escalation unless deadline at risk
- 🟢 **P3 (Low):** Minor, non-urgent → Backlog, fix when ready
- ⚪ **P4 (Idea):** Suggestion → Document in learnings.md

**Trigger Decisions:**
- Client blocked? → P1
- Deal at risk? → P1
- Data issue? → P0
- Feature delayed? → P2
- Nice-to-have? → P3

---

### 2. **Memory Protocol** — Session Handoff & Continuity
**File:** `memory-protocol.md` (To be created)

**Summary:**
Every agent writes to `shared/memory/<their-name>/active-projects.md` at END of session:

```markdown
**Current Status:** [in_progress / blocked / completed]
**Next Action:** [what to do next]
**Blocked By:** [if applicable]
**Date Updated:** YYYY-MM-DD
```

**Guarantees:**
- Next agent knows where we are
- No context loss between sessions
- Quick ramp-up <5 min

**Files per Agent:**
```
shared/memory/<agent>/
├── active-projects.md      ← Updated every session
├── learnings.md            ← Append-only
└── tier-warm/, tier-cold/  ← Long-term storage
```

---

### 3. **Communication Protocol** — How We Talk
**File:** `communication-protocol.md` (To be created)

**Summary:**
- **Language:** Română (all internal comms)
- **Style:** Direct, no lingușeală, professional
- **Channels:** Git comments, GitHub issues, memory files (NO Slack/Teams)
- **Async First:** Don't wait for instant replies
- **P0/P1 Only:** Can interrupt for critical issues

**Standup Format:**
```
## [AGENT] Status Update

### Current Work
- [Task 1]: [Status]
- [Task 2]: [Status]

### Blockers
[Any blockers?]

### Next Actions
[What's next?]
```

---

### 4. **Anti-Timeout Protocol** — Long Session Management
**File:** `anti-timeout-protocol.md` (To be created)

**Summary:**
- **Write fragmentation:** Keep writes <10KB (prevent context explosion)
- **Frequency:** Commit/push every 30-45 min of active work
- **Task breakdown:** Split big tasks into 1-2h subtasks
- **Memory:** Dump context to memory files, don't keep in head
- **No mega-files:** Break code/docs into modules

**Triggers:**
- File >100 lines of code? Split into modules
- Session >2h? Write checkpoint to memory
- Multiple tasks? Do one at a time
- Context full? Save + push + fresh session

---

### 5. **Proposals & Decision Protocol** — How Decisions Get Made
**File:** `proposals-protocol.md` (To be created)

**Summary:**
When proposing to Bogdan:

```
## Proposal: [Short title]

### What
[1 sentence: what are we deciding?]

### Options
1. **Option A:** [Pros/Cons, effort, timeline]
2. **Option B:** [Pros/Cons, effort, timeline]
3. **Option C:** [Pros/Cons, effort, timeline]

### Recommendation
**Option B** because [2-3 reasons]

### Risk
- [Risk 1]
- [Risk 2]

### Timeline
[If approved, when do we start/finish?]
```

**Bogdan decides.** You recommend. Decision always his.

---

## 🏢 Glass Expert Specific Protocols

### 6. **Sales Pipeline Protocol** — Deal Tracking
**File:** `sales-pipeline-protocol.md` (To be created)

Tracks every prospect from first contact → closed deal:

```
Prospect Name | Company | Contact | Stage | Value | Probability | Next Action | Owner | Date
---|---|---|---|---|---|---|---|---
John Smith | Acme Corp | john@acme | Proposal sent | €75K | 60% | Follow-up call | @glass-sales | 2026-06-05
```

**Stages:**
1. **Lead** — Initial contact
2. **Qualified** — Budget + decision maker confirmed
3. **Proposal sent** — Quote + proposal delivered
4. **Negotiation** — Discussing terms
5. **Closed Won** — Deal signed
6. **Closed Lost** — Why we lost?

---

### 7. **Client Success Protocol** — Post-Sale Management
**File:** `client-success-protocol.md` (To be created)

After deal closes:

- **30 days:** Onboarding + project kickoff
- **60 days:** Status check + progress confirmation
- **90 days:** Completion + satisfaction survey
- **6 months:** Upsell opportunity review
- **Annual:** Renewal + expansion discussion

**Owner:** @glass-support + @glass-account

---

## 📚 Knowledge & Reference Protocols

### 8. **Glass Industry Standards** — Technical Reference
**File:** `glass-specs-reference.md` (To be created)

Quick reference:
- Glass types (tempered, laminated, curved, ceramic-printed)
- International standards (EN, ASTM, ISO)
- Glas Expert product specs
- Performance ratings + certifications

---

### 9. **Pricing Model** — Quote Generation Rules
**File:** `pricing-model.md` (To be created)

- Base cost per m² (by glass type)
- Customization premiums (curved, special coatings)
- Volume discounts
- Margin targets per deal
- International shipping costs

**Owner:** @glass-pricing

---

### 10. **USA Market Entry** — Market Intelligence
**File:** `usa-market-strategy.md` (To be created)

- Competitor mapping (5+ key USA glass companies)
- Pricing benchmarks (USA market)
- Sales cycle typical (3-6 months for architectural)
- Key personas (architects, developers, contractors)
- Procurement standards (certifications, warranties)

**Owner:** @glass-market

---

## 🧠 Agent Management Protocols

### 11. **Agent Activation & Onboarding** — How Agents Join Pod
**File:** `agent-activation.md` (To be created)

When activating a new agent:
1. Copy agent profile to `agents/<name>.md`
2. Create memory folder: `shared/memory/<name>/`
3. Initial briefing (30 min, cover domain + first task)
4. Assign first task (simple, build confidence)
5. Daily standup integration
6. Monthly skill review

---

### 12. **Agent Life Protocol** — Team Health & Culture
**File:** `agent-life-protocol.md` (Inherited from ai-team)

- **Socializare:** Celebrate wins, acknowledge growth
- **Relații:** Agents collaborate, no silos
- **Pauze:** Legitimate to say "need context refresh"
- **Learning:** Continuous skill evolution expected
- **Feedback:** Constructive, specific, actionable

---

## 🔄 Operational Ritualuri

| Ritual | Schedule | Owner | Purpose |
|--------|----------|-------|---------|
| **Daily Standup** | 09:00 UTC | @Glass | Status + blockers |
| **Weekly KPI Review** | Friday 16:00 | @Glass + @glass-sales-lead | Pipeline velocity, deals, metrics |
| **Weekly Retro** | Friday 18:00 | @Glass | What worked, what didn't, actions |
| **Monthly Retro** | Last Friday | @Glass | Bigger picture + agent evolution |
| **Learnings** | Continuous | All agents | Append-only KB |

---

## 📁 Repository Structure (Shared)

```
glass-expert/
├── shared/
│   ├── PROTOCOLS-INDEX.md      ← This file
│   ├── protocols/              ← Individual protocol files
│   │   ├── escalation.md
│   │   ├── memory.md
│   │   ├── communication.md
│   │   ├── sales-pipeline.md
│   │   ├── glass-specs.md
│   │   ├── pricing-model.md
│   │   └── usa-market.md
│   └── memory/                 ← Agent memory (per agent)
│       ├── glass/              ← @Glass memory
│       │   ├── active-projects.md
│       │   └── learnings.md
│       ├── glass-sales/        ← @glass-sales-lead memory
│       │   ├── active-projects.md
│       │   └── sales-pipeline.md
│       ├── glass-account/      ← @glass-account memory
│       │   ├── active-projects.md
│       │   └── client-notes.md
│       └── [other agents]
├── agents/
│   ├── glass-coo.md            ← @Glass (you)
│   ├── glass-lead.md           ← Pod co-lead
│   ├── glass-sales-lead.md     ← Sales director
│   └── [other 7 agents]
├── docs/
│   ├── BUSINESS-RESEARCH.md    ← Glas Expert market analysis
│   ├── glass-specs.md          ← Product reference
│   ├── pricing-model.md        ← Pricing + margins
│   ├── usa-market.md           ← Market strategy
│   └── client-database.md      ← Client tracking
└── [project docs]
```

---

## 🔗 Integration with AXA IT

### Shared with ai-team
- **Memory protocol** — identical structure
- **Escalation path** — P0/P1 escalate to Bogdan
- **Standup format** — 09:00 UTC same as ai-team
- **Weekly KPI** — Friday 16:00 (can be combined with ai-team)
- **Learnings tracker** — append-only, shared knowledge

### Key Contact
- **@ana (ai-team COO)** — escalation support, cross-pod coordination
- **@Glass (glass-expert COO)** — day-to-day pod management

### Cross-Pod Visibility
- Glass Expert standup shared with Bogdan daily
- KPI dashboard integrated into ai-team metrics
- Major escalations copied to @ana
- Learnings shared across both orgs

---

## ✅ Protocol Compliance Checklist

**Every agent must:**
- [ ] Read all protocols (1st session, 30 min)
- [ ] Understand escalation triggers
- [ ] Write memory at end of session
- [ ] Use standardized communication format
- [ ] Escalate P0/P1 immediately
- [ ] Contribute to learnings

**@Glass must:**
- [ ] Run daily standup 09:00 UTC
- [ ] Weekly KPI review (Friday 16:00)
- [ ] Monthly retro + agent evolution
- [ ] Escalate to Bogdan when needed
- [ ] Support team proactively
- [ ] Update memory + manage knowledge

---

## 📞 Questions?

- **Which protocol?** See index above + links to individual docs
- **Unsure on escalation?** Ask @Glass (threshold is low for P1)
- **Need training?** Ask @Glass for 30-min onboarding
- **Protocol change?** @Glass approves + documents + shares with team

---

**Protocols = Organizational DNA.**  
Follow them = predictable operations.  
Question them = healthy feedback.

**Glass Expert is built on clear protocols, transparent decisions, and team trust.**

🔮 **Let's build this right.**
