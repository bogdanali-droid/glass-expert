import json
from datetime import datetime, timedelta

# Response Tracking System
tracking_template = {
    "campaign_name": "Glas Expert - USA Market Entry Q2 2026",
    "campaign_start_date": datetime.now().isoformat(),
    "expected_response_window": {
        "day_1_to_3": "Initial opens/engagement",
        "day_4_to_7": "First responses expected",
        "day_8_to_14": "Meeting scheduling phase",
        "day_15_30": "Follow-up sequence"
    },
    "outreach_phases": {
        "phase_1": {
            "name": "First Batch",
            "count": 5,
            "firms": [
                "Skidmore, Owings & Merrill (SOM)",
                "Kohn Pedersen Fox (KPF)",
                "Diller Scofidio + Renfro (DS+R)",
                "Rockwell Group",
                "Gensler"
            ],
            "status": "PENDING_SEND",
            "send_date_planned": (datetime.now() + timedelta(days=1)).isoformat(),
            "segment_breakdown": {
                "Commercial Real Estate": 4,
                "Hospitality & Leisure": 1
            }
        },
        "phase_2": {
            "name": "Second Batch (Days 3-5)",
            "count": 5,
            "planned_send_date": (datetime.now() + timedelta(days=3)).isoformat(),
            "status": "PLANNED"
        },
        "phase_3": {
            "name": "Third Batch (Days 8-10)",
            "count": 5,
            "planned_send_date": (datetime.now() + timedelta(days=8)).isoformat(),
            "status": "PLANNED"
        },
        "phase_4": {
            "name": "Fourth Batch (Days 15-17)",
            "count": 5,
            "planned_send_date": (datetime.now() + timedelta(days=15)).isoformat(),
            "status": "PLANNED"
        }
    },
    "metrics_to_track": {
        "open_rate_target": "45-50%",
        "response_rate_target": "15-20%",
        "meeting_rate_target": "8-10%",
        "qualified_lead_target": "2-3 from first 20"
    },
    "response_log_template": {
        "email_id": "AUTO_INCREMENT",
        "recipient": "Decision Maker Name",
        "firm": "Firm Name",
        "segment": "Commercial Real Estate / Hospitality & Leisure",
        "send_date": "YYYY-MM-DD HH:MM:SS",
        "email_opened": "TRACKING_ENABLED",
        "first_response_date": "YYYY-MM-DD HH:MM:SS",
        "response_type": "INTEREST / DECLINED / NO_RESPONSE / MEETING_SCHEDULED",
        "response_notes": "Detailed notes on response",
        "action_items": "Follow-up actions",
        "qualification_status": "WARM_LEAD / HOT_LEAD / DEAD_LEAD / NURTURE",
        "estimated_project_value": "$XXX,XXX"
    },
    "follow_up_sequence": {
        "day_0": "Send initial cold email",
        "day_3": "Check opens, send second batch if no response",
        "day_5": "LinkedIn message follow-up (warm if no response)",
        "day_10": "Phone call attempt (if email & LinkedIn ignored)",
        "day_15": "Final email (case study / value proposition refresh)",
        "day_21": "Decision: Nurture or archive"
    },
    "success_criteria": {
        "phase_1_goal": "1-2 qualified meetings from 5 emails",
        "phase_1_pipeline_value": "$150k - $300k",
        "first_30_days_goal": "5-7 qualified leads total",
        "first_30_days_pipeline_value": "$750k - $1.05M"
    }
}

# Save response tracking template
tracking_file = '/home/user/glass-expert/response_tracking_template.json'
with open(tracking_file, 'w') as f:
    json.dump(tracking_template, f, indent=2)

print("✓ Response tracking system created")
print(f"✓ Template saved to: {tracking_file}")

# Create detailed response log (empty, ready for data entry)
response_log = {
    "campaign_start": datetime.now().isoformat(),
    "total_prospects_phase_1": 5,
    "responses": [],
    "summary": {
        "total_sent": 0,
        "total_opened": 0,
        "total_responded": 0,
        "total_meetings_scheduled": 0,
        "qualified_leads": 0,
        "pipeline_value": 0
    }
}

response_log_file = '/home/user/glass-expert/response_log_phase1.json'
with open(response_log_file, 'w') as f:
    json.dump(response_log, f, indent=2)

print(f"✓ Response log created: {response_log_file}")

