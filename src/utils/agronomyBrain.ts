import { FarmProfile } from '../types';

export interface KnowledgeResponse {
  content: string;
  suggestedFollowUps?: string[];
}

export function generateAgronomistResponse(
  userQuery: string,
  farmProfile: FarmProfile,
  language: string = 'English'
): KnowledgeResponse {
  const query = userQuery.toLowerCase();
  const farmer = farmProfile.farmerName || 'Farmer';
  const crops = farmProfile.primaryCrops?.length ? farmProfile.primaryCrops.join(', ') : 'Crops';
  const location = farmProfile.location || 'your region';
  const soil = farmProfile.soilType || 'Soil';
  const acreage = farmProfile.totalAcreage || 1;

  // 1. Pests
  if (query.includes('aphid') || query.includes('sucking pest') || query.includes('thrip') || query.includes('whitefl')) {
    return {
      content: `Hello **${farmer}**, for sucking pests (aphids/thrips/whiteflies) in ${crops}:\n\n` +
        `### 🌿 Organic / Bio-Control:\n` +
        `• **Neem Oil (10,000 ppm)**: Mix 3–5 ml per Liter of water with a few drops of liquid soap. Spray in late afternoon on leaf undersides.\n` +
        `• **Yellow Sticky Traps**: Install 8–10 yellow & blue sticky traps per acre to trap adult winged flies.\n` +
        `• **Verticillium lecanii**: Spray bio-fungicide @ 5g/L during humid morning conditions.\n\n` +
        `### 🧪 Agrochemical Treatment (If severe infestation):\n` +
        `• **Imidacloprid 17.8% SL**: 0.5 ml/L water (Wait 15 days before harvest).\n` +
        `• **Acetamiprid 20% SP**: 0.4 g/L water (Effective against thrips and whiteflies).\n\n` +
        `*Tip: Ensure uniform spray coverage under the canopy where pests hide.*`,
      suggestedFollowUps: ['What is the safety withholding period?', 'How to prepare homemade garlic-chili spray?', 'Show fertilizer schedule for flowering stage']
    };
  }

  if (query.includes('armyworm') || query.includes('caterpillar') || query.includes('stem borer') || query.includes('bollworm') || query.includes('worm')) {
    return {
      content: `Hello **${farmer}**, for caterpillar / borer pests affecting ${crops}:\n\n` +
        `### 🐛 Organic & Biological Control:\n` +
        `• **Pheromone Traps**: Place 5–6 funnel traps per acre to monitor and disrupt male moth mating.\n` +
        `• **Bacillus thuringiensis (Bt)**: 2g/L water sprayed in early larval stage.\n` +
        `• **Beauveria bassiana**: 5g/L water for biological caterpillar control.\n\n` +
        `### 🧪 Chemical Intervention:\n` +
        `• **Chlorantraniliprole 18.5% SC (Coragen)**: 0.4 ml/L (60 ml per acre in 150L water). Excellent translaminar residual control.\n` +
        `• **Emamectin Benzoate 5% SG**: 0.5 g/L (80-100g per acre) for quick knockdown of worms.\n\n` +
        `*Safety: Spray early morning or after 4 PM to protect pollinators.*`,
      suggestedFollowUps: ['How many pheromone traps per acre?', 'Is Coragen safe for beneficial insects?', 'Symptoms of Fall Armyworm in Maize']
    };
  }

  // 2. Fungal / Bacterial Diseases
  if (query.includes('blight') || query.includes('leaf spot') || query.includes('rust') || query.includes('mildew') || query.includes('fung') || query.includes('yellow leaf')) {
    return {
      content: `Hello **${farmer}**, for leaf spot, blight, and fungal symptoms in ${crops} on ${soil} soil:\n\n` +
        `### 🔍 Immediate Action Plan:\n` +
        `1. **Pruning & Hygiene**: Remove and burn badly infected lower leaves showing concentric rings or yellow halos.\n` +
        `2. **Irrigation Tuning**: Avoid overhead sprinkler splash; keep surface soil dry between irrigation cycles.\n\n` +
        `### 🌿 Organic Treatments:\n` +
        `• **Copper Oxychloride (COC 50% WP)**: 2.5–3g per Liter water.\n` +
        `• **Trichoderma viride**: Soil application @ 2.5 kg/acre mixed with 100kg compost.\n\n` +
        `### 🧪 Systemic Fungicide Solutions:\n` +
        `• **Mancozeb 75% WP (Contact)**: 2.5g/L water for preventive protection.\n` +
        `• **Azoxystrobin 18.2% + Difenoconazole 11.4% SC**: 1 ml/L for curative systemic control.\n` +
        `• **Hexaconazole 5% SC**: 2 ml/L (Effective against rust and powdery mildew).`,
      suggestedFollowUps: ['How often should I spray fungicide?', 'What causes yellow leaves besides fungal blight?', 'Check Crop Doctor Scanner']
    };
  }

  // 3. Fertilizer, NPK, Soil Nutrition
  if (query.includes('fertilizer') || query.includes('npk') || query.includes('urea') || query.includes('dap') || query.includes('potash') || query.includes('nutrient') || query.includes('zinc')) {
    const urea = Math.round(acreage * 45);
    const dap = Math.round(acreage * 30);
    const mop = Math.round(acreage * 25);

    return {
      content: `Hello **${farmer}**, customized nutrient management for your **${acreage}-acre** farm (${soil} soil):\n\n` +
        `### ⚖️ Estimated Base Fertilizer Schedule:\n` +
        `• **DAP (18:46:0)**: Total ~**${dap} kg** — Apply 100% as **Basal dose** at sowing/transplanting time near rootzone.\n` +
        `• **MOP (Potash 60%)**: Total ~**${mop} kg** — Apply 50% basal and 50% at flowering/grain filling.\n` +
        `• **Urea (46% N)**: Total ~**${urea} kg** — Split in 3 equal stages:\n` +
        `   1. *Day 0–15 (Basal/Early)*: ${Math.round(urea/3)} kg\n` +
        `   2. *Day 30–40 (Vegetative)*: ${Math.round(urea/3)} kg\n` +
        `   3. *Day 55–65 (Flowering/Booting)*: ${Math.round(urea/3)} kg\n\n` +
        `### 🔬 Micronutrient Booster:\n` +
        `• **Zinc Sulphate (21% Zn)**: ${Math.round(acreage * 5)} kg/acre soil application.\n` +
        `• **19:19:19 (All-in-One Foliar Spray)**: 5g/L water during active branching/tillering.`,
      suggestedFollowUps: ['How to calculate exact fertilizer for Tomato?', 'How to make Jeevamrutha?', 'What are the signs of nitrogen deficiency?']
    };
  }

  // 4. Specific Crops & General Advisory
  if (query.includes('paddy') || query.includes('rice')) {
    return {
      content: `Hello **${farmer}**, expert agronomic guidance for **Paddy (Rice)**:\n\n` +
        `• **Water Management**: Maintain 2–3 cm shallow standing water during early tillering; drain field 7 days before harvesting.\n` +
        `• **Key Pests**: Yellow Stem Borer, Brown Plant Hopper (BPH), Leaf Folder.\n` +
        `• **Disease Alert**: Bacterial Leaf Blight (BLB) & Neck Blast. Apply Tricyclazole 75% WP @ 0.6g/L for blast prevention.\n` +
        `• **Weed Control**: Pre-emergence spray of Pretilachlor 50% EC @ 600ml/acre within 0–3 days of transplanting.`,
      suggestedFollowUps: ['How to control Brown Plant Hopper (BPH)?', 'Best fertilizer dose for Paddy', 'Zinc deficiency in rice']
    };
  }

  // Default Comprehensive Advisory
  return {
    content: `Hello **${farmer}**! As your AI Agronomist companion for your **${acreage}-acre farm** in **${location}** (growing ${crops}):\n\n` +
      `I can help you solve any farming challenge with practical recommendations:\n\n` +
      `• **🩺 Crop Doctor**: Instant identification of leaf diseases, rusts, blights, and insect pest attacks.\n` +
      `• **🧪 Fertilizer & Nutrition**: Split schedules for Urea, DAP, Potash, Zinc, and customized NPK for ${soil} soil.\n` +
      `• **💧 Irrigation Advisory**: Water requirement planning, drip runtimes, and drought protection.\n` +
      `• **🌱 Sustainable Formulations**: Jeevamrutha recipe, vermicomposting, bio-pesticides, and weed control.\n\n` +
      `*What specific crop, pest, or fertilizer question can I answer for you?*`,
    suggestedFollowUps: [
      `How to protect ${farmProfile.primaryCrops[0] || 'crops'} from pests?`,
      `Fertilizer schedule for ${acreage} acres`,
      `Recipe for organic Jeevamrutha`,
      `Government farm subsidies`
    ]
  };
}
