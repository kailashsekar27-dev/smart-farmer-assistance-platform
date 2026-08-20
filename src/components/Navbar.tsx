import React from 'react';
import { 
  Sprout, 
  Languages, 
  PhoneCall, 
  UserCheck, 
  Sparkles,
  Leaf
} from 'lucide-react';
import { LanguageCode, FarmProfile } from '../types';

interface NavbarProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  farmProfile: FarmProfile;
  onOpenProfile: () => void;
}

const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { code: 'Punjabi', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'Bengali', label: 'Bengali', native: 'বাংলা' },
  { code: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'Spanish', label: 'Spanish', native: 'Español' },
  { code: 'French', label: 'French', native: 'Français' },
  { code: 'Swahili', label: 'Swahili', native: 'Kiswahili' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  farmProfile,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white border-b border-emerald-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center shadow-inner text-emerald-950 font-black">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white sm:text-xl">
                  AgriSmart
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600">
                  <Sparkles className="w-3 h-3 text-lime-300" /> AI 3.7
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Smart Farmer Assistance & Advisory Platform
              </p>
            </div>
          </div>

          {/* Right Controls: Kisan Helpline, Language Switcher, Farm Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Quick Kisan Helpline Link */}
            <a 
              href="tel:18001801551" 
              title="Kisan Call Centre (Toll Free: 1800-180-1551)" 
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 text-xs font-medium border border-emerald-700 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-lime-400" />
              <span>Toll-Free Helpline: <strong>1800-180-1551</strong></span>
            </a>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Languages className="w-4 h-4 text-emerald-300 absolute left-2.5 pointer-events-none" />
              <select
                id="language-selector"
                value={currentLang}
                onChange={(e) => onSelectLang(e.target.value as LanguageCode)}
                className="bg-emerald-950/70 text-emerald-100 text-xs sm:text-sm font-medium pl-8 pr-7 py-1.5 rounded-lg border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer appearance-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-emerald-950 text-white">
                    {l.native} ({l.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Farm Profile Badge */}
            <button
              id="farm-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium border border-emerald-600 transition shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-lime-400" />
              <div className="text-left hidden lg:block">
                <p className="leading-tight font-semibold">{farmProfile.farmerName}</p>
                <p className="text-[10px] text-emerald-300 truncate max-w-[120px]">{farmProfile.location}</p>
              </div>
              <span className="lg:hidden">{farmProfile.farmerName.split(' ')[0]}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
