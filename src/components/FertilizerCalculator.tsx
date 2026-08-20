import React, { useState } from 'react';
import { 
  Droplet, 
  Sparkles, 
  Calendar, 
  Leaf, 
  FlaskConical, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  DollarSign, 
  Waves,
  Layers
} from 'lucide-react';
import { FertilizerPlanResult, LanguageCode, FarmProfile } from '../types';

interface FertilizerCalculatorProps {
  currentLanguage: LanguageCode;
  farmProfile: FarmProfile;
}

const CROPS = [
  'Tomato', 'Paddy / Basmati Rice', 'Wheat', 'Cotton', 'Maize / Corn', 
  'Sugarcane', 'Onion', 'Soybean', 'Potato', 'Chilli', 'Groundnut', 'Mustard'
];

const SOIL_TYPES = [
  'Medium Black Loamy Soil (Clay Loam)',
  'Alluvial Deep Fertile Loam',
  'Red Sandy Loam Soil',
  'Heavy Black Cotton Clay Soil',
  'Sandy / Light Porous Soil',
  'Laterite Acidic Soil'
];

const GROWTH_STAGES = [
  'Basal / Land Preparation (Pre-Sowing)',
  'Early Vegetative / Tillering Stage (15-30 DAS)',
  'Grand Growth / Branching Stage (30-60 DAS)',
  'Flowering & Fruit/Earhead Initiation (60-90 DAS)',
  'Fruit Development / Grain Filling Stage',
  'Maturity & Pre-Harvest Ripening'
];

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({
  currentLanguage,
  farmProfile,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(farmProfile.primaryCrops[0] || 'Tomato');
  const [acreage, setAcreage] = useState<number>(3.5);
  const [unit, setUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [soilType, setSoilType] = useState<string>(farmProfile.soilType);
  const [stage, setStage] = useState<string>(GROWTH_STAGES[1]);
  
  // Soil Test Values (optional advanced)
  const [showAdvancedSoilTest, setShowAdvancedSoilTest] = useState<boolean>(false);
  const [soilN, setSoilN] = useState<string>('Medium (220 kg/ha)');
  const [soilP, setSoilP] = useState<string>('Medium (24 kg/ha)');
  const [soilK, setSoilK] = useState<string>('High (290 kg/ha)');
  const [soilPh, setSoilPh] = useState<string>('6.8 (Neutral)');
  const [organicCarbon, setOrganicCarbon] = useState<string>('0.55% (Moderate)');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<FertilizerPlanResult | null>(null);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/fertilizer-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          acreage,
          unit,
          soilType,
          stage,
          soilTest: showAdvancedSoilTest ? {
            nitrogen: soilN,
            phosphorus: soilP,
            potassium: soilK,
            pH: soilPh,
            organicCarbon,
          } : { status: 'Standard fertility assumptions for ' + soilType },
          language: currentLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate fertilization schedule');
      }

      setPlan(data.plan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Fertilizer calculation service temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-600/80 text-teal-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Agronomic Precision Engine
            </span>
            <span className="text-xs text-lime-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Soil-Customized Dosing
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Smart Fertilizer & Irrigation Scheduler
          </h2>
          <p className="text-sm text-teal-200 mt-1 max-w-2xl">
            Calculate precise N-P-K nutrient split applications, water budgets, and bio-organic inputs tailored to your specific plot acreage, soil fertility, and crop growth stage.
          </p>
        </div>

        {plan && (
          <button
            onClick={() => setPlan(null)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-sm font-medium transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Recalculate
          </button>
        )}
      </div>

      {/* Input Parameters Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Area & Unit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Land Area
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={acreage}
                onChange={(e) => setAcreage(parseFloat(e.target.value) || 1)}
                className="w-2/3 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-1/3 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-xs font-bold text-slate-800 focus:bg-white"
              >
                <option value="Acres">Acres</option>
                <option value="Hectares">Hectares</option>
              </select>
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Current Growth Stage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Growth Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {GROWTH_STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Toggle Soil Health Card Parameters */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvancedSoilTest(!showAdvancedSoilTest)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>{showAdvancedSoilTest ? 'Hide Soil Test Inputs (NPK/pH)' : '+ Enter Soil Health Card Lab Test Values (Optional)'}</span>
          </button>

          {showAdvancedSoilTest && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Available Nitrogen (N)
                </label>
                <input
                  type="text"
                  value={soilN}
                  onChange={(e) => setSoilN(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Available Phosphorus (P)
                </label>
                <input
                  type="text"
                  value={soilP}
                  onChange={(e) => setSoilP(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Available Potassium (K)
                </label>
                <input
                  type="text"
                  value={soilK}
                  onChange={(e) => setSoilK(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Soil pH Level
                </label>
                <input
                  type="text"
                  value={soilPh}
                  onChange={(e) => setSoilPh(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Organic Carbon (OC %)
                </label>
                <input
                  type="text"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          id="calculate-fertilizer-plan-btn"
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-lime-300" />
              <span>Calculating Optimal Dosage & Water Budgets...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-lime-300" />
              <span>Generate Precision Dosage & Fertigation Schedule</span>
            </>
          )}
        </button>

      </div>

      {/* Results Prescription Display */}
      {plan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Executive Overview & Recommended Ratio */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Nutrient Demand Profile • {selectedCrop} ({acreage} {unit})
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Agronomic Fertilization & Irrigation Prescription
                </h3>
              </div>

              <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Recommended Total N:P:K Ratio
                </span>
                <span className="text-base font-extrabold text-emerald-950">
                  {plan.npkRatioRecommended}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {plan.cropSummary}
            </p>
          </div>

          {/* Section 1: Basal Application Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-700" />
              <h4 className="font-bold text-base text-slate-900">
                1. Basal / Pre-Sowing Application (Soil Incorporation)
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 rounded-l-lg">Fertilizer / Nutrient Source</th>
                    <th className="py-3 px-4">Dosage for {acreage} {unit}</th>
                    <th className="py-3 px-4 rounded-r-lg">Agronomic Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plan.basalApplication.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.item}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-800">{item.quantity}</td>
                      <td className="py-3 px-4 text-slate-600">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Top-Dressing & Fertigation Split Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h4 className="font-bold text-base text-slate-900">
                2. Split Top-Dressing & Fertigation Timeline
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.topDressingStages.map((stageItem, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Stage {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {stageItem.daysAfterSowing}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-slate-900">
                    {stageItem.stageName}
                  </h5>

                  <div className="space-y-1 text-xs pt-1 border-t border-slate-200/60">
                    <p className="text-slate-700">
                      <strong>Fertilizer:</strong> {stageItem.fertilizer}
                    </p>
                    <p className="text-emerald-800 font-semibold">
                      <strong>Quantity:</strong> {stageItem.quantity}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      <strong>Method:</strong> {stageItem.applicationMethod}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Water & Irrigation Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-sky-600" />
              <h4 className="font-bold text-base text-slate-900">
                3. Precision Irrigation Schedule & Water Budget
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-xs font-bold text-sky-800 uppercase block">Daily Water Requirement</span>
                <span className="text-lg font-extrabold text-sky-950 mt-1 block">
                  {plan.irrigationSchedule.waterNeedLitersPerDay}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-xs font-bold text-sky-800 uppercase block">Drip Pump Runtime</span>
                <span className="text-lg font-extrabold text-sky-950 mt-1 block">
                  {plan.irrigationSchedule.dripDurationHours}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-xs font-bold text-sky-800 uppercase block">Interval Frequency</span>
                <span className="text-lg font-extrabold text-sky-950 mt-1 block">
                  {plan.irrigationSchedule.frequencyDays}
                </span>
              </div>
            </div>

            {plan.irrigationSchedule.criticalWateringStages && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-1.5">
                  Critical Moisture-Sensitive Growth Windows (Never allow water stress):
                </span>
                <div className="flex flex-wrap gap-2">
                  {plan.irrigationSchedule.criticalWateringStages.map((crit, idx) => (
                    <span key={idx} className="text-xs bg-sky-100 text-sky-900 px-2.5 py-1 rounded-lg font-medium border border-sky-200">
                      {crit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Organic Alternatives & Micronutrients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bio-Fertilizers */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-lime-900 font-bold text-sm uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Organic & Bio-Fertilizer Supplements</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {plan.organicAlternatives.map((org, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{org}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micronutrients */}
            {plan.micronutrientsNeeded && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                  <Droplet className="w-4 h-4 text-amber-600" />
                  <span>Essential Foliar Micronutrient Sprays</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {plan.micronutrientsNeeded.map((micro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{micro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Cost Estimate & Warnings */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Estimated Fertilizer Input Investment
              </span>
              <p className="text-xl font-extrabold text-lime-400 mt-0.5">
                {plan.costEstimateRange || `${farmProfile.currency} 4,500 - 6,800 per acre`}
              </p>
            </div>

            {plan.warnings && plan.warnings.length > 0 && (
              <div className="text-xs text-slate-300 max-w-md bg-slate-800 p-3 rounded-xl border border-slate-700">
                <span className="font-bold text-amber-400 block mb-1">Agronomic Caution:</span>
                {plan.warnings.join(' • ')}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
