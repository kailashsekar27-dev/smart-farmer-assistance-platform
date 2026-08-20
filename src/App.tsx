import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TabNav } from './components/TabNav';
import { FarmOverview } from './components/FarmOverview';
import { CropDoctor } from './components/CropDoctor';
import { AgronomistChat } from './components/AgronomistChat';
import { FertilizerCalculator } from './components/FertilizerCalculator';
import { WeatherAlerts } from './components/WeatherAlerts';
import { MandiMarket } from './components/MandiMarket';
import { IoTSensors } from './components/IoTSensors';
import { GovSchemes } from './components/GovSchemes';
import { FarmLogbook } from './components/FarmLogbook';
import { ProfileModal } from './components/ProfileModal';
import { AppTab, LanguageCode, FarmProfile } from './types';
import { INITIAL_FARM_PROFILE } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('English');
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() => {
    try {
      const saved = localStorage.getItem('agrismart_farm_profile');
      return saved ? JSON.parse(saved) : INITIAL_FARM_PROFILE;
    } catch {
      return INITIAL_FARM_PROFILE;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [agronomistInitialQuery, setAgronomistInitialQuery] = useState<string | undefined>(undefined);

  const handleSaveProfile = (newProfile: FarmProfile) => {
    setFarmProfile(newProfile);
    try {
      localStorage.setItem('agrismart_farm_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToAgronomist = (query: string) => {
    setAgronomistInitialQuery(query);
    setActiveTab('advisory');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col antialiased selection:bg-lime-300 selection:text-emerald-950 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLanguage}
        onSelectLang={setCurrentLanguage}
        farmProfile={farmProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Tab Navigation */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <FarmOverview
            farmProfile={farmProfile}
            onNavigateTab={setActiveTab}
            onAskAgronomist={navigateToAgronomist}
          />
        )}

        {activeTab === 'cropDoctor' && (
          <CropDoctor
            currentLanguage={currentLanguage}
            onNavigateToAgronomist={navigateToAgronomist}
          />
        )}

        {activeTab === 'advisory' && (
          <AgronomistChat
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            initialQuery={agronomistInitialQuery}
            onClearInitialQuery={() => setAgronomistInitialQuery(undefined)}
          />
        )}

        {activeTab === 'fertilizerCalculator' && (
          <FertilizerCalculator
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
          />
        )}

        {activeTab === 'weatherAlerts' && (
          <WeatherAlerts farmProfile={farmProfile} />
        )}

        {activeTab === 'mandiPrices' && (
          <MandiMarket
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
          />
        )}

        {activeTab === 'iotSensors' && (
          <IoTSensors farmProfile={farmProfile} />
        )}

        {activeTab === 'govSchemes' && (
          <GovSchemes
            currentLanguage={currentLanguage}
            farmProfile={farmProfile}
            onAskAgronomist={navigateToAgronomist}
          />
        )}

        {activeTab === 'farmLogbook' && (
          <FarmLogbook farmProfile={farmProfile} />
        )}
      </main>

      {/* Farm Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        farmProfile={farmProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>
            © 2026 Smart Farmer Assistance Platform (AgriSmart). Dedicated to precision agriculture and farmer prosperity.
          </p>
          <div className="flex items-center gap-4 text-emerald-400">
            <span>Kisan Call Center: 1800-180-1551</span>
            <span>•</span>
            <span>e-NAM Integrated</span>
            <span>•</span>
            <span>IMD Weather Verified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
