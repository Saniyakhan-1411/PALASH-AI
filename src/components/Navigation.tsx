import React from 'react';
import {
  Mic,
  BookOpen,
  Sparkles,
  FileText,
  Layers,
  CheckSquare,
  BarChart3,
  DownloadCloud,
  Settings,
  Home,
  GraduationCap,
  Image as ImageIcon,
  Radio,
  Building2,
} from 'lucide-react';
import { AuthUser } from './LoginModal';

interface NavigationProps {
  currentScreen: string;
  onSelectScreen: (screen: string) => void;
  currentUser: AuthUser;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onSelectScreen,
  currentUser,
}) => {
  const role = currentUser.role;

  // Student Navigation (Minimalist Icons with Tooltips)
  if (role === 'student') {
    const studentNav = [
      { id: 'student-dashboard', label: 'गृह (Home)', icon: GraduationCap },
      { id: 'classroom', label: 'लाइव कक्षा ब्रॉडकास्ट (Live Broadcast)', icon: Radio },
      { id: 'worksheets', label: 'कार्यपत्रक (Worksheets)', icon: FileText },
      { id: 'quiz', label: 'प्रश्नोत्तरी (Quiz)', icon: CheckSquare },
      { id: 'see-and-learn', label: 'देखो और सीखो (See & Learn)', icon: ImageIcon },
      { id: 'pronunciation', label: 'उच्चारण कोच (Speech Coach)', icon: Mic },
      { id: 'flashcards', label: 'फ़्लैशकार्ड (Flashcards)', icon: Layers },
      { id: 'settings', label: 'सेटिंग्स (Settings)', icon: Settings },
    ];

    return (
      <nav className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-xs sticky top-[69px] z-30 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center space-x-2 py-2 overflow-x-auto scrollbar-none">
          {studentNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentScreen === item.id ||
              (item.id === 'student-dashboard' && currentScreen === 'student-home');
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`relative group flex items-center justify-center p-2.5 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md scale-105'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-40">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Admin Navigation
  if (role === 'admin') {
    const adminNav = [
      { id: 'admin-dashboard', label: 'प्रशासक डैशबोर्ड (Overview)', icon: Building2 },
      { id: 'classroom', label: 'कक्षा प्रसारण निगरानी (Live Broadcast)', icon: Radio },
      { id: 'progress', label: 'प्रगति व विश्लेषण (Analytics)', icon: BarChart3 },
      { id: 'curriculum', label: 'पाठ्यक्रम (Curriculum)', icon: BookOpen },
      { id: 'offline', label: 'ऑफ़लाइन व सिंक प्रबंधक (Offline & Sync)', icon: DownloadCloud },
      { id: 'settings', label: 'सिस्टम सेटिंग्स (Settings)', icon: Settings },
    ];

    return (
      <nav className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-xs sticky top-[69px] z-30 transition-colors">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center space-x-2 py-2 overflow-x-auto scrollbar-none">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentScreen === item.id ||
              (item.id === 'admin-dashboard' && currentScreen === 'admin');
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`relative group flex items-center justify-center p-2.5 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-700 text-white shadow-md scale-105'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-40">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Teacher Navigation (Clean minimalist icons with tooltips)
  const teacherNav = [
    { id: 'home', label: 'शिक्षक गृह (Home)', icon: Home },
    { id: 'voice', label: 'द्विभाषी अनुवाद (Live Voice)', icon: Mic },
    { id: 'classroom', label: 'कक्षा प्रसारण (Classroom Broadcast)', icon: Radio },
    { id: 'see-and-learn', label: 'देखो और सीखो (See & Learn)', icon: ImageIcon },
    { id: 'pronunciation', label: 'उच्चारण कोच (Speech Coach)', icon: Mic },
    { id: 'flashcards', label: 'फ़्लैशकार्ड (Flashcards)', icon: Layers },
    { id: 'quiz', label: 'प्रश्नोत्तरी (Quiz)', icon: CheckSquare },
    { id: 'worksheet', label: 'कार्यपत्रक (Worksheet)', icon: FileText },
    { id: 'assistant', label: 'एआई सहायक (AI Co-pilot)', icon: Sparkles },
    { id: 'curriculum', label: 'पाठ्यक्रम (Curriculum)', icon: BookOpen },
    { id: 'progress', label: 'प्रगति विश्लेषण (Progress)', icon: BarChart3 },
    { id: 'offline', label: 'ऑफ़लाइन डेटा व सिंक (Offline & Sync)', icon: DownloadCloud },
    { id: 'settings', label: 'सेटिंग्स (Settings)', icon: Settings },
  ];

  return (
    <nav className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-xs sticky top-[69px] z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
        {teacherNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || (item.id === 'offline' && currentScreen === 'sync');
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              title={item.label}
              aria-label={item.label}
              className={`relative group flex items-center justify-center p-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-700 text-white shadow-md scale-105'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md z-40">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
