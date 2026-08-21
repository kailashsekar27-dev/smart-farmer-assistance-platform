import { CropDiagnosisResult, LanguageCode } from '../types';

export function analyzeCropSymptoms(
  cropName: string,
  symptoms: string,
  language: LanguageCode = 'English'
): CropDiagnosisResult {
  const cLower = (cropName || 'Plant').toLowerCase();
  const sLower = (symptoms || '').toLowerCase();

  // 1. TOMATO
  if (cLower.includes('tomato')) {
    if (sLower.includes('yellow') || sLower.includes('curl') || sLower.includes('whitefl')) {
      return {
        cropIdentified: 'Tomato (Solanum lycopersicum)',
        diseaseName: 'Tomato Leaf Curl Virus (ToLCV) & Whitefly Vector',
        scientificName: 'Begomovirus (Vectored by Bemisia tabaci)',
        confidenceScore: 95,
        severity: 'Severe',
        affectedPart: 'Apical Leaves & Vegetative Shoots',
        primaryCause: 'Viral infection transmitted by silverleaf whiteflies during warm, dry spells.',
        favorableConditions: 'Warm temperatures (26°C–34°C) with dry atmospheric humidity.',
        organicRemedies: [
          'Install 15-20 yellow sticky traps per acre at canopy level.',
          'Spray 10,000 ppm Neem Oil (3-5 ml/L) mixed with liquid soap once every 5 days.',
          'Apply fermented sour buttermilk spray (50 ml/L) to build plant immune response.',
          'Erect nylon mesh border nets (40-50 mesh) to block viruliferous whitefly migration.'
        ],
        chemicalRemedies: [
          'Diafenthiuron 50% WP @ 1.25 g/L of water.',
          'Imidacloprid 17.8% SL @ 0.5 ml/L or Acetamiprid 20% SP @ 0.4 g/L.',
          'Observe a strict 7-day pre-harvest withholding interval.'
        ],
        preventativeMeasures: [
          'Plant 2 border rows of maize or sorghum as a physical barrier against whiteflies.',
          'Treat nursery seedlings with Imidacloprid 70 WS (5g/kg seed) before sowing.',
          'Rogue out and bury severely stunted, curled plants immediately.'
        ],
        irrigationAdvice: 'Maintain consistent soil moisture via drip. Avoid moisture stress which accelerates whitefly colonization.',
        summaryAdvice: 'The priority is immediate vector suppression (whiteflies) with yellow sticky traps and systemic insecticide/neem spray, alongside rouging out infected plants.'
      };
    }

    // Default Tomato: Early / Late Blight
    return {
      cropIdentified: 'Tomato (Solanum lycopersicum)',
      diseaseName: 'Early Blight & Target Leaf Spot',
      scientificName: 'Alternaria solani',
      confidenceScore: 94,
      severity: 'Moderate',
      affectedPart: 'Lower Leaves, Stems, and Fruit Calyx',
      primaryCause: 'Fungal pathogen sporulating during alternating humid wet mornings and warm afternoons.',
      favorableConditions: 'Temperatures of 24°C–29°C with relative humidity > 80%.',
      organicRemedies: [
        'Prune all foliage within 20cm of ground level to eliminate soil-splash spores.',
        'Spray Copper Oxychloride 50% WP @ 2.5g/L water.',
        'Apply Trichoderma viride bio-fungicide @ 5g/L with 2g jaggery in water.',
        'Mulch bed surface with clean dry paddy straw (3-inch layer).'
      ],
      chemicalRemedies: [
        'Mancozeb 75% WP @ 2.5 g/L (Contact protective spray).',
        'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L (Curative systemic control).',
        'Apply early morning or late afternoon for maximum leaf absorption.'
      ],
      preventativeMeasures: [
        'Adopt trellis staking with bamboo/nylon twine to improve aeration.',
        'Avoid overhead sprinkler irrigation.',
        'Rotate with non-solanaceous crops (maize, pulses, mustard).'
      ],
      irrigationAdvice: 'Irrigate via drip in early morning only. Keep foliage completely dry before sundown.',
      summaryAdvice: 'Early Blight is well manageable. Prune infected bottom leaves, apply systemic fungicide or copper spray, and maintain clean drip irrigation.'
    };
  }

  // 2. PADDY / RICE
  if (cLower.includes('paddy') || cLower.includes('rice')) {
    if (sLower.includes('hopper') || sLower.includes('brown') || sLower.includes('burn')) {
      return {
        cropIdentified: 'Paddy / Rice (Oryza sativa)',
        diseaseName: 'Brown Plant Hopper (BPH) & Hopper Burn',
        scientificName: 'Nilaparvata lugens',
        confidenceScore: 93,
        severity: 'Critical',
        affectedPart: 'Stem Base & Lower Tillers',
        primaryCause: 'Nymphs and adults congregating at water level sucking sap, leading to circular lodging patches.',
        favorableConditions: 'Excessive nitrogen fertilizer, stagnant deep water, and high canopy density.',
        organicRemedies: [
          'Drain field water completely for 3 to 4 days (Alternate Wetting & Drying).',
          'Create 30cm "alleyways" (skipping 1 row every 2 meters) to allow sunlight and airflow.',
          'Conserve natural predators (mirid bugs, wolf spiders, and ladybird beetles).'
        ],
        chemicalRemedies: [
          'Pymetrozine 50% WDG @ 0.6 g/L (120g/acre) directed strictly to plant base.',
          'Trifiumeclopyr 10% SC @ 0.5 ml/L water.',
          'Avoid synthetic pyrethroids which trigger BPH resurgence.'
        ],
        preventativeMeasures: [
          'Never over-apply Urea. Split nitrogen into 3 equal doses.',
          'Adopt synchronized planting across neighboring fields.',
          'Grow resistant varieties (IR64, MTU 1010).'
        ],
        irrigationAdvice: 'Immediately drain standing field water to desiccate young nymph colonies.',
        summaryAdvice: 'Drain standing water for 72 hours and spray Pymetrozine directed towards the base of rice hills.'
      };
    }

    return {
      cropIdentified: 'Paddy / Rice (Oryza sativa)',
      diseaseName: 'Bacterial Leaf Blight (BLB) & Neck Blast',
      scientificName: 'Xanthomonas oryzae / Magnaporthe oryzae',
      confidenceScore: 92,
      severity: 'Severe',
      affectedPart: 'Leaf Blades & Flag Leaves',
      primaryCause: 'Bacterial and fungal pathogens entering through hydathodes during windy, rainy spells.',
      favorableConditions: '25°C–32°C temperature with relative humidity > 85% and high Nitrogen.',
      organicRemedies: [
        'Spray fresh Cow Dung Filtrate (20kg raw dung in 100L water + 500g lime).',
        'Pseudomonas fluorescens foliar spray @ 10g/L during early tillering.',
        'Drain field water for 48 hours to aerate the soil root zone.'
      ],
      chemicalRemedies: [
        'Streptocycline 6g + Copper Oxychloride 50 WP (500g) in 200L water per acre.',
        'Tricyclazole 75% WP @ 0.6 g/L for blast prevention.',
        'Apply additional Potassium (MOP @ 15 kg/acre) to strengthen cell walls.'
      ],
      preventativeMeasures: [
        'Avoid excess top-dressing of Urea. Balance with Potash.',
        'Treat seeds with Streptocycline (0.01%) for 8 hours prior to sowing.',
        'Eradicate weed hosts on field bunds.'
      ],
      irrigationAdvice: 'Drain standing water for 2-3 days to curb bacterial propagation.',
      summaryAdvice: 'Halt nitrogen top-dressing immediately. Apply Streptocycline + Copper Oxychloride and drain standing water.'
    };
  }

  // 3. COTTON
  if (cLower.includes('cotton')) {
    return {
      cropIdentified: 'Cotton (Gossypium hirsutum)',
      diseaseName: 'Pink Bollworm & Sucking Pest Complex',
      scientificName: 'Pectinophora gossypiella / Thrips tabaci',
      confidenceScore: 91,
      severity: 'Severe',
      affectedPart: 'Squares, Flowers, and Developing Green Bolls',
      primaryCause: 'Larvae boring into squares and developing bolls, causing rosette flowers and premature drop.',
      favorableConditions: 'Warm nights and humid monsoon season.',
      organicRemedies: [
        'Install 5 to 8 Pheromone Traps (PBLure) per acre for monitoring & mating disruption.',
        'Release Trichogramma bactrae egg parasitoids @ 60,000/acre.',
        'Spray Neem Seed Kernel Extract (NSKE 5%) at square formation stage.'
      ],
      chemicalRemedies: [
        'Emamectin Benzoate 5% SG @ 0.5 g/L (90g/acre) for quick knockdown.',
        'Chlorantraniliprole 18.5% SC @ 0.4 ml/L (60ml/acre).',
        'Profenofos 50% EC @ 2 ml/L during peak moth flight.'
      ],
      preventativeMeasures: [
        'Destroy and bury rosette flowers and dropped squares daily.',
        'Avoid extending ratoon crop season.',
        'Spray 1% Magnesium Sulphate (10g/L) + Urea (10g/L) to prevent leaf reddening.'
      ],
      irrigationAdvice: 'Irrigate at regular 10-12 day intervals during boll development. Avoid waterlogging.',
      summaryAdvice: 'Deploy pheromone traps to monitor adult moth counts and apply Emamectin Benzoate or Chlorantraniliprole when flower infestation is observed.'
    };
  }

  // 4. CHILI / PEPPER
  if (cLower.includes('chili') || cLower.includes('chilli') || cLower.includes('pepper')) {
    return {
      cropIdentified: 'Chili (Capsicum annuum)',
      diseaseName: 'Chili Leaf Curl (Murda Complex) & Anthracnose Dieback',
      scientificName: 'Colletotrichum capsici / Polyphagotarsonemus latus',
      confidenceScore: 94,
      severity: 'Moderate',
      affectedPart: 'Leaves, Flowering Shoots, and Ripening Fruit',
      primaryCause: 'Synergistic damage from yellow mites (downward curling) and thrips (upward curling) plus fungal dieback.',
      favorableConditions: 'Dry spells followed by humid warm conditions.',
      organicRemedies: [
        'Spray fermented buttermilk + garlic-chili extract (50ml/L).',
        'Install 10 blue sticky traps (for thrips) and 10 yellow sticky traps (for whiteflies) per acre.',
        'Apply bio-agent Beauveria bassiana @ 5g/L in evening hours.'
      ],
      chemicalRemedies: [
        'Fipronil 5% SC @ 2 ml/L or Spinetoram 11.7% SC @ 1 ml/L for thrips.',
        'Spiromesifen 22.9% SC @ 1 ml/L for yellow mite control.',
        'Azoxystrobin 23% SC @ 1 ml/L for anthracnose fruit rot.'
      ],
      preventativeMeasures: [
        'Spray seedlings in nursery before transplanting.',
        'Avoid excessive Nitrogen which promotes soft succulent growth vulnerable to thrips.',
        'Collect and destroy necrotic twig tips.'
      ],
      irrigationAdvice: 'Use drip irrigation. Maintain consistent soil moisture to prevent blossom-end blossom drop.',
      summaryAdvice: 'Inspect leaf curling orientation: upward curl requires Fipronil/Spinetoram (Thrips), while downward curl requires Spiromesifen (Mites).'
    };
  }

  // 5. WHEAT / MAIZE / GENERAL
  return {
    cropIdentified: `${cropName} (Field Specimen)`,
    diseaseName: 'Foliar Blight & Nutrient Deficiency Stress',
    scientificName: 'Helminthosporium / Physiological Stress',
    confidenceScore: 89,
    severity: 'Moderate',
    affectedPart: 'Foliage and Stem Nodes',
    primaryCause: 'Fungal leaf spotting combined with micronutrient imbalance (Zinc/Iron).',
    favorableConditions: 'High canopy humidity, dew retention, and soil moisture fluctuations.',
    organicRemedies: [
      'Apply 10% Jeevamrutha soil drenching and 5% foliar spray every 12-14 days.',
      'Spray Copper Oxychloride 50% WP @ 2.5g/L water.',
      'Incorporate 1 tonne/acre Trichoderma-enriched vermicompost near rootzone.'
    ],
    chemicalRemedies: [
      'Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1 ml/L.',
      'Foliar spray of 19:19:19 (5g/L) + Chelated Zinc (1g/L) to restore leaf vigor.',
      'Ensure 10-14 day spray intervals during active vegetative stage.'
    ],
    preventativeMeasures: [
      'Maintain field hygiene and rogue out severely damaged crop residues.',
      'Ensure seed treatment with fungicide prior to planting.',
      'Improve surface drainage to prevent root-zone suffocation.'
    ],
    irrigationAdvice: 'Ensure optimal rootzone aeration; avoid prolonged surface water stagnation.',
    summaryAdvice: 'Apply a combination of protective Mancozeb fungicide and 19:19:19 balanced foliar spray to arrest fungal spread and boost vegetative vigor.'
  };
}
