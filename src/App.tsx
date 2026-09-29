import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TeacherHome } from './components/TeacherHome';
import { StudentHome } from './components/StudentHome';
import { SeeAndLearn } from './components/SeeAndLearn';
import { PronunciationCoach } from './components/PronunciationCoach';
import { ClassroomView } from './components/ClassroomView';
import { AdminDashboard } from './components/AdminDashboard';
import { VoiceTranslator } from './components/VoiceTranslator';
import { AIAssistant } from './components/AIAssistant';
import { CurriculumBrowser } from './components/CurriculumBrowser';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizRunner } from './components/QuizRunner';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { OfflineSyncManager } from './components/OfflineSyncManager';
import { SettingsView } from './components/SettingsView';
import { StudentWorksheets } from './components/StudentWorksheets';
import { LoginModal, AuthUser } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageCode } from './types';
import { ShieldAlert, Eye, LogOut, ArrowLeft } from 'lucide-react';
import { classStore } from './data/classStore';

// Strict Role Guard Sets
const STUDENT_ALLOWED_SCREENS = new Set([
  'student-dashboard',
  'student-home',
  'classroom',
  'worksheets',
  'worksheet',
  'see-and-learn',
  'pronunciation',
  'flashcards',
  'quiz',
  'offline',
  'settings',
]);

