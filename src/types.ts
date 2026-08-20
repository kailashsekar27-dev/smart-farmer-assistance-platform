export type AppTab = 
  | 'overview' 
  | 'cropDoctor' 
  | 'advisory' 
  | 'fertilizerCalculator' 
  | 'weatherAlerts' 
  | 'mandiPrices' 
  | 'iotSensors' 
  | 'govSchemes'
  | 'farmLogbook';

export type LanguageCode = 
  | 'English' 
  | 'Hindi' 
  | 'Telugu' 
  | 'Tamil' 
  | 'Marathi' 
  | 'Punjabi' 
  | 'Bengali' 
  | 'Gujarati' 
  | 'Kannada' 
  | 'Spanish' 
  | 'French' 
  | 'Swahili';

export interface CropDiagnosisResult {
  cropIdentified: string;
  diseaseName: string;
  scientificName?: string;
  confidenceScore: number;
  severity: 'Healthy' | 'Low' | 'Moderate' | 'Severe' | 'Critical';
  affectedPart?: string;
  primaryCause: string;
  favorableConditions?: string;
  organicRemedies: string[];
  chemicalRemedies: string[];
  preventativeMeasures: string[];
  irrigationAdvice?: string;
  summaryAdvice: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FertilizerPlanResult {
  cropSummary: string;
  npkRatioRecommended: string;
  basalApplication: Array<{
    item: string;
    quantity: string;
    purpose: string;
  }>;
  topDressingStages: Array<{
    stageName: string;
    daysAfterSowing: string;
    fertilizer: string;
    quantity: string;
    applicationMethod: string;
  }>;
  organicAlternatives: string[];
  micronutrientsNeeded?: string[];
  irrigationSchedule: {
    waterNeedLitersPerDay: string;
    dripDurationHours: string;
    frequencyDays: string;
    criticalWateringStages: string[];
  };
  costEstimateRange?: string;
  warnings?: string[];
}

export interface MarketCommodity {
  id: string;
  name: string;
  variety: string;
  market: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  priceChange24h: number; // percentage
  trend: 'up' | 'down' | 'stable';
  arrivalVolumeTonnes: number;
  lastUpdated: string;
  historicalPrices: Array<{
    date: string;
    price: number;
  }>;
}

export interface MarketForecastResult {
  marketSentiment: string;
  expectedPriceRange15Days: string;
  strategicRecommendation: string;
  demandDrivers: string[];
  supplyFactors: string[];
  valueAdditionTip: string;
  summary: string;
}

export interface IoTSensorZone {
  id: string;
  name: string;
  crop: string;
  areaAcres: number;
  soilMoisturePct: number; // e.g. 42%
  soilTempC: number; // e.g. 26.5 C
  soilPh: number; // e.g. 6.8
  npkNitrogenPpm: number;
  npkPhosphorusPpm: number;
  npkPotassiumPpm: number;
  ambientHumidityPct: number;
  ambientTempC: number;
  irrigationStatus: 'OFF' | 'RUNNING' | 'SCHEDULED' | 'ALERT';
  valveOpen: boolean;
  batteryLevelPct: number;
  lastSync: string;
}

export interface FarmProfile {
  farmerName: string;
  farmName: string;
  location: string;
  totalAcreage: number;
  primaryCrops: string[];
  soilType: string;
  irrigationType: string;
  currency: string;
}

export interface FarmActivityLog {
  id: string;
  date: string;
  plotName: string;
  activityType: 'Sowing' | 'Fertigation' | 'Pesticide Spray' | 'Weeding' | 'Irrigation' | 'Harvesting' | 'Sale';
  details: string;
  costOrRevenue: number; // positive = revenue, negative = expense
}

export interface GovScheme {
  id: string;
  title: string;
  authority: string;
  category: 'Direct Financial Support' | 'Crop Insurance' | 'Solar & Irrigation Subsidy' | 'Organic Farming' | 'Credit & Loan' | 'Farm Machinery';
  benefitAmount: string;
  eligibility: string[];
  documentsNeeded: string[];
  applicationStatus: 'Open Year-Round' | 'Application Open (Seasonal)' | 'Rolling Allocation';
  officialPortalUrl: string;
  summary: string;
}
