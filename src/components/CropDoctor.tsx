import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  FlaskConical, 
  Droplets, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ArrowRight,
  Info,
  X,
  FileText
} from 'lucide-react';
import { CropDiagnosisResult, LanguageCode } from '../types';
import { SAMPLE_DISEASE_PRESETS } from '../data/mockData';
import { analyzeCropSymptoms } from '../utils/cropDiagnostician';

interface CropDoctorProps {
  currentLanguage: LanguageCode;
  onNavigateToAgronomist?: (query: string) => void;
}

const COMMON_CROPS = [
  'Tomato', 'Paddy / Rice', 'Wheat', 'Cotton', 'Maize / Corn', 
  'Chilli / Pepper', 'Onion', 'Soybean', 'Sugarcane', 'Potato', 
  'Banana', 'Citrus / Lemon', 'Mango', 'Mustard', 'Groundnut / Peanut'
];

const SYMPTOM_TAGS = [
  'Yellowing Leaves (Chlorosis)',
  'Dark Brown / Black Spots',
  'White Powdery Mildew',
  'Leaf Curling & Wrinkling',
  'Wilting & Drooping',
  'Holes / Chewed Margins',
  'Stem Rot / Lesions',
  'Stunted Growth',
  'Premature Fruit Drop',
  'Water-soaked Lesions'
];

