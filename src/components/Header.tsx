import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
  Moon,
  Sun,
  Settings,
  Home,
} from 'lucide-react';
import { offlineStorage } from '../services/offlineStorage';
import { SUPPORTED_LANGUAGES } from '../data/curriculum';
import { LanguageCode } from '../types';
import { AuthUser } from './LoginModal';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigate: (screen: string) => void;
  currentUser: AuthUser;
  onOpenLoginModal: () => void;
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onNavigate,
  currentUser,
  onOpenLoginModal,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  const { currentLanguage: ctxLanguage, setLanguage } = useLanguage();
  const effectiveLanguage = ctxLanguage || currentLanguage;

  const [syncState, setSyncState] = useState({
    pendingCount: 0,
    isOnline: true,
    isSyncing: false,
  });

  useEffect(() => {
    const unsub = offlineStorage.subscribe((status) => {
      setSyncState(status);
    });
    return () => unsub();
  }, []);

  const toggleNetwork = () => {
    const nextState = !syncState.isOnline;
    offlineStorage.setSimulatedNetwork(nextState);
  };

  const getRoleBadge = () => {
    if (currentUser.role === 'student') {
      return {
        label: 'विद्यार्थी (Student)',
        bg: 'bg-emerald-800 text-emerald-100 border-emerald-600',
        icon: GraduationCap,
      };
    }
    if (currentUser.role === 'admin') {
      return {
        label: 'प्रशासक (Admin / DEO)',
        bg: 'bg-indigo-800 text-indigo-100 border-indigo-600',
        icon: Building2,
      };
    }
    return {
      label: 'शिक्षक (Teacher)',
      bg: 'bg-red-800 text-red-100 border-red-600',
      icon: User,
    };
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-stone-900/95">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate(currentUser.role === 'student' ? 'student-home' : currentUser.role === 'admin' ? 'admin' : 'home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-md border border-amber-400/30 group-hover:scale-105 transition-transform">
            ᱯ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                PALASH AI
                <span className="text-xs px-2 py-0.5 rounded bg-red-800 text-red-100 font-semibold border border-red-700">
                  पलाश
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-400 font-medium">
              मातृभाषा आधारित प्राथमिक शिक्षा (Mother Tongue-Based Pedagogy)
            </p>
          </div>
        </div>

        {/* Controls & Badges */}
        <div className="flex items-center flex-wrap gap-2 text-sm">
          {/* Language Pair Selector */}
          <div className="flex items-center bg-stone-800/90 rounded-lg px-2.5 py-1 border border-stone-700">
            <Globe className="w-4 h-4 text-amber-400 mr-1.5 shrink-0" />
            <span className="text-xs text-stone-400 mr-1.5 hidden sm:inline">भाषा:</span>
            <select
              value={effectiveLanguage}
              onChange={(e) => {
                const next = e.target.value as LanguageCode;
                onLanguageChange(next);
                setLanguage(next);
              }}
              className="bg-transparent text-xs font-semibold text-amber-300 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-900 text-white">
                  हिन्दी ➔ {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Network Simulator Toggle */}
          <button
            onClick={toggleNetwork}
            title="Click to toggle between Online mode and Offline rural mode"
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              syncState.isOnline
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-amber-950/80 border-amber-600 text-amber-300 hover:bg-amber-900'
            }`}
          >
            {syncState.isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>ऑनलाइन</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>ऑफ़लाइन</span>
              </>
            )}
          </button>

          {/* Sync Status Badge */}
          <div
            onClick={() => onNavigate('sync')}
            className="flex items-center space-x-1.5 bg-stone-800 px-2.5 py-1 rounded-lg text-xs border border-stone-700 cursor-pointer hover:border-stone-500"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncState.isSyncing
                  ? 'animate-spin text-amber-400'
                  : syncState.pendingCount > 0
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            />
            <span className="hidden sm:inline">
              {syncState.isSyncing
                ? 'सिंक...'
                : syncState.pendingCount > 0
                ? `${syncState.pendingCount} कतार में`
                : 'क्लाउड सिंक'}
            </span>
          </div>

          {/* Active Role Profile */}
          <div className="flex items-center space-x-2 bg-stone-800/90 rounded-xl px-3 py-1.5 border border-stone-700">
            <div
              className={`flex items-center space-x-1.5 text-xs font-bold px-2 py-0.5 rounded-lg ${roleInfo.bg}`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{currentUser.name}</span>
              <span className="text-[10px] opacity-80 hidden md:inline">({roleInfo.label})</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
