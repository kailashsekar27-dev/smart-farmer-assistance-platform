import React, { useState } from 'react';
import { 
  Cpu, 
  Droplets, 
  Thermometer, 
  BatteryCharging, 
  Power, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Play, 
  Square,
  Sparkles
} from 'lucide-react';
import { IoTSensorZone, FarmProfile } from '../types';
import { MOCK_IOT_ZONES } from '../data/mockData';

interface IoTSensorsProps {
  farmProfile: FarmProfile;
}

export const IoTSensors: React.FC<IoTSensorsProps> = ({ farmProfile }) => {
  const [zones, setZones] = useState<IoTSensorZone[]>(MOCK_IOT_ZONES);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const toggleValve = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextState = !z.valveOpen;
          return {
            ...z,
            valveOpen: nextState,
            irrigationStatus: nextState ? 'RUNNING' : 'OFF',
            lastSync: 'Just now (Command Dispatched)',
          };
        }
        return z;
      })
    );

    const targetZone = zones.find((z) => z.id === zoneId);
    if (targetZone) {
      const willOpen = !targetZone.valveOpen;
      setActionFeedback(
        `Automated valve ${willOpen ? 'OPENED' : 'CLOSED'} for ${targetZone.name}. Water flow ${willOpen ? 'started' : 'stopped'}.`
      );
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const simulateAutoWateringAllLowZones = () => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.soilMoisturePct < 35) {
          return {
            ...z,
            valveOpen: true,
            irrigationStatus: 'RUNNING',
            soilMoisturePct: 48,
            lastSync: 'Just now (Auto-balanced)',
          };
        }
        return z;
      })
    );
    setActionFeedback('Smart auto-balancing executed: Watered all moisture-deficit zones to target 48%.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-600 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Telemetry & Micro-Irrigation Actuators
            </span>
            <span className="text-xs text-lime-300 font-medium flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 animate-pulse text-lime-400" /> LoRaWAN Mesh Online
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Field IoT Sensors & Smart Irrigation Telemetry
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time subsurface soil moisture at 15cm & 30cm depth, N-P-K electro-conductivity, and remote solonoid valve actuators for automated drip irrigation.
          </p>
        </div>

        <button
          onClick={simulateAutoWateringAllLowZones}
          className="flex items-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-900" /> Auto-Irrigate Deficit Zones
        </button>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Field Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {zones.map((zone) => {
          const isDry = zone.soilMoisturePct < 35;
          const isHigh = zone.soilMoisturePct > 70;
          return (
            <div
              key={zone.id}
              className={`bg-white rounded-2xl p-6 border transition shadow-xs flex flex-col justify-between space-y-5 ${
                zone.valveOpen
                  ? 'border-sky-400 ring-2 ring-sky-300/50 bg-sky-50/20'
                  : isDry
                  ? 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Zone Top Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Field Sector
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {zone.name}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      {zone.crop} • {zone.areaAcres} Acres
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      zone.valveOpen
                        ? 'bg-sky-500 text-white animate-pulse'
                        : isDry
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {zone.valveOpen ? '💧 Drip Active' : isDry ? '⚠️ Moisture Low' : 'Standby'}
                  </span>
                </div>

                {/* Soil Moisture Gauge */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-sky-600" /> Soil Moisture (15cm Depth)
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {zone.soilMoisturePct}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDry
                          ? 'bg-amber-500'
                          : isHigh
                          ? 'bg-sky-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(zone.soilMoisturePct, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Dry (&lt;30%)</span>
                    <span>Target Ideal (40-60%)</span>
                    <span>Saturated (&gt;75%)</span>
                  </div>
                </div>

                {/* Sensor Matrix: Temp, pH, NPK */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Soil Temp / pH</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {zone.soilTempC}°C • pH {zone.soilPh}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">NPK Nutrients</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      N:{zone.npkNitrogenPpm} P:{zone.npkPhosphorusPpm} K:{zone.npkPotassiumPpm}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Air Temp & Hum</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {zone.ambientTempC}°C • {zone.ambientHumidityPct}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Sensor Battery</span>
                    <span className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> {zone.batteryLevelPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actuator Valve Controls */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => toggleValve(zone.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    zone.valveOpen
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {zone.valveOpen ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Drip Irrigation Valve</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Open Solenoid Drip Valve</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Last sync: {zone.lastSync}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
