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
    setRawBase64(null); // use preset data directly
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

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Diagnostic evaluation failed.');
      }

      setDiagnosis(data.diagnosis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Diagnostic service is currently unavailable. Please try again.');
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
          <p className="text-sm text-emerald-200 mt-1 max-w-2xl">
            Upload or snap a photo of damaged leaves, stems, or fruits. Our agronomist neural network identifies pathogens and delivers immediate organic and chemical prescriptions.
          </p>
        </div>

        {/* Quick Reset / Status Button */}
        {diagnosis && (
          <button
            onClick={resetScanner}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Scan Another Crop
          </button>
        )}
      </div>

      {/* 1-Click Sample Disease Presets Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          Test instantly with verified sample pathological cases:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_DISEASE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition group cursor-pointer"
            >
              <img
                src={preset.imageThumb}
                alt={preset.title}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 group-hover:scale-105 transition shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-800 block truncate">
                  {preset.crop}
                </span>
                <span className="text-xs font-medium text-slate-700 block truncate">
                  {preset.title.split('(')[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Grid: Input Controls (Left) & Results/Prescription (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Crop & Symptom Input & Photo Capture */}
        <div className={`space-y-5 ${diagnosis ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
            
            {/* Step 1: Select Target Crop */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Target Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {COMMON_CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Upload or Snap Plant Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Capture or Upload Plant Photo
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 group">
                  <img
                    src={imagePreview}
                    alt="Uploaded crop preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setRawBase64(null);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow"
                    >
                      <X className="w-3.5 h-3.5" /> Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 hover:bg-emerald-50/40 cursor-pointer transition text-center">
                    <Upload className="w-6 h-6 text-emerald-700 mb-1.5" />
                    <span className="text-xs font-semibold text-slate-800">Upload Photo</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Camera Snap Button */}
                  <button
                    type="button"
                    onClick={openCamera}
                    className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 hover:bg-emerald-50/40 cursor-pointer transition text-center"
                  >
                    <Camera className="w-6 h-6 text-emerald-700 mb-1.5" />
                    <span className="text-xs font-semibold text-slate-800">Use Live Camera</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Snap leaf/stem now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Observed Symptoms */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Observed Symptoms (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {SYMPTOM_TAGS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="Other symptoms (e.g. leaf spots appearing after heavy rain)..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Run Analysis Button */}
            <button
              id="run-crop-diagnosis-btn"
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-300" />
                  <span>Analyzing Plant Pathology via AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>Run Disease Diagnosis & Prescription</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Prescription & Treatment Plan */}
        {diagnosis && (
          <div className="lg:col-span-7 space-y-5 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-5">
              
              {/* Top Banner: Diagnosis Header & Severity */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {diagnosis.cropIdentified} Pathology Report
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    {diagnosis.diseaseName}
                  </h3>
                  {diagnosis.scientificName && (
                    <p className="text-xs italic text-slate-500">
                      Scientific Name: {diagnosis.scientificName}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      AI Confidence
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      {diagnosis.confidenceScore}%
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                      diagnosis.severity === 'Critical'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : diagnosis.severity === 'Severe'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : diagnosis.severity === 'Moderate'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {diagnosis.severity} Severity
                  </span>
                </div>
              </div>

              {/* Audio Listen & Summary Advice Box */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3.5">
                <button
                  onClick={() => speakPrescription(`${diagnosis.diseaseName}. ${diagnosis.summaryAdvice}`)}
                  title={isSpeaking ? 'Stop Audio' : 'Listen to Prescription in Audio'}
                  className="p-2.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition shrink-0 shadow-xs"
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Executive Agronomist Summary
                  </p>
                  <p className="text-sm text-emerald-950 font-medium mt-0.5 leading-relaxed">
                    {diagnosis.summaryAdvice}
                  </p>
                </div>
              </div>

              {/* Primary Cause & Favorable Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">
                    Pathogen & Vector Cause:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {diagnosis.primaryCause}
                  </p>
                </div>

                {diagnosis.favorableConditions && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      Trigger Conditions:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {diagnosis.favorableConditions}
                    </p>
                  </div>
                )}
              </div>

              {/* Treatment Protocols: Organic & Bio-Control (Left) and Chemical (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Organic & Biological Control */}
                <div className="p-4 rounded-xl bg-lime-50/70 border border-lime-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-lime-900 font-bold text-xs uppercase tracking-wider">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Organic & Bio-Remedies</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {diagnosis.organicRemedies.map((remedy, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical / Fungicide / Pesticide Prescription */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <FlaskConical className="w-4 h-4 text-amber-700" />
                    <span>Chemical & Fungicide Treatment</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {diagnosis.chemicalRemedies.map((remedy, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Preventative & Irrigation Notes */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Irrigation & Long-Term Prevention Measures</span>
                </div>
                {diagnosis.irrigationAdvice && (
                  <p className="text-xs text-slate-700">
                    <strong>Irrigation Strategy:</strong> {diagnosis.irrigationAdvice}
                  </p>
                )}
                <ul className="space-y-1.5 text-xs text-slate-600 mt-2">
                  {diagnosis.preventativeMeasures.map((measure, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action: Ask Agronomist follow-up */}
              {onNavigateToAgronomist && (
                <button
                  onClick={() =>
                    onNavigateToAgronomist(
                      `My ${diagnosis.cropIdentified} is diagnosed with ${diagnosis.diseaseName}. Can you give me more specific dosage and mixing instructions for my field?`
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-50 text-emerald-900 border border-slate-300 hover:border-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ask AI Agronomist for custom spray schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Live Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-5 text-white border border-slate-700 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-lime-400" /> Position leaf inside frame
              </h4>
              <button
                onClick={closeCamera}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeCamera}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Camera className="w-4 h-4" /> Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
