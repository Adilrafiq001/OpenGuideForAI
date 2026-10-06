/**
 * Universal AI Fluency Spectrum & Real-World Application Domains Data
 * OpenGuide: For Everyone — From 0 AI Knowledge to Frontier AI Expert
 * 100% Client-Side • $0 Rule • Plain English Intuition • Human Psychological Ergonomics
 */

export type SpectrumTier = 'tier0' | 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';

export interface SpectrumTierInfo {
  id: SpectrumTier;
  number: string;
  title: string;
  shortTitle: string;
  desc: string;
  color: string;
  tagline: string;
  scenariosCount?: number;
  iconName?: string;
}

export type ApplicationDomain = SpectrumTierInfo;

export interface UniversalProfile {
  id: string;
  tier: SpectrumTier;
  domainId?: string;
  domainTitle?: string;
  title: string;
  badge: string;
  category: string;
  accent: string;
  iconName: string;
  tagline: string;
  realWorldChallenge: string;
  plainEnglishSolution: string;
  promptExample: string;
  simulatedOutput: string;
  actionableTips?: string[];
  interactiveCodeSnippet?: string;
  recommendedTrack: string;
  trackUrl: string;
}

export const SPECTRUM_TIERS: SpectrumTierInfo[] = [
  {
    id: 'tier0',
    number: '0',
    title: 'Everyday Life & Family',
    shortTitle: 'Family & Life',
    desc: 'Household, Budgeting, Health & Daily Living',
    color: '#8b5cf6',
    tagline: 'Zero computer skills needed. 100% free. Protect family budgets, verify scams, and learn concepts simply.',
    scenariosCount: 4,
    iconName: 'HeartHandshake'
  },
  {
    id: 'tier1',
    number: '1',
    title: 'Skilled Trades & Crafts',
    shortTitle: 'Trades & Crafts',
    desc: 'Automotive, Repair, Construction & Culinary',
    color: '#ec4899',
    tagline: 'Fair customer quotes, OBD-II diagnostic checklists, material cure times, and yield scaling.',
    scenariosCount: 5,
    iconName: 'Wrench'
  },
  {
    id: 'tier2',
    number: '2',
    title: 'Healthcare, Education & Services',
    shortTitle: 'Services & Care',
    desc: 'Patient Instructions, Teaching Plans & Agriculture',
    color: '#06b6d4',
    tagline: 'Empathetic discharge summaries, 3-tier lesson plans, contract translations, and crop rotations.',
    scenariosCount: 4,
    iconName: 'Stethoscope'
  },
  {
    id: 'tier3',
    number: '3',
    title: 'Small Business & Operations',
    shortTitle: 'Business & Ops',
    desc: 'Retail, Bookkeeping, Customer Feedback & Terms',
    color: '#14b8a6',
    tagline: 'Operating expense variance memos, de-escalating reviews, reorder math, and payment terms.',
    scenariosCount: 3,
    iconName: 'Calculator'
  },
  {
    id: 'tier4',
    number: '4',
    title: 'Physical & Systems Engineering',
    shortTitle: 'Physical Eng',
    desc: 'Mechanical, Structural & Electrical Calculations',
    color: '#3b82f6',
    tagline: 'Thermal tolerances, beam deflection formulas, sensor telemetry, and load safety factors.',
    scenariosCount: 3,
    iconName: 'Cog'
  },
  {
    id: 'tier5',
    number: '5',
    title: 'Software & Frontier AI Systems',
    shortTitle: 'Frontier AI & Code',
    desc: 'Local-First WASM, Strict Schemas & Attention Math',
    color: '#f59e0b',
    tagline: 'Structured JSON schemas, context window budgeting, vector cosine similarity, and WebGPU shaders.',
    scenariosCount: 3,
    iconName: 'BrainCircuit'
  }
];

export const APPLICATION_DOMAINS = SPECTRUM_TIERS;

