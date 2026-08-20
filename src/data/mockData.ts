import { MarketCommodity, IoTSensorZone, GovScheme, FarmProfile, FarmActivityLog } from '../types';

export const INITIAL_FARM_PROFILE: FarmProfile = {
  farmerName: 'Ramesh Patel',
  farmName: 'Annapurna Green Agri-Estates',
  location: 'Nashik, Maharashtra, India',
  totalAcreage: 12.5,
  primaryCrops: ['Tomato (Hybrid)', 'Paddy / Rice (Basmati)', 'Cotton (Bt-II)', 'Wheat (Sharbati)'],
  soilType: 'Medium Black Loamy Soil (Clay Loam)',
  irrigationType: 'Solar Drip Irrigation & Micro-Sprinkler',
  currency: '₹',
};

export const SAMPLE_DISEASE_PRESETS = [
  {
    title: 'Tomato Early Blight (Alternaria solani)',
    crop: 'Tomato',
    symptoms: 'Concentric dark brown rings on lower leaves, yellow chlorotic halos around lesions, premature leaf drop, and sunken dark fruit rot.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    imageThumb: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&auto=format&fit=crop&q=80',
    sampleDiagnosis: {
      cropIdentified: 'Tomato (Solanum lycopersicum)',
      diseaseName: 'Early Blight (Alternaria solani)',
      scientificName: 'Alternaria solani',
      confidenceScore: 96,
      severity: 'Moderate' as const,
      affectedPart: 'Leaves & Lower Stems',
      primaryCause: 'Fungal pathogen triggered by alternating dry and warm humid periods with heavy morning dew.',
      favorableConditions: 'Temperatures between 24°C–29°C and relative humidity exceeding 80%.',
      organicRemedies: [
        'Apply 1% Bordeaux mixture or copper oxychloride (3g/liter) at 10-day intervals.',
        'Foliar spray of Trichoderma harzianum bio-fungicide (5g/L) mixed in fermented jaggery water.',
        'Spray cow urine extract fermented with neem leaves (10% solution) on foliage.',
        'Mulch heavily around base with straw to stop fungal soil spores from splashing onto foliage during rain.'
      ],
      chemicalRemedies: [
        'Mancozeb 75% WP @ 2.5g per liter of water (Basal preventative spray).',
        'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml per liter of water during active spread.',
        'Ensure 7-day pre-harvest withholding safety interval after systemic fungicide sprays.'
      ],
      preventativeMeasures: [
        'Practice 3-year crop rotation avoiding Solanaceae crops (potatoes, eggplants, peppers).',
        'Use certified disease-resistant hybrid cultivars (e.g., Arka Rakshak, Pusa Rohini).',
        'Adopt drip irrigation rather than overhead sprinklers to keep canopy dry.',
        'Prune lower foliage (bottom 25cm) to improve airflow.'
      ],
      irrigationAdvice: 'Switch strictly to sub-surface drip in early morning. Avoid late-evening waterings.',
      summaryAdvice: 'Early Blight is actively manageable at this stage. Immediate pruning of affected lower leaves combined with bio-fungicide foliar spray will prevent spread to ripening fruit clusters.'
    }
  },
  {
    title: 'Paddy / Rice Bacterial Leaf Blight (Xanthomonas oryzae)',
    crop: 'Paddy / Rice',
    symptoms: 'Water-soaked wavy yellowish-orange stripes starting from leaf tips and margins, drying into pale straw-colored streaks, milky bacterial ooze droplets during humid mornings.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    imageThumb: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    sampleDiagnosis: {
      cropIdentified: 'Paddy / Rice (Oryza sativa)',
      diseaseName: 'Bacterial Leaf Blight (BLB)',
      scientificName: 'Xanthomonas oryzae pv. oryzae',
      confidenceScore: 94,
      severity: 'Severe' as const,
      affectedPart: 'Leaves and Flag Leaf Canopy',
      primaryCause: 'Bacterial infection spread through irrigation water, strong winds, and excessive nitrogenous fertilizer application.',
      favorableConditions: 'Warm temperatures (25-34°C) with continuous rainy spells and high humidity >70%.',
      organicRemedies: [
        'Spray Fresh Cow Dung Extract (20kg raw dung mixed in 100L water, filtered and mixed with 500g lime).',
        'Apply Pseudomonas fluorescens (10g/L) during tillering stage as protective spray.',
        'Drain standing field water for 48 hours to aerate the soil root zone.'
      ],
      chemicalRemedies: [
        'Streptocycline (9% Streptomycin + 1% Tetracycline) @ 6g + Copper Oxychloride 50 WP @ 500g in 200 Liters of water per acre.',
        'Plantomycin (antibiotic) @ 1g/liter of water applied at early tillering.'
      ],
      preventativeMeasures: [
        'Avoid excessive top-dressing of Urea. Split Nitrogen into 3-4 micro-doses instead.',
        'Apply additional Potassium (MOP @ 15-20 kg/acre) to strengthen cell walls against bacteria.',
        'Seed treatment with Streptocycline 0.01% solution for 8 hours prior to nursery sowing.'
      ],
      irrigationAdvice: 'Drain standing water completely for 2-3 days to break bacterial multiplication in stagnant water.',
      summaryAdvice: 'Immediately halt all synthetic nitrogen fertilizers. Drain excess standing field water and spray bactericide combination with Copper Oxychloride early morning.'
    }
  },
  {
    title: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly',
    crop: 'Cotton',
    symptoms: 'Upward/downward leaf curling, thickening of veins, leaf enations (leaf-like outgrowths on underside), stunted plant growth, whitefly swarms under leaves.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    imageThumb: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=400&auto=format&fit=crop&q=80',
    sampleDiagnosis: {
      cropIdentified: 'Cotton (Gossypium hirsutum)',
      diseaseName: 'Cotton Leaf Curl Geminivirus (Vector: Whitefly Bemisia tabaci)',
      scientificName: 'Begomovirus / Bemisia tabaci',
      confidenceScore: 91,
      severity: 'Critical' as const,
      affectedPart: 'Apical leaves and terminal shoots',
      primaryCause: 'Viral transmission vectored by dense whitefly nymph and adult populations.',
      favorableConditions: 'Hot and dry conditions with high whitefly reproduction rates.',
      organicRemedies: [
        'Install 25 yellow sticky traps per acre at crop canopy level to mass-trap adult whiteflies.',
        'Spray Neem Oil (Azadirachtin 10000 ppm) @ 2ml/liter + soap emulsifier.',
        'Foliar spray of Verticillium lecanii bio-entomopathogenic fungus @ 5g/liter.'
      ],
      chemicalRemedies: [
        'Diafenthiuron 50% WP @ 250g/acre or Pyriproxyfen 10% + Clothianidin @ 400ml/acre.',
        'Alternate with Afidopyropen 50 g/L DC @ 400ml/acre for quick knockdown.'
      ],
      preventativeMeasures: [
        'Eradicate weed hosts (Abutilon, Sida, Parthenium) on field bunds and borders.',
        'Grow barrier crops like maize, pearl millet, or sorghum in 4-6 border rows around cotton.',
        'Maintain clean field edges free from alternative weed hosts.'
      ],
      irrigationAdvice: 'Maintain uniform soil moisture; avoid water stress which triggers whitefly outbreak explosions.',
      summaryAdvice: 'Whitefly vector control is the urgent priority. Deploy yellow sticky traps immediately and execute targeted spray to protect boll formation.'
    }
  },
  {
    title: 'Wheat Yellow / Stripe Rust (Puccinia striiformis)',
    crop: 'Wheat',
    symptoms: 'Linear yellow/orange stripes of powdery pustules arranged parallel along leaf veins, bright yellow spores rubbing off onto fingers when touched.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    imageThumb: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
    sampleDiagnosis: {
      cropIdentified: 'Wheat (Triticum aestivum)',
      diseaseName: 'Yellow / Stripe Rust (Puccinia striiformis)',
      scientificName: 'Puccinia striiformis f. sp. tritici',
      confidenceScore: 97,
      severity: 'Severe' as const,
      affectedPart: 'Upper foliage and flag leaves',
      primaryCause: 'Airborne fungal spores thriving in cool, damp winter climates.',
      favorableConditions: 'Cool temperatures (9°C–18°C) with intermittent rain and fog.',
      organicRemedies: [
        'Foliar spray of 2% fermented buttermilk (sour lassi) mixed with crushed garlic extract.',
        'Application of bio-agent Bacillus subtilis formulation @ 5g/L water.'
      ],
      chemicalRemedies: [
        'Propiconazole 25% EC (Tilt) @ 1 ml per liter of water (200ml in 200L water per acre).',
        'Tebuconazole 25.9% EC @ 1ml/liter if pustules have spread past lower canopy.'
      ],
      preventativeMeasures: [
        'Cultivate resistant varieties like DBW 187, DBW 222, HD 3226, or PBW 725.',
        'Timely sowing in November to avoid late cold-season rust pressure.',
        'Balanced fertilizer use with adequate zinc and potash.'
      ],
      irrigationAdvice: 'Irrigate during morning hours so wheat leaves dry quickly under sun.',
      summaryAdvice: 'Stripe rust can rapidly destroy 40-70% of grain yield if flag leaf is infected. Spray Propiconazole 25% EC immediately to halt sporulation.'
    }
  }
];

