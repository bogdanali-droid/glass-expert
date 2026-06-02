# 🤖 AI AGENT COMMUNICATION PROTOCOL
**Glass Expert Agent Network — Structured Inter-Agent Communication**

---

## 🏗️ AGENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│  STRATEGIC LAYER (Bogdan)                              │
│  └─ Receives: Monthly reports, strategic decisions     │
│  └─ Sends: Strategic directives, approvals             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  SUPERVISION LAYER (@ana - ai-team COO)               │
│  └─ Receives: Weekly reports, KPIs, blockers          │
│  └─ Sends: Approvals, resources, strategy corrections │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│  OPERATIONAL LAYER (@Glass - Glass Expert COO)         │
│  └─ Receives: Daily standups, metrics, escalations    │
│  └─ Sends: Delegation, unblocking, direction           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SPECIALIST AGENTS (9 agents)                     │  │
│  │  @glass-dev | @glass-sales | @glass-marketing   │  │
│  │  @glass-content | @glass-assets | @glass-crm    │  │
│  │  @glass-account | @glass-spec | @glass-support  │  │
│  │                                                   │  │
│  │  Communication: Agent-to-Agent via Shared Memory │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘

SHARED MEMORY LAYER:
├─ /shared/memory/team-status.json      (real-time KPIs)
├─ /shared/memory/daily-standups.json   (agent standups)
├─ /shared/memory/blockers.json         (P0/P1/P2 issues)
├─ /shared/memory/delegation-queue.json (task assignments)
└─ /shared/memory/design-specs.json     (brand/design constants)
```

---

## 📨 MESSAGE TYPES & PROTOCOLS

### TYPE 1: DAILY STANDUP (Required 09:00 UTC)

**Source:** Each specialist agent  
**Destination:** Shared memory + @Glass review  
**Format:** JSON (structured)  
**Frequency:** Once daily

```json
{
  "timestamp": "2026-06-02T09:00:00Z",
  "agent": "@glass-sales",
  "message_type": "daily_standup",
  "status": "GREEN|YELLOW|RED",
  "completed_yesterday": [
    "Sent 12 cold emails to architecture firms",
    "Got 2 positive responses (8% response rate)",
    "Qualified 1 lead for proposal"
  ],
  "planned_today": [
    "Follow up with 3 warm prospects",
    "Monitor Dodge RFQ board for 2 projects",
    "Prepare quote for Commercial Real Estate firm"
  ],
  "blockers": [],
  "metrics": {
    "emails_sent": 12,
    "response_rate": 0.08,
    "qualified_leads": 1,
    "pipeline_value_eur": 150000
  },
  "escalation_needed": false
}
```

**Storage:** `shared/memory/daily-standups.json` → Appended as array  
**Consumer:** @Glass (reviews all, identifies patterns, flags P0)

---

### TYPE 2: BLOCKER ALERT (Urgent - Real-time)

**Source:** Any agent encountering P0/P1 blocker  
**Destination:** @Glass + shared memory  
**Format:** JSON + Slack priority tag  
**Frequency:** On-demand (immediately)

```json
{
  "timestamp": "2026-06-02T14:30:00Z",
  "agent": "@glass-dev",
  "message_type": "blocker_alert",
  "severity": "P0|P1|P2",
  "title": "Form submission backend integration failing",
  "description": "EmailJS API returning 401 errors - authentication issue with API key",
  "impact": "Contact form not submitting - no leads being captured",
  "attempted_solutions": [
    "Verified API key in config - correct",
    "Checked CORS headers - proper",
    "Tested API endpoint directly - returns 401"
  ],
  "requested_from": "@Glass",
  "requested_action": "Check EmailJS account setup or provide alternate service",
  "urgency_reason": "Blocking website launch - form is critical path"
}
```

**Storage:** `shared/memory/blockers.json` → Current blockers list  
**Consumer:** @Glass (immediate response required for P0)  
**Escalation:** If @Glass unresponsive >1 hour on P0 → escalate to @ana

---

### TYPE 3: DELEGATION ASSIGNMENT (From @Glass)

**Source:** @Glass (supervisor)  
**Destination:** Specific agent + shared memory  
**Format:** JSON task definition  
**Frequency:** As needed (usually daily)

```json
{
  "timestamp": "2026-06-02T09:15:00Z",
  "delegation_id": "DEL-2026-06-001",
  "from": "@Glass",
  "to": "@glass-dev",
  "task_name": "Homepage Hero Section Redesign",
  "description": "Redesign homepage hero with new design system colors and layout per UI-UX-DESIGN-BRIEF.md",
  "context": {
    "design_ref": "UI-UX-DESIGN-BRIEF.md — Section: Visual Design System",
    "colors": {
      "primary_blue": "#1B3A6B",
      "accent_gold": "#D4AF37",
      "background": "#FFFFFF"
    },
    "requirements": [
      "Apply design system colors",
      "Update headline to new brand positioning",
      "Add value propositions (3 cards)",
      "Mobile responsive",
      "PageSpeed maintained >90"
    ]
  },
  "acceptance_criteria": [
    "Homepage renders with new design",
    "Colors match specification exactly",
    "Mobile testing on 2 breakpoints",
    "No regression in existing functionality"
  ],
  "deadline": "2026-06-04T17:00:00Z",
  "priority": "P1",
  "dependencies": ["Design system finalized"],
  "estimated_effort": "8 hours",
  "reporting_format": "Daily standup + design screenshot by EOD"
}
```

**Storage:** `shared/memory/delegation-queue.json` → Active tasks  
**Consumer:** Assigned agent (starts work immediately)  
**Acknowledgment:** Agent responds with timestamp when task started

---

### TYPE 4: METRICS UPDATE (Real-time or Batched)

**Source:** Specialist agents (continuous)  
**Destination:** Shared memory  
**Format:** JSON (append-only metrics log)  
**Frequency:** Continuous (batch hourly)

```json
{
  "timestamp": "2026-06-02T17:00:00Z",
  "agent": "@glass-sales",
  "metric_type": "lead_generation",
  "metrics": {
    "emails_sent_today": 15,
    "responses_received": 2,
    "response_rate": 0.133,
    "qualified_leads": 1,
    "unqualified_leads": 1,
    "pipeline_value_added_today": 250000,
    "cumulative_pipeline": 1250000,
    "target_pipeline": 1780000,
    "progress_percent": 70
  },
  "trend": "On track - exceeding email targets",
  "forecast": "Will reach 15-20 qualified leads by Week 2 end"
}
```

**Storage:** `shared/memory/team-status.json` → Updated real-time  
**Consumer:** @Glass (for supervision) + Reporting (for weekly summary)

---

### TYPE 5: WEEKLY EXECUTIVE REPORT (@Glass → @ana)

**Source:** @Glass (synthesizes all agent data)  
**Destination:** @ana + Bogdan  
**Format:** Structured JSON + Markdown summary  
**Frequency:** Friday 17:00 UTC

```json
{
  "report_period": "2026-05-27 to 2026-06-02",
  "reporting_agent": "@Glass",
  "status_overall": "GREEN|YELLOW|RED",
  
  "executive_summary": {
    "wins": [
      "Website Phase 1 on track - 60% complete",
      "Lead generation exceeded targets - 8 qualified leads",
      "Social media activated - 240 new followers"
    ],
    "risks": [
      "Design asset sourcing delayed by 2 days",
      "Form backend integration needs resolution"
    ],
    "next_priorities": [
      "Homepage redesign completion",
      "Glass Selector tool functionality",
      "First proposals to prospects"
    ]
  },
  
  "department_reports": {
    "@glass-dev": {
      "status": "GREEN",
      "completion_percent": 60,
      "deliverables_on_track": 4,
      "deliverables_at_risk": 1,
      "blockers_count": 1
    },
    "@glass-sales": {
      "status": "GREEN",
      "leads_this_week": 8,
      "leads_cumulative": 8,
      "target": 15,
      "progress_percent": 53,
      "pipeline_value": 1250000
    },
    "@glass-marketing": {
      "status": "GREEN",
      "followers_gained": 240,
      "engagement_rate": 0.045,
      "posts_published": 6
    }
  },
  
  "kpis_vs_targets": {
    "leads": {"actual": 8, "target": 5, "status": "ON_TRACK"},
    "website_pages": {"actual": 3, "target": 5, "status": "ON_TRACK"},
    "pipeline_eur": {"actual": 1250000, "target": 1780000, "status": "ON_TRACK"}
  },
  
  "escalations": [
    {
      "severity": "P1",
      "title": "EmailJS backend integration",
      "owner": "@glass-dev",
      "action_requested": "Approve alternate service or resolve API issue"
    }
  ]
}
```

**Storage:** `shared/memory/reports/` → Weekly timestamped files  
**Consumer:** @ana (reviews progress, approves decisions) + Bogdan (strategic view)

---

## 🔄 AGENT INTERACTION PATTERNS

### Pattern 1: AGENT-TO-AGENT DEPENDENCY RESOLUTION

```
@glass-dev needs design asset → Checks shared/memory/design-specs.json
  ├─ Color specs ✓ (in memory)
  ├─ Typography specs ✓ (in memory)
  ├─ Icon asset status → @glass-assets in progress
  │   └─ Polls shared/memory/daily-standups.json for @glass-assets status
  │   └─ Sees ETA: "Day 5"
  │   └─ Adapts timeline: Uses placeholder colors until assets ready
  └─ Updates own status with dependency tracking
