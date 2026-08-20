import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Bot, 
  Droplet, 
  CloudSun, 
  TrendingUp, 
  Cpu, 
  Award, 
  BookOpen
} from 'lucide-react';
import { AppTab } from '../types';

interface TabNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const TABS: { id: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cropDoctor', label: 'AI Crop Doctor', icon: Stethoscope, badge: 'Vision' },
  { id: 'advisory', label: 'AI Agronomist', icon: Bot, badge: 'Voice' },
  { id: 'fertilizerCalculator', label: 'Fertilizer & NPK', icon: Droplet },
  { id: 'weatherAlerts', label: 'Weather & Ag-Risks', icon: CloudSun },
  { id: 'mandiPrices', label: 'Mandi Market Rates', icon: TrendingUp },
  { id: 'iotSensors', label: 'IoT Field Sensors', icon: Cpu },
  { id: 'govSchemes', label: 'Govt Schemes & Subsidies', icon: Award },
  { id: 'farmLogbook', label: 'Farm Ledger & Tasks', icon: BookOpen },
];

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-emerald-100 shadow-xs sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-lime-300' : 'text-emerald-700'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-lime-400 text-emerald-950'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