export const MOCK_COMMODITIES: MarketCommodity[] = [
  {
    id: 'comm-1',
    name: 'Tomato (Hybrid Desi / Local)',
    variety: 'Abhinav / Arka',
    market: 'Lasalgaon APMC, Nashik',
    state: 'Maharashtra',
    minPrice: 1800,
    maxPrice: 2600,
    modalPrice: 2250,
    unit: '₹ / Quintal (100 kg)',
    priceChange24h: 8.5,
    trend: 'up',
    arrivalVolumeTonnes: 340,
    lastUpdated: 'Today, 08:30 AM',
    historicalPrices: [
      { date: '14 Aug', price: 1750 },
      { date: '15 Aug', price: 1820 },
      { date: '16 Aug', price: 1950 },
      { date: '17 Aug', price: 2050 },
      { date: '18 Aug', price: 2150 },
      { date: '19 Aug', price: 2250 },
    ]
  },
  {
    id: 'comm-2',
    name: 'Paddy / Basmati Rice (1121 Pusa)',
    variety: '1121 Steam / Raw',
    market: 'Karnal Mandi',
    state: 'Haryana',
    minPrice: 3600,
    maxPrice: 4250,
    modalPrice: 3980,
    unit: '₹ / Quintal',
    priceChange24h: 2.1,
    trend: 'up',
    arrivalVolumeTonnes: 620,
    lastUpdated: 'Today, 09:15 AM',
    historicalPrices: [
      { date: '14 Aug', price: 3820 },
      { date: '15 Aug', price: 3850 },
      { date: '16 Aug', price: 3890 },
      { date: '17 Aug', price: 3910 },
      { date: '18 Aug', price: 3940 },
      { date: '19 Aug', price: 3980 },
    ]
  },
  {
    id: 'comm-3',
    name: 'Cotton (Shankar-6 Long Staple)',
    variety: 'Medium / Long Staple 29mm',
    market: 'Rajkot APMC',
    state: 'Gujarat',
    minPrice: 6800,
    maxPrice: 7450,
    modalPrice: 7180,
    unit: '₹ / Quintal',
    priceChange24h: -1.4,
    trend: 'down',
    arrivalVolumeTonnes: 450,
    lastUpdated: 'Today, 10:00 AM',
    historicalPrices: [
      { date: '14 Aug', price: 7380 },
      { date: '15 Aug', price: 7350 },
      { date: '16 Aug', price: 7300 },
      { date: '17 Aug', price: 7240 },
      { date: '18 Aug', price: 7210 },
      { date: '19 Aug', price: 7180 },
    ]
  },
  {
    id: 'comm-4',
    name: 'Wheat (Sharbati Gold / Lokwan)',
    variety: 'Premium Sharbati Grain',
    market: 'Sehore APMC',
    state: 'Madhya Pradesh',
    minPrice: 2750,
    maxPrice: 3350,
    modalPrice: 3080,
    unit: '₹ / Quintal',
    priceChange24h: 3.4,
    trend: 'up',
    arrivalVolumeTonnes: 890,
    lastUpdated: 'Today, 08:45 AM',
    historicalPrices: [
      { date: '14 Aug', price: 2920 },
      { date: '15 Aug', price: 2950 },
      { date: '16 Aug', price: 2990 },
      { date: '17 Aug', price: 3020 },
      { date: '18 Aug', price: 3050 },
      { date: '19 Aug', price: 3080 },
    ]
  },
  {
    id: 'comm-5',
    name: 'Red Onion (Garva High Storage Quality)',
    variety: 'Nashik Red Garva',
    market: 'Pimpalgaon APMC',
    state: 'Maharashtra',
    minPrice: 1900,
    maxPrice: 2700,
    modalPrice: 2420,
    unit: '₹ / Quintal',
    priceChange24h: 5.2,
    trend: 'up',
    arrivalVolumeTonnes: 1200,
    lastUpdated: 'Today, 09:30 AM',
    historicalPrices: [
      { date: '14 Aug', price: 2150 },
      { date: '15 Aug', price: 2200 },
      { date: '16 Aug', price: 2280 },
      { date: '17 Aug', price: 2340 },
      { date: '18 Aug', price: 2380 },
      { date: '19 Aug', price: 2420 },
    ]
  },
  {
    id: 'comm-6',
    name: 'Yellow Soybean (JS 335 / 9560)',
    variety: 'Oil Grade Bold Seed',
    market: 'Indore Mandi',
    state: 'Madhya Pradesh',
    minPrice: 4300,
    maxPrice: 4780,
    modalPrice: 4560,
    unit: '₹ / Quintal',
    priceChange24h: 0.0,
    trend: 'stable',
    arrivalVolumeTonnes: 780,
    lastUpdated: 'Today, 07:50 AM',
    historicalPrices: [
      { date: '14 Aug', price: 4550 },
      { date: '15 Aug', price: 4560 },
      { date: '16 Aug', price: 4540 },
      { date: '17 Aug', price: 4570 },
      { date: '18 Aug', price: 4560 },
      { date: '19 Aug', price: 4560 },
    ]
  }
];