```

### Pattern 2: BLOCKER ESCALATION CHAIN

```
@glass-crm encounters form backend issue (P0)
  ├─ Logs to shared/memory/blockers.json
  ├─ @Glass reviews standups at 09:00 UTC
  │   └─ Identifies P0 blocker
  │   └─ Proposes 2 solutions: Fix API auth OR switch service
  ├─ If @Glass can't resolve → escalates to @ana
  │   └─ @ana approves solution (same day)
  └─ Issue resolved, blocker cleared from memory
```

### Pattern 3: COLLABORATIVE TASK EXECUTION

```
Website homepage redesign requires:
  ├─ @glass-dev (HTML/CSS implementation)
  ├─ @glass-content (copy writing)
  ├─ @glass-assets (hero image, colors)
  
Coordination via shared memory:
  ├─ Day 1: All 3 agents read UI-UX-DESIGN-BRIEF.md from shared memory
  ├─ Day 2: @glass-content publishes copy → shared memory
  │   └─ @glass-dev reads copy, starts HTML structure
  ├─ Day 3: @glass-assets publishes hero image + colors → shared memory
  │   └─ @glass-dev integrates, applies colors
  ├─ Day 4: All 3 agents review combined result
  └─ Day 5: Homepage complete, tested, deployed
```

---

## 📁 SHARED MEMORY STRUCTURE

```
glass-expert/
├─ shared/
│   └─ memory/
│       ├─ team-status.json              (Real-time KPIs - read-only for viewing)
│       ├─ daily-standups.json           (All daily standups - append-only)
│       ├─ blockers.json                 (Active blockers - updated live)
│       ├─ delegation-queue.json         (Active task assignments)
│       ├─ design-specs.json             (Design constants - never changes)
│       ├─ brand-guidelines.json         (Brand + messaging constants)
│       ├─ market-segmentation.json      (Customer personas + messaging)
│       ├─ technical-specs.json          (Glass specs + standards)
│       └─ reports/
│           ├─ weekly-2026-06-02.json    (Week 1 report)
│           ├─ monthly-2026-06.json      (Month June report)
│           └─ 90day-roadmap.json        (90-day targets)
```

**Access Rules:**
- All agents: Read access to all memory files
- Only specified agent: Write access to specific files
  - @glass-dev → writes to delegation-queue (acknowledge) + daily-standups
  - @glass-sales → writes to team-status (metrics) + daily-standups
  - @Glass → writes to blockers (resolve/update)
  - @ana → writes to reports/

---

## ⚠️ ESCALATION PROTOCOL (Agent → @Glass → @ana → Bogdan)

```
Severity | Timeout | Action
---------|---------|--------
P0       | 1 hour  | @Glass must respond. If not → escalate to @ana immediately
P1       | 4 hours | @Glass responds in standup. If unresolved → @ana EOD
P2       | 24 hrs  | Include in weekly report. @Glass decides.
P3       | EOW     | Include in weekly report only.