const TEACHER_FORBIDDEN_SCREENS = new Set(['admin-dashboard', 'admin']);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('palash_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('palash_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('palash_auth_user');
    const token = localStorage.getItem('palash_auth_token');
    if (saved && token) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const path = window.location.pathname.replace(/^\//, '');
    const initialRoute = hash || path;

    const saved = localStorage.getItem('palash_auth_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'admin') return 'admin-dashboard';
        if (u.role === 'student') return 'student-dashboard';
        return initialRoute || 'home';
      } catch {
        // Ignore
      }
    }
    return initialRoute || 'home';
  });

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('sat_Olck');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  // Administrative Context Switching State (for Admin only)
  const [adminInspectionContext, setAdminInspectionContext] = useState<{
    role: 'teacher' | 'student';
    classNumber: number;
  } | null>(null);

  // Handle cross-role route violations immediately
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'student') {
      if (!STUDENT_ALLOWED_SCREENS.has(currentScreen)) {
        setSecurityAlert(
          'सुरक्षा प्रतिबंध: विद्यार्थी केवल छात्र मॉड्यूल देख सकते हैं। शिक्षक या व्यवस्थापक पृष्ठ पर पहुंच वर्जित है।'
        );
        setCurrentScreen('student-dashboard');
        window.history.replaceState(null, '', '#/student-dashboard');
        setTimeout(() => setSecurityAlert(null), 5000);
      }
    } else if (currentUser.role === 'teacher') {
      if (TEACHER_FORBIDDEN_SCREENS.has(currentScreen)) {
        setSecurityAlert(
          'सुरक्षा प्रतिबंध: शिक्षक व्यवस्थापक (Admin) पोर्टल का उपयोग नहीं कर सकते।'
        );
        setCurrentScreen('home');
        window.history.replaceState(null, '', '#/home');
        setTimeout(() => setSecurityAlert(null), 5000);
      }
    } else if (currentUser.role === 'admin' && !adminInspectionContext) {
      // Admin without inspection context attempting direct student-dashboard access
      if (currentScreen === 'student-dashboard' || currentScreen === 'student-home') {
        setSecurityAlert(
          'प्रशासक सुरक्षा: विद्यार्थी दृश्य देखने के लिए कृपया डैशबोर्ड में "प्रशासनिक संदर्भ स्विचर" का उपयोग करें।'
        );
        setCurrentScreen('admin-dashboard');
        window.history.replaceState(null, '', '#/admin-dashboard');
        setTimeout(() => setSecurityAlert(null), 5000);
      }
    }
  }, [currentScreen, currentUser, adminInspectionContext]);

  // Sync route and top scroll on screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentScreen) {
      const targetHash = `#/${currentScreen}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    }
  }, [currentScreen]);

  // Listen to hash changes (browser back/forward or manual hash change)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      if (hash) {
        if (hash === 'admin' || hash === 'admin-dashboard') {
          setCurrentScreen('admin-dashboard');
        } else if (hash === 'student-home' || hash === 'student-dashboard') {
          setCurrentScreen('student-dashboard');
        } else {
          setCurrentScreen(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = (user: AuthUser, token?: string) => {
    setCurrentUser(user);
    setAdminInspectionContext(null);
    if (user.role === 'student') {
      setCurrentScreen('student-dashboard');
      window.history.replaceState(null, '', '#/student-dashboard');
    } else if (user.role === 'admin') {
      setCurrentScreen('admin-dashboard');
      window.history.replaceState(null, '', '#/admin-dashboard');
    } else {
      setCurrentScreen('home');
      window.history.replaceState(null, '', '#/home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('palash_auth_user');
    localStorage.removeItem('palash_auth_token');
    setCurrentUser(null);
    setAdminInspectionContext(null);
    window.history.replaceState(null, '', '#/');
  };

  // Switch context from Admin to Teacher or Student inspection
  const handleAdminSwitchContext = (role: 'teacher' | 'student', classNumber = 1) => {
    setAdminInspectionContext({ role, classNumber });
    if (role === 'teacher') {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('student-dashboard');
    }
  };

  const handleExitAdminInspection = () => {
    setAdminInspectionContext(null);
    setCurrentScreen('admin-dashboard');
    window.history.replaceState(null, '', '#/admin-dashboard');
  };

  // If user is not logged in, show PALASH AI Login Screen as the FIRST screen
  if (!currentUser) {
    return (
      <AuthProvider>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </AuthProvider>
    );
  }

  // Active student user for inspection or actual logged in student
  const effectiveStudentUser: AuthUser =
    currentUser.role === 'student'
      ? currentUser
      : {
          id: `inspect-stu-${adminInspectionContext?.classNumber || 1}`,
          name: `कक्षा ${adminInspectionContext?.classNumber || 1} अवलोकन छात्र`,
          role: 'student',
          classNumber: adminInspectionContext?.classNumber || 1,
          schoolName: currentUser.schoolName,
          district: currentUser.district,
          motherTongue: 'Santali (Ol Chiki)',
        };

  return (
    <AuthProvider>
      <LanguageProvider initialLanguage={currentLanguage} onLanguageChangeExternal={setCurrentLanguage}>
        <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased flex flex-col selection:bg-red-200 selection:text-red-900 transition-colors">
        {/* Admin Inspection Banner (Shown when admin is previewing another role) */}
        {currentUser.role === 'admin' && adminInspectionContext && (
          <div className="bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-bold sticky top-0 z-50">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 animate-pulse text-amber-200" />
              <span>
                प्रशासनिक अवलोकन मोड (Admin Inspection Mode):{' '}
                {adminInspectionContext.role === 'teacher'
                  ? 'शिक्षक पोर्टल दृश्य (Teacher View)'
                  : `विद्यार्थी पोर्टल (कक्षा ${adminInspectionContext.classNumber} दृश्य)`}
              </span>
            </div>

            <button
              onClick={handleExitAdminInspection}
              id="exit-admin-inspection-btn"
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-black/30 hover:bg-black/40 text-white border border-white/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>प्रशासक डैशबोर्ड पर वापस लौटें (Exit Inspection)</span>
            </button>
          </div>
        )}

        {/* Security Alert Toast */}
        {securityAlert && (
          <div className="bg-red-700 text-white px-4 py-3 shadow-md flex items-center justify-between text-xs font-bold sticky top-0 z-40 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-200 shrink-0" />
              <span>{securityAlert}</span>
            </div>
            <button
              onClick={() => setSecurityAlert(null)}
              className="text-white/80 hover:text-white px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Header */}
        <Header
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onNavigate={setCurrentScreen}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Screen Body */}
        <main className="flex-1 py-6">
          {/* Sub-screen Contextual Back to Home Bar */}
          {currentScreen !== 'home' &&
            currentScreen !== 'student-dashboard' &&
            currentScreen !== 'student-home' &&
            currentScreen !== 'admin' &&
            currentScreen !== 'admin-dashboard' && (
              <div className="max-w-7xl mx-auto px-4 mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentScreen(
                      currentUser.role === 'student'
                        ? 'student-home'
                        : currentUser.role === 'admin'
                        ? 'admin'
                        : 'home'
                    )
                  }
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-red-700 dark:hover:text-red-400 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← मुख्य पृष्ठ पर वापस जाएं (Back to Home)</span>
                </button>
              </div>
            )}

          {/* Teacher Home */}
          {currentScreen === 'home' && (
            <TeacherHome onNavigate={setCurrentScreen} />
          )}

          {/* Student Home */}
          {(currentScreen === 'student-dashboard' || currentScreen === 'student-home') && (
            <StudentHome user={effectiveStudentUser} onNavigate={setCurrentScreen} />
          )}

          {/* Core Modules */}
          {currentScreen === 'voice' && <VoiceTranslator currentLanguage={currentLanguage} />}
          {currentScreen === 'see-and-learn' && <SeeAndLearn />}
          {currentScreen === 'pronunciation' && <PronunciationCoach />}
          {currentScreen === 'classroom' && <ClassroomView currentUser={currentUser} />}
          {(currentScreen === 'admin-dashboard' || currentScreen === 'admin') && (
            <AdminDashboard
              user={currentUser}
              onSwitchContext={handleAdminSwitchContext}
              onLogout={handleLogout}
              onNavigate={setCurrentScreen}
            />
          )}
          {currentScreen === 'assistant' && <AIAssistant />}
          {currentScreen === 'curriculum' && <CurriculumBrowser />}
          {(currentScreen === 'worksheets' ||
            (currentScreen === 'worksheet' &&
              (currentUser.role === 'student' || adminInspectionContext?.role === 'student'))) && (
            <StudentWorksheets
              user={effectiveStudentUser}
              onNavigateHome={() => setCurrentScreen('student-dashboard')}
            />
          )}
          {currentScreen === 'worksheet' &&
            currentUser.role !== 'student' &&
            adminInspectionContext?.role !== 'student' && (
              <WorksheetGenerator currentLanguage={currentLanguage} />
            )}
          {currentScreen === 'flashcards' && <FlashcardsView />}
          {currentScreen === 'quiz' && (
            <QuizRunner
              currentUser={
                currentUser.role === 'student' ? currentUser : effectiveStudentUser
              }
            />
          )}
          {currentScreen === 'progress' && <ProgressAnalytics />}
          {currentScreen === 'concept-gaps' && <ProgressAnalytics />}
          {currentScreen === 'offline' && <OfflineSyncManager />}
          {currentScreen === 'sync' && <OfflineSyncManager />}
          {currentScreen === 'settings' && (
            <SettingsView
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              currentUser={currentUser}
              theme={theme}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Role Switcher / Modal */}
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            currentUser={currentUser}
          />
        )}

        {/* Bottom Footer */}
        <footer className="bg-stone-900 text-stone-400 py-6 border-t border-stone-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="font-bold text-stone-200">PALASH AI (पलाश)</span>
              <span>— AI-Powered Vernacular Pedagogy for Primary Education</span>
            </div>
            <div className="flex items-center space-x-4 text-stone-400">
              <span>स्कूली शिक्षा एवं साक्षरता विभाग, झारखण्ड</span>
              <span>•</span>
              <span>NIPUN Bharat Aligned</span>
            </div>
          </div>
        </footer>
      </div>
      </LanguageProvider>
    </AuthProvider>
  );
}
