# CRM Business Workflow Optimization

## Executive Summary

Complete redesign of pricing, booking, and CRM workflows to increase conversion rates by 45% and reduce sales cycle time by 30%.

---

## 1. Lead-to-Client Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LEAD GENERATION                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: LEAD CAPTURE                                          │
│  ─────────────────────────                                      │
│  Sources: Website, Referral, Social, Events, Ads               │
│  Data: Name, Email, Phone, Project Type, Budget, Timeline      │
│  Auto Actions:                                                  │
│    • Send welcome email (instant)                               │
│    • Create lead record                                         │
│    • Assign to designer (round-robin)                           │
│    • Schedule follow-up task (1 hour)                           │
│  SLA: Respond within 1 hour                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: LEAD QUALIFICATION                                    │
│  ────────────────────────────                                   │
│  Scoring Model (0-100 points):                                  │
│    Budget Score (40 points):                                    │
│      • $250k+        = 40 points  (Premium)                     │
│      • $100k-$250k   = 30 points  (High-value)                  │
│      • $50k-$100k    = 20 points  (Mid-tier)                    │
│      • $25k-$50k     = 10 points  (Entry)                       │
│      • <$25k         = 0 points   (Low-priority)                │
│                                                                  │
│    Timeline Score (20 points):                                  │
│      • Immediate     = 20 points  (Ready to start)              │
│      • 1-3 months    = 15 points  (Soon)                        │
│      • 3-6 months    = 10 points  (Planning)                    │
│      • 6+ months     = 5 points   (Future)                      │
│      • Uncertain     = 0 points   (Exploring)                   │
│                                                                  │
│    Project Type Score (15 points):                              │
│      • Commercial    = 15 points  (High margin)                 │
│      • Full home     = 12 points  (Large scope)                 │
│      • Renovation    = 10 points  (Medium scope)                │
│      • Single room   = 5 points   (Small scope)                 │
│      • Consultation  = 3 points   (Low commitment)              │
│                                                                  │
│    Source Score (15 points):                                    │
│      • Referral      = 15 points  (High trust)                  │
│      • Past client   = 15 points  (Repeat business)             │
│      • Website       = 10 points  (Self-educated)               │
│      • Social media  = 7 points   (Brand aware)                 │
│      • Paid ad       = 5 points   (Cold traffic)                │
│                                                                  │
│    Engagement Score (10 points):                                │
│      • Responded fast           = +5 points                     │
│      • Provided details         = +3 points                     │
│      • Viewed portfolio         = +2 points                     │
│      • Downloaded materials     = +2 points                     │
│                                                                  │
│  Lead Grades:                                                   │
│    A-Grade (80-100): Hot lead - Priority 1                      │
│    B-Grade (60-79):  Warm lead - Priority 2                     │
│    C-Grade (40-59):  Cold lead - Priority 3                     │
│    D-Grade (0-39):   Nurture lead - Priority 4                  │
│                                                                  │
│  Auto Actions:                                                  │
│    • Calculate lead score                                       │
│    • Assign priority grade                                      │
│    • Route to appropriate designer                              │
│    • Trigger grade-specific workflow                            │
│  Decision: Qualify (60+) or Nurture (<60)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│  NURTURE TRACK           │    │  QUALIFIED TRACK         │
│  ──────────────           │    │  ────────────────         │
│  Score: 0-59             │    │  Score: 60-100           │
│  Auto email sequence:    │    │  Direct to consultation  │
│    • Week 1: Portfolio   │    │                          │
│    • Week 2: Case study  │    │                          │
│    • Week 4: Tips guide  │    │                          │
│    • Week 8: Special offer│   │                          │
│  Exit: Score rises to 60+│    │                          │
└──────────────────────────┘    └──────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: CONSULTATION SCHEDULED                                │
│  ─────────────────────────────                                  │
│  Booking Options:                                               │
│    • In-person consultation (90 min)                            │
│    • Virtual consultation (60 min)                              │
│    • Site visit (2-3 hours)                                     │
│                                                                  │
│  Pre-Consultation:                                              │
│    • Send questionnaire (project vision, style, must-haves)     │
│    • Request inspiration photos                                 │
│    • Request floor plans/photos if available                    │
│    • Send calendar invite with Zoom link                        │
│                                                                  │
│  Auto Actions:                                                  │
│    • Send booking confirmation                                  │
│    • Add to calendar                                            │
│    • Send reminder (24 hours before)                            │
│    • Send questionnaire                                         │
│    • Create consultation task                                   │
│  SLA: Consultation within 5 business days                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: CONSULTATION COMPLETED                                │
│  ─────────────────────────────────                              │
│  Deliverables:                                                  │
│    • Project scope definition                                   │
│    • Timeline estimate                                          │
│    • Budget range                                               │
│    • Style direction                                            │
│    • Next steps outline                                         │
│                                                                  │
│  Designer Actions:                                              │
│    • Take detailed notes                                        │
│    • Photograph site (if in-person)                             │
│    • Document requirements                                      │
│    • Update project details in CRM                              │
│    • Set follow-up date (2-3 days)                              │
│                                                                  │
│  Auto Actions:                                                  │
│    • Send thank you email                                       │
│    • Send consultation summary                                  │
│    • Create quotation task                                      │
│    • Schedule follow-up call                                    │
│  Decision: Move to proposal or disqualify                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: QUOTATION PREPARATION                                 │
│  ────────────────────────────                                   │
│  Quotation Components:                                          │
│                                                                  │
│  A. Design Fees (20-30% of total):                              │
│     • Initial consultation:     $500 (credited if signed)       │
│     • Concept development:      15% of construction budget      │
│     • Design documentation:     8% of construction budget       │
│     • Project management:       7% of construction budget       │
│     Minimum design fee: $15,000                                 │
│                                                                  │
│  B. Construction/Implementation (70-80% of total):              │
│     Pricing Model: Cost-Plus or Fixed-Price                     │
│                                                                  │
│     Cost-Plus Method:                                           │
│       Materials cost + Labor cost + 20% markup                  │
│       Pros: Transparent, flexible                               │
│       Cons: Uncertain total                                     │
│                                                                  │
│     Fixed-Price Method:                                         │
│       Room-based pricing with line items                        │
│       Pros: Predictable, client confidence                      │
│       Cons: Risk if costs exceed estimate                       │
│                                                                  │
│  Room-Based Pricing Guide (NYC market):                         │
│    Living Room (400 sq ft):                                     │
│      • Basic refresh:        $15,000 - $25,000                  │
│      • Mid-tier renovation:  $25,000 - $50,000                  │
│      • Luxury transformation: $50,000 - $100,000+               │
│                                                                  │
│    Kitchen (200 sq ft):                                         │
│      • Cosmetic update:      $25,000 - $40,000                  │
│      • Mid-range remodel:    $40,000 - $75,000                  │
│      • High-end renovation:  $75,000 - $150,000+                │
│                                                                  │
│    Bedroom (300 sq ft):                                         │
│      • Design refresh:       $10,000 - $20,000                  │
│      • Complete redesign:    $20,000 - $40,000                  │
│      • Luxury suite:         $40,000 - $80,000+                 │
│                                                                  │
│    Bathroom (80 sq ft):                                         │
│      • Basic update:         $15,000 - $25,000                  │
│      • Full renovation:      $25,000 - $50,000                  │
│      • Spa-quality luxury:   $50,000 - $100,000+                │
│                                                                  │
│  Package Options:                                               │
│    Bronze Package (Entry-level):                                │
│      • Virtual consultations only                               │
│      • Concept boards & material selections                     │
│      • Shopping list with sources                               │
│      • Email support                                            │
│      Price: $5,000 - $15,000                                    │
│                                                                  │
│    Silver Package (Standard):                                   │
│      • 2-3 in-person consultations                              │
│      • Full design documentation                                │
│      • 3D renderings (2-3 views)                                │
│      • Vendor coordination                                      │
│      • Project oversight (bi-weekly)                            │
│      Price: $25,000 - $75,000                                   │
│                                                                  │
│    Gold Package (Premium):                                      │
│      • Unlimited consultations                                  │
│      • Complete design & documentation                          │
│      • 3D renderings (unlimited)                                │
│      • Full project management                                  │
│      • Site visits (weekly)                                     │
│      • Custom furniture design                                  │
│      • Art curation                                             │
│      Price: $75,000 - $250,000+                                 │
│                                                                  │
│  Quotation Template Structure:                                  │
│    1. Executive Summary                                         │
│       • Project vision                                          │
│       • Scope overview                                          │
│       • Total investment                                        │
│       • Timeline                                                │
│                                                                  │
│    2. Design Services Breakdown                                 │
│       • Line-item fees                                          │
│       • Payment schedule                                        │
│       • Deliverables                                            │
│                                                                  │
│    3. Construction/Implementation Costs                         │
│       • Room-by-room breakdown                                  │
│       • Material allowances                                     │
│       • Labor estimates                                         │
│       • Contingency (10-15%)                                    │
│                                                                  │
│    4. Exclusions & Assumptions                                  │
│       • What's NOT included                                     │
│       • Change order policy                                     │
│       • Client responsibilities                                 │
│                                                                  │
│    5. Terms & Conditions                                        │
│       • Payment terms (30/30/30/10)                             │
│       • Cancellation policy                                     │
│       • Timeline dependencies                                   │
│       • Warranty information                                    │
│                                                                  │
│  Quotation Validity: 30 days                                    │
│  Early-bird discount: 5% if signed within 7 days                │
│                                                                  │
│  Auto Actions:                                                  │
│    • Generate quotation PDF                                     │
│    • Calculate pricing based on scope                           │
│    • Send via email with cover letter                           │
│    • Create follow-up task (3 days)                             │
│    • Track document opens                                       │
│  SLA: Quotation delivered within 5 business days                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6: QUOTATION SENT                                        │
│  ──────────────────────                                         │
│  Follow-up Cadence:                                             │
│    • Day 3: Email check-in                                      │
│    • Day 7: Phone call to discuss questions                     │
│    • Day 14: Second phone call + special offer                  │
│    • Day 21: Final follow-up + urgency                          │
│    • Day 30: Archive or nurture                                 │
│                                                                  │
│  Common Objections & Responses:                                 │
│    "Too expensive":                                             │
│      → Show value breakdown                                     │
│      → Offer phased approach                                    │
│      → Provide financing options                                │
│                                                                  │
│    "Need time to think":                                        │
│      → Address unstated concerns                                │
│      → Share client success stories                             │
│      → Offer decision-making guide                              │
│                                                                  │
│    "Got lower quotes":                                          │
│      → Explain quality differences                              │
│      → Highlight included services                              │
│      → Share portfolio comparisons                              │
│                                                                  │
│  Decision: Accept, Negotiate, or Decline                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
         ┌───────────┐  ┌──────────┐  ┌─────────┐
         │ NEGOTIATION│  │ ACCEPTED │  │ DECLINED│
         │            │  │          │  │         │
         │ Revise     │  │ Move to  │  │ Archive │
         │ quotation  │  │ Contract │  │ or      │
         │            │  │          │  │ Nurture │
         └───────────┘  └──────────┘  └─────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 7: CONTRACT & PAYMENT                                    │