Example P0 Escalation Path:
@glass-crm logs P0 blocker (09:30 UTC)
  ├─ @Glass checks at 09:00 standup (might be logged after standup)
  ├─ @Glass acknowledges + proposes solution (10:00 UTC)
  ├─ If no solution by 10:30 → @Glass pings @ana
  ├─ @ana approves solution OR provides alternative (11:00 UTC)
  └─ Issue resolved by EOD
```

---

## 🎯 DESIGN REQUIREMENTS (In Shared Memory)

All agents have access to `shared/memory/design-specs.json`:

```json
{
  "brand_positioning": "European Innovation. American Speed. Architectural Impact.",
  "design_pillars": [
    "Premium but Approachable",
    "Innovative & Modern",
    "Segment-Specific",
    "Visual Storytelling",
    "Mobile-First"
  ],
  "colors": {
    "primary": {
      "name": "Deep Blue",
      "hex": "#1B3A6B",
      "usage": "Headers, CTAs, primary elements"
    },
    "accent": {
      "name": "Gold",
      "hex": "#D4AF37",
      "usage": "Highlights, premium indicators"
    },
    "segments": {
      "commercial": "#0E7C86",
      "hospitality": "#B87333",
      "healthcare": "#6FCF97",
      "education": "#4B0082"
    }
  },
  "typography": {
    "headlines": "Poppins Bold",
    "body": "Inter Regular",
    "accents": "Georgia or Crimson Text"
  },
  "phase1_deliverables": [
    "Homepage redesign",
    "Glass Selector Tool",
    "4 Segment pages",
    "Contact form",
    "Mobile optimization",
    "Cloudflare deployment"
  ]
}
```

**Important:** All agents read this file daily. Design changes go through @ana approval first.

---

## ✅ AGENT PROTOCOL COMPLIANCE

**Every agent must:**
- ✅ Submit daily standup 09:00 UTC (JSON format)
- ✅ Update team-status.json with current metrics
- ✅ Log blockers immediately (P0 + P1)
- ✅ Check shared memory for delegations at start of day
- ✅ Reference design-specs.json before any visual/messaging work
- ✅ Acknowledge receipt of delegation assignments
- ✅ Respond to @Glass requests within 1 hour (P0) / 4 hours (P1)
- ✅ Read weekly report for context/feedback

**@Glass must:**
- ✅ Review all standups 09:30 UTC daily
- ✅ Identify + escalate blockers same day
- ✅ Unblock agents or escalate to @ana
- ✅ Update blockers.json with status/resolution
- ✅ Compile weekly report by Friday 16:00 UTC
- ✅ Send weekly report to @ana by Friday 17:00 UTC

**@ana must:**
- ✅ Review @Glass weekly reports
- ✅ Assess KPIs vs targets
- ✅ Approve P0/P1 escalation resolutions
- ✅ Provide strategic feedback
- ✅ Report to Bogdan monthly

---

## 🚀 IMPLEMENTATION (First Week)

**Day 1 (Today):**
- [ ] Create shared/memory/ directory structure
- [ ] Populate design-specs.json with design brief
- [ ] Activate agent team with protocol docs
- [ ] First daily standup at 09:00 UTC tomorrow

**Week 1:**
- [ ] All agents submitting daily standups
- [ ] Shared memory populated with agent updates
- [ ] Blockers logged + resolved daily
- [ ] @Glass supervising + escalating as needed

**Week 2:**
- [ ] First weekly report compiled
- [ ] KPIs tracked + reported to @ana
- [ ] Phase 1 progress visible in metrics
- [ ] Team velocity established

---

**AGENT COMMUNICATION PROTOCOL — ACTIVE**

All agents: Read, understand, and comply with this protocol.

Effective: 2 iunie 2026  
Review: Weekly (adjust as needed)  
Status: READY FOR ACTIVATION

