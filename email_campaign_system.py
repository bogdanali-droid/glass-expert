import json
from datetime import datetime, timedelta
import csv

# Email Templates by Segment
email_templates = {
    "Commercial Real Estate": {
        "subject_template": "Custom Glass Solutions for {project_type} Projects",
        "body_template": """Dear {decision_maker},

I'm reaching out because {firm_name} is recognized as a leader in designing premium {project_type} projects—exactly where Glas Expert delivers differentiation.

We specialize in custom architectural glass solutions that give your projects a competitive edge:

• Curved Glass Facades - Manufacturing capability rare in North America (4-6 week turnaround)
• Ceramic-Printed Glass - Branded patterns, privacy solutions, premium aesthetics
• EN & ASTM Certified - European-grade quality, full compliance with USA standards
• Competitive Margins - 40-50% margin potential vs. standard suppliers

Recent Success: We've delivered curved glass façades for €150k-300k office projects, with premium pricing justified by lead-time advantage and design innovation.

I'd like to explore how Glas Expert could support {firm_name}'s next generation of office/mixed-use projects. Would you be open to a 15-minute conversation about your glass sourcing strategy?

Available this week for a quick call.

Best regards,
Bogdan Gheorghita
Business Development | Glas Expert USA
+1 (646) 123-4567
bogdan@glasexpert.com

P.S. — We're also approved vendors for major GC networks and bid board systems (Dodge, BuildFax). Happy to discuss partnership opportunities."""
    },
    "Hospitality & Leisure": {
        "subject_template": "Premium Glass Solutions for {project_type} | Luxury Finishes",
        "body_template": """Dear {decision_maker},

I noticed {firm_name} has delivered some exceptional {project_type} projects recently—the level of design sophistication is impressive.

That's why I'm reaching out: Glas Expert specializes in premium glass solutions for hospitality design:

• Custom Interior Glass - Frosted, ceramic-printed, colored glass for brand identity
• Luxury Finishes - Curved glass, specialized coatings, safety-rated tempered/laminated
• Sustainability Advantage - EU green certifications = marketing edge for high-end properties
• Margin Opportunity - 45-55% margins on premium hospitality glass

We've worked on luxury hotel renovations (€80k-150k glass scope) and fine dining spaces (€40k-80k)—delivering design goals while protecting margins.

Quick question: How are you currently sourcing specialty glass for your premium hospitality projects? I'd love to show you how Glas Expert could be a valuable partner.

15-minute call this week?

Best regards,
Bogdan Gheorghita
Business Development | Glas Expert USA
+1 (646) 123-4567
bogdan@glasexpert.com

P.S. — We also handle rapid prototyping for custom finishes and colors. Perfect for design-forward projects."""
    }
}

# Email Tracking System
class EmailTracker:
    def __init__(self):
        self.drafts = []
        self.sent_history = []
        self.metadata = {
            "campaign_start": datetime.now().isoformat(),
            "total_prospects": 20,
            "batch_size": 5,
            "segment_targets": {
                "Commercial Real Estate": 14,
                "Hospitality & Leisure": 6
            }
        }
    
    def create_draft(self, prospect, template, body):
        draft = {
            "draft_id": len(self.drafts) + 1,
            "timestamp": datetime.now().isoformat(),
            "recipient": prospect['decision_maker'],
            "recipient_email": prospect['email'],
            "firm": prospect['firm_name'],
            "segment": prospect['segment'],
            "decision_maker_title": prospect['title'],
            "template_used": template,
            "subject": email_templates[template]['subject_template'].format(
                project_type=prospect['project_type'],
                firm_name=prospect['firm_name']
            ),
            "body": body,
            "status": "DRAFT",
            "estimated_value": prospect['estimated_annual_glass_budget'] * 0.05,  # 5% of annual budget
            "priority": prospect['priority']
        }
        self.drafts.append(draft)
        return draft
    
    def log_draft(self, draft):
        print("\n" + "="*80)
        print(f"EMAIL DRAFT #{draft['draft_id']} | STATUS: {draft['status']}")
        print("="*80)
        print(f"TO: {draft['recipient']} ({draft['recipient_email']})")
        print(f"FIRM: {draft['firm']} | SEGMENT: {draft['segment']}")
        print(f"DECISION MAKER: {draft['decision_maker_title']}")
        print(f"PRIORITY: {draft['priority']} | EST. PROJECT VALUE: ${draft['estimated_value']:,.0f}")
        print("-"*80)
        print(f"SUBJECT: {draft['subject']}")
        print("-"*80)
        print(f"BODY:\n{draft['body']}")
        print("="*80 + "\n")

# Load prospects
prospects = []
with open('/home/user/glass-expert/prospect_list_20firms.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        row['estimated_annual_glass_budget'] = int(row['estimated_annual_glass_budget'])
        prospects.append(row)

# Initialize tracker
tracker = EmailTracker()

# Create first 5 emails (3 CRE + 2 Hospitality)
first_batch = prospects[:5]

print("GLAS EXPERT - COLD EMAIL CAMPAIGN")
print("="*80)
print(f"Campaign Start: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Total Prospect Database: 20 architecture firms (NY + Boston)")
print(f"First Batch: 5 cold email drafts")
print(f"Total Estimated Pipeline Value: ${sum(p['estimated_annual_glass_budget'] * 0.05 for p in first_batch):,.0f}")
print("="*80 + "\n")

for i, prospect in enumerate(first_batch, 1):
    segment = prospect['segment']
    template = segment
    
    # Personalize email body
    body = email_templates[template]['body_template'].format(
        decision_maker=prospect['decision_maker'],
        firm_name=prospect['firm_name'],
        project_type=prospect['project_type']
    )
    
    # Create and log draft
    draft = tracker.create_draft(prospect, template, body)
    tracker.log_draft(draft)

# Save tracking metadata
tracking_file = '/home/user/glass-expert/email_campaign_tracking.json'
with open(tracking_file, 'w') as f:
    json.dump({
        "campaign_metadata": tracker.metadata,
        "first_batch_drafts": tracker.drafts
    }, f, indent=2)

print("\n" + "="*80)
print("FIRST BATCH SUMMARY")
print("="*80)
print(f"✓ Email drafts created: {len(tracker.drafts)}")
print(f"✓ Personas targeted:")
for draft in tracker.drafts:
    print(f"   - {draft['recipient']} ({draft['segment']}) @ {draft['firm']}")

print(f"\n✓ Key Decision Makers Contacted:")
for draft in tracker.drafts:
    print(f"   - {draft['decision_maker_title']}")

print(f"\n✓ Total Outreach Value (Est. 5% of annual budget): ${sum(d['estimated_value'] for d in tracker.drafts):,.0f}")
print(f"\n✓ Campaign tracking saved: {tracking_file}")
print("="*80 + "\n")

# Summary Statistics
print("SEGMENT BREAKDOWN (First Batch):")
segment_count = {}
for draft in tracker.drafts:
    seg = draft['segment']
    segment_count[seg] = segment_count.get(seg, 0) + 1

for seg, count in segment_count.items():
    total_value = sum(d['estimated_value'] for d in tracker.drafts if d['segment'] == seg)
    print(f"  {seg}: {count} emails | Est. Value: ${total_value:,.0f}")

print("\n✓ Ready for send (manual review recommended for personalization)")
print("✓ Response tracking structure created in JSON format")

