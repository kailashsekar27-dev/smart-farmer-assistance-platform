import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  DollarSign, 
  Sun, 
  ShieldCheck, 
  CreditCard, 
  Droplets,
  Layers
} from 'lucide-react';
import { GovScheme, LanguageCode, FarmProfile } from '../types';
import { MOCK_GOV_SCHEMES } from '../data/mockData';

interface GovSchemesProps {
  currentLanguage: LanguageCode;
  farmProfile: FarmProfile;
  onAskAgronomist?: (query: string) => void;
}

export const GovSchemes: React.FC<GovSchemesProps> = ({
  currentLanguage,
  farmProfile,
  onAskAgronomist,
}) => {
  const [schemes] = useState<GovScheme[]>(MOCK_GOV_SCHEMES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(MOCK_GOV_SCHEMES[0].id);

  const categories = ['All', 'Direct Financial Support', 'Solar & Irrigation Subsidy', 'Crop Insurance', 'Credit & Loan'];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.authority.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-700 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Central & State Welfare Catalog
            </span>
            <span className="text-xs text-lime-300 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Direct Benefit Transfer (DBT)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Government Schemes, Subsidies & Agri-Credit Portal
          </h2>
          <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
            Verified official guidelines for agricultural subsidies, PM-KUSUM solar pump installations, PMFBY crop insurance claims, and low-interest Kisan Credit Cards.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search scheme (e.g. PM-KISAN, Solar Pump, Crop Insurance)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              {/* Header Row */}
              <div
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-slate-50/70"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {scheme.authority}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {scheme.title}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-3xl">
                    {scheme.summary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Benefit / Subsidy
                  </span>
                  <span className="text-xs font-bold text-emerald-700 max-w-xs block leading-tight mt-0.5">
                    {scheme.benefitAmount}
                  </span>
                  <span className="inline-block text-[10px] font-bold text-slate-500 mt-2">
                    {isExpanded ? '▲ Hide Details' : '▼ View Eligibility & Docs'}
                  </span>
                </div>
              </div>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/70 border-t border-slate-200 space-y-5 animate-in fade-in">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Eligibility Criteria */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Eligibility Criteria</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {scheme.eligibility.map((el, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span>Required Documents for Application</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {scheme.documentsNeeded.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Actions: Official Portal Link & Ask Agronomist */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Visit Official Application Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {onAskAgronomist && (
                      <button
                        onClick={() =>
                          onAskAgronomist(
                            `Can you guide me step-by-step on how to apply for ${scheme.title} for my ${farmProfile.totalAcreage} acre farm in ${farmProfile.location}?`
                          )
                        }
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ask AI Agronomist how to apply</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