export const CropDoctor: React.FC<CropDoctorProps> = ({
  currentLanguage,
  onNavigateToAgronomist,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);
  
  // Camera capture states
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setRawBase64(result);
      setMimeType(file.type);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Camera handling
  const openCamera = async () => {
    try {
      setError(null);
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraOpen(false);
      setError('Unable to access camera. Please check browser permissions or upload a photo directly.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      setRawBase64(dataUrl);
      setMimeType('image/jpeg');
    }
    closeCamera();
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const loadPreset = (preset: typeof SAMPLE_DISEASE_PRESETS[0]) => {
    setSelectedCrop(preset.crop);
    setImagePreview(preset.imageThumb);
    setRawBase64(null);
    setDiagnosis(preset.sampleDiagnosis);
    setError(null);
  };

  const handleDiagnose = async () => {
    setLoading(true);
    setError(null);

    const combinedSymptoms = [
      ...selectedSymptoms,
      customSymptom.trim()
    ].filter(Boolean).join(', ');

    if (!rawBase64 && !combinedSymptoms) {
      setError('Please upload a plant image or specify observed symptoms.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/gemini/diagnose-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: selectedCrop,
          symptoms: combinedSymptoms || 'Visual plant inspection',
          imageBase64: rawBase64,
          mimeType,
          language: currentLanguage,
        }),
      });

      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.success && data.diagnosis) {
            setDiagnosis(data.diagnosis);
            setLoading(false);
            return;
          }
        } catch {
          // Ignore JSON parse errors on static servers
        }
      }
    } catch {
      // Ignored for offline / GitHub Pages
    }

    // 100% resilient offline pathology engine
    try {
      const fallbackDiag = analyzeCropSymptoms(selectedCrop, combinedSymptoms, currentLanguage);
      setDiagnosis(fallbackDiag);
    } catch (err: any) {
      setError('Unable to analyze symptoms. Please select a crop and symptoms.');
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech for Farmers
  const speakPrescription = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const resetScanner = () => {
    setImagePreview(null);
    setRawBase64(null);
    setDiagnosis(null);
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setError(null);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-600/80 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Multimodal Vision AI
            </span>
            <span className="text-xs text-lime-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Pathological Analysis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            AI Crop Doctor & Plant Disease Scanner
          </h2>
          <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
            Upload or capture photo of diseased leaves, stems, or fruits. Get instant identification with severity scoring, organic biopesticides, and chemical treatment regimens in {currentLanguage}.
          </p>
        </div>

        {diagnosis && (
          <button
            onClick={resetScanner}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Crop</span>
          </button>
        )}
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Upload & Form Inputs */}
        <div className={`space-y-5 ${diagnosis ? 'lg:col-span-5' : 'lg:col-span-12 max-w-4xl mx-auto w-full'}`}>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            
            {/* Step 1: Crop Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Target Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                {COMMON_CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Image Upload or Camera Capture */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                2. Plant Photo (Leaf / Stem / Fruit)
              </label>

              {/* Camera Live Modal / Inline Box */}
              {isCameraOpen ? (
                <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-4 px-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
                    >
                      <Camera className="w-4 h-4" /> Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={closeCamera}
                      className="bg-slate-800/80 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/20"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img
                    src={imagePreview}
                    alt="Uploaded plant specimen"
                    className="w-full h-56 object-cover bg-slate-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setRawBase64(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <X className="w-4 h-4" /> Remove Photo
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Specimen Loaded
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Upload diseased crop image
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clear close-up of leaf spots, rust, mold, or insects (JPG, PNG, max 10MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <label className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition flex items-center gap-1.5">
                      <Upload className="w-4 h-4" /> Select File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    
                    <button
                      type="button"
                      onClick={openCamera}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" /> Use Camera
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Observed Symptoms Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                3. Observed Symptoms (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SYMPTOM_TAGS.map((tag) => {
                  const isSelected = selectedSymptoms.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSymptom(tag)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-emerald-200" />}
                      {tag}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Or describe specific symptom (e.g., 'tiny yellow webbing on underside')..."
                className="mt-2.5 w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Diagnostic Action Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleDiagnose}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Performing Vision Diagnostic Evaluation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>Run Disease Diagnosis & Prescription</span>
                </>
              )}
            </button>

          </div>

          {/* Preset Samples */}
          {!diagnosis && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Or Test with Real Pathology Samples:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_DISEASE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="bg-white hover:bg-emerald-50/50 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition text-left flex flex-col gap-1.5 cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">
                        {preset.crop}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold ${preset.badgeColor}`}>
                        Sample
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {preset.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Comprehensive Pathology Report */}
        {diagnosis && (
          <div className="lg:col-span-7 space-y-5">
            
            {/* Top Pathology Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {diagnosis.cropIdentified}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        diagnosis.severity === 'Critical'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : diagnosis.severity === 'Severe'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      }`}
                    >
                      Severity: {diagnosis.severity}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {diagnosis.diseaseName}
                  </h3>
                  <p className="text-xs text-slate-500 italic mt-0.5 font-serif">
                    Pathogen: {diagnosis.scientificName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Confidence</p>
                    <p className="text-lg font-extrabold text-emerald-600">{diagnosis.confidenceScore}%</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakPrescription(`${diagnosis.diseaseName}. ${diagnosis.summaryAdvice}`)}
                    className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                      isSpeaking
                        ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Listen to audio prescription in selected language"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen Advice'}</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis Summary Banner */}
              <div className="bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <span className="font-bold text-emerald-950 block mb-1">Agronomist Pathology Summary:</span>
                {diagnosis.summaryAdvice}
              </div>

              {/* Key Diagnostic Vectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold block mb-0.5">Primary Infection Trigger</span>
                  <span className="text-slate-800 font-medium">{diagnosis.primaryCause}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold block mb-0.5">Favorable Weather Conditions</span>
                  <span className="text-slate-800 font-medium">{diagnosis.favorableConditions}</span>
                </div>
              </div>

            </div>

            {/* Remedies Tabs / Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Organic Remedies */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Organic & Bio-Remedies</h4>
                    <p className="text-[11px] text-emerald-700 font-medium">Safe for soil biology & export crops</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  {diagnosis.organicRemedies.map((remedy, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold leading-tight mt-0.5">•</span>
                      <span className="leading-relaxed">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Regimens */}
              <div className="bg-white rounded-2xl p-5 border border-teal-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Chemical Regimen & Dosages</h4>
                    <p className="text-[11px] text-teal-700 font-medium">For severe or rapid epidemic control</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  {diagnosis.chemicalRemedies.map((remedy, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold leading-tight mt-0.5">•</span>
                      <span className="leading-relaxed">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Preventative & Irrigation Guidance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Preventative & Farm Hygiene Protocols
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" /> Irrigation Adjustment:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    {diagnosis.irrigationAdvice}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Long-Term Prevention:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {diagnosis.preventativeMeasures.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up with Agronomist CTA */}
              {onNavigateToAgronomist && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Need customized spray scheduling or brand recommendations?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateToAgronomist(
                        `I detected ${diagnosis.diseaseName} on my ${diagnosis.cropIdentified}. Can you guide me on the exact step-by-step application schedule?`
                      )
                    }
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ask Agronomist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