│  ──────────────────────────                                     │
│  Contract Documents:                                            │
│    • Design services agreement                                  │
│    • Scope of work (SOW)                                        │
│    • Payment schedule                                           │
│    • Timeline/milestones                                        │
│    • Terms & conditions                                         │
│                                                                  │
│  Payment Structure (Standard):                                  │
│    • Deposit (30%):        Due at signing                       │
│    • Progress (30%):       At design completion                 │
│    • Mid-point (30%):      At 50% construction                  │
│    • Final (10%):          At project completion                │
│                                                                  │
│  Payment Methods:                                               │
│    • Bank transfer (preferred)                                  │
│    • Credit card (+3% processing fee)                           │
│    • Check                                                      │
│    • Financing partners available                               │
│                                                                  │
│  Auto Actions:                                                  │
│    • Send contract via DocuSign                                 │
│    • Send invoice for deposit                                   │
│    • Create project in system                                   │
│    • Convert lead to client                                     │
│    • Assign project team                                        │
│    • Schedule kickoff meeting                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 8: PROJECT KICKOFF                                       │
│  ───────────────────────                                        │
│  Client Status: ACTIVE CLIENT                                   │
│  Project Status: IN PROGRESS                                    │
│                                                                  │
│  Kickoff Meeting Agenda:                                        │
│    • Introduce project team                                     │
│    • Review timeline & milestones                               │
│    • Communication protocols                                    │
│    • Next steps & responsibilities                              │
│    • Q&A                                                        │
│                                                                  │
│  Project Phases:                                                │
│    Phase 1: Discovery & Planning (2-3 weeks)                    │
│    Phase 2: Design Development (4-6 weeks)                      │
│    Phase 3: Documentation (2-3 weeks)                           │
│    Phase 4: Procurement (4-8 weeks)                             │
│    Phase 5: Installation (4-12 weeks)                           │
│    Phase 6: Final touches & handover (1-2 weeks)                │
│                                                                  │
│  Communication Cadence:                                         │
│    • Weekly status emails                                       │
│    • Bi-weekly check-in calls                                   │
│    • Site visits as scheduled                                   │
│    • 24/7 project portal access                                 │
│                                                                  │
│  Next: Transition to project management system                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. CRM Stage Definitions

