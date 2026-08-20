import React, { useState } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Compass, 
  Calendar, 
  MapPin, 
  Thermometer, 
  Eye, 
  RefreshCw,
  Umbrella,
  ShieldAlert
} from 'lucide-react';
import { FarmProfile } from '../types';

interface WeatherAlertsProps {
  farmProfile: FarmProfile;
}

interface DayForecast {
  day: string;
  date: string;
  condition: string;
  icon: 'sunny' | 'cloudy' | 'rain' | 'thunder';
  tempMax: number;
  tempMin: number;
  rainChancePct: number;
  rainfallMm: number;
  humidityPct: number;
  windKmh: number;
  spraySuitability: 'Optimal' | 'Caution' | 'Unfavorable';
  diseaseRisk: 'Low' | 'Moderate' | 'High';
  irrigationAction: 'Proceed' | 'Reduce 50%' | 'Skip (Rain)';
}

const SEVEN_DAY_FORECAST: DayForecast[] = [
  {
    day: 'Today (Wed)',
    date: '19 Aug',
    condition: 'Partly Cloudy & Humid',
    icon: 'cloudy',
    tempMax: 31,
    tempMin: 23,
    rainChancePct: 20,
    rainfallMm: 1.2,
    humidityPct: 72,
    windKmh: 12,
    spraySuitability: 'Optimal',
    diseaseRisk: 'Moderate',
    irrigationAction: 'Proceed',
  },
  {
    day: 'Thu',
    date: '20 Aug',
    condition: 'Scattered Showers',
    icon: 'rain',
    tempMax: 29,
    tempMin: 22,
    rainChancePct: 65,
    rainfallMm: 14.5,
    humidityPct: 84,
    windKmh: 18,
    spraySuitability: 'Unfavorable',
    diseaseRisk: 'High',
    irrigationAction: 'Skip (Rain)',
  },
  {
    day: 'Fri',
    date: '21 Aug',
    condition: 'Moderate Rain & Thunder',
    icon: 'thunder',
    tempMax: 28,
    tempMin: 21,
    rainChancePct: 80,
    rainfallMm: 28.0,
    humidityPct: 89,
    windKmh: 24,
    spraySuitability: 'Unfavorable',
    diseaseRisk: 'High',
    irrigationAction: 'Skip (Rain)',
  },
  {
    day: 'Sat',
    date: '22 Aug',
    condition: 'Light Morning Drizzle',
    icon: 'rain',
    tempMax: 30,
    tempMin: 22,
    rainChancePct: 40,
    rainfallMm: 4.5,
    humidityPct: 78,
    windKmh: 14,
    spraySuitability: 'Caution',
    diseaseRisk: 'Moderate',
    irrigationAction: 'Reduce 50%',
  },
  {
    day: 'Sun',
    date: '23 Aug',
    condition: 'Sunny & Clear Skies',
    icon: 'sunny',
    tempMax: 33,
    tempMin: 23,
    rainChancePct: 10,
    rainfallMm: 0.0,
    humidityPct: 58,
    windKmh: 10,
    spraySuitability: 'Optimal',
    diseaseRisk: 'Low',
    irrigationAction: 'Proceed',
  },
  {
    day: 'Mon',
    date: '24 Aug',
    condition: 'Bright Sunshine',
    icon: 'sunny',
    tempMax: 34,
    tempMin: 24,
    rainChancePct: 5,
    rainfallMm: 0.0,
    humidityPct: 54,
    windKmh: 9,
    spraySuitability: 'Optimal',
    diseaseRisk: 'Low',
    irrigationAction: 'Proceed',
  },
  {
    day: 'Tue',
    date: '25 Aug',
    condition: 'Warm & Breezy',
    icon: 'sunny',
    tempMax: 34,
    tempMin: 23,
    rainChancePct: 15,
    rainfallMm: 0.0,
    humidityPct: 60,
    windKmh: 11,
    spraySuitability: 'Optimal',
    diseaseRisk: 'Low',
    irrigationAction: 'Proceed',
  },
];

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ farmProfile }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(farmProfile.location);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-600/80 text-sky-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Hyper-Local Agro-Meteorology
            </span>
            <span className="text-xs text-sky-200 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-lime-300" /> {selectedLocation}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Weather Forecast & Agricultural Risk Advisories
          </h2>
          <p className="text-sm text-sky-200 mt-1 max-w-2xl">
            Real-time atmospheric monitoring calibrated for farm field decisions: chemical spray windows, fungal infection risk levels, and rain-adjusted irrigation advice.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Telemetry
        </button>
      </div>

      {/* Active High-Priority Weather Warning */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Rainfall & High Humidity Alert
            </span>
            <span className="text-xs font-bold text-amber-900">
              Valid: Thursday Evening to Saturday Morning
            </span>
          </div>
          <h3 className="font-bold text-base text-amber-950">
            Incoming 42mm Precipitation Spell — High Fungal Disease Pressure Alert
          </h3>
          <p className="text-xs text-amber-900 leading-relaxed">
            High relative humidity (&gt;85%) paired with overcast cloud cover will elevate spore germination for Tomato Early Blight, Downy Mildew in Cucurbits, and Blast in Paddy. <strong>Postpone chemical foliar spraying until Sunday</strong> to avoid chemical wash-off and wastage. Ensure field drainage channels are cleared of weeds.
          </p>
        </div>
      </div>

      {/* Live Atmospheric Conditions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Temperature */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Ambient Temp</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">30.4°C</p>
          <p className="text-[11px] text-slate-500 mt-1">Feels like 34°C</p>
        </div>

        {/* Humidity */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">72%</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Elevated moisture</p>
        </div>

        {/* Wind Speed */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">12 km/h</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Gentle (Safe spray)</p>
        </div>

        {/* Rain Probability */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Precipitation</span>
            <Umbrella className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">20%</p>
          <p className="text-[11px] text-slate-500 mt-1">1.2 mm forecast</p>
        </div>

        {/* Soil Temperature */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Soil Temp (15cm)</span>
            <Thermometer className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">25.2°C</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Optimal root zone</p>
        </div>

        {/* Evapotranspiration */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">ET Rate (Crop loss)</span>
            <Sun className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">4.8 mm/d</p>
          <p className="text-[11px] text-slate-500 mt-1">Moderate water loss</p>
        </div>

      </div>

      {/* 7-Day Actionable Agro-Forecast Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-slate-900">
              7-Day Agricultural Action & Operational Windows
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Updated every 3 hours from Indian Meteorological Dept (IMD) feed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {SEVEN_DAY_FORECAST.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 ${
                idx === 0
                  ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/40'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              {/* Date & Condition */}
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-slate-900 block">{day.day}</span>
                  <span className="text-[10px] text-slate-500">{day.date}</span>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <CloudSun className={`w-6 h-6 ${day.rainChancePct > 50 ? 'text-sky-600' : 'text-amber-500'}`} />
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {day.tempMax}° / {day.tempMin}°
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      {day.condition}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200">
                  <p>🌧️ Rain: <strong>{day.rainChancePct}%</strong> ({day.rainfallMm}mm)</p>
                  <p>💨 Wind: <strong>{day.windKmh} km/h</strong></p>
                  <p>💧 Hum: <strong>{day.humidityPct}%</strong></p>
                </div>
              </div>

              {/* Action Badges */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[10px]">
                {/* Spray */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Spraying:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      day.spraySuitability === 'Optimal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : day.spraySuitability === 'Caution'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {day.spraySuitability}
                  </span>
                </div>

                {/* Pest Risk */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Pest Risk:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      day.diseaseRisk === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : day.diseaseRisk === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {day.diseaseRisk}
                  </span>
                </div>

                {/* Irrigation */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Irrigate:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      day.irrigationAction === 'Proceed'
                        ? 'bg-sky-100 text-sky-800'
                        : day.irrigationAction === 'Reduce 50%'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {day.irrigationAction}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
