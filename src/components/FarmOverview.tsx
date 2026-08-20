import React from 'react';
import { 
  Stethoscope, 
  Bot, 
  Droplet, 
  CloudSun, 
  TrendingUp, 
  Cpu, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Wind, 
  Layers,
  PhoneCall
} from 'lucide-react';
import { AppTab, FarmProfile } from '../types';
import { MOCK_COMMODITIES, MOCK_IOT_ZONES, SAMPLE_DISEASE_PRESETS } from '../data/mockData';

interface FarmOverviewProps {
  farmProfile: FarmProfile;
  onNavigateTab: (tab: AppTab) => void;
  onAskAgronomist: (query: string) => void;
}

export const FarmOverview: React.FC<FarmOverviewProps> = ({
  farmProfile,
  onNavigateTab,
  onAskAgronomist,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-500 text-xs font-semibold text-lime-300">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Agriculture Hub
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome back, {farmProfile.farmerName}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {farmProfile.farmName} is operating with <strong>{farmProfile.totalAcreage} Acres</strong> under active cultivation in {farmProfile.location}. Telemetry and agro-risk engines are monitoring your plots.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('cropDoctor')}
              className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-emerald-950" /> Scan Leaf for Disease
            </button>
            <button
              onClick={() => onNavigateTab('advisory')}
              className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-emerald-500 transition flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-lime-300" /> Talk to AI Agronomist
            </button>
          </div>
        </div>
      </div>

      {/* Critical Status Snapshot Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Weather Snapshot */}
        <div 
          onClick={() => onNavigateTab('weatherAlerts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agro-Weather Window</span>
              <CloudSun className="w-5 h-5 text-sky-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">30.4°C • Humid</p>
            <p className="text-xs text-emerald-700 font-bold mt-0.5">
              🟢 Chemical Spray Condition: Optimal Today
            </p>
          </div>
          <span className="text-xs text-sky-700 font-bold flex items-center gap-1 mt-3">
            <span>View 7-Day Forecast & Rain Alert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Mandi Snapshot */}
        <div 
          onClick={() => onNavigateTab('mandiPrices')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Mandi Commodity</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              Tomato: {farmProfile.currency} 2,250 / Q
            </p>
            <p className="text-xs text-emerald-700 font-bold mt-0.5">
              ▲ +8.5% 24h Gain (Bullish Forecast)
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-3">
            <span>Check All Commodity Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* IoT Snapshot */}
        <div 
          onClick={() => onNavigateTab('iotSensors')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">IoT Telemetry & Valves</span>
              <Cpu className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-2xl font-black text-amber-700 mt-2">
              1 Deficit Alert
            </p>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Zone South (Cotton) moisture at 29% (Low)
            </p>
          </div>
          <span className="text-xs text-teal-700 font-bold flex items-center gap-1 mt-3">
            <span>Open IoT Actuators & Valves</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>

      {/* Feature Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Crop Doctor */}
        <div 
          onClick={() => onNavigateTab('cropDoctor')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">AI Plant Disease Scanner</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Diagnose leaf blight, rust, pests, and nutrient chlorosis using computer vision and get immediate organic & chemical treatment plans.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
            <span>Launch Plant Doctor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>

        {/* Card 2: AI Agronomist Chat */}
        <div 
          onClick={() => onNavigateTab('advisory')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-lime-100 text-lime-900 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Multilingual Agronomist</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Voice-enabled interactive conversational companion answering queries on seed treatment, Jeevamrutha, pest cycles, and harvest management.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
            <span>Start Voice/Text Chat</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>

        {/* Card 3: Fertilizer & NPK Calculator */}
        <div 
          onClick={() => onNavigateTab('fertilizerCalculator')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Droplet className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Precision NPK & Water Budget</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compute exact basal and split top-dressing fertilizer quantities per acre alongside customized drip irrigation runtimes.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
            <span>Calculate Dosages</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>

        {/* Card 4: Mandi Market Rates */}
        <div 
          onClick={() => onNavigateTab('mandiPrices')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Mandi Rates & AI Predictions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Spot prices across APMC mandis, historical charts, 15-day AI commodity forecast, and storage vs. liquidation advice.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
            <span>Explore Market Prices</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>

        {/* Card 5: Government Schemes & Subsidies */}
        <div 
          onClick={() => onNavigateTab('govSchemes')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Govt Schemes & Subsidies</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Check eligibility, documentation requirements, and application steps for PM-KISAN, PM-KUSUM solar pumps, and PMFBY crop insurance.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
            <span>Browse Subsidies</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>

        {/* Card 6: Farm Ledger & Tasks */}
        <div 
          onClick={() => onNavigateTab('farmLogbook')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Farm Activity Logbook</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Record day-to-day input applications, labor outlays, and crop harvests to compute net seasonal return on investment (ROI).
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
            <span>Open Farm Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>

      </div>

      {/* Kisan Call Center & Quick AI Helpline Banner */}
      <div className="bg-emerald-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base">Need Direct Phone Assistance?</h4>
            <p className="text-xs text-emerald-200 mt-0.5">
              Call the Government Kisan Call Centre (Toll-Free: <strong>1800-180-1551</strong>) 6:00 AM - 10:00 PM all 7 days.
            </p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="px-5 py-2.5 bg-white text-emerald-900 font-extrabold rounded-xl text-xs sm:text-sm hover:bg-emerald-50 transition shadow-sm shrink-0"
        >
          Call 1800-180-1551 Now
        </a>
      </div>

    </div>
  );
};