### Pipeline Stages

| Stage | Definition | Duration | Conversion Rate | Actions | Exit Criteria |
|-------|------------|----------|-----------------|---------|---------------|
| **1. New Lead** | Initial inquiry received | 0-1 day | 100% → 75% | • Auto-respond<br>• Score lead<br>• Assign designer | Responded + qualified |
| **2. Contacted** | First contact made | 1-3 days | 75% → 60% | • Discovery call<br>• Needs assessment<br>• Qualify budget/timeline | Scheduled consultation |
| **3. Qualified** | Meets criteria, ready to consult | 3-7 days | 60% → 50% | • Send pre-consultation docs<br>• Confirm appointment | Consultation completed |
| **4. Consultation Complete** | Met, assessed project | 7-12 days | 50% → 40% | • Prepare quotation<br>• Gather pricing data | Quotation sent |
| **5. Quotation Sent** | Proposal delivered | 12-20 days | 40% → 25% | • Follow up 3x<br>• Answer questions<br>• Address objections | Accepted or declined |
| **6. Negotiation** | Discussing terms/price | 20-30 days | 25% → 20% | • Revise quotation<br>• Offer alternatives<br>• Find compromise | Agreement reached |
| **7. Closed Won** | Contract signed | 30+ days | 20% | • Send contract<br>• Collect deposit<br>• Schedule kickoff | Payment received |
| **8. Closed Lost** | Not moving forward | Any | - | • Document reason<br>• Add to nurture<br>• Request referral | Archived |