export const MOCK_IOT_ZONES: IoTSensorZone[] = [
  {
    id: 'zone-north',
    name: 'North Plot (Zone A) - Hybrid Tomatoes',
    crop: 'Tomato (Abhinav F1)',
    areaAcres: 4.2,
    soilMoisturePct: 44, // ideal is 40-60%
    soilTempC: 24.8,
    soilPh: 6.7,
    npkNitrogenPpm: 185,
    npkPhosphorusPpm: 62,
    npkPotassiumPpm: 210,
    ambientHumidityPct: 68,
    ambientTempC: 29.4,
    irrigationStatus: 'OFF',
    valveOpen: false,
    batteryLevelPct: 94,
    lastSync: '1 min ago (Telemetry Active)'
  },
  {
    id: 'zone-east',
    name: 'East Paddy Field (Zone B) - Basmati 1121',
    crop: 'Paddy Rice',
    areaAcres: 5.0,
    soilMoisturePct: 78, // High for paddy
    soilTempC: 26.1,
    soilPh: 7.1,
    npkNitrogenPpm: 140,
    npkPhosphorusPpm: 48,
    npkPotassiumPpm: 175,
    ambientHumidityPct: 74,
    ambientTempC: 30.2,
    irrigationStatus: 'RUNNING',
    valveOpen: true,
    batteryLevelPct: 88,
    lastSync: 'Just now'
  },
  {
    id: 'zone-south',
    name: 'South Orchard (Zone C) - Bt Cotton & Mango',
    crop: 'Bt Cotton / Fruit Orchards',
    areaAcres: 3.3,
    soilMoisturePct: 29, // Dry! Needs irrigation
    soilTempC: 27.5,
    soilPh: 6.9,
    npkNitrogenPpm: 210,
    npkPhosphorusPpm: 55,
    npkPotassiumPpm: 190,
    ambientHumidityPct: 52,
    ambientTempC: 31.8,
    irrigationStatus: 'ALERT',
    valveOpen: false,
    batteryLevelPct: 79,
    lastSync: '2 mins ago'
  }
];