export const ALL_SPECTRUM_PROFILES: UniversalProfile[] = [
  // ==========================================
  // DOMAIN 0: EVERYDAY LIFE, HOUSEHOLD & FAMILY
  // ==========================================
  {
    id: 'beginner',
    tier: 'tier0',
    domainId: 'tier0',
    domainTitle: 'Everyday Life & Family',
    title: 'Absolute Beginner (Zero Knowledge of AI)',
    badge: 'UNIVERSAL ENTRY',
    category: 'Everyday Life & Family',
    accent: '#8b5cf6',
    iconName: 'Compass',
    tagline: 'Zero coding background required. 100% free forever. You cannot break anything.',
    realWorldChallenge: 'You have never written code, technical buzzwords make you feel excluded, and you want to know what AI actually is without sales hype or subscriptions.',
    plainEnglishSolution: 'AI is a fast, patient helper that has read millions of books and knows how to talk in normal human words. You talk to it like a kind coworker. It can simplify dense letters, organize weekly chores, explain medicine instructions, or help kids with homework.',
    promptExample: 'Explain how home microwave ovens work using only simple kitchen words and zero confusing physics equations. Keep it under 4 sentences.',
    simulatedOutput: 'Inside a microwave is a tiny radio transmitter called a magnetron. Instead of broadcasting music, it sends invisible energy waves that make water molecules inside your food vibrate back and forth very fast. That friction creates heat instantly, just like rubbing your hands together on a cold morning. That is why your soup gets piping hot in two minutes while the bowl stays mostly cooler!',
    actionableTips: [
      'Always tell the AI what format you want (e.g. "under 4 sentences" or "as a bullet list").',
      'Never hesitate to ask it to explain again if the first response used unfamiliar words.'
    ],
    interactiveCodeSnippet: `# Your very first line of in-browser Python!
# Runs 100% client-side for $0 compute
welcome_message = "Hello! Technology should be simple, free, and accessible to everyone."
print(welcome_message)`,
    recommendedTrack: 'Track 0: Absolute Zero (Start Here)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'family-budget',
    tier: 'tier0',
    domainId: 'tier0',
    domainTitle: 'Everyday Life & Family',
    title: 'Everyday Life & Family Helper',
    badge: 'FAMILY FINANCIAL WELLNESS',
    category: 'Everyday Life & Family',
    accent: '#8b5cf6',
    iconName: 'HeartHandshake',
    tagline: 'Organize household bills, eliminate financial anxiety, and protect emergency savings.',
    realWorldChallenge: 'Struggling to know how much cash is safe to spend on groceries this week after rent, utilities, insurance, and unexpected school supplies arrive.',
    plainEnglishSolution: 'AI functions as a private, non-judgmental family financial coach. Feed it your monthly net take-home and bills; it computes a safe weekly spending envelope with an emergency buffer in plain language.',
    promptExample: 'Act as a compassionate family financial coach. My monthly take-home pay is $2,850. Fixed monthly expenses are: Rent $1,250, Electricity $145, Water $45, Mobile $70, Transit $95, Internet $55. Give me a clear weekly grocery/living envelope and suggest a realistic emergency savings cushion.',
    simulatedOutput: 'Here is your realistic monthly and weekly household spending blueprint:\n\n1. Fixed Monthly Overhead: $1,660.00\n2. Unallocated Net Income: $1,190.00 per month\n3. Weekly Allowance (divided across 4.33 weeks): $274.82 per week\n\nRecommended Balanced Envelope:\n• Weekly Groceries & Household Essentials: $175.00 / week\n• Weekly Family Emergency Fund: $60.00 / week ($260 / month to build your rainy-day cushion)\n• Weekly Discretionary & Kids Needs: $39.82 / week\n\nRule of Thumb: If electricity runs higher during peak summer, absorb the difference from discretionary funds, never from the grocery baseline.',
    actionableTips: [
      'Divide monthly remaining cash by 4.33 weeks (not 4) to account for 31-day months.',
      'Always allocate emergency savings first before determining discretionary spending.'
    ],
    interactiveCodeSnippet: `# Weekly Family Budget Calculator
monthly_income = 2850.00
fixed_expenses = 1250.00 + 145.00 + 45.00 + 70.00 + 95.00 + 55.00
unallocated = monthly_income - fixed_expenses
weekly_allowance = unallocated / 4.33

print(f"Total Fixed Expenses: \${fixed_expenses:,.2f}")
print(f"Unallocated Monthly:  \${unallocated:,.2f}")
print(f"Safe Weekly Spending: \${weekly_allowance:,.2f}/week")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Math)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'senior',
    tier: 'tier0',
    domainId: 'tier0',
    domainTitle: 'Everyday Life & Family',
    title: 'Senior & Lifelong Learner',
    badge: 'SECURITY & SENIOR CARE',
    category: 'Everyday Life & Family',
    accent: '#8b5cf6',
    iconName: 'ShieldCheck',
    tagline: 'Spot deceptive text messages, verify unexpected invoices, and navigate tech safely.',
    realWorldChallenge: 'Receiving urgent text messages or emails claiming a parcel is detained, a banking password has expired, or an immediate $5 fee is required.',
    plainEnglishSolution: 'AI serves as a vigilant digital guardian. Paste suspicious messages directly into the AI to analyze psychological manipulation tactics, verify official protocols, and receive immediate safety instructions.',
    promptExample: 'Analyze this SMS text message and tell me if it is legitimate or a scam, explaining the exact red flags: "USPS Notice: Your package delivery has been put on hold due to missing house number. Click https://usps-track-deliver.top/verify within 24 hours to update address or item will be returned to sender."',
    simulatedOutput: 'VERDICT: THIS IS A 100% FRAUDULENT PHISHING SCAM.\n\nImmediate Actions:\n1. DO NOT CLICK the link.\n2. DO NOT enter your credit card or name.\n3. Delete and report the text message.\n\nKey Red Flags Identified:\n• Fake Domain: The official postal service uses ".gov" or "usps.com". The address "usps-track-deliver.top" is a criminal website registered to steal credit card details.\n• Artificial Urgency: Threatening "within 24 hours" is designed to create panic so you act before thinking.\n• Inconsistent Tracking: Real couriers include your exact 22-digit tracking number directly in legitimate alerts.',
    actionableTips: [
      'Postal services and tax authorities will never request credit card fees via SMS links.',
      'When in doubt, open the official app or website directly from your browser—never via text links.'
    ],
    interactiveCodeSnippet: `# Suspicious Link & Keyword Scanner
def check_suspicious_message(text):
    red_flags = ['click here', 'within 24 hours', 'verify now', '.top', '.xyz', 'fee required']
    found = [flag for flag in red_flags if flag in text.lower()]
    return len(found) > 0, found

test_msg = "Delivery hold. Click here: https://track-parcel.top within 24 hours."
is_scam, flags = check_suspicious_message(test_msg)
print("Scam Indicator Detected:", is_scam)
print("Flagged Patterns:", flags)`,
    recommendedTrack: 'Track 0: Absolute Zero (Conditionals & Logic)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'student',
    tier: 'tier0',
    domainId: 'tier0',
    domainTitle: 'Everyday Life & Family',
    title: 'Student & Homework Concept Learner',
    badge: 'INTUITIVE LEARNING',
    category: 'Everyday Life & Family',
    accent: '#8b5cf6',
    iconName: 'BookOpen',
    tagline: 'Grasp challenging science and math concepts using vivid physical analogies.',
    realWorldChallenge: 'Struggling with abstract textbook definitions (like electrical current, gravity, or biological cells) where memorizing terms doesn\'t create genuine understanding.',
    plainEnglishSolution: 'AI uses the Socratic method to build intuitive mental bridges. It explains abstract mechanics through physical objects you touch every day—water pipes, bicycle gears, and kitchen recipes.',
    promptExample: 'Act as an intuitive physics tutor. Explain electrical Voltage (V), Current (I), and Resistance (R) using the analogy of a garden hose with water, including Ohm\'s law in plain language.',
    simulatedOutput: 'Think of an electric circuit as a garden hose connected to an outdoor spigot:\n\n1. Voltage (V) = Water Pressure: How hard the spigot is pushing water through the pipe. More pressure means stronger push.\n2. Current (I) = Flow Rate: How many gallons of water actually pour out of the nozzle every second.\n3. Resistance (R) = The Nozzle Squeeze (or Kink in the Hose): Anything that restricts flow. If you step on the hose, resistance goes way up, and water flow slows down.\n\nOhm\'s Law (V = I × R) simply says: If you want high water flow (Current) through a pinched hose (Resistance), you need massive water pressure (Voltage) behind it!',
    actionableTips: [
      'Ask the AI: "Give me an analogy using [a subject you love, e.g. cooking, skateboarding, plumbing]".',
      'Tell the tutor: "Ask me a question to test if I truly understood."'
    ],
    interactiveCodeSnippet: `# Ohm's Law Calculator: V = I * R
voltage = 120.0       # Volts (wall outlet)
resistance = 15.0     # Ohms (heater element)
current = voltage / resistance

print(f"Voltage:    {voltage} V")
print(f"Resistance: {resistance} Ohms")
print(f"Current:    {current:.2f} Amperes (Safe on 15A breaker: {current <= 15})")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Functions)',
    trackUrl: '/track/0/intro'
  },

  // ==========================================
  // DOMAIN 1: SKILLED TRADES & WORKSHOP CRAFTS
  // ==========================================
  {
    id: 'mechanic',
    tier: 'tier1',
    domainId: 'tier1',
    domainTitle: 'Skilled Trades & Crafts',
    title: 'Automotive Diagnostics & OBD-II Triangulation',
    badge: 'AUTOMOTIVE REPAIR',
    category: 'Skilled Trades & Crafts',
    accent: '#ec4899',
    iconName: 'Wrench',
    tagline: 'Triangulate DTC trouble codes, verify sensor telemetry, and build customer trust.',
    realWorldChallenge: 'A vehicle enters the shop with an engine light throwing P0420 (Catalyst System Efficiency). Replacing the $1,200 catalytic converter often fails if upstream oil consumption or an exhaust leak is the actual root cause.',
    plainEnglishSolution: 'AI acts as a master diagnostic partner. It correlates OBD-II freeze frame data with fuel trim logs, generating an orderly 4-step diagnostic checklist to verify before ordering costly parts.',
    promptExample: 'Act as an ASE-certified master diagnostic technician. A 2016 Subaru Outback 2.5L has DTC P0420. Long-Term Fuel Trim (LTFT) at idle is +11% and upstream O2 sensor reads rich, while downstream O2 sensor is oscillating rapidly between 0.1V and 0.8V. Provide a systematic diagnostic checklist prioritizing causes before catalytic replacement.',
    simulatedOutput: 'Diagnostic Assessment for P0420 with Positive Fuel Trim:\n\n1. Exhaust Manifold Flange Leak (Upstream):\n   • Rationale: Positive LTFT (+11%) indicates unmetered oxygen entering the exhaust stream before the cat, tricking the downstream sensor.\n   • Test: Smoke-test the exhaust system cold; inspect donuts and flex pipe for carbon trails.\n\n2. Downstream O2 Sensor Switching:\n   • Rationale: A healthy catalytic converter stores oxygen, causing downstream O2 to hold steady around 0.45V–0.6V. Oscillating rapidly (0.1V–0.8V) confirms either a dead catalyst substrate or false signals from false air.\n\n3. Mass Air Flow (MAF) Contamination:\n   • Test: Clean MAF sensor with dedicated solvent and check grams/second at 2,500 RPM (should be ~10-12 g/s on 2.5L).\n\nCustomer Communication: "We must confirm your exhaust seal is intact before replacing the converter, saving you from replacing a part that may still be functional."',
    actionableTips: [
      'Always test fuel trim at both idle and 2,500 RPM to isolate vacuum leaks from fuel delivery issues.',
      'Check downstream sensor heater resistance before assuming sensor failure.'
    ],
    interactiveCodeSnippet: `# OBD-II Fuel Trim Balance Check
stft = 3.5   # Short Term Fuel Trim (%)
ltft = 11.2  # Long Term Fuel Trim (%)
total_trim = stft + ltft

print(f"Total Fuel Trim: {total_trim:.1f}%")
if abs(total_trim) > 10.0:
    print("STATUS: Fuel delivery anomaly detected! Check unmetered air or fuel pressure.")
else:
    print("STATUS: Fuel trims within acceptable ±10% range.")`,
    recommendedTrack: 'Track 0: Absolute Zero (Logic & Numbers)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'cobbler',
    tier: 'tier1',
    domainId: 'tier1',
    domainTitle: 'Skilled Trades & Crafts',
    title: 'Craftsman & Cobbler Fair Quote Estimator',
    badge: 'TRADITIONAL TRADES',
    category: 'Skilled Trades & Crafts',
    accent: '#ec4899',
    iconName: 'Hammer',
    tagline: 'Master adhesive open cure times, stitch repair quotes, and customer aftercare.',
    realWorldChallenge: 'Handcrafting bespoke leather resole jobs requires balancing hours of hand de-stitching, specialty welt thread, rubber outsoles, and workshop machinery overhead without undercharging.',
    plainEnglishSolution: 'AI structures workshop job tickets and calculates fair pricing models based on true bench hours and consumable costs, while producing clear aftercare slips that prevent customer disputes.',
    promptExample: 'Act as a master shoe repair craftsman. Provide the exact chemical preparation steps, surface scuffing grit, and open drying time for Barge all-purpose contact cement when bonding a Vibram 430 rubber half-sole to an oily chrome-tanned leather midsole.',
    simulatedOutput: 'Master Cobbler Technical Procedure:\n\n1. Surface Deglazing:\n   • Wipe the bonding area of the chrome-tanned leather midsole twice with pure acetone on a clean cotton rag. This draws out oily waxes that prevent adhesive penetration.\n\n2. Mechanical Scuffing:\n   • Sand both the leather midsole and Vibram 430 rubber sole with 36-grit abrasive paper in a 45-degree crosshatch pattern to raise fibers and maximize surface area.\n\n3. Adhesive Application & Tack Time:\n   • Apply a uniform, thin coat of Barge all-purpose cement to both surfaces. Allow 15 to 20 minutes open tack time at 20°C (68°F). The cement must feel dry and tacky to the touch without transferring liquid to your knuckle.\n\n4. Pressure Consolidation:\n   • Align sole carefully (contact cement bonds on touch). Hammer firmly with a cobbler\'s rounded hammer from arch forward, then clamp in a sole press at 35–40 PSI for 10 minutes.',
    actionableTips: [
      'Never press contact cement while wet; trapped solvent bubbles cause delamination.',
      'Always calculate machine amortization and specialty needles into labor costs.'
    ],
    interactiveCodeSnippet: `# Bespoke Craft Fair Pricing Calculator
soles_materials = 26.50   # Vibram sole + heel lift
cork_and_thread = 5.20    # Specialty welt supplies
bench_hours = 2.25        # Actual artisan hand work
craft_hourly_rate = 48.00 # Target hourly artisan wage
overhead_charge = 12.00   # Workshop rent, power, press amort

quote = soles_materials + cork_and_thread + (bench_hours * craft_hourly_rate) + overhead_charge
print(f"Materials & Overhead: \${(soles_materials + cork_and_thread + overhead_charge):.2f}")
print(f"Artisan Labor:        \${(bench_hours * craft_hourly_rate):.2f}")
print(f"Fair Customer Quote:  \${quote:.2f}")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Math)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'plumber',
    tier: 'tier1',
    domainId: 'tier1',
    domainTitle: 'Skilled Trades & Crafts',
    title: 'Plumbing & Mechanical Contractor Estimates',
    badge: 'MECHANICAL CONTRACTING',
    category: 'Skilled Trades & Crafts',
    accent: '#ec4899',
    iconName: 'Wrench',
    tagline: 'Draft building-code compliant customer proposals and calculate pipe volumes.',
    realWorldChallenge: 'Explaining to a homeowner why replacing an aging atmospheric water heater with a modern tankless unit requires electrical rewiring, gas line upsizing, and category IV venting.',
    plainEnglishSolution: 'AI generates transparent, itemized contractor proposals that educate the customer on safety codes, gas supply calculations, and long-term utility savings.',
    promptExample: 'Act as a licensed master plumbing contractor. Write an itemized proposal explaining why upgrading a failing 50-gallon atmospheric gas water heater to a 199k BTU condensing tankless unit requires a dedicated 3/4-inch gas line and concentric PVC venting.',
    simulatedOutput: 'RESIDENTIAL WATER HEATER UPGRADE PROPOSAL\n\nDear Homeowner,\n\nBelow is our itemized scope for upgrading your domestic hot water system:\n\n1. Safe Decommissioning & Disposal ($180)\n   • Evacuation and legal recycling of failing 50-gallon tank.\n\n2. High-Efficiency Condensing Unit Installation ($1,850)\n   • 199,000 BTU tankless water heater (0.95 UEF energy rating).\n\n3. Code-Required Infrastructure Upgrades ($620)\n   • Gas Line Capacity: Modern tankless units draw high instantaneous fuel (199k BTU vs 40k BTU on tanks). Upgrading the supply line to 3/4" ensures your furnace and stove do not starve of gas during winter.\n   • Direct Concentric Venting: High-efficiency condensing units release cool acidic exhaust requiring dedicated 2" schedule 40 PVC venting.\n\nTotal Investment: $2,650.00\nEstimated Annual Energy Savings: 28% ($140–$180/year in natural gas costs).',
    actionableTips: [
      'Always list safety and building code reasons for line upsizing before naming prices.',
      'Provide estimated annual savings to contextualize the upfront equipment cost.'
    ],
    interactiveCodeSnippet: `# Pipe Volume & Flow Rate Verification
import math

pipe_diameter_in = 0.75 # 3/4 inch pipe
pipe_length_ft = 50.0   # 50 ft run
radius_ft = (pipe_diameter_in / 2.0) / 12.0
volume_cu_ft = math.pi * (radius_ft ** 2) * pipe_length_ft
gallons = volume_cu_ft * 7.48052

print(f"Pipe Diameter: {pipe_diameter_in} inches")
print(f"Run Length:    {pipe_length_ft} ft")
print(f"Water Volume:  {gallons:.2f} gallons in pipe")`,
    recommendedTrack: 'Track 0: Absolute Zero (Math & Data Types)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'salon',
    tier: 'tier1',
    domainId: 'tier1',
    domainTitle: 'Skilled Trades & Crafts',
    title: 'Salon Stylist Formulation & Client Retention',
    badge: 'BEAUTY & WELLNESS',
    category: 'Skilled Trades & Crafts',
    accent: '#ec4899',
    iconName: 'Scissors',
    tagline: 'Calculate chemical color ratios, prevent no-shows, and protect treatment margins.',
    realWorldChallenge: 'Balancing client appointment calendars, calculating chemical color tube weights to minimize waste, and drafting polite pre-care instructions while working on your feet.',
    plainEnglishSolution: 'AI acts as a front-desk coordinator and formulation calculator. It drafts warm, informative SMS reminders that cut cancellations and tracks product costs per service.',
    promptExample: 'Act as a boutique salon director. Write a warm 2-sentence SMS appointment reminder for client Sarah coming tomorrow at 1:30 PM for a 3-hour balayage and toner, reminding her to arrive with clean dry hair and a button-up shirt.',
    simulatedOutput: 'Hi Sarah! Looking forward to your balayage and toner appointment tomorrow at 1:30 PM! Please plan for roughly 3 hours, arrive with clean, dry hair, and wear a button-up shirt so you can change easily without brushing against your fresh toner. See you soon!',
    actionableTips: [
      'Remind clients to wear button-up shirts for color appointments to avoid pulling collars over fresh hair.',
      'Measure color and developer on a digital gram scale rather than eyeballing to maintain exact margins.'
    ],
    interactiveCodeSnippet: `# Treatment Product Margin & Consumable Calculator
color_tube = 11.50      # Professional color cream
developer_oz = 2.40     # 20-volume developer
foils_and_gloves = 3.20 # Sundries
service_fee = 165.00    # Client bill

cost = color_tube + developer_oz + foils_and_gloves
profit = service_fee - cost
margin = (profit / service_fee) * 100

print(f"Product Cost: \${cost:.2f}")
print(f"Net Profit:   \${profit:.2f} ({margin:.1f}% margin)")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Math)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'chef',
    tier: 'tier1',
    domainId: 'tier1',
    domainTitle: 'Skilled Trades & Crafts',
    title: 'Commercial Culinary Yield & Baker\'s Percentages',
    badge: 'CULINARY CRAFT',
    category: 'Skilled Trades & Crafts',
    accent: '#ec4899',
    iconName: 'UtensilsCrossed',
    tagline: 'Scale recipe yields accurately by weight, control food costs, and prevent waste.',
    realWorldChallenge: 'Scaling a boutique pastry recipe from 4 loaves to 60 loaves often fails if volume measurements (cups, spoons) are used rather than Baker\'s weight percentages.',
    plainEnglishSolution: 'AI converts kitchen recipes into precise metric Baker\'s Percentages where all ingredients are proportional to total flour weight, ensuring identical texture at any batch scale.',
    promptExample: 'Act as an artisan bakery production manager. I have a sourdough brioche recipe: 500g flour (100%), 64% water, 38% butter, 22% levain, 2.2% sea salt. Scale all ingredient weights in grams for a 50-loaf commercial production run (total flour 25,000g).',
    simulatedOutput: 'Commercial Production Batch (Total Flour: 25.0 kg / 25,000 g):\n\n• Bread Flour (100%): 25,000 g (25.00 kg)\n• Water / Hydration (64%): 16,000 g (16.00 kg / liters)\n• Unsalted Butter (38%): 9,500 g (9.50 kg)\n• Active Sourdough Levain (22%): 5,500 g (5.50 kg)\n• Fine Sea Salt (2.2%): 550 g (0.55 kg)\n\nTotal Batch Dough Mass: 56,550 g (56.55 kg)\nIndividual Dough Piece Scaled at: ~1,131 g per raw loaf (bakes to ~1,000 g finished loaf after 11% bake evaporation loss).',
    actionableTips: [
      'In professional baking, flour is always 100%; every other ingredient is a ratio of flour.',
      'Factor an 11-12% moisture loss during oven bake when sizing raw dough portion cuts.'
    ],
    interactiveCodeSnippet: `# Baker's Percentage Scaler
flour_kg = 25.0
water_pct = 0.64
butter_pct = 0.38
levain_pct = 0.22
salt_pct = 0.022

water_kg = flour_kg * water_pct
butter_kg = flour_kg * butter_pct
levain_kg = flour_kg * levain_pct
salt_kg = flour_kg * salt_pct
total_kg = flour_kg + water_kg + butter_kg + levain_kg + salt_kg

print(f"Flour:  {flour_kg:.2f} kg")
print(f"Water:  {water_kg:.2f} kg")
print(f"Butter: {butter_kg:.2f} kg")
print(f"Total:  {total_kg:.2f} kg dough")`,
    recommendedTrack: 'Track 0: Absolute Zero (Loops & Functions)',
    trackUrl: '/track/0/intro'
  },

  // ==========================================
  // DOMAIN 2: HEALTHCARE, EDUCATION & SERVICES
  // ==========================================
  {
    id: 'healthcare',
    tier: 'tier2',
    domainId: 'tier2',
    domainTitle: 'Healthcare, Education & Services',
    title: 'Patient Care Instructions & Discharge Clarity',
    badge: 'HEALTHCARE COMMUNICATION',
    category: 'Healthcare, Education & Services',
    accent: '#06b6d4',
    iconName: 'Stethoscope',
    tagline: 'Translate clinical discharge notes into compassionate, 6th-grade reading level guidelines.',
    realWorldChallenge: 'Hospital patients and elderly care recipients leaving clinical settings are frequently overwhelmed by Latin medical acronyms, leading to medication non-compliance or preventable readmissions.',
    plainEnglishSolution: 'AI transforms dense clinical notes into warm, clear, structured recovery plans formatted for family caregivers at home.',
    promptExample: 'Translate this clinical discharge summary into a compassionate 6th-grade-reading-level home care plan: "Dx: Congestive Heart Failure exacerbation. Rx: Furosemide 40mg PO QAM, Lisinopril 10mg PO daily. Low sodium diet (<2000mg/day). Daily weights AM post-void. Call clinic if weight gain >3 lbs in 24 hours or peripheral edema worsens."',
    simulatedOutput: 'Dear Patient and Family,\n\nHere is your simple, step-by-step home care plan to keep you safe and breathing easily:\n\n1. Your Morning Water Pill (Furosemide 40mg):\n   • Take 1 tablet every morning with water. This helps your kidneys drain extra fluid so your lungs stay clear.\n\n2. Your Daily Blood Pressure Pill (Lisinopril 10mg):\n   • Take 1 tablet each day at the same time to relax your blood vessels.\n\n3. The Morning Weigh-In Habit:\n   • Weigh yourself every single morning right after you use the bathroom and before breakfast.\n   • Write the number on your calendar.\n\n4. When to Call Us Right Away:\n   • If your weight jumps by 3 pounds in one day, or your shoes/ankles feel suddenly tight and puffy, call our nurse line immediately. We can adjust your water pill before you feel short of breath!',
    actionableTips: [
      'Specify medication timing relative to breakfast and bedtime to prevent night-time urination disruption.',
      'State exactly which symptoms require calling the clinic versus calling emergency services.'
    ],
    interactiveCodeSnippet: `# Patient Weight Fluctuation Alert Tracker
baseline_weight = 168.0
today_weight = 171.4
gain_24hr = today_weight - baseline_weight

print(f"24-Hour Weight Shift: {gain_24hr:+.1f} lbs")
if gain_24hr >= 3.0:
    print("ACTION REQUIRED: Sudden fluid retention! Notify clinic nurse.")
else:
    print("STATUS: Fluid levels stable.")`,
    recommendedTrack: 'Track 1: Vector Spaces & Retrieval',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'teacher',
    tier: 'tier2',
    domainId: 'tier2',
    domainTitle: 'Healthcare, Education & Services',
    title: 'Differentiated 3-Tier Classroom Lesson Architect',
    badge: 'PEDAGOGICAL DESIGN',
    category: 'Healthcare, Education & Services',
    accent: '#06b6d4',
    iconName: 'GraduationCap',
    tagline: 'Design adaptive lesson plans and differentiated tiers for diverse student reading levels.',
    realWorldChallenge: 'Teachers spend hours after school adapting a single curriculum standard to support emerging readers, grade-level students, and advanced gifted learners simultaneously.',
    plainEnglishSolution: 'AI acts as a tireless curriculum assistant, structuring a single topic into 3 scaffolded reading and activity tiers with engaging hands-on inquiry hooks.',
    promptExample: 'Act as a master pedagogical designer. Design a 45-minute middle school science lesson introducing ecosystem energy pyramids (trophic levels). Provide a 5-minute hands-on hook activity, and 3 differentiated practice activities: Tier 1 (Supported), Tier 2 (Standard), and Tier 3 (Extension Challenge).',
    simulatedOutput: 'LESSON PLAN: How Energy Flows in Ecosystems (Trophic Pyramids)\n\n• Hook (5 min - The Dollar Bill Crunch): Hand one student 100 fake dollar bills (representing sunlight). Each step up the food chain (plants → grasshoppers → birds → hawks), the student must return 90% of the money to the bank. Students physically see only $0.10 reaches the top predator!\n\n• Direct Instruction (15 min): Connect sunlight to the 10% Ecological Rule.\n\n• Differentiated Practice (15 min):\n  - Tier 1 (Supported): Visual cutout cards with color-coded calorie counters showing animals to place on a labeled 4-step pyramid mat.\n  - Tier 2 (Standard): Calculate kilocalories remaining at each level given 20,000 kcal of producer corn and explain why top predators are rare.\n  - Tier 3 (Extension): Design an agricultural food system analyzing why human vegetarian diets support more population than livestock feedlots based on trophic efficiency.\n\n• Exit Ticket (5 min): In 1 sentence, why can an acre of land feed more people if we eat grain directly instead of feeding cattle first?',
    actionableTips: [
      'Always structure differentiated tiers by cognitive depth, not by giving struggling students fewer questions.',
      'Use hands-on kinesthetic demonstrations in the first 5 minutes to anchor abstract concepts.'
    ],
    interactiveCodeSnippet: `# Trophic Energy Transfer Model (10% Rule)
solar_energy_kcal = 100000.0
producers = solar_energy_kcal * 0.01   # Plants capture ~1% of sunlight
herbivores = producers * 0.10          # 10% transfer
carnivores = herbivores * 0.10
apex_predators = carnivores * 0.10

print(f"Sunlight Available:    {solar_energy_kcal:,.0f} kcal")
print(f"Plant Producers:       {producers:,.0f} kcal")
print(f"Herbivore Consumers:   {herbivores:,.0f} kcal")
print(f"Top Apex Predators:    {apex_predators:,.0f} kcal")`,
    recommendedTrack: 'Track 1: Vector Spaces & Document Chunking',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'farmer',
    tier: 'tier2',
    domainId: 'tier2',
    domainTitle: 'Healthcare, Education & Services',
    title: 'Agronomy & Sustainable Soil Crop Rotation',
    badge: 'SUSTAINABLE AGRICULTURE',
    category: 'Healthcare, Education & Services',
    accent: '#06b6d4',
    iconName: 'Wheat',
    tagline: 'Balance soil nitrogen depletion, plan multi-year crop rotations, and calculate nutrients.',
    realWorldChallenge: 'High synthetic fertilizer costs and soil compaction erode long-term farm profitability. Planning sustainable multi-year crop rotations that restore organic matter is mathematically and ecologically complex.',
    plainEnglishSolution: 'AI assists agronomists and farmers in designing multi-season cover crop sequences that naturally fix nitrogen and prevent weed cycles.',
    promptExample: 'Act as a sustainable agronomist. Design a 4-year crop rotation schedule for 120 acres of silt loam soil aiming to reduce synthetic nitrogen fertilizer inputs while maintaining cash crop revenue with corn and soybeans.',
    simulatedOutput: '4-YEAR SUSTAINABLE SOIL NITROGEN ROTATION PLAN:\n\n• Year 1 (Cash Heavy Feeder): Field Corn.\n  - Post-Harvest Action: Aerially seed cereal rye cover crop (scavenges residual N and protects topsoil from winter runoff).\n\n• Year 2 (Biological Nitrogen Fixer): Soybeans.\n  - Mechanism: Rhizobia bacteria in root nodules fix atmospheric nitrogen (saving 40-50 lbs N/acre for the next cycle).\n  - Post-Harvest: Light disking and seeding of hairy vetch.\n\n• Year 3 (Cash Small Grain): Winter Wheat.\n  - Harvest in mid-summer; immediately frost-seed red clover.\n\n• Year 4 (Soil Regeneration & Green Manure): Multi-Species Forage / Red Clover.\n  - Provides organic matter buildup and deep taproot aeration; plow down in late autumn to release up to 120 lbs N/acre naturally for Year 1 Corn.\n\nEstimated Fertilizer Reduction: 35-45% reduction in synthetic urea purchases over 4 years.',
    actionableTips: [
      'Incorporate legume cover crops (vetch, clover) before heavy nitrogen-consuming cash crops.',
      'Check soil test phosphorus and potassium levels before finalizing rotation schedules.'
    ],
    interactiveCodeSnippet: `# Soil Nitrogen Credit & Cost Savings Calculator
acres = 120.0
synthetic_n_price_per_lb = 0.85
n_credit_lbs_per_acre = 45.0 # From legume rotation

total_n_saved = acres * n_credit_lbs_per_acre
dollars_saved = total_n_saved * synthetic_n_price_per_lb

print(f"Acres Managed:         {acres:.0f}")
print(f"Biological N Provided: {total_n_saved:,.0f} lbs")
print(f"Fertilizer Cash Saved: \${dollars_saved:,.2f}")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Math)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'legal-plain-english',
    tier: 'tier2',
    domainId: 'tier2',
    domainTitle: 'Healthcare, Education & Services',
    title: 'Plain-English Legal Contract Risk Auditor',
    badge: 'LEGAL & COMMUNITY RIGHTS',
    category: 'Healthcare, Education & Services',
    accent: '#06b6d4',
    iconName: 'Scale',
    tagline: 'Translate dense legal lease clauses and vendor agreements into plain risk summaries.',
    realWorldChallenge: 'Signing commercial leases, residential rental contracts, or non-compete agreements with pages of dense legalese that hide liability traps.',
    plainEnglishSolution: 'AI identifies aggressive indemnification clauses, ambiguous renewal triggers, and hidden fee penalties, explaining legal terms in straightforward plain English.',
    promptExample: 'Act as an objective legal contract reviewer. Review this commercial lease clause and explain what it means in plain English, highlighting the top 2 risks for the tenant: "Lessee shall indemnify and hold Lessor harmless from any and all claims, including reasonable attorney fees, arising out of any occurrence on the premises, regardless of Lessor\'s contributory negligence. Lease automatically renews for successive 24-month terms unless written notice is received 180 days prior via certified mail."',
    simulatedOutput: 'PLAIN-ENGLISH CLAUSE ANALYSIS:\n\n1. Risk 1: Unfair Liability for Landlord Negligence (The Indemnity Trap)\n   • What it says: Even if the landlord neglects building maintenance (like a roof collapse or faulty wiring that causes a fire), YOU (the tenant) agree to pay for their legal defense and all damages.\n   • Recommendation: Strike "regardless of Lessor\'s contributory negligence" and add "except for claims resulting from Lessor\'s gross negligence or willful misconduct".\n\n2. Risk 2: Severe 6-Month Auto-Renewal Lock-In\n   • What it says: You must remember to send a certified letter at least 6 full months before your lease expires, or you are automatically trapped in another 2-year lease with zero exit rights.\n   • Recommendation: Request a 60-day or 90-day notice window, with written reminder required from the landlord before automatic renewal activates.',
    actionableTips: [
      'Never sign an indemnification clause that includes the other party\'s sole or contributory negligence.',
      'Put automatic renewal notification dates on your digital calendar immediately upon signing.'
    ],
    interactiveCodeSnippet: `# Contract Notice Deadline Calculator
lease_term_months = 24
notice_window_days = 180
days_in_lease = lease_term_months * 30.4
notice_day_from_start = days_in_lease - notice_window_days

print(f"Total Lease Duration: ~{days_in_lease:.0f} days")
print(f"Notice Window:        {notice_window_days} days before end")
print(f"Action Required Day:  ~Day {notice_day_from_start:.0f} of your tenancy")`,
    recommendedTrack: 'Track 1: Vector Spaces & Document Retrieval',
    trackUrl: '/track/1/intro'
  },

  // ==========================================
  // DOMAIN 3: SMALL BUSINESS & OPERATIONS
  // ==========================================
  {
    id: 'accountant',
    tier: 'tier3',
    domainId: 'tier3',
    domainTitle: 'Small Business & Operations',
    title: 'Operating Expense (OpEx) Variance Analysis',
    badge: 'FINANCIAL INTELLIGENCE',
    category: 'Small Business & Operations',
    accent: '#14b8a6',
    iconName: 'Calculator',
    tagline: 'Isolate budget variance anomalies, track cost leaks, and draft executive memos.',
    realWorldChallenge: 'Combing through monthly spreadsheet ledgers to understand why operating expenses shot up 14% over budget, and communicating the drivers clearly to partners or lenders.',
    plainEnglishSolution: 'AI writes Python verification scripts, categorizes variance into fixed overhead vs variable inflation, and formats clear, transparent executive memos.',
    promptExample: 'Act as a senior CPA and financial controller. Draft a concise 1-page executive variance memo explaining a 14.2% unfavorable variance in Q2 operating expenses ($285,500 actual vs $250,000 budget), breaking down labor overtime, freight surcharges, and emergency repair drivers.',
    simulatedOutput: 'MEMORANDUM\n\nTo: Executive Committee & Managing Partners\nFrom: Financial Controller\nSubject: Q2 Operating Expense (OpEx) Variance Analysis (+14.2% vs Budget)\n\nExecutive Summary:\nQ2 actual expenses totaled $285,500 against an authorized budget of $250,000, creating an unfavorable variance of $35,500 (+14.2%). The variance was driven by three primary operational factors:\n\n1. Production Labor Overtime (+$19,200 / +54% of variance):\n   • Driver: Unplanned overtime to fulfill accelerated delivery commitments following supply delays.\n   • Corrective Action: Cross-training second-shift staff to eliminate 1.5x overtime premiums.\n\n2. Logistics & LTL Freight Surcharges (+$10,800 / +30% of variance):\n   • Driver: Spot-rate ocean container repositioning and diesel fuel index adjustments.\n\n3. Facility Boiler HVAC Repair (+$5,500 / +16% of variance):\n   • Driver: One-time unbudgeted compressor rebuild in May.\n\nForward Outlook: Normalizing labor scheduling will return Q3 operating margins to the target 18.5% baseline.',
    actionableTips: [
      'Distinguish one-time extraordinary costs (repairs) from persistent variable cost creep (overtime).',
      'Always express variance in both dollar amounts and percentage of total variance.'
    ],
    interactiveCodeSnippet: `# Financial Variance Calculator
budget = 250000.00
actual = 285500.00
variance = actual - budget
variance_pct = (variance / budget) * 100

status = "UNFAVORABLE" if variance > 0 else "FAVORABLE"
print(f"Budget:       \${budget:,.2f}")
print(f"Actual:       \${actual:,.2f}")
print(f"Variance:     \${variance:+,.2f} ({variance_pct:+.2f}%) [{status}]")`,
    recommendedTrack: 'Track 1: Vector Spaces & Numerical Data',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'customer-deescalation',
    tier: 'tier3',
    domainId: 'tier3',
    domainTitle: 'Small Business & Operations',
    title: 'Customer Review De-escalation & Resolution',
    badge: 'CUSTOMER EXPERIENCE',
    category: 'Small Business & Operations',
    accent: '#14b8a6',
    iconName: 'HeartHandshake',
    tagline: 'De-escalate public online complaints with empathy, dignity, and professional accountability.',
    realWorldChallenge: 'Receiving an angry, emotional 1-star public Google review where reacting defensively damages your business reputation, but staying silent looks like guilt.',
    plainEnglishSolution: 'AI crafts dignified, empathetic responses that de-escalate emotional friction, demonstrate public accountability, and move the conversation to private channels.',
    promptExample: 'Act as a customer experience director for a family-owned neighborhood restaurant. A customer left a 1-star review claiming their reservation had a 30-minute delay and their server was inattentive on their wedding anniversary. Write a warm, professional, non-defensive public reply that validates their feelings, explains our standard, and invites them to speak directly with the general manager.',
    simulatedOutput: 'Dear Marcus,\n\nFirst and most importantly: happy anniversary to you both, and please accept our sincere apologies for letting you down on such a special evening. Celebrating a wedding anniversary should be effortless and celebratory, and waiting 30 minutes past your reservation time falls short of the warm hospitality we hold ourselves to.\n\nWhile our dining room was at maximum capacity that evening, that is never an excuse for delayed service or making you feel overlooked. We take complete ownership of your experience.\n\nI would love the opportunity to speak with you directly and make this right. Please email me at gm@ourbistro.com or call my personal desk at (555) 019-2834. We would be honored to host you for a proper dinner on us to celebrate your anniversary the way you deserved.\n\nWarmly,\nElena Rostova, General Manager',
    actionableTips: [
      'Never debate factual details in a public review; public readers judge your character, not who was right.',
      'Always provide a direct personal phone number or email to take the resolution private.'
    ],
    interactiveCodeSnippet: `# Net Promoter Score (NPS) Impact Estimator
promoters = 45   # 9-10 rating
passives = 12    # 7-8 rating
detractors = 6   # 0-6 rating (including angry reviews)
total = promoters + passives + detractors

nps = ((promoters - detractors) / total) * 100
print(f"Total Respondents: {total}")
print(f"Net Promoter Score: {nps:.1f} (World Class benchmark is > 50)")`,
    recommendedTrack: 'Track 0: Absolute Zero (Conditionals & Strings)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'inventory-reorder',
    tier: 'tier3',
    domainId: 'tier3',
    domainTitle: 'Small Business & Operations',
    title: 'Inventory Reorder Point & Safety Stock Modeler',
    badge: 'OPERATIONS & SUPPLY',
    category: 'Small Business & Operations',
    accent: '#14b8a6',
    iconName: 'Calculator',
    tagline: 'Calculate exact reorder trigger points to eliminate stockouts without tying up cash.',
    realWorldChallenge: 'Running out of critical retail products during peak weekends because supplier lead times vary, while over-ordering locks up working capital in unsold inventory.',
    plainEnglishSolution: 'AI calculates the statistical Reorder Point (ROP) and safety stock buffer based on daily sales velocity and supplier lead-time variance.',
    promptExample: 'Act as an operations and supply chain specialist. An e-commerce boutique sells an average of 18 units/day of organic coffee beans with a lead time of 10 days from the roaster. Weekend demand spikes up to 26 units/day, and roaster deliveries can occasionally delay up to 14 days. Calculate the exact Safety Stock and Reorder Point (ROP) in units.',
    simulatedOutput: 'INVENTORY REORDER SPECIFICATION:\n\n1. Baseline Parameters:\n   • Average Daily Demand (d_avg): 18 units/day\n   • Maximum Daily Demand (d_max): 26 units/day\n   • Average Lead Time (L_avg): 10 days\n   • Maximum Lead Time (L_max): 14 days\n\n2. Safety Stock Calculation:\n   • Formula: Safety Stock = (d_max × L_max) - (d_avg × L_avg)\n   • Calculation: (26 × 14) - (18 × 10) = 364 - 180 = 184 units\n\n3. Reorder Point (ROP):\n   • Formula: ROP = (Average Daily Demand × Average Lead Time) + Safety Stock\n   • Calculation: (18 × 10) + 184 = 180 + 184 = 364 units\n\nOperational Rule: The moment your inventory shelf count drops to 364 units, immediately place your purchase order with the roaster. You will never stock out even during the worst-case 14-day delay.',
    actionableTips: [
      'Safety stock protects against both supplier delays and sudden demand surges simultaneously.',
      'Recalculate ROP quarterly as seasonal velocities shift.'
    ],
    interactiveCodeSnippet: `# Reorder Point (ROP) Calculator
d_avg = 18.0  # units/day
d_max = 26.0
l_avg = 10.0  # days lead time
l_max = 14.0

safety_stock = (d_max * l_max) - (d_avg * l_avg)
rop = (d_avg * l_avg) + safety_stock

print(f"Safety Stock Buffer: {safety_stock:.0f} units")
print(f"Trigger Reorder at:   {rop:.0f} units on shelf")`,
    recommendedTrack: 'Track 1: Vector Spaces & Numerical Data',
    trackUrl: '/track/1/intro'
  },

  // ==========================================
  // DOMAIN 4: PHYSICAL & SYSTEMS ENGINEERING
  // ==========================================
  {
    id: 'mechanical',
    tier: 'tier4',
    domainId: 'tier4',
    domainTitle: 'Physical & Systems Engineering',
    title: 'Precision Thermal Expansion & Machining Tolerances',
    badge: 'MECHANICAL SYSTEMS',
    category: 'Physical & Systems Engineering',
    accent: '#3b82f6',
    iconName: 'Cog',
    tagline: 'Calculate linear thermal growth, verify shaft clearances, and check ASTM specs.',
    realWorldChallenge: 'Precision shafts machined at 20°C workshop ambient temperature can seize inside bronze bushings or roller bearings when operating at 180°C under thermal expansion.',
    plainEnglishSolution: 'AI eliminates manual handbook lookup errors by writing immediate NumPy calculations applying coefficient alpha and verifying bearing run-out clearances.',
    promptExample: 'Act as a senior mechanical engineer. Write a concise Python script using NumPy to calculate the linear thermal expansion delta L of a 750mm 304 Stainless Steel shaft heated from 22°C to 180°C with thermal expansion coefficient alpha = 17.3e-6 /°C.',
    simulatedOutput: 'Linear Thermal Expansion Analysis:\n\nFormula: ΔL = α · L₀ · ΔT\n\n• Initial Length (L₀): 750.0 mm\n• Temperature Differential (ΔT): 180.0°C - 22.0°C = 158.0°C\n• Linear Coefficient (α): 1.73 × 10⁻⁵ /°C (304 Stainless Steel)\n\nCalculation:\nΔL = (1.73 × 10⁻⁵) × 750 × 158 = 2.0501 mm\nHot Operating Length: 752.0501 mm\n\nDesign Consideration: Ensure the bearing housing floating end has at least 2.5mm of axial clearance to prevent axial bearing pre-loading and premature fatigue failure.',
    actionableTips: [
      'Always verify whether the bearing assembly is fixed or floating to absorb axial thermal growth.',
      'Check if the housing material expands faster than the shaft (e.g. aluminum vs steel).'
    ],
    interactiveCodeSnippet: `# Precision Thermal Growth Calculator
L_0 = 750.0       # mm nominal shaft length
alpha = 17.3e-6   # 1/°C (304 Stainless Steel)
T_cold = 22.0     # °C workshop ambient
T_hot = 180.0     # °C operating continuous

delta_T = T_hot - T_cold
delta_L = alpha * L_0 * delta_T

print(f"Temperature Rise: {delta_T:.1f} °C")
print(f"Axial Expansion:  {delta_L:.4f} mm")
print(f"Hot Length:       {L_0 + delta_L:.4f} mm")`,
    recommendedTrack: 'Track 1: Vector Spaces & NumPy Math',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'civil',
    tier: 'tier4',
    domainId: 'tier4',
    domainTitle: 'Physical & Systems Engineering',
    title: 'Simply Supported Beam Bending Moment & Deflection',
    badge: 'STRUCTURAL ENGINEERING',
    category: 'Physical & Systems Engineering',
    accent: '#3b82f6',
    iconName: 'Building',
    tagline: 'Compute bending moments, deflection limits, and safety factors for steel beams.',
    realWorldChallenge: 'Sanity-checking maximum bending moments (M = wL²/8) and serviceability deflection limits (L/360) for steel beams under combined dead and live loads.',
    plainEnglishSolution: 'AI writes Python calculation scripts verifying structural bending moments, section modulus requirements, and deflection invariants.',
    promptExample: 'Act as a licensed structural engineer. Write a Python script to compute the maximum bending moment and verify the L/360 deflection limit for a simply supported steel W8x24 beam under a uniform load w = 1.2 kip/ft over a span L = 20 ft with E = 29,000 ksi and I = 82.7 in⁴.',
    simulatedOutput: 'STRUCTURAL ANALYSIS REPORT:\n\n1. Maximum Bending Moment:\n   • Formula: M_max = (w · L²) / 8\n   • w = 1.2 kip/ft, L = 20 ft\n   • M_max = (1.2 × 20²) / 8 = 60.0 kip-ft = 720 kip-in\n\n2. Maximum Midspan Deflection:\n   • Formula: Δ_max = (5 · w_in · L_in⁴) / (384 · E · I)\n   • w_in = 1.2 / 12 = 0.10 kip/in\n   • L_in = 20 × 12 = 240 in\n   • Numerator: 5 × 0.10 × (240⁴) = 1,658,880,000\n   • Denominator: 384 × 29,000 × 82.7 = 921,029,760\n   • Δ_max = 1.801 inches\n\n3. Serviceability Check (L/360):\n   • Allowable Δ = 240 / 360 = 0.667 inches\n   • Verdict: DEFLECTION EXCEEDS ALLOWABLE (1.801" > 0.667"). The beam has adequate bending strength but fails deflection serviceability. Upsize to a beam with higher moment of inertia (I > 224 in⁴, e.g. W12x26).',
    actionableTips: [
      'Structural steel sizing is frequently governed by live-load deflection limits rather than yield stress.',
      'Convert distributed load to kip/inch and span to inches before computing deflection.'
    ],
    interactiveCodeSnippet: `# Steel Beam Bending & Deflection Check
w_kip_ft = 1.2
L_ft = 20.0
E_ksi = 29000.0
I_in4 = 82.7

M_max_kip_ft = (w_kip_ft * (L_ft ** 2)) / 8.0
w_in = w_kip_ft / 12.0
L_in = L_ft * 12.0
delta_max = (5.0 * w_in * (L_in ** 4)) / (384.0 * E_ksi * I_in4)
allowable_delta = L_in / 360.0

print(f"Max Bending Moment: {M_max_kip_ft:.1f} kip-ft")
print(f"Calculated Deflect: {delta_max:.3f} inches")
print(f"Allowable (L/360):  {allowable_delta:.3f} inches")
print("Passes Deflection: ", delta_max <= allowable_delta)`,
    recommendedTrack: 'Track 1: Vector Spaces & NumPy Math',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'sensor-telemetry',
    tier: 'tier4',
    domainId: 'tier4',
    domainTitle: 'Physical & Systems Engineering',
    title: 'IoT Sensor Vibration Telemetry & Anomaly Bounds',
    badge: 'SYSTEMS TELEMETRY',
    category: 'Physical & Systems Engineering',
    accent: '#3b82f6',
    iconName: 'Cog',
    tagline: 'Detect motor bearing anomalies from raw accelerometer frequency CSV time-series.',
    realWorldChallenge: 'Industrial IoT accelerometers generate millions of noisy time-series data points. Finding bearing race spalling before catastrophic motor seizure requires fast outlier bounding.',
    plainEnglishSolution: 'AI writes Python signal processing filters that compute Root-Mean-Square (RMS) vibration metrics and statistical 3-sigma thresholds directly in browser memory.',
    promptExample: 'Write a Python snippet using NumPy to calculate the Root Mean Square (RMS) acceleration and Peak-to-Peak vibration of an accelerometer time series, flagging any readings exceeding ISO 10816 vibration severity limits (> 4.5 mm/s RMS).',
    simulatedOutput: 'ISO 10816 Vibration Anomaly Analyzer:\n\n• Root Mean Square (RMS) captures total vibration energy: RMS = sqrt(mean(signal²))\n• ISO 10816 Class II Machines:\n  - < 1.4 mm/s: Excellent (Zone A)\n  - 1.4 - 2.8 mm/s: Good (Zone B)\n  - 2.8 - 4.5 mm/s: Allowable for short term (Zone C)\n  - > 4.5 mm/s: Unacceptable / Imminent Failure (Zone D)',
    actionableTips: [
      'Always subtract sensor DC offset (gravity bias) before calculating vibration RMS.',
      'ISO 10816 thresholds apply to steady-state operating speed, not machine startup.'
    ],
    interactiveCodeSnippet: `# Vibration RMS & Severity Check
import numpy as np

# Simulated vibration velocity telemetry (mm/s)
telemetry = np.array([1.2, 1.8, 2.1, 2.4, 3.1, 4.8, 5.2, 3.6, 2.2])
rms_velocity = np.sqrt(np.mean(telemetry ** 2))
iso_limit = 4.5

print(f"RMS Velocity:    {rms_velocity:.2f} mm/s")
print(f"ISO 10816 Limit: {iso_limit:.1f} mm/s")
print("Severity Alert: ", "DANGER - SCHEDULE MAINTENANCE" if rms_velocity > iso_limit else "NORMAL")`,
    recommendedTrack: 'Track 1: Vector Spaces & NumPy Math',
    trackUrl: '/track/1/intro'
  },

  // ==========================================
  // DOMAIN 5: FRONTIER AI & MODERN SOFTWARE
  // ==========================================
  {
    id: 'software',
    tier: 'tier5',
    domainId: 'tier5',
    domainTitle: 'Software & Frontier AI Systems',
    title: 'Local-First WebAssembly & Invariant Testing',
    badge: 'LOCAL-FIRST ARCHITECTURE',
    category: 'Software & Frontier AI Systems',
    accent: '#f59e0b',
    iconName: 'Code2',
    tagline: 'Architect resilient client-side systems with Pyodide WebAssembly, Workers, and IndexedDB.',
    realWorldChallenge: 'Building zero-cost, high-performance web software without getting locked into expensive cloud SaaS API bills or leaking user data to remote servers.',
    plainEnglishSolution: 'OpenGuide demonstrates how to run complete CPython environments directly inside the user\'s browser Web Worker using Pyodide WASM, enforcing a 15-second watchdog timer for infinite loop protection.',
    promptExample: 'Write a client-side TypeScript Web Worker manager with a 15-second watchdog timer that safely terminates runaway Python loops and respawns the worker cleanly without freezing the main UI thread.',
    simulatedOutput: 'export class PyodideWorkerManager {\n  private worker: Worker | null = null;\n  private timeoutId: number | null = null;\n\n  constructor(private workerScriptUrl: string) {\n    this.initWorker();\n  }\n\n  private initWorker() {\n    this.worker = new Worker(this.workerScriptUrl, { type: "module" });\n  }\n\n  async executeCode(code: string, timeoutMs = 15000): Promise<string> {\n    return new Promise((resolve, reject) => {\n      this.timeoutId = window.setTimeout(() => {\n        this.worker?.terminate();\n        this.initWorker(); // Clean respawn\n        reject(new Error("Worker terminated: Execution exceeded 15s watchdog"));\n      }, timeoutMs);\n\n      this.worker!.onmessage = (event) => {\n        if (this.timeoutId) clearTimeout(this.timeoutId);\n        resolve(event.data.output);\n      };\n    });\n  }\n}',
    actionableTips: [
      'Always terminate and respawn Web Workers on watchdog expiration rather than attempting soft resets.',
      'Store execution history in local IndexedDB (Dexie) so user code persists offline.'
    ],
    interactiveCodeSnippet: `# Mathematical Vector Normalization Invariant
def safe_vector_normalize(v):
    norm = sum(x**2 for x in v) ** 0.5
    assert norm > 0, "Cannot normalize a zero-magnitude vector"
    unit_v = [x / norm for x in v]
    unit_norm = sum(x**2 for x in unit_v) ** 0.5
    assert abs(unit_norm - 1.0) < 1e-6, "Unit norm invariant failed"
    return unit_v

test_vector = [3.0, 4.0]
print("Normalized Unit Vector:", safe_vector_normalize(test_vector))`,
    recommendedTrack: 'Track 2: RAG & Autonomous Agents',
    trackUrl: '/track/2/intro'
  },
  {
    id: 'ai-expert',
    tier: 'tier5',
    domainId: 'tier5',
    domainTitle: 'Software & Frontier AI Systems',
    title: 'Transformer Attention Math & Softmax Scaling',
    badge: 'TRANSFORMER INTERNALS',
    category: 'Software & Frontier AI Systems',
    accent: '#f59e0b',
    iconName: 'BrainCircuit',
    tagline: 'Implement Scaled Dot-Product Attention, RoPE, KV caching, and WebGPU kernels from scratch.',
    realWorldChallenge: 'Understanding transformer mechanics down to numerical stability, why dividing by sqrt(d_k) prevents vanishing gradients, and memory footprints per token.',
    plainEnglishSolution: 'OpenGuide teaches every frontier transformer concept in pure NumPy without black-box frameworks, explaining the mathematical intuition before code.',
    promptExample: 'Explain why dividing by sqrt(d_k) in Scaled Dot-Product Attention prevents Softmax gradients from vanishing, and provide a numerically stable NumPy implementation subtracting max(scores).',
    simulatedOutput: 'Mathematical Grounding:\nWhen Query (Q) and Key (K) vectors of dimension d_k have elements drawn from independent normal distributions N(0, 1), their dot product q·k has a mean of 0 and a variance equal to d_k.\n\nFor large head dimensions (e.g. d_k = 64 or 128), dot products frequently reach values like +40 or -40. Passing large values through Softmax pushes probabilities toward 1.0 or 0.0, where the derivative of Softmax approaches ZERO. This causes gradients to vanish, stalling neural network training.\n\nDividing by sqrt(d_k) scales variance back to 1.0, preserving healthy gradient flow during backpropagation.',
    actionableTips: [
      'Always subtract np.max(scores, axis=-1, keepdims=True) before exponentiation to prevent floating-point overflow.',
      'Remember that KV caching stores Key and Value tensors for past tokens, avoiding O(N²) recomputation.'
    ],
    interactiveCodeSnippet: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    # 1. Scaled dot products
    scores = (Q @ K.T) / np.sqrt(d_k)
    # 2. Numerically stable softmax
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    # 3. Weighted values
    return weights @ V, weights

Q = np.random.randn(2, 8)
K = np.random.randn(2, 8)
V = np.random.randn(2, 8)
out, weights = scaled_dot_product_attention(Q, K, V)
print("Attention Weights Row Sum:", np.sum(weights, axis=-1))
print("Output Shape:", out.shape)`,
    recommendedTrack: 'Track 4: Frontier Intelligence (Transformer Internals)',
    trackUrl: '/track/4/intro'
  },
  {
    id: 'vector-retrieval',
    tier: 'tier5',
    domainId: 'tier5',
    domainTitle: 'Software & Frontier AI Systems',
    title: 'In-Browser Cosine Similarity Semantic Search',
    badge: 'VECTOR SPACES',
    category: 'Software & Frontier AI Systems',
    accent: '#f59e0b',
    iconName: 'BrainCircuit',
    tagline: 'Build client-side vector search without external vector databases or paid APIs.',
    realWorldChallenge: 'Implementing Retrieval-Augmented Generation (RAG) often makes developers believe they need expensive hosted vector databases, when modern client browsers can compute dot products over thousands of embeddings in milliseconds.',
    plainEnglishSolution: 'AI demonstrates how to normalize embedding vectors and perform fast matrix multiplications in pure JavaScript or WebAssembly adhering to the $0 Rule.',
    promptExample: 'Write a Python snippet calculating Cosine Similarity between a query embedding and 3 document embeddings using NumPy dot products, returning the top-1 ranked document.',
    simulatedOutput: 'Client-Side Cosine Similarity Mathematics:\nCosine Similarity measures the cosine of the angle between two high-dimensional vectors:\n\ncos(θ) = (A · B) / (||A|| · ||B||)\n\nIf all vectors are pre-normalized to unit length (||A|| = 1.0), Cosine Similarity simplifies to a single dot product (A · B), allowing sub-millisecond retrieval in browser WebAssembly.',
    actionableTips: [
      'Pre-normalize all document embeddings to unit length once during ingestion to turn similarity into simple dot products.',
      'Use 384-dimensional models (like MiniLM) for fast client-side execution in browser memory.'
    ],
    interactiveCodeSnippet: `import numpy as np

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

query = np.array([0.8, 0.2, 0.1])
doc_a = np.array([0.7, 0.3, 0.1])  # Semantically close
doc_b = np.array([-0.5, 0.8, 0.1]) # Semantically distant

score_a = cosine_similarity(query, doc_a)
score_b = cosine_similarity(query, doc_b)
print(f"Similarity Doc A: {score_a:.4f} (Match)")
print(f"Similarity Doc B: {score_b:.4f} (Irrelevant)")`,
    recommendedTrack: 'Track 1: Vector Spaces & Retrieval',
    trackUrl: '/track/1/intro'
  }
];

