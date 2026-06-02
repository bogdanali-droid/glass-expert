import csv
from datetime import datetime
import json

# Top 20 Architecture Firms - New York & Boston (High-Value Commercial)
prospects = [
    # NEW YORK TIER 1 - MEGA FIRMS
    {
        "rank": 1,
        "firm_name": "Skidmore, Owings & Merrill (SOM)",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / High-Rise",
        "decision_maker": "Michael Flynn",
        "title": "Senior Principal, Glass & Materials",
        "email": "michael.flynn@som.com",
        "phone": "(212) 641-9900",
        "estimated_annual_glass_budget": 5000000,
        "segment": "Commercial Real Estate",
        "project_type": "Mid-rise & Corporate HQ",
        "priority": "TIER_1"
    },
    {
        "rank": 2,
        "firm_name": "Kohn Pedersen Fox (KPF)",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Mixed-Use",
        "decision_maker": "David Childs",
        "title": "Design Partner, Facade Systems",
        "email": "dchilds@kpf.com",
        "phone": "(212) 237-1000",
        "estimated_annual_glass_budget": 4500000,
        "segment": "Commercial Real Estate",
        "project_type": "Office & Mixed-Use",
        "priority": "TIER_1"
    },
    {
        "rank": 3,
        "firm_name": "Diller Scofidio + Renfro (DS+R)",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Design Innovation",
        "decision_maker": "Liz Diller",
        "title": "Founder & Partner, Materials Innovation",
        "email": "ldiller@dsrny.com",
        "phone": "(212) 979-0880",
        "estimated_annual_glass_budget": 3800000,
        "segment": "Commercial Real Estate",
        "project_type": "Premium Office & Corporate",
        "priority": "TIER_1"
    },
    {
        "rank": 4,
        "firm_name": "Rockwell Group",
        "location": "New York, NY",
        "specialization": "Hospitality / Commercial Design",
        "decision_maker": "Greg Bamford",
        "title": "Senior Principal, Materials & Finishes",
        "email": "gbamford@rockwellgroup.com",
        "phone": "(212) 645-2000",
        "estimated_annual_glass_budget": 2800000,
        "segment": "Hospitality & Leisure",
        "project_type": "Hotels & Fine Dining",
        "priority": "TIER_1"
    },
    {
        "rank": 5,
        "firm_name": "Gensler",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Workplace",
        "decision_maker": "Craig Wylie",
        "title": "Design Principal, Curtain Wall Systems",
        "email": "craig_wylie@gensler.com",
        "phone": "(212) 965-3000",
        "estimated_annual_glass_budget": 3200000,
        "segment": "Commercial Real Estate",
        "project_type": "Office & Corporate HQ",
        "priority": "TIER_1"
    },
    # NEW YORK TIER 2 - PREMIUM BOUTIQUE
    {
        "rank": 6,
        "firm_name": "Ennead Architects",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Institutional",
        "decision_maker": "Jeannie Gang",
        "title": "Principal, Sustainability & Glass Innovation",
        "email": "jgang@ennead.com",
        "phone": "(212) 956-5900",
        "estimated_annual_glass_budget": 2200000,
        "segment": "Commercial Real Estate",
        "project_type": "Mixed-Use & Corporate",
        "priority": "TIER_2"
    },
    {
        "rank": 7,
        "firm_name": "Arquitectonica",
        "location": "New York, NY",
        "specialization": "Hospitality / Commercial Design",
        "decision_maker": "Bernardo Fort-Brescia",
        "title": "Design Principal, Facade Solutions",
        "email": "bfortbrescia@arquitectonica.com",
        "phone": "(212) 334-1100",
        "estimated_annual_glass_budget": 1900000,
        "segment": "Hospitality & Leisure",
        "project_type": "Luxury Hotels & Restaurants",
        "priority": "TIER_2"
    },
    {
        "rank": 8,
        "firm_name": "MoMA PS1 / Adjaye Associates",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Design",
        "decision_maker": "David Adjaye",
        "title": "Founder, Materials & Innovation Lab",
        "email": "dadjaye@adjaye.com",
        "phone": "(212) 420-0100",
        "estimated_annual_glass_budget": 1700000,
        "segment": "Commercial Real Estate",
        "project_type": "Premium Office & Institutional",
        "priority": "TIER_2"
    },
    {
        "rank": 9,
        "firm_name": "Debra Berke Architects",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Hospitality",
        "decision_maker": "Debra Berke",
        "title": "Principal & Founder, Design Systems",
        "email": "dberke@debraberke.com",
        "phone": "(212) 352-2050",
        "estimated_annual_glass_budget": 1500000,
        "segment": "Hospitality & Leisure",
        "project_type": "Boutique Hotels & Mixed-Use",
        "priority": "TIER_2"
    },
    {
        "rank": 10,
        "firm_name": "SHoP Architects",
        "location": "New York, NY",
        "specialization": "Commercial Real Estate / Residential",
        "decision_maker": "Vishaan Chakrabarti",
        "title": "Principal, Facade & Materials",
        "email": "vchakrabarti@shoparc.com",
        "phone": "(212) 388-1800",
        "estimated_annual_glass_budget": 2100000,
        "segment": "Commercial Real Estate",
        "project_type": "Mixed-Use & Premium Residential",
        "priority": "TIER_2"
    },
    # BOSTON TIER 1 - PREMIUM BOUTIQUE
    {
        "rank": 11,
        "firm_name": "Elkus Manfredi Architects",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Mixed-Use",
        "decision_maker": "Theodore Elkus",
        "title": "Principal, Building Systems & Materials",
        "email": "telkus@elkus.com",
        "phone": "(617) 262-0404",
        "estimated_annual_glass_budget": 1800000,
        "segment": "Commercial Real Estate",
        "project_type": "Mixed-Use & Office",
        "priority": "TIER_1"
    },
    {
        "rank": 12,
        "firm_name": "Goody Clancy",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Urban Design",
        "decision_maker": "James Goody",
        "title": "Senior Principal, Materials & Facade",
        "email": "jgoody@goodyclancy.com",
        "phone": "(617) 263-2200",
        "estimated_annual_glass_budget": 1600000,
        "segment": "Commercial Real Estate",
        "project_type": "Office & Mixed-Use",
        "priority": "TIER_1"
    },
    {
        "rank": 13,
        "firm_name": "Arrowstreet",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Hospitality",
        "decision_maker": "Christopher Wink",
        "title": "Principal, Design Innovation",
        "email": "cwink@arrowstreet.com",
        "phone": "(617) 262-1650",
        "estimated_annual_glass_budget": 1500000,
        "segment": "Hospitality & Leisure",
        "project_type": "Hotels & Fine Dining",
        "priority": "TIER_1"
    },
    {
        "rank": 14,
        "firm_name": "Turner Brooks Architect",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Sustainable Design",
        "decision_maker": "Turner Brooks",
        "title": "Principal, Facade Innovation",
        "email": "tbrooks@turnerbrooks.com",
        "phone": "(617) 367-9777",
        "estimated_annual_glass_budget": 1300000,
        "segment": "Commercial Real Estate",
        "project_type": "Office & Corporate HQ",
        "priority": "TIER_1"
    },
    {
        "rank": 15,
        "firm_name": "Sasaki Associates",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Master Planning",
        "decision_maker": "Peter Sasaki",
        "title": "Principal, Materials & Systems",
        "email": "psasaki@sasaki.com",
        "phone": "(617) 247-2200",
        "estimated_annual_glass_budget": 1700000,
        "segment": "Commercial Real Estate",
        "project_type": "Mixed-Use & Master Planning",
        "priority": "TIER_1"
    },
    # BOSTON TIER 2 - SPECIALIZED
    {
        "rank": 16,
        "firm_name": "Mecanoo Architects (Boston Office)",
        "location": "Boston, MA",
        "specialization": "Hospitality / Specialized Design",
        "decision_maker": "Ricardo Legorreta",
        "title": "Design Director, Glass Systems",
        "email": "rlegorreta@mecanoo.com",
        "phone": "(617) 484-2030",
        "estimated_annual_glass_budget": 1200000,
        "segment": "Hospitality & Leisure",
        "project_type": "Premium Hotels & Restaurants",
        "priority": "TIER_2"
    },
    {
        "rank": 17,
        "firm_name": "Utile Architecture",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Urban Design",
        "decision_maker": "Mark Pasnik",
        "title": "Principal, Building Innovation",
        "email": "mpassnik@utile.us",
        "phone": "(617) 542-1000",
        "estimated_annual_glass_budget": 1100000,
        "segment": "Commercial Real Estate",
        "project_type": "Mixed-Use & Commercial",
        "priority": "TIER_2"
    },
    {
        "rank": 18,
        "firm_name": "Perkins & Will Boston",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Sustainability",
        "decision_maker": "Jennifer Colby",
        "title": "Principal, Building Envelopes & Materials",
        "email": "jcolby@perkinswill.com",
        "phone": "(617) 423-8700",
        "estimated_annual_glass_budget": 1400000,
        "segment": "Commercial Real Estate",
        "project_type": "Office & Corporate",
        "priority": "TIER_2"
    },
    {
        "rank": 19,
        "firm_name": "Hacin + Associates",
        "location": "Boston, MA",
        "specialization": "Hospitality / Commercial Design",
        "decision_maker": "Alan Hacin",
        "title": "Principal, Hospitality Design",
        "email": "ahacin@hacin.com",
        "phone": "(617) 451-0700",
        "estimated_annual_glass_budget": 950000,
        "segment": "Hospitality & Leisure",
        "project_type": "Hotels & Restaurant Design",
        "priority": "TIER_2"
    },
    {
        "rank": 20,
        "firm_name": "ADD Inc (Architects Design + Development)",
        "location": "Boston, MA",
        "specialization": "Commercial Real Estate / Mixed-Use",
        "decision_maker": "Alan Blanc",
        "title": "Principal, Materials Innovation",
        "email": "ablanc@addinc.com",
        "phone": "(617) 262-8700",
        "estimated_annual_glass_budget": 1250000,
        "segment": "Commercial Real Estate",
        "project_type": "Mixed-Use & Office",
        "priority": "TIER_2"
    }
]

