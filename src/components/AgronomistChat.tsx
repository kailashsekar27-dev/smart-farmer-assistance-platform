import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Wheat,
  ShieldCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { ChatMessage, LanguageCode, FarmProfile } from '../types';
import { generateAgronomistResponse } from '../utils/agronomyBrain';

interface AgronomistChatProps {
  currentLanguage: LanguageCode;
  farmProfile: FarmProfile;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

const QUICK_PROMPTS = [
  'How to prepare Jeevamrutha organic bio-fertilizer at home?',
  'Best split application schedule for Urea and Potash in Paddy?',
  'Remedy for yellowing leaves and early blight spots in Tomato',
  'Government subsidies for drip irrigation systems under PMKSY',
  'Tips to control sucking pests and aphids with organic sprays',
];

export const AgronomistChat: React.FC<AgronomistChatProps> = ({
  currentLanguage,
  farmProfile,
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste **${farmProfile.farmerName}**! I am your AI Agronomist companion for **${farmProfile.farmName}** (${farmProfile.totalAcreage} acres in ${farmProfile.location}).\n\nI can advise you on crop nutrition, pest & disease identification, organic formulas, and Mandi price strategies in ${currentLanguage}. How can I assist your farm today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([
    'Custom fertilizer schedule',
    'How to protect crops from pests?',
    'Recipe for organic Jeevamrutha',
    'Government farm subsidies',
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle initial query from another tab if provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== '') {
      handleSendMessage(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Initialize Web Speech API for voice dictation
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<LanguageCode, string> = {
        English: 'en-IN',
        Hindi: 'hi-IN',
        Tamil: 'ta-IN',
        Telugu: 'te-IN',
        Kannada: 'kn-IN',
        Malayalam: 'ml-IN',
        Marathi: 'mr-IN',
        Bengali: 'bn-IN',
        Gujarati: 'gu-IN',
        Punjabi: 'pa-IN',
      };

      recognition.lang = langMap[currentLanguage] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Text to speech for replies
  const handleSpeak = (text: string, msgId: string) => {
    if (!synthRef.current) return;

    if (speakingMsgId === msgId) {
      synthRef.current.cancel();
      setSpeakingMsgId(null);
      return;
    }

    synthRef.current.cancel();

    const cleanText = text.replace(/[*_#`•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langVoiceMap: Record<LanguageCode, string> = {
      English: 'en-IN',
      Hindi: 'hi-IN',
      Tamil: 'ta-IN',
      Telugu: 'te-IN',
      Kannada: 'kn-IN',
      Malayalam: 'ml-IN',
      Marathi: 'mr-IN',
      Bengali: 'bn-IN',
      Gujarati: 'gu-IN',
      Punjabi: 'pa-IN',
    };

    utterance.lang = langVoiceMap[currentLanguage] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    synthRef.current.speak(utterance);
  };

  const handleSendMessage = async (customText?: string) => {
    const query = (customText || inputMessage).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLanguage,
          farmProfile: {
            farmerName: farmProfile.farmerName,
            farmName: farmProfile.farmName,
            location: farmProfile.location,
            totalAcreage: farmProfile.totalAcreage,
            primaryCrops: farmProfile.primaryCrops,
            soilType: farmProfile.soilType,
          },
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.reply) {
        throw new Error(data.error || 'Failed to get agronomist advice');
      }

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // 100% reliable fallback for static hosting / GitHub Pages
      const answer = generateAgronomistResponse(query, farmProfile, currentLanguage);
      
      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: answer.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (answer.suggestedFollowUps && answer.suggestedFollowUps.length > 0) {
        setSuggestedFollowUps(answer.suggestedFollowUps);
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm">Dedicated AI Agronomist</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                Online ({currentLanguage})
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized for {farmProfile.farmName} • {farmProfile.primaryCrops.join(', ')}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: `Namaste **${farmProfile.farmerName}**! How can I assist you with your ${farmProfile.primaryCrops.join(', ')} crops today?`,
                timestamp: 'Just now',
              },
            ])
          }
          title="Reset conversation"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Suggested:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 px-3 py-1 rounded-full whitespace-nowrap transition shrink-0 cursor-pointer shadow-2xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[78%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>

                <div
                  className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.content, msg.id)}
                      className={`hover:text-emerald-700 flex items-center gap-1 transition ${
                        speakingMsgId === msg.id ? 'text-emerald-600 font-semibold' : ''
                      }`}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3 h-3 text-red-500 animate-pulse" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5 max-w-[75%] mr-auto">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
                <span className="text-xs text-slate-500 ml-2 font-medium">
                  Analyzing farm conditions...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Follow-Up Prompt Chips */}
      {suggestedFollowUps.length > 0 && (
        <div className="px-3 py-2 bg-emerald-50/50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Next:
          </span>
          {suggestedFollowUps.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-xs bg-white hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap transition shrink-0 cursor-pointer shadow-2xs font-medium"
            >
              {chip} →
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask your agronomy question in ${currentLanguage}... (e.g. 'Pest spray for Cotton')`}
              disabled={loading}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