export const MOCK_GOV_SCHEMES: GovScheme[] = [
  {
    id: 'scheme-1',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    authority: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    category: 'Direct Financial Support',
    benefitAmount: '₹6,000 / year (Paid in 3 equal instalments of ₹2,000 directly via DBT to Aadhaar-linked bank account)',
    eligibility: [
      'All landholding farmer families with cultivable land in their names.',
      'Small and marginal farmers as well as medium scale landholders.',
      'Must have Aadhaar card linked with Land Record (7/12 extract / Khatauni) and Active Bank Account.'
    ],
    documentsNeeded: [
      'Aadhaar Card copy',
      'Proof of Citizenship / Landholding Certificate (RoR / 7/12 / Khasra)',
      'Bank Account Passbook / Cancelled Cheque with IFSC',
      'e-KYC biometric or OTP verification'
    ],
    applicationStatus: 'Open Year-Round',
    officialPortalUrl: 'https://pmkisan.gov.in',
    summary: 'Universal income support providing ₹6,000 per year directly to farming households to purchase high quality seeds, fertilizers, and equipment.'
  },
  {
    id: 'scheme-2',
    title: 'PM-KUSUM (Solar Agri Pump & Grid Feed Subsidy)',
    authority: 'Ministry of New & Renewable Energy (MNRE)',
    category: 'Solar & Irrigation Subsidy',
    benefitAmount: 'Up to 60% Govt Subsidy (30% Central + 30% State) + 30% Low Interest Bank Loan on 3HP to 10HP Solar Pumps',
    eligibility: [
      'Individual farmers, Water User Associations, and Farmer Producer Organizations (FPOs).',
      'Farmers without grid electric pump connection or wishing to replace expensive diesel pumps.'
    ],
    documentsNeeded: [
      'Land ownership documents',
      'Water source proof (Borewell / Open Well / Canal permission)',
      'Aadhaar card and Mobile number',
      'Bank Account details'
    ],
    applicationStatus: 'Rolling Allocation',
    officialPortalUrl: 'https://pmkusum.mnre.gov.in',
    summary: 'Dramatically cuts irrigation operational diesel/electricity bills to zero by setting up stand-alone or grid-tied solar irrigation pumps.'
  },
  {
    id: 'scheme-3',
    title: 'PM Fasal Bima Yojana (PMFBY - Pradhan Mantri Crop Insurance)',
    authority: 'Department of Agriculture & Farmers Welfare',
    category: 'Crop Insurance',
    benefitAmount: 'Comprehensive claim coverage for pre-sowing prevented planting, mid-season localized disasters, drought, pest attack, and post-harvest cyclone damage.',
    eligibility: [
      'All farmers cultivating notified crops in notified areas.',
      'Extremely low premium: Only 1.5% for Rabi crops, 2.0% for Kharif crops, and 5% for Annual Commercial/Horticultural crops. Remaining 90%+ premium subsidized by Govt.'
    ],
    documentsNeeded: [
      'Land Possession Certificate / Sowing Certificate by Village Patwari/Revenue Inspector',
      'Bank passbook',
      'Aadhaar card'
    ],
    applicationStatus: 'Application Open (Seasonal)',
    officialPortalUrl: 'https://pmfby.gov.in',
    summary: 'Affordable safety net shielding farmers from unpredictable climate shocks, hailstorms, droughts, and pest swarms.'
  },
  {
    id: 'scheme-4',
    title: 'Per Drop More Crop (Micro-Irrigation Drip & Sprinkler Scheme)',
    authority: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    category: 'Solar & Irrigation Subsidy',
    benefitAmount: 'Up to 55% subsidy for Small & Marginal Farmers, 45% subsidy for Other Farmers on Drip/Sprinkler systems',
    eligibility: [
      'Farmers with assured water source having land under horticulture or field crops.'
    ],
    documentsNeeded: [
      'Soil & Water test report (if requested)',
      'Electricity / Solar pump connection receipt',
      'Land revenue records'
    ],
    applicationStatus: 'Open Year-Round',
    officialPortalUrl: 'https://pmksy.gov.in',
    summary: 'Maximizes water-use efficiency by up to 50% while boosting yield 30-40% through pressurized micro-drip fertigation.'
  },
  {
    id: 'scheme-5',
    title: 'Kisan Credit Card (KCC) & Interest Subvention Scheme',
    authority: 'NABARD & Reserve Bank of India',
    category: 'Credit & Loan',
    benefitAmount: 'Collateral-free agricultural working capital credit up to ₹3,00,000 at an effective subsidized interest rate of only 4% (with timely repayment prompt incentive).',
    eligibility: [
      'All farmers, tenant cultivators, sharecroppers, self-help groups (SHGs), animal husbandry, and dairy farmers.'
    ],
    documentsNeeded: [
      'Filled KCC loan application at any Nationalized or Regional Rural Bank (RRB)',
      'Land record documents & proof of sowing',
      'Identity & Address Proof'
    ],
    applicationStatus: 'Open Year-Round',
    officialPortalUrl: 'https://myscheme.gov.in',
    summary: 'Instant institutional credit eliminating dependency on local informal high-interest moneylenders.'
  }
];