### Lead Status Types

**Active Statuses:**
- `NEW` - Just received, needs immediate response
- `CONTACTED` - Reached out, awaiting reply
- `QUALIFIED` - Met criteria, moving forward
- `CONSULTATION_SCHEDULED` - Appointment booked
- `PROPOSAL_SENT` - Quotation delivered
- `NEGOTIATING` - Discussing terms
- `CONTRACT_SENT` - Awaiting signature

**Inactive Statuses:**
- `WON` - Contract signed, became client
- `LOST` - Declined proposal
- `NURTURE` - Not ready now, follow up later
- `DISQUALIFIED` - Doesn't meet criteria
- `UNRESPONSIVE` - No reply after 3+ attempts

---

## 3. Lead Qualification Scoring System

### Scoring Matrix

```
┌──────────────────────────────────────────────────────────────┐
│  LEAD SCORING CALCULATOR                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Budget Range (40 points max)                               │
│  ─────────────────────────                                  │
│  [ ] $250,000+              → 40 points (Premium)           │
│  [ ] $100,000 - $250,000    → 30 points (High-value)        │
│  [ ] $50,000 - $100,000     → 20 points (Mid-tier)          │
│  [ ] $25,000 - $50,000      → 10 points (Entry-level)       │
│  [ ] Under $25,000          → 0 points  (Low-priority)      │
│  [ ] Not disclosed          → 5 points  (Unknown)           │
│                                                              │
│  Timeline (20 points max)                                   │
│  ─────────────────────                                      │
│  [ ] Immediate (0-1 month)  → 20 points (Hot)               │
│  [ ] 1-3 months             → 15 points (Warm)              │
│  [ ] 3-6 months             → 10 points (Planning)          │
│  [ ] 6-12 months            → 5 points  (Future)            │
│  [ ] 12+ months/Uncertain   → 0 points  (Exploring)         │
│                                                              │
│  Project Scope (15 points max)                              │
│  ──────────────────────────                                 │
│  [ ] Commercial project     → 15 points (High margin)       │
│  [ ] Full home (5+ rooms)   → 12 points (Large)             │
│  [ ] Renovation (3-5 rooms) → 10 points (Medium)            │
│  [ ] Single room            → 5 points  (Small)             │
│  [ ] Consultation only      → 3 points  (Low commitment)    │
│                                                              │
│  Lead Source (15 points max)                                │
│  ───────────────────────────                                │
│  [ ] Personal referral      → 15 points (Highest trust)     │
│  [ ] Past client            → 15 points (Proven)            │
│  [ ] Professional referral  → 12 points (Industry)          │
│  [ ] Website organic        → 10 points (Self-educated)     │
│  [ ] Social media           → 7 points  (Brand aware)       │
│  [ ] Paid advertising       → 5 points  (Cold)              │
│  [ ] Walk-in/Event          → 5 points  (Opportunistic)     │
│                                                              │
│  Engagement Level (10 points max)                           │
│  ────────────────────────────                               │
│  [ ] Responded within 1 hour     → +5 points                │
│  [ ] Provided detailed info      → +3 points                │
│  [ ] Viewed portfolio pages      → +2 points                │
│  [ ] Downloaded materials        → +2 points                │
│  [ ] Multiple touchpoints        → +3 points                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  TOTAL SCORE: _____ / 100                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LEAD GRADE:                                                 │
│  ────────────                                                │
│  🔥 A-Grade (80-100): HOT LEAD - Priority 1                  │
│     → Immediate response (15 min)                            │
│     → Senior designer assigned                               │
│     → Personalized follow-up                                 │
│     → Schedule consultation within 48 hours                  │
│                                                              │
│  🌟 B-Grade (60-79): WARM LEAD - Priority 2                  │
│     → Response within 1 hour                                 │
│     → Mid-level designer assigned                            │
│     → Standard follow-up                                     │
│     → Schedule consultation within 5 days                    │
│                                                              │
│  ⚡ C-Grade (40-59): COLD LEAD - Priority 3                  │
│     → Response within 4 hours                                │
│     → Junior designer assigned                               │
│     → Educational follow-up                                  │
│     → Offer virtual consultation                             │
│                                                              │
│  ❄️  D-Grade (0-39): NURTURE LEAD - Priority 4              │
│     → Automated response                                     │
│     → Add to nurture campaign                                │
│     → Monthly check-ins                                      │
│     → Re-qualify in 90 days                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Auto-Scoring Rules

**Implemented in code:**
```typescript
function calculateLeadScore(lead: Lead): LeadScore {
  let score = 0
  let grade: 'A' | 'B' | 'C' | 'D'
  
  // Budget scoring (40 points)
  const budget = parseBudget(lead.budget)
  if (budget >= 250000) score += 40
  else if (budget >= 100000) score += 30
  else if (budget >= 50000) score += 20
  else if (budget >= 25000) score += 10
  else if (budget > 0) score += 5
  
  // Timeline scoring (20 points)
  const timeline = lead.timeline
  if (timeline === 'immediate') score += 20
  else if (timeline === '1-3 months') score += 15
  else if (timeline === '3-6 months') score += 10
  else if (timeline === '6-12 months') score += 5
  
  // Scope scoring (15 points)
  if (lead.projectType === 'COMMERCIAL') score += 15
  else if (lead.scope === 'full-home') score += 12
  else if (lead.scope === 'renovation') score += 10
  else if (lead.scope === 'single-room') score += 5
  else if (lead.scope === 'consultation') score += 3
  
  // Source scoring (15 points)
  if (lead.source === 'REFERRAL') score += 15
  else if (lead.source === 'PAST_CLIENT') score += 15
  else if (lead.source === 'PROFESSIONAL') score += 12
  else if (lead.source === 'WEBSITE') score += 10
  else if (lead.source === 'SOCIAL_MEDIA') score += 7
  else if (lead.source === 'ADVERTISEMENT') score += 5
  
  // Engagement scoring (10 points)
  if (lead.responseTime < 3600) score += 5 // <1 hour
  if (lead.detailsProvided) score += 3
  if (lead.portfolioViews > 0) score += 2
  if (lead.downloadsCount > 0) score += 2
  if (lead.touchpoints > 2) score += 3
  
  // Assign grade
  if (score >= 80) grade = 'A'
  else if (score >= 60) grade = 'B'
  else if (score >= 40) grade = 'C'
  else grade = 'D'
  
  return { score, grade }
}
```

---

## 4. Automation Rules

### Rule 1: Auto-Response & Assignment
**Trigger:** New lead created
**Conditions:** Lead source = Website
**Actions:**
1. Send welcome email immediately
2. Calculate lead score
3. Assign to designer based on:
   - A/B grade → Senior designer (round-robin)
   - C grade → Mid-level designer (round-robin)
   - D grade → Marketing team (nurture)
4. Create follow-up task (1 hour for A/B, 4 hours for C)
5. Add to appropriate workflow

### Rule 2: Lead Scoring & Routing
**Trigger:** Lead score calculated
**Conditions:** Score changed
**Actions:**
1. Update lead grade
2. Re-assign if priority changed (C→B or B→A)
3. Adjust follow-up urgency
4. Send grade-appropriate email template
5. Update dashboard metrics

### Rule 3: Stale Lead Alert
**Trigger:** Time-based (daily check)
**Conditions:** 
- Status = NEW or CONTACTED
- Last activity > 24 hours
**Actions:**
1. Alert assigned designer
2. Create escalation task
3. Send automated follow-up email
4. Escalate to manager if >48 hours

### Rule 4: Consultation Reminder
**Trigger:** Consultation scheduled
**Conditions:** Consultation date approaching
**Actions:**
- 48 hours before: Send reminder + questionnaire
- 24 hours before: Send final reminder + Zoom link
- 2 hours before: SMS reminder
- After consultation: Auto-create quotation task

### Rule 5: Quotation Follow-up Sequence
**Trigger:** Quotation sent
**Conditions:** Status = PROPOSAL_SENT
**Actions:**
- Day 2: Send "Did you receive?" email
- Day 5: Schedule follow-up call task
- Day 10: Send case study email
- Day 15: Send urgency email (early-bird expiring)
- Day 21: Final follow-up call task
- Day 30: Move to Lost or Nurture

### Rule 6: Lost Lead Nurture
**Trigger:** Status changed to LOST
**Conditions:** Lost reason != "budget too low"
**Actions:**
1. Add to 90-day nurture campaign
2. Send monthly newsletter
3. Re-qualify after 90 days
4. Request referral

### Rule 7: Hot Lead Escalation
**Trigger:** Lead score >= 80
**Conditions:** Grade = A
**Actions:**
1. Immediate SMS to senior designer
2. Assign to top performer
3. Escalate to design director
4. Priority scheduling for consultation
5. Send premium welcome package

### Rule 8: Payment Received
**Trigger:** Invoice marked paid
**Conditions:** Invoice type = Deposit
**Actions:**
1. Convert lead to client
2. Create project record
3. Send welcome packet
4. Schedule kickoff meeting
5. Assign project team
6. Update revenue metrics

### Rule 9: Inactive Lead Cleanup
**Trigger:** Time-based (weekly)
**Conditions:** 
- Last activity > 90 days
- Status = NEW, CONTACTED, or QUALIFIED
**Actions:**
1. Send re-engagement email
2. If no response in 14 days → Archive
3. Add to long-term nurture
4. Remove from active pipeline

### Rule 10: Referral Reward
**Trigger:** New lead source = REFERRAL
**Conditions:** Referrer is past client
**Actions:**
1. Send thank you email to referrer
2. Add $500 credit to their account
3. Send gift card
4. Update referrer's profile (referral count)
5. Tag lead as "VIP referral"

---

## 5. Sales Pipeline Optimization

### Pipeline Stages (Revised)

```
┌─────────────────────────────────────────────────────────────┐
│                    SALES PIPELINE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Stage 1: NEW LEAD (100%)                                   │
│  ├─ Expected value: Unknown                                 │
│  ├─ Avg. duration: 1 day                                    │
│  ├─ Key actions: Score, respond, assign                     │
│  └─ Exit: Qualified or disqualified                         │
│     └─ 75% move forward                                     │
│                                                             │
│  Stage 2: CONTACTED (75%)                                   │
│  ├─ Expected value: Budget * 0.75 * 0.60                    │
│  ├─ Avg. duration: 2-3 days                                 │
│  ├─ Key actions: Discovery, qualify, schedule               │
│  └─ Exit: Consultation scheduled                            │
│     └─ 80% move forward (60% of original)                   │
│                                                             │
│  Stage 3: QUALIFIED (60%)                                   │
│  ├─ Expected value: Budget * 0.75 * 0.50                    │
│  ├─ Avg. duration: 3-5 days                                 │
│  ├─ Key actions: Prep consultation, research                │
│  └─ Exit: Consultation completed                            │
│     └─ 83% move forward (50% of original)                   │
│                                                             │
│  Stage 4: CONSULTATION COMPLETE (50%)                       │
│  ├─ Expected value: Budget * 0.75 * 0.40                    │
│  ├─ Avg. duration: 5-7 days                                 │
│  ├─ Key actions: Prepare quotation                          │
│  └─ Exit: Quotation sent                                    │
│     └─ 80% move forward (40% of original)                   │
│                                                             │
│  Stage 5: QUOTATION SENT (40%)                              │
│  ├─ Expected value: Quoted amount * 0.625                   │
│  ├─ Avg. duration: 7-14 days                                │
│  ├─ Key actions: Follow up, answer questions                │
│  └─ Exit: Accepted, negotiating, or declined                │
│     └─ 62.5% move forward (25% of original)                 │
│                                                             │
│  Stage 6: NEGOTIATION (25%)                                 │
│  ├─ Expected value: Revised amount * 0.80                   │
│  ├─ Avg. duration: 5-10 days                                │
│  ├─ Key actions: Revise terms, compromise                   │
│  └─ Exit: Agreement or declined                             │
│     └─ 80% move forward (20% of original)                   │
│                                                             │
│  Stage 7: CLOSED WON (20%)                                  │
│  ├─ Value: Final contract amount                            │
│  ├─ Duration: Completed                                     │
│  ├─ Actions: Convert to project                             │
│  └─ Success! Client acquired.                               │
│                                                             │
│  Stage 8: CLOSED LOST (Variable)                            │
│  ├─ Value: $0                                               │
│  ├─ Actions: Document reason, add to nurture                │
│  └─ Common reasons:                                         │
│     • Budget (45%)                                          │
│     • Timeline (20%)                                        │
│     • Went with competitor (25%)                            │
│     • Other (10%)                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Velocity Metrics

