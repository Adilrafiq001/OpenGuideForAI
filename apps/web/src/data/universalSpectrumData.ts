/**
 * Universal AI Fluency Spectrum Data
 * OpenGuide: For Everyone — From 0 AI Knowledge to Frontier AI Expert
 * 100% Client-Side • $0 Rule • Plain English Intuition
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
}

export interface UniversalProfile {
  id: string;
  tier: SpectrumTier;
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
  interactiveCodeSnippet?: string;
  recommendedTrack: string;
  trackUrl: string;
}

export const SPECTRUM_TIERS: SpectrumTierInfo[] = [
  {
    id: 'tier0',
    number: '0',
    title: 'Absolute Zero',
    shortTitle: 'Zero Knowledge',
    desc: 'No Prior Tech or AI Literacy',
    color: '#8b5cf6',
    tagline: 'Zero computer skills needed. 100% free. You cannot break anything.'
  },
  {
    id: 'tier1',
    number: '1',
    title: 'Trades & Everyday Life',
    shortTitle: 'Trades & Crafts',
    desc: 'Vocations, Crafts & Daily Work',
    color: '#ec4899',
    tagline: 'Hair stylists, cobblers, mechanics, plumbers, chefs, and shopkeepers.'
  },
  {
    id: 'tier2',
    number: '2',
    title: 'Knowledge & Services',
    shortTitle: 'Services & Edu',
    desc: 'Educators, Healthcare & Business',
    color: '#06b6d4',
    tagline: 'Teachers, nurses, accountants, lawyers, and farmers.'
  },
  {
    id: 'tier3',
    number: '3',
    title: 'Physical Engineers',
    shortTitle: 'Physical Eng',
    desc: 'Mechanical, Civil & Electrical',
    color: '#3b82f6',
    tagline: 'Thermal tolerances, beam deflection, and sensor telemetry.'
  },
  {
    id: 'tier4',
    number: '4',
    title: 'Software Builders',
    shortTitle: 'Software & Dev',
    desc: 'Developers & Systems Architects',
    color: '#10b981',
    tagline: 'In-browser WASM, local-first RAG, and testing invariants.'
  },
  {
    id: 'tier5',
    number: '5',
    title: 'Frontier AI Experts',
    shortTitle: 'Frontier AI',
    desc: 'Transformers & Research Math',
    color: '#f59e0b',
    tagline: 'QKV attention math, RoPE, KV caching, and WebGPU shaders.'
  }
];

export const ALL_SPECTRUM_PROFILES: UniversalProfile[] = [
  // ==========================================
  // TIER 0: ABSOLUTE ZERO (NO PRIOR TECH/AI KNOWLEDGE)
  // ==========================================
  {
    id: 'beginner',
    tier: 'tier0',
    title: 'Absolute Beginner (Zero Knowledge of AI)',
    badge: 'EVERYONE WELCOME',
    category: 'Universal Foundations',
    accent: '#8b5cf6',
    iconName: 'Compass',
    tagline: 'Zero coding background required. 100% free forever. You cannot break anything.',
    realWorldChallenge: 'You have never written code, don\'t understand technical jargon, and feel worried that AI is too complicated, dangerous, or requires expensive subscriptions.',
    plainEnglishSolution: 'AI is simply a fast, patient helper that has read millions of books and knows how to talk to humans in normal everyday words. You talk to it like a kind friend. You can ask for help with family budgets, letters to your boss, understanding doctor notes, or homework explanations.',
    promptExample: 'Explain how a refrigerator works using only simple kitchen words and zero confusing science terms.',
    simulatedOutput: 'Think of your refrigerator as a heat sponge. Inside the back walls, there is a special liquid flowing in tubes. This liquid soaks up all the warm air from inside your fridge, carries it outside to the back of the fridge, and dumps the heat into your kitchen. That is why the inside stays cold, and the back of your fridge feels warm!',
    interactiveCodeSnippet: `# Your very first line of code!
# Click 'Run Code' — Python runs 100% in your browser for $0
welcome_message = "Hello World! AI is for everyone."
print(welcome_message)`,
    recommendedTrack: 'Track 0: Absolute Zero (Start Here)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'family-budget',
    tier: 'tier0',
    title: 'Everyday Life & Family Helper',
    badge: 'DAILY LIVING',
    category: 'Universal Foundations',
    accent: '#a855f7',
    iconName: 'HeartHandshake',
    tagline: 'Save money, organize household schedules, and understand confusing bills.',
    realWorldChallenge: 'Struggling to figure out how much you can afford for groceries this week after rent and electric bills arrive with confusing rate surcharges.',
    plainEnglishSolution: 'AI acts as your private household bookkeeper. Paste your income and bills, and it organizes a clear weekly spending plan in plain language without judging you.',
    promptExample: 'Act as a kind family financial coach. My monthly take-home pay is $2,400. My rent is $1,100, electricity is $140, phone is $65, and bus pass is $90. How much money do I have left for groceries and emergencies each week?',
    simulatedOutput: 'Here is your clear weekly breakdown:\n\n1. Fixed Monthly Bills: $1,395 (Rent, Power, Phone, Bus)\n2. Money Left for the Month: $1,005\n3. Weekly Budget (4.3 weeks): Roughly $233 per week\n\nSuggested Plan per Week:\n• Groceries & Essentials: $150/week\n• Emergency Savings Cushion: $50/week\n• Personal / Miscellaneous: $33/week',
    interactiveCodeSnippet: `# Weekly Family Budget Calculator
income = 2400.00
fixed_bills = 1100.00 + 140.00 + 65.00 + 90.00
remaining = income - fixed_bills
weekly_allowance = remaining / 4.33

print(f"Monthly Bills: \${fixed_bills:.2f}")
print(f"Remaining:     \${remaining:.2f}")
print(f"Weekly Budget: \${weekly_allowance:.2f}/week")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Math)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'senior',
    tier: 'tier0',
    title: 'Senior & Lifelong Learner',
    badge: 'ACCESSIBLE & SAFE',
    category: 'Universal Foundations',
    accent: '#8b5cf6',
    iconName: 'ShieldCheck',
    tagline: 'Spot scam messages, write heartfelt family letters, and learn at your own comfortable pace.',
    realWorldChallenge: 'Receiving suspicious text messages claiming a package is delayed, or feeling left behind by fast modern tech vocabulary.',
    plainEnglishSolution: 'AI acts as your patient digital grandchild. It reads suspicious messages to explain if they are scams, formats clear emails, and never gets impatient when you ask questions twice.',
    promptExample: 'Is this message a scam? "USPS: Your package has an incorrect zip code. Click this link within 12 hours or pay $3 penalty."',
    simulatedOutput: 'YES, this is a 100% scam! Here is why: The official postal service never texts you with urgent 12-hour threats or asks for random $3 fees via text links. Do NOT click the link. Simply delete the text.',
    interactiveCodeSnippet: `# Safe Message Checking Assistant
message = "USPS: Click link to verify zip code or pay $3"
is_suspicious = "Click link" in message or "pay" in message

print("Analyzing incoming text...")
if is_suspicious:
    print("WARNING: This looks like a scam message! Do not click links.")
else:
    print("Message appears safe.")`,
    recommendedTrack: 'Track 0: Absolute Zero (Start Here)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'student',
    tier: 'tier0',
    title: 'Student & Homework Concept Learner',
    badge: 'SOCRATIC INTUITION',
    category: 'Universal Foundations',
    accent: '#a855f7',
    iconName: 'BookOpen',
    tagline: 'Understand difficult science and math concepts through vivid real-life analogies, not rote memorization.',
    realWorldChallenge: 'Stuck on abstract textbook definitions like photosynthesis or gravity without understanding what is actually happening physically.',
    plainEnglishSolution: 'AI uses the Socratic method to give you intuitive analogies using pizza slices, kitchen recipes, and sports rather than dry mathematical jargon.',
    promptExample: 'Explain photosynthesis using the analogy of a solar-powered bakery making sugar cakes.',
    simulatedOutput: 'Think of a leaf as a tiny green bakery:\\n1. Sunlight is the solar electricity powering the oven.\\n2. Water from roots is the dough liquid.\\n3. Carbon dioxide from the air is the flour.\\n4. Glucose (sugar) is the freshly baked cake the plant eats.\\n5. Oxygen is the clean steam released out the bakery window for us to breathe!',
    interactiveCodeSnippet: `# Photosynthesis Recipe Model
sunlight_hours = 6
water_cups = 2
energy_created = sunlight_hours * water_cups * 10

print(f"Sunlight: {sunlight_hours} hrs | Water: {water_cups} cups")
print(f"Energy produced for plant: {energy_created} Joules")`,
    recommendedTrack: 'Track 0: Absolute Zero (Conditionals & Loops)',
    trackUrl: '/track/0/intro'
  },

  // ==========================================
  // TIER 1: EVERYDAY VOCATIONS & REAL-WORLD TRADES
  // ==========================================
  {
    id: 'salon',
    tier: 'tier1',
    title: 'Hair Salon Stylist & Barber',
    badge: 'BEAUTY & WELLNESS',
    category: 'Trades & Physical Crafts',
    accent: '#ec4899',
    iconName: 'Scissors',
    tagline: 'Save 5+ hours a week on client reminders, service profit margins, and consultations.',
    realWorldChallenge: 'Juggling appointment books, calculating how much product (color tubes & developer) each client uses, and keeping Google reviews high while standing on your feet all day.',
    plainEnglishSolution: 'AI acts as your free front-desk receptionist and business calculator. You can ask it to draft warm, polite SMS reminders that reduce no-shows, calculate exact treatment profit margins, and generate customized hair aftercare instructions.',
    promptExample: 'Act as a boutique hair salon manager. Write a warm 2-sentence SMS reminder for my client Sarah coming tomorrow at 2 PM for a full foil balayage. Remind her to allow 3 hours, arrive with clean dry hair, and wear a button-down shirt.',
    simulatedOutput: 'Hi Sarah! Just a warm reminder from the salon: your full foil balayage appointment is tomorrow at 2:00 PM. Please allow around 3 hours, arrive with clean, dry hair, and wear a comfortable button-down shirt so you don\'t mess up your fresh style when changing. We can\'t wait to see you!',
    interactiveCodeSnippet: `# Salon Treatment Profit Margin Calculator
tube_cost = 12.00       # Premium color tube
developer_cost = 2.50   # 20-volume developer
foils_and_gloves = 3.50 # Sundries & disposables
service_charge = 150.00 # Client fee

total_cost = tube_cost + developer_cost + foils_and_gloves
net_profit = service_charge - total_cost
margin_pct = (net_profit / service_charge) * 100

print(f"Product Cost: \${total_cost:.2f}")
print(f"Net Profit:   \${net_profit:.2f} ({margin_pct:.1f}% margin)")`,
    recommendedTrack: 'Track 0: Absolute Zero (Variables & Math)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'cobbler',
    tier: 'tier1',
    title: 'Cobbler & Leather Craftsman',
    badge: 'TRADITIONAL TRADES',
    category: 'Trades & Physical Crafts',
    accent: '#d97706',
    iconName: 'Hammer',
    tagline: 'Master adhesive cure times, fair repair pricing, and custom customer care slips.',
    realWorldChallenge: 'Working with physical materials—leather, rubber, welt stitching, and adhesives. Explaining why a Goodyear welt resole costs $120 or ensuring Barge cement adheres to oily pull-up leather takes time and research.',
    plainEnglishSolution: 'AI functions like an encyclopedia in your workshop. You can ask about chemical solvent cure times, calculate labor rates so you never undercharge, and print customized care slips to put inside finished boots.',
    promptExample: 'Act as a master shoe repair technician. I am resoling a pair of Red Wing boots with oily full-grain leather and Vibram 430 rubber half-soles. Explain the exact surface preparation, scuffing grit, and open drying time needed before applying neoprene contact cement so the sole never peels.',
    simulatedOutput: '1. Surface Prep: Deglaze the leather bonding area with acetone to strip surface oils.\n2. Mechanical Scuff: Sand both the leather midsole and Vibram rubber with 36-grit paper in a crosshatch pattern to create physical tooth.\n3. Cement Application: Apply a thin, even coat of Barge all-purpose contact cement to both surfaces. Allow 15-20 minutes open tack time until glossy and dry to the touch (not wet).\n4. Bond & Hammer: Align precisely and hammer firmly from center to edges with a shoemaker\'s hammer, then press on a 5-in-1 press at 40 PSI.',
    interactiveCodeSnippet: `# Bespoke Shoe Repair Fair Quote Calculator
soles_and_heels = 24.00 # Vibram sole & heel units
cork_and_thread = 4.50  # Welt thread & filler
hours_labor = 2.25      # Hand de-stitching, stitching, finishing
hourly_rate = 45.00     # Fair master craft rate
overhead = 12.00        # Shop utilities & machinery amort.

quote = soles_and_heels + cork_and_thread + (hours_labor * hourly_rate) + overhead
print(f"Fair Customer Quote: \${quote:.2f}")`,
    recommendedTrack: 'Track 0: Absolute Zero (Conditionals & Calculations)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'mechanic',
    tier: 'tier1',
    title: 'Auto Mechanic & Shop Technician',
    badge: 'AUTOMOTIVE REPAIR',
    category: 'Trades & Physical Crafts',
    accent: '#ea580c',
    iconName: 'Wrench',
    tagline: 'Diagnose OBD-II diagnostic fault codes, write clear customer estimates, and verify torque specs.',
    realWorldChallenge: 'Explaining complex engine misfires or suspension wear to customers without sounding like you are overcharging, while tracking shop book time.',
    plainEnglishSolution: 'AI translates cryptic P0300 diagnostic trouble codes into clear diagnostic checklists and drafts honest, transparent customer estimates.',
    promptExample: 'Act as an ASE-certified master automotive technician. A customer brings in a 2015 Honda Accord throwing error code P0420 (Catalyst System Efficiency Below Threshold). Explain the top 3 potential root causes beyond just replacing the expensive catalytic converter, written in plain language a car owner can trust.',
    simulatedOutput: 'Before spending $1,200 on a new catalytic converter, here are the 3 most common culprits:\n\n1. Downstream Oxygen Sensor (O2): The sensor itself may be reading lazily or coated in carbon soot, giving false signals.\n2. Exhaust Leak Ahead of Converter: A tiny crack in the flex pipe draws in outside air, tricking the computer into thinking the converter has failed.\n3. Engine Oil or Coolant Burning: Leaking valve seals or head gaskets contaminate the exhaust gas.',
    interactiveCodeSnippet: `# Automotive Repair Labor & Parts Estimator
parts_cost = 145.00     # O2 sensor + gasket
book_hours = 1.5        # AllData / Mitchell book time
shop_labor_rate = 120.00
shop_supplies = 18.00

subtotal = parts_cost + (book_hours * shop_labor_rate) + shop_supplies
tax = subtotal * 0.08
total_estimate = subtotal + tax
print(f"Itemized Estimate: \${total_estimate:.2f} (Tax incl.)")`,
    recommendedTrack: 'Track 0: Absolute Zero (Logic & Numbers)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'plumber',
    tier: 'tier1',
    title: 'Plumber & Pipefitter',
    badge: 'MECHANICAL TRADES',
    category: 'Trades & Physical Crafts',
    accent: '#f97316',
    iconName: 'Wrench',
    tagline: 'Draft customer estimates, verify pipe volumes, and explain code requirements.',
    realWorldChallenge: 'Translating complex building codes and explaining why emergency repairs cost what they do to frustrated homeowners.',
    plainEnglishSolution: 'AI acts as your professional estimator and code assistant. Generate itemized customer quotes that build trust and verify physical flow rate formulas instantly.',
    promptExample: 'Act as a master residential plumbing contractor. Write a clear, respectful 3-paragraph estimate explaining to a homeowner why replacing a corroded 50-gallon water heater with a tankless unit costs $2,800, highlighting energy savings and code-compliant venting.',
    simulatedOutput: 'Thank you for consulting us regarding your hot water system. Below is our itemized review of the proposed tankless upgrade...\n\n1. Scope: Safe decommissioning and code disposal of the failing 50-gallon tank.\n2. Installation: High-efficiency condensing unit with dedicated category IV stainless venting and gas line sizing.\n3. Long-Term Value: Tankless systems eliminate continuous standby heating loss, cutting your annual heating bill by roughly 25-30% while delivering endless hot water.',
    recommendedTrack: 'Track 0: Absolute Zero (Data Types & Logic)',
    trackUrl: '/track/0/intro'
  },
  {
    id: 'chef',
    tier: 'tier1',
    title: 'Chef, Baker & Food Craft',
    badge: 'CULINARY ARTS',
    category: 'Trades & Physical Crafts',
    accent: '#ef4444',
    iconName: 'UtensilsCrossed',
    tagline: 'Scale recipes accurately, control food waste costs, and craft seasonal menus.',
    realWorldChallenge: 'Scaling recipes from 4 servings to 120 guests without throwing off salt ratios, and calculating food costs per plate to protect margins.',
    plainEnglishSolution: 'AI functions as your kitchen prep manager. Scale ingredient bakers\' percentages, suggest dietary substitutions (gluten-free, vegan), and compute food cost targets.',
    promptExample: 'Act as an executive pastry chef. I have a sourdough brioche recipe for 2 loaves (500g flour, 65% hydration, 40% butter, 20% starter, 2% salt). Scale all ingredient quantities in exact grams for a 48-loaf batch.',
    simulatedOutput: 'Bakers Percentages Scaled for 48 Loaves (Total Flour: 12,000g / 12kg):\n\n• Bread Flour (100%): 12,000 g\n• Water / Milk (65%): 7,800 g\n• Unsalted Butter (40%): 4,800 g\n• Active Sourdough Starter (20%): 2,400 g\n• Fine Sea Salt (2%): 240 g\n• Whole Eggs (roughly 30%): 3,600 g (approx. 72 large eggs)',
    recommendedTrack: 'Track 0: Absolute Zero (Functions & Loops)',
    trackUrl: '/track/0/intro'
  },

  // ==========================================
  // TIER 2: KNOWLEDGE WORKERS & EDUCATORS
  // ==========================================
  {
    id: 'teacher',
    tier: 'tier2',
    title: 'Teacher, Educator & Professor',
    badge: 'EDUCATION',
    category: 'Knowledge Workers',
    accent: '#06b6d4',
    iconName: 'GraduationCap',
    tagline: 'Design adaptive lesson plans, differentiated worksheets, and rubric evaluations in minutes.',
    realWorldChallenge: 'Spending nights and weekends grading, drafting individualized education plans (IEPs), and adapting one lesson for mixed student reading levels.',
    plainEnglishSolution: 'AI serves as a tireless teaching assistant. It can rewrite a historical text at 3 different reading levels, generate rubric criteria, and craft interactive discussion prompts.',
    promptExample: 'Act as a high school science teacher. Create a 45-minute lesson plan introducing photosynthesis to 9th graders, including a 5-minute hands-on hook activity, 3 check-for-understanding questions, and an exit ticket.',
    simulatedOutput: 'Lesson Plan: How Plants Trap Sunlight (Photosynthesis)\n\n1. Hook (5 min): The Underwater Leaf Demo. Submerge a fresh spinach leaf in baking soda water under a bright lamp; have students observe oxygen bubbles forming.\n2. Guided Inquiry (20 min): Connect Sunlight + Water + CO2 -> Glucose + O2. Emphasize that plants make their own food, not "absorb" food.\n3. Checks for Understanding: What molecule provides the carbon in sugar? Why did bubbles appear under the light?\n4. Exit Ticket: Explain in 2 sentences why humans depend on plant chloroplasts to breathe.',
    recommendedTrack: 'Track 1: Vector Spaces & Document Chunking',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'healthcare',
    tier: 'tier2',
    title: 'Nurse & Healthcare Professional',
    badge: 'HEALTHCARE',
    category: 'Knowledge Workers',
    accent: '#0ea5e9',
    iconName: 'Stethoscope',
    tagline: 'Translate medical jargon into plain patient instructions and organize discharge summaries.',
    realWorldChallenge: 'Patients leaving the clinic overwhelmed by medical terms, medication schedules, and post-procedure wound care instructions.',
    plainEnglishSolution: 'AI translates dense clinical notes into warm, compassionate, 6th-grade-reading-level instructions that families can actually follow at home.',
    promptExample: 'Translate this clinical discharge note into clear, empathetic bullet points for an elderly patient with mild hypertension: "Patient prescribed amlodipine 5mg PO daily. Monitor for peripheral edema. Limit sodium intake <2g/day. Follow up in 14 days."',
    simulatedOutput: 'Dear Mr. Thompson, here is your simple guide to staying healthy at home:\n\n1. Your Daily Blood Pressure Pill: Take 1 tablet of Amlodipine (5mg) each morning with water.\n2. Watch Your Ankles: Check your feet and ankles daily. If you notice any puffy swelling, give our clinic a call.\n3. Eating Healthy: Avoid salty foods, canned soups, and salty snacks. Use herbs and lemon to flavor your food instead.\n4. Follow-Up: We look forward to seeing you for a quick check in two weeks.',
    recommendedTrack: 'Track 1: Vector Spaces & Retrieval',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'accountant',
    tier: 'tier2',
    title: 'Accountant & Financial Auditor',
    badge: 'FINANCIAL SERVICES',
    category: 'Knowledge Workers',
    accent: '#14b8a6',
    iconName: 'Calculator',
    tagline: 'Spot variance anomalies, summarize tax code changes, and draft audit memos.',
    realWorldChallenge: 'Combing through thousands of line items in spreadsheets to explain budget variances and verifying deductions against evolving tax codes.',
    plainEnglishSolution: 'AI writes Python data validation scripts, summarizes tax compliance requirements, and formats executive financial variance summaries.',
    promptExample: 'Act as a senior CPA. Write a concise executive memo explaining a 14% unfavorable variance in operating expenses for Q2, categorizing drivers into fixed overhead, variable labor, and supply chain inflation.',
    simulatedOutput: 'MEMORANDUM\nTo: Executive Board\nFrom: Financial Controller\nSubject: Q2 Operating Expense Variance Analysis (+14% vs Budget)\n\nKey Variance Drivers:\n1. Labor Cost Surge (+8.2%): Overtime premiums during facility expansion.\n2. Raw Material Freight (+4.1%): Fuel surcharge adjustments across sea freight lanes.\n3. Unplanned Maintenance (+1.7%): Emergency boiler repairs in May.',
    interactiveCodeSnippet: `# Financial Variance Calculator
budget = 250000.00
actual = 285000.00
variance = actual - budget
variance_pct = (variance / budget) * 100

status = "UNFAVORABLE" if variance > 0 else "FAVORABLE"
print(f"Variance: \${variance:+,.2f} ({variance_pct:+.2f}%) [{status}]")`,
    recommendedTrack: 'Track 1: Vector Spaces & Numerical Data',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'farmer',
    tier: 'tier2',
    title: 'Farmer & Agricultural Producer',
    badge: 'AGRICULTURE',
    category: 'Knowledge Workers',
    accent: '#84cc16',
    iconName: 'Wheat',
    tagline: 'Optimize crop rotation cycles, soil amendment ratios, and weather contingency plans.',
    realWorldChallenge: 'Balancing soil nitrogen depletion, managing pest pressures across growing seasons, and calculating fertilizer costs per acre.',
    plainEnglishSolution: 'AI helps design multi-season crop rotation plans, calculate nutrient application rates, and draft contingency action plans for drought or frost.',
    promptExample: 'Act as an agronomist. Recommend a 4-year crop rotation schedule for a 150-acre farm with clay loam soil aiming to rebuild organic matter and minimize synthetic nitrogen inputs.',
    simulatedOutput: '4-Year Sustainable Crop Rotation Schedule:\n\n• Year 1 (Heavy Feeder): Corn (incorporate winter rye cover crop post-harvest).\n• Year 2 (Nitrogen Fixer): Soybeans / Field Peas (nodulating bacteria naturally fix atmospheric N).\n• Year 3 (Light Feeder): Winter Wheat (protects soil structure over winter).\n• Year 4 (Soil Restorer): Mixed Red Clover & Alfalfa (deep taproots scavenge nutrients; mow as green manure).',
    recommendedTrack: 'Track 0: Absolute Zero (Problem Solving)',
    trackUrl: '/track/0/intro'
  },

  // ==========================================
  // TIER 3: PHYSICAL & CLASSICAL ENGINEERS
  // ==========================================
  {
    id: 'mechanical',
    tier: 'tier3',
    title: 'Mechanical & Physical Engineer',
    badge: 'PHYSICAL ENGINEERING',
    category: 'Physical & Classical Engineers',
    accent: '#3b82f6',
    iconName: 'Cog',
    tagline: 'Automate sensor CSV telemetry, verify thermal tolerances, and check ASTM specs.',
    realWorldChallenge: 'Sanity-checking beam deflection, verifying thermal expansion of machined shafts, and parsing thousands of rows of noisy accelerometer CSV logs.',
    plainEnglishSolution: 'AI eliminates boilerplate calculation time. Ask it to write instant NumPy data parsers, verify thermodynamic formulas, and summarize ASTM machining standards in seconds.',
    promptExample: 'Act as a senior mechanical engineer. Write a concise Python script using NumPy to calculate the thermal expansion delta L of a 750mm 304 Stainless Steel shaft heated from 22°C to 180°C with thermal expansion coefficient alpha = 17.3e-6 /°C.',
    simulatedOutput: 'Using the thermal expansion equation:\nΔL = α · L₀ · ΔT\n\n• Initial Length L₀ = 750 mm\n• Temperature Rise ΔT = 180°C - 22°C = 158°C\n• Linear Expansion Coefficient α = 1.73 × 10⁻⁵ /°C\n\nCalculation:\nΔL = (1.73 × 10⁻⁵) × 750 × 158 = 2.050 mm\nFinal Length = 752.050 mm.',
    interactiveCodeSnippet: `import numpy as np

# Thermal Expansion: delta_L = alpha * L_0 * delta_T
L_0 = 750.0       # mm (nominal length)
alpha = 17.3e-6   # 1/°C (304 Stainless Steel)
T_init = 22.0     # °C (ambient)
T_hot = 180.0     # °C (operating)

delta_T = T_hot - T_init
delta_L = alpha * L_0 * delta_T
print(f"Delta T:    {delta_T:.1f} °C")
print(f"Growth:     {delta_L:.4f} mm")
print(f"Hot Length: {L_0 + delta_L:.4f} mm")`,
    recommendedTrack: 'Track 1: Vector Spaces & NumPy Math',
    trackUrl: '/track/1/intro'
  },
  {
    id: 'civil',
    tier: 'tier3',
    title: 'Civil & Structural Engineer',
    badge: 'INFRASTRUCTURE',
    category: 'Physical & Classical Engineers',
    accent: '#2563eb',
    iconName: 'Building',
    tagline: 'Verify concrete compressive curing models, beam bending moment diagrams, and shear stress.',
    realWorldChallenge: 'Verifying Eurocode / ACI beam load capacities under combined dead and live loads while checking deflection limits.',
    plainEnglishSolution: 'AI helps write Python calculation checks, verifies maximum bending moments M = wL²/8, and sanity-checks structural safety factors.',
    promptExample: 'Act as a licensed structural engineer. Write a Python script to compute the maximum bending moment and maximum deflection for a simply supported steel W8x24 beam under a uniform load w = 1.2 kip/ft over span L = 20 ft.',
    simulatedOutput: 'Structural Formulas:\n• Max Bending Moment: M_max = (w · L²) / 8\n• Max Deflection: Δ_max = (5 · w · L⁴) / (384 · E · I)\n\nFor w = 1.2 kip/ft, L = 20 ft:\n• M_max = 1.2 · 400 / 8 = 60.0 kip-ft = 720 kip-in.',
    interactiveCodeSnippet: `# Simply Supported Beam Maximum Bending Moment
w = 1.2   # kip/ft (distributed load)
L = 20.0  # ft (span)

M_max = (w * (L ** 2)) / 8.0
print(f"Max Moment: {M_max:.2f} kip-ft ({M_max * 12:.1f} kip-in)")`,
    recommendedTrack: 'Track 1: Vector Spaces & NumPy Math',
    trackUrl: '/track/1/intro'
  },

  // ==========================================
  // TIER 4: SOFTWARE BUILDERS & DEVELOPERS
  // ==========================================
  {
    id: 'software',
    tier: 'tier4',
    title: 'Software & Systems Engineer',
    badge: 'SYSTEMS ARCHITECTURE',
    category: 'Software Developers',
    accent: '#10b981',
    iconName: 'Code2',
    tagline: 'Generate invariant test suites, build local-first systems, and master tensor architectures.',
    realWorldChallenge: 'Building high-performance, resilient systems without getting trapped in expensive $20/month SaaS subscriptions or black-box API dependencies.',
    plainEnglishSolution: 'AI serves as your pair programmer for testing invariants, refactoring legacy code, and architecting local-first client-side systems (Pyodide WebAssembly, Web Workers, IndexedDB) adhering to the $0 Rule.',
    promptExample: 'Write a client-side TypeScript Web Worker manager with a 15-second watchdog timer that safely terminates runaway Python loops and respawns the worker cleanly.',
    simulatedOutput: 'class WorkerWatchdog {\n  private worker: Worker | null = null;\n  private timer: number | null = null;\n\n  execute(code: string, timeoutMs = 15000): Promise<string> {\n    return new Promise((resolve, reject) => {\n      this.timer = window.setTimeout(() => {\n        this.worker?.terminate();\n        this.initWorker();\n        reject(new Error("Worker timed out after 15s"));\n      }, timeoutMs);\n      // ...\n    });\n  }\n}',
    interactiveCodeSnippet: `# Invariant Verification Pattern
def safe_vector_normalize(v):
    norm = sum(x**2 for x in v) ** 0.5
    assert norm > 0, "Cannot normalize zero-vector"
    unit_v = [x / norm for x in v]
    unit_mag = sum(x**2 for x in unit_v) ** 0.5
    assert abs(unit_mag - 1.0) < 1e-6, "Unit vector invariant violated"
    return unit_v

print("Unit vector:", safe_vector_normalize([3.0, 4.0]))`,
    recommendedTrack: 'Track 2: RAG & Autonomous Agents',
    trackUrl: '/track/2/intro'
  },

  // ==========================================
  // TIER 5: FRONTIER AI EXPERTS & ML RESEARCHERS
  // ==========================================
  {
    id: 'ai-expert',
    tier: 'tier5',
    title: 'Frontier AI Researcher & ML Specialist',
    badge: 'FRONTIER INTELLIGENCE',
    category: 'AI & Machine Learning Researchers',
    accent: '#f59e0b',
    iconName: 'BrainCircuit',
    tagline: 'Master QKV attention softmax, RoPE, KV caching, LoRA, and WebGPU WGSL shaders from scratch.',
    realWorldChallenge: 'Understanding frontier transformer mechanics down to numerical stability, memory footprints (KV cache bytes per token), and hardware kernel optimization without high cloud training costs.',
    plainEnglishSolution: 'OpenGuide lets you implement every single frontier concept—from causal masking to LoRA rank decomposition—directly in raw NumPy and client-side WebGPU compute shaders adhering to the $0 Rule.',
    promptExample: 'Explain why dividing by sqrt(d_k) in Scaled Dot-Product Attention prevents Softmax gradients from vanishing, and write a numerically stable NumPy implementation.',
    simulatedOutput: 'Mathematical Basis:\nWhen Query and Key vectors have components drawn from N(0, 1), their dot product has mean 0 and variance d_k. For large d_k (e.g. 64 or 128), large dot products push the Softmax function into regions with near-zero gradients.\n\nDividing by sqrt(d_k) normalizes variance back to 1.0, preserving gradient flow during backpropagation.',
    interactiveCodeSnippet: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = (Q @ K.T) / np.sqrt(d_k)
    # Numerically stable softmax: subtract max along last axis
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    return weights @ V

Q = np.random.randn(4, 16)
K = np.random.randn(4, 16)
V = np.random.randn(4, 16)
output = scaled_dot_product_attention(Q, K, V)
print(f"Output Matrix Shape: {output.shape} (Stable Attention Computed)")`,
    recommendedTrack: 'Track 4: Frontier Intelligence (Transformer Internals)',
    trackUrl: '/track/4/intro'
  }
];

export const LLM_PLAIN_ENGLISH_GUIDE = {
  headline: "You Are an LLM: How Anyone Can Use Me in the Simplest Way",
  subtitle: "No computer degree needed. No complicated jargon. Just 3 simple rules.",
  whatIsAnLlm: "Think of me as a super-fast apprentice who has read millions of books, manuals, and conversations. I don't have emotions or feelings—I predict the most helpful next words to solve your dilemma based on patterns.",
  threeGoldenRules: [
    {
      rule: "Rule 1: Role (Who to be)",
      explanation: "Tell me who to act as. If you need help fixing a sink, say 'Act as an experienced plumber'. If you need help with a family budget, say 'Act as a kind budget coach'.",
      example: "Act as an expert hair salon manager..."
    },
    {
      rule: "Rule 2: Context (What you have)",
      explanation: "Tell me your exact situation in everyday words. Mention your ingredients, materials, or what went wrong.",
      example: "...my client is coming tomorrow at 2 PM for a full foil balayage..."
    },
    {
      rule: "Rule 3: Format (What to give)",
      explanation: "Tell me exactly how you want the answer back: a 3-sentence text message, a bullet checklist, or a simple recipe.",
      example: "...write a warm 2-sentence SMS reminder with pre-care instructions."
    }
  ],
  samplePrompts: [
    {
      category: "Everyday Life",
      title: "Pantry Dinner from Leftovers",
      prompt: "Act as an inventive home chef. I have 2 eggs, leftover white rice, soy sauce, and frozen peas in my kitchen. Give me a 3-step dinner recipe that takes under 10 minutes."
    },
    {
      category: "Trades & Crafts",
      title: "Salon Client Appointment SMS",
      prompt: "Act as a friendly salon manager. Write a polite 2-sentence SMS reminder for my client Sarah coming tomorrow at 2 PM for highlights, reminding her to allow 3 hours and wear a button-down shirt."
    },
    {
      category: "Physical Engineering",
      title: "Stainless Shaft Thermal Expansion",
      prompt: "Act as a mechanical engineer. Write a Python snippet calculating the thermal expansion of a 750mm 304 Stainless Steel shaft heated from 22°C to 180°C with alpha = 17.3e-6 /°C."
    },
    {
      category: "Frontier AI",
      title: "Scaled Dot-Product Attention Softmax",
      prompt: "Explain why dividing by sqrt(d_k) in Attention prevents vanishing gradients, and provide a numerically stable NumPy implementation subtracting max(scores)."
    }
  ]
};
