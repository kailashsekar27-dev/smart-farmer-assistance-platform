import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Sparkles, 
  Building2, 
  Calendar, 
  DollarSign, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers,
  Scale
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MarketCommodity, MarketForecastResult, LanguageCode, FarmProfile } from '../types';
import { MOCK_COMMODITIES } from '../data/mockData';

interface MandiMarketProps {
  currentLanguage: LanguageCode;
  farmProfile: FarmProfile;
}

export const MandiMarket: React.FC<MandiMarketProps> = ({
  currentLanguage,
  farmProfile,
}) => {
  const [commodities, setCommodities] = useState<MarketCommodity[]>(MOCK_COMMODITIES);
  const [selectedCommodity, setSelectedCommodity] = useState<MarketCommodity>(MOCK_COMMODITIES[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // AI Market Forecast states
  const [loadingForecast, setLoadingForecast] = useState<boolean>(false);
  const [forecastResult, setForecastResult] = useState<MarketForecastResult | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);

  // Profit Margin Calculator states
  const [calcQuantityQuintals, setCalcQuantityQuintals] = useState<number>(50);
  const [calcCostOfProdPerQuintal, setCalcCostOfProdPerQuintal] = useState<number>(1400);

  const filteredCommodities = commodities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFetchAiForecast = async (comm: MarketCommodity) => {
    setLoadingForecast(true);
    setForecastError(null);

    try {
      const response = await fetch('/api/gemini/market-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: comm.name,
          region: `${comm.market}, ${comm.state}`,
          currentPrice: `${farmProfile.currency} ${comm.modalPrice} per quintal`,
          language: currentLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate market forecast');
      }

      setForecastResult(data.forecast);
    } catch (err: any) {
      console.error(err);
      setForecastError(err.message || 'Market forecasting service unavailable.');
    } finally {
      setLoadingForecast(false);
    }
  };

  // Calculator outputs
  const totalRevenue = calcQuantityQuintals * selectedCommodity.modalPrice;
  const totalCost = calcQuantityQuintals * calcCostOfProdPerQuintal;
  const netProfit = totalRevenue - totalCost;
  const profitMarginPct = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-700 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Live Mandi Price Intelligence
            </span>
            <span className="text-xs text-lime-300 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> e-NAM & APMC Spot Rates
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Mandi Rates & AI Price Forecasting
          </h2>
          <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
            Live commodity prices across major APMC markets with historical trends, 15-day price trajectory projections, and smart storage vs. sale recommendations.
          </p>
        </div>
      </div>

      {/* Search & Commodity Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Commodities Ticker List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search commodity (e.g. Tomato, Cotton, Wheat)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredCommodities.map((comm) => {
                const isSelected = selectedCommodity.id === comm.id;
                const isPositive = comm.priceChange24h >= 0;
                return (
                  <button
                    key={comm.id}
                    onClick={() => {
                      setSelectedCommodity(comm);
                      setForecastResult(null);
                    }}
                    className={`w-full p-3.5 rounded-xl text-left border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {comm.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {comm.market} • {comm.state}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Arrivals: {comm.arrivalVolumeTonnes} Tonnes
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {farmProfile.currency} {comm.modalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        per Quintal
                      </span>
                      <span
                        className={`inline-flex items-center text-[11px] font-bold mt-1 ${
                          isPositive ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {comm.priceChange24h > 0 ? `+${comm.priceChange24h}%` : `${comm.priceChange24h}%`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right: Selected Commodity Detail, Price Chart & AI Forecast */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Detailed Market Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  APMC Market Spot Rate
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedCommodity.name} ({selectedCommodity.variety})
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCommodity.market}, {selectedCommodity.state} • Updated {selectedCommodity.lastUpdated}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Modal Mandi Price
                </span>
                <span className="text-2xl font-black text-emerald-950">
                  {farmProfile.currency} {selectedCommodity.modalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 block">per Quintal</span>
              </div>
            </div>

            {/* Min / Max / Arrival metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Min Price</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {farmProfile.currency} {selectedCommodity.minPrice}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Modal / Avg</span>
                <span className="text-sm font-extrabold text-emerald-950 mt-0.5 block">
                  {farmProfile.currency} {selectedCommodity.modalPrice}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Max Price</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {farmProfile.currency} {selectedCommodity.maxPrice}
                </span>
              </div>
            </div>

            {/* Recharts 7-Day Historical Trend Area Chart */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                6-Day Price Trajectory ({farmProfile.currency} / Quintal)
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedCommodity.historicalPrices}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis 
                      domain={['dataMin - 100', 'dataMax + 100']} 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [`${farmProfile.currency} ${val}`, 'Price']} 
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#059669" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Price Forecast Trigger */}
            <div>
              {!forecastResult && !loadingForecast && (
                <button
                  id="get-ai-forecast-btn"
                  onClick={() => handleFetchAiForecast(selectedCommodity)}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>Generate 15-Day AI Price Forecast & Storage Strategy</span>
                </button>
              )}

              {loadingForecast && (
                <div className="w-full py-3 px-4 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>AI is modeling domestic demand and arrival volume projections...</span>
                </div>
              )}

              {forecastError && (
                <p className="text-xs text-red-600 mt-2">{forecastError}</p>
              )}
            </div>

            {/* AI Forecast Result Box */}
            {forecastResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3 animate-in fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Market Outlook & Selling Advisory
                    </span>
                    <h5 className="font-extrabold text-sm text-emerald-950 mt-0.5">
                      Sentiment: {forecastResult.marketSentiment}
                    </h5>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 bg-white text-emerald-900 rounded-lg border border-emerald-300">
                    Est: {forecastResult.expectedPriceRange15Days}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-xs">
                  <span className="font-bold text-slate-800 block">Recommended Action:</span>
                  <p className="text-emerald-900 font-semibold mt-0.5">
                    {forecastResult.strategicRecommendation}
                  </p>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p><strong>Key Drivers:</strong> {forecastResult.demandDrivers.join(' • ')}</p>
                  <p><strong>Value-Addition Tip:</strong> {forecastResult.valueAdditionTip}</p>
                </div>

                <p className="text-[11px] italic text-emerald-900 bg-emerald-100/60 p-2 rounded-lg">
                  {forecastResult.summary}
                </p>
              </div>
            )}

          </div>

          {/* Quick Mandi Net Profit Margin Calculator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <h4 className="font-bold text-sm text-slate-900">
                Mandi Profit Margin & Net Farm Return Calculator
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Quantity for Sale (Quintals)
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcQuantityQuintals}
                  onChange={(e) => setCalcQuantityQuintals(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Estimated Cost of Production ({farmProfile.currency} / Quintal)
                </label>
                <input
                  type="number"
                  min="100"
                  value={calcCostOfProdPerQuintal}
                  onChange={(e) => setCalcCostOfProdPerQuintal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block">Total Revenue</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {farmProfile.currency} {totalRevenue.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block">Total Input Cost</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {farmProfile.currency} {totalCost.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block">Net Return / ROI</span>
                <span className={`font-extrabold mt-0.5 block ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {farmProfile.currency} {netProfit.toLocaleString()} (+{profitMarginPct}%)
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