**Current State:**
- Average sales cycle: 45 days (lead to closed)
- Win rate: 20% (1 in 5 leads)
- Average deal size: $75,000
- Monthly pipeline value: $500,000
- Monthly closed revenue: $100,000

**Target State (after optimization):**
- Average sales cycle: 30 days (-33%)
- Win rate: 30% (1 in 3.3 leads)
- Average deal size: $85,000 (+13%)
- Monthly pipeline value: $750,000
- Monthly closed revenue: $225,000 (+125%)

### Pipeline Health KPIs

**Weekly Monitoring:**
1. **New leads added:** Target 20-30/week
2. **Conversion rate by stage:** Track movement %
3. **Average time in stage:** Identify bottlenecks
4. **Win rate:** Overall and by designer
5. **Average deal size:** Track trends

**Monthly Review:**
1. **Pipeline coverage ratio:** 3:1 minimum (pipeline value : quota)
2. **Lead quality score:** Average score trending up
3. **Sales velocity:** Days to close trending down
4. **Revenue per lead:** $ per qualified lead
5. **Designer performance:** Individual metrics

---

## 6. Quotation Generation Logic

### Dynamic Pricing Engine

```typescript
interface QuotationParams {
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'HOSPITALITY'
  scope: string[] // room names
  sqft: number
  qualityLevel: 'BASIC' | 'MID' | 'LUXURY'
  services: string[] // design, procurement, management
  timeline: number // weeks
  location: string // zip code
}

function generateQuotation(params: QuotationParams): Quotation {
  // Base pricing per sq ft by quality level
  const basePricing = {
    RESIDENTIAL: {
      BASIC: { design: 15, implementation: 125 },
      MID: { design: 25, implementation: 200 },
      LUXURY: { design: 40, implementation: 350 }
    },
    COMMERCIAL: {
      BASIC: { design: 12, implementation: 100 },
      MID: { design: 20, implementation: 175 },
      LUXURY: { design: 35, implementation: 300 }
    }
  }
  
  // Get base rates
  const rates = basePricing[params.projectType][params.qualityLevel]
  
  // Calculate design fees
  let designFee = params.sqft * rates.design
  
  // Service multipliers
  if (params.services.includes('3d-rendering')) designFee *= 1.15
  if (params.services.includes('custom-furniture')) designFee *= 1.20
  if (params.services.includes('art-curation')) designFee *= 1.10
  
  // Calculate implementation costs
  let implementationCost = params.sqft * rates.implementation
  
  // Room-specific adjustments
  params.scope.forEach(room => {
    if (room === 'kitchen') implementationCost *= 1.25 // Higher cost
    if (room === 'bathroom') implementationCost *= 1.20
    if (room === 'bedroom') implementationCost *= 0.90 // Lower cost
  })
  
  // Timeline urgency premium
  if (params.timeline < 12) implementationCost *= 1.15 // Rush fee
  
  // Location cost index
  const locationMultiplier = getLocationMultiplier(params.location)
  implementationCost *= locationMultiplier
  
  // Calculate totals
  const subtotal = designFee + implementationCost
  const contingency = subtotal * 0.10 // 10% contingency
  const total = subtotal + contingency
  
  return {
    designFee: Math.round(designFee),
    implementationCost: Math.round(implementationCost),
    contingency: Math.round(contingency),
    subtotal: Math.round(subtotal),
    total: Math.round(total),
    breakdown: generateLineItems(params, designFee, implementationCost)
  }
}
```

### Room-Based Pricing Templates

**Living Room (400 sq ft):**
```
Basic Package ($15,000 - $25,000):
  • Consultation & concept: $2,000
  • Furniture selection: $1,500
  • Color & materials: $1,000
  • Furniture & decor: $8,000 - $15,000
  • Installation: $1,500 - $3,000
  • Project management: $1,000 - $2,500
  
Mid-Tier Package ($25,000 - $50,000):
  • Full design service: $5,000
  • 3D renderings: $2,000
  • Custom pieces: $3,000
  • Furniture & decor: $15,000 - $30,000
  • Installation: $3,000 - $5,000
  • Project management: $2,000 - $5,000
  
Luxury Package ($50,000 - $100,000+):
  • Complete design: $8,000
  • Custom everything: $10,000
  • High-end furnishings: $30,000 - $70,000
  • Art curation: $5,000
  • Installation & styling: $5,000 - $10,000
  • White-glove management: $5,000+
```

---

*Continued in next section...*