export const LLM_PLAIN_ENGLISH_GUIDE = {
  headline: "You Are an LLM: How Anyone Can Talk to an AI in 3 Simple Rules",
  subtitle: "No computer degree needed. No confusing jargon. Just 3 simple human rules.",
  whatIsAnLlm: "Think of an AI as a super-fast apprentice who has read millions of books, manuals, and recipes. It doesn't have emotions or feelings—it predicts the most helpful next words to solve your dilemma based on patterns.",
  threeGoldenRules: [
    {
      rule: "Rule 1: Role (Who to be)",
      explanation: "Tell the AI who to act as. If you need help diagnosing an engine, say 'Act as an experienced mechanic'. If you need help with a household budget, say 'Act as a kind family financial coach'.",
      example: "Act as an expert automotive technician..."
    },
    {
      rule: "Rule 2: Context (What you have)",
      explanation: "Describe your exact situation in everyday human words. Mention your vehicle year, ingredients, room dimensions, or what went wrong.",
      example: "...my 2016 Outback is throwing trouble code P0420 with a positive fuel trim..."
    },
    {
      rule: "Rule 3: Format (What to give back)",
      explanation: "Tell the AI exactly what shape you want the answer in: a 4-bullet checklist, a 2-sentence text message, or an itemized table with prices.",
      example: "...give me a prioritized 3-step inspection checklist before replacing parts."
    }
  ],
  samplePrompts: [
    {
      category: "Everyday Family",
      title: "Balanced Weekly Grocery Envelope",
      prompt: "Act as a family budget coach. My take-home pay is $2,850/month and fixed bills are $1,660. Give me a clear weekly grocery envelope and emergency cushion plan."
    },
    {
      category: "Skilled Trades",
      title: "Fair Customer Repair Estimate",
      prompt: "Act as an expert plumber. Write a clear, respectful 3-paragraph estimate explaining to a homeowner why upgrading to a tankless unit requires 3/4-inch gas venting."
    },
    {
      category: "Healthcare & Caregiving",
      title: "Plain-English Discharge Instructions",
      prompt: "Translate this clinical note into a warm, 6th-grade-reading-level home care plan for a patient with high blood pressure, highlighting when to call the clinic."
    },
    {
      category: "Frontier Systems",
      title: "Scaled Attention Softmax Math",
      prompt: "Explain why dividing by sqrt(d_k) in Scaled Dot-Product Attention prevents vanishing gradients, with a numerically stable NumPy implementation subtracting max."
    }
  ]
};