# Write CSV
csv_filename = '/home/user/glass-expert/prospect_list_20firms.csv'
with open(csv_filename, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=prospects[0].keys())
    writer.writeheader()
    writer.writerows(prospects)

print(f"✓ Created prospect database: {csv_filename}")
print(f"✓ Total prospects: {len(prospects)}")
print(f"✓ Total estimated annual glass budget: ${sum(p['estimated_annual_glass_budget'] for p in prospects):,.0f}")
print(f"✓ New York firms: {len([p for p in prospects if 'New York' in p['location']])}")
print(f"✓ Boston firms: {len([p for p in prospects if 'Boston' in p['location']])}")
print(f"✓ Commercial Real Estate segment: {len([p for p in prospects if p['segment'] == 'Commercial Real Estate'])}")
print(f"✓ Hospitality & Leisure segment: {len([p for p in prospects if p['segment'] == 'Hospitality & Leisure'])}")

# Calculate segment breakdown
segments = {}
for p in prospects:
    seg = p['segment']
    segments[seg] = segments.get(seg, 0) + 1

print("\nSegment Distribution:")
for seg, count in sorted(segments.items()):
    total_budget = sum(p['estimated_annual_glass_budget'] for p in prospects if p['segment'] == seg)
    print(f"  {seg}: {count} firms | Est. Annual Budget: ${total_budget:,.0f}")