export const INITIAL_ACTIVITY_LOGS: FarmActivityLog[] = [
  {
    id: 'log-1',
    date: '2026-08-18',
    plotName: 'North Plot (Tomato)',
    activityType: 'Fertigation',
    details: 'Applied 19:19:19 Water Soluble NPK (25kg) + Micronutrient Zinc chelate via drip venturi injector.',
    costOrRevenue: -2850
  },
  {
    id: 'log-2',
    date: '2026-08-16',
    plotName: 'East Paddy Field',
    activityType: 'Weeding',
    details: 'Cono-weeder inter-row mechanical weeding + manual boundary cleaning with 4 farm workers.',
    costOrRevenue: -2400
  },
  {
    id: 'log-3',
    date: '2026-08-14',
    plotName: 'North Plot (Tomato)',
    activityType: 'Sale',
    details: 'Harvested & sold 45 Crates (1,125 kg) Grade-A Hybrid Tomatoes to Lasalgaon APMC trader.',
    costOrRevenue: 27800
  },
  {
    id: 'log-4',
    date: '2026-08-10',
    plotName: 'South Orchard',
    activityType: 'Pesticide Spray',
    details: 'Foliar spray of Neem Oil (Azadirachtin 10000 ppm) + Beauveria bassiana for biological whitefly control.',
    costOrRevenue: -1650
  }
];
