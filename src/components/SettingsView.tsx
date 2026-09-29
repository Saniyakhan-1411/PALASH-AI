import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Database,
  CheckCircle2,
  User,
  Volume2,
  Trash2,
  Check,
  Moon,
  Sun,
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
  HardDrive,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/curriculum';
import { LanguageCode } from '../types';
import { AuthUser } from './LoginModal';
import { offlineStorage } from '../services/offlineStorage';

interface SettingsViewProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentUser?: AuthUser | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLanguage,
  onLanguageChange,
  currentUser,
  theme = 'light',
  onToggleTheme,
  onLogout,
}) => {
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<string>('1.0');
  const [cacheSize, setCacheSize] = useState<string>('12.8 MB');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isOnlineState, setIsOnlineState] = useState<boolean>(offlineStorage.isOnline());
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = offlineStorage.subscribe((status) => {
      setIsOnlineState(status.isOnline);
      setPendingQueueCount(status.pendingCount);
      setIsSyncing(status.isSyncing);
    });
    setPendingQueueCount(offlineStorage.getPendingSyncQueue().length);
    return () => unsub();
  }, []);

  const handleClearCache = () => {
    localStorage.removeItem('palash_translation_history');
    setCacheSize('0.0 MB');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleNetwork = () => {
    offlineStorage.setSimulatedNetwork(!isOnlineState);
  };

  const handleTriggerSync = async () => {
    if (!isOnlineState) return;
    setIsSyncing(true);
    await offlineStorage.processSyncQueue();
    setIsSyncing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-stone-700/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2 border border-amber-400/20">
            <Settings className="w-3.5 h-3.5" />
            <span>Integrated Preferences & System Settings</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">प्रणाली सेटिंग्स (System Settings)</h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            थीम नियंत्रण, मातृभाषा चयन, ध्वनि गति, एकीकृत ऑफ़लाइन डेटा व सिंक प्रबंधक।
          </p>
        </div>

        {/* Global Logout in Settings */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट करें (Logout)</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-600 text-emerald-100 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>आपकी सेटिंग्स और वरीयताएं सफलतापूर्वक सुरक्षित कर ली गई हैं!</span>
        </div>
      )}

      {/* 1. Theme Configuration Card (Dark/Light Mode) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            एप्लिकेशन थीम (Display Theme Mode):
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {theme === 'dark' ? 'डार्क थीम (Dark)' : 'लाइट थीम (Light)'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
              डार्क थीम सक्रिय करें (Dark Mode Toggle)
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              कम रोशनी वाली कक्षाओं और ग्रामीण रात्रि अध्ययन में आँखों के तनाव को कम करता है।
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors shadow-inner ${
              theme === 'dark' ? 'bg-amber-500' : 'bg-stone-300'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-7 text-amber-600' : 'translate-x-0 text-stone-400'
              }`}
            >
              {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </div>
          </button>
        </div>
      </div>

      {/* 2. User Account Identity (Strictly View-only, No Switcher) */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <User className="w-4 h-4 text-red-700 dark:text-red-400" />
            सक्रिय उपयोगकर्ता विवरण (Account Details):
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 uppercase tracking-wide">
            {currentUser?.role === 'admin'
              ? 'प्रशासक (Admin)'
              : currentUser?.role === 'student'
              ? 'विद्यार्थी (Student)'
              : 'शिक्षक (Teacher)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block">नाम (Name):</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
              {currentUser?.name || 'मनोज कुमार मुर्मू'}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block">खाता आईडी / संपर्क:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
              {currentUser?.emailOrMobile || currentUser?.id || 'teacher@school.com'}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block">विद्यालय / संस्था:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {currentUser?.schoolName || 'राजकीय उत्क्रमित प्राथमिक विद्यालय (Jharkhand)'}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block">जिला / प्रखण्ड:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {currentUser?.district || 'Dumka (दुमका)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Primary Tribal Language Selection */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          प्राथमिक जनजातीय भाषा (Primary Tribal Language):
        </h3>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          कक्षा अनुवाद, उच्चारण गाइड और शिक्षण सामग्री के लिए अपनी स्थानीय भाषा चुनें।
        </p>

        <div className="space-y-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-red-600 bg-red-50/60 dark:bg-red-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{lang.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-600 dark:text-stone-300">
                      {lang.code}
                    </span>
                    {lang.code === 'sat_Olck' && (
                      <span className="text-[10px] bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full font-bold">
                        प्राथमिक (Primary)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-red-900 dark:text-red-400 font-serif font-bold mt-1">
                    {lang.nativeName} • लिपि: {lang.script}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Unified Offline Data & Sync Manager Module */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            एकीकृत ऑफ़लाइन डेटा एवं सिंक प्रबंधक (Offline Data & Sync Manager):
          </h3>
          <div className="flex items-center space-x-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOnlineState ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}
            ></span>
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
              {isOnlineState ? 'ऑनलाइन' : 'ऑफ़लाइन कैश मोड'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">नेटवर्क सिमुलेशन</span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {isOnlineState ? 'नेटवर्क उपलब्ध (Online)' : 'शून्य इंटरनेट (Offline Mode)'}
              </span>
            </div>
            <button
              onClick={handleToggleNetwork}
              className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isOnlineState
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {isOnlineState ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOnlineState ? 'ऑफ़लाइन करें' : 'ऑनलाइन करें'}</span>
            </button>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                लंबित सिंक कतार: {pendingQueueCount} आइटम
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                स्थानीय सिंगल-सोर्स कैश
              </span>
            </div>
            <button
              onClick={handleTriggerSync}
              disabled={!isOnlineState || isSyncing}
              className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'सिंक हो रहा...' : 'सिंक करें'}</span>
            </button>
          </div>
        </div>

        {/* Clear Local Cache */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
              ऑफ़लाइन कैश आकार: {cacheSize}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              सभी डाउनलोड किए गए पाठ, फ़्लैशकार्ड और अनुवाद
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-stone-500" />
            <span>कैश साफ़ करें</span>
          </button>
        </div>
      </div>

      {/* 5. Account Session & Logout Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <LogOut className="w-4 h-4 text-red-600" />
            सत्र प्रबंधन एवं लॉगआउट (Session & Logout):
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300">
            सक्रिय सत्र (Active Session)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
              वर्तमान सत्र से बाहर निकलें (Log out from current account)
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              लॉगआउट करने पर आपका सत्र समाप्त होगा और आप मुख्य लॉगिन स्क्रीन पर निर्देशित होंगे।
            </span>
          </div>

          {onLogout && (
            <button
              type="button"
              id="settings-logout-action-btn"
              onClick={onLogout}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>लॉगआउट करें (Logout Account)</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSavePreferences}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>वरीयताएं सुरक्षित करें (Save Preferences)</span>
        </button>
      </div>
    </div>
  );
};
