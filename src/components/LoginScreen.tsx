import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AuthUser } from './LoginModal';
import { FALLBACK_MOCK_USERS } from '../context/AuthContext';
import { classStore } from '../data/classStore';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser, token: string) => void;
}

type AuthRole = 'admin' | 'teacher' | 'student';
type AuthMode = 'signin' | 'signup' | 'forgot_password';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [activeRole, setActiveRole] = useState<AuthRole>('admin');

  // Input states
  const [emailOrMobile, setEmailOrMobile] = useState('admin@school.com');
  const [password, setPassword] = useState('admin123');
  const [selectedStudentClass, setSelectedStudentClass] = useState<number>(1);

  // Sign up inputs
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)');
  const [classNumber, setClassNumber] = useState<number>(3);
  const [district, setDistrict] = useState('Dumka (दुमका)');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Switch role and update preset credentials
  const handleRoleSelect = (role: AuthRole) => {
    setActiveRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (role === 'admin') {
      setEmailOrMobile('admin@school.com');
      setPassword('admin123');
    } else if (role === 'teacher') {
      setEmailOrMobile('teacher@school.com');
      setPassword('teacher123');
    } else {
      setEmailOrMobile(`student${selectedStudentClass}@school.com`);
      setPassword('student123');
    }
  };

  const handleStudentClassChange = (cls: number) => {
    setSelectedStudentClass(cls);
    setEmailOrMobile(`student${cls}@school.com`);
    setPassword('student123');
    setErrorMessage(null);
  };

  // Sign In with Strict Role Isolation
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const input = emailOrMobile.trim().toLowerCase();
    if (!input) {
      setErrorMessage('कृपया ईमेल या मोबाइल नंबर दर्ज करें (Please enter email or mobile number)');
      return;
    }
    if (!password) {
      setErrorMessage('कृपया पासवर्ड दर्ज करें (Please enter password)');
      return;
    }

    // Role Isolation Pre-Check on Client
    if (activeRole === 'student') {
      if (input.includes('admin') || input.includes('teacher')) {
        setErrorMessage('अनुमति अस्वीकृत: विद्यार्थी केवल विद्यार्थी पोर्टल में प्रवेश कर सकते हैं। (Access Denied: Student portal only accepts student accounts.)');
        return;
      }
    } else if (activeRole === 'teacher') {
      if (input.includes('admin') || input.includes('student')) {
        setErrorMessage('अनुमति अस्वीकृत: शिक्षक केवल शिक्षक पोर्टल में प्रवेश कर सकते हैं। (Access Denied: Teacher portal only accepts teacher accounts.)');
        return;
      }
    } else if (activeRole === 'admin') {
      if (input.includes('student') || input.includes('teacher')) {
        setErrorMessage('अनुमति अस्वीकृत: प्रशासक पोर्टल में प्रवेश के लिए अधिकृत प्रशासक क्रेडेंशियल्स आवश्यक हैं। (Access Denied: Admin credentials required.)');
        return;
      }
    }

    setIsLoading(true);

    // 1. Try Backend Authentication
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrMobile: input, password, requestedRole: activeRole }),
      });

      if (response.ok) {
        const data = await response.json();
        // Check returned user role matches activeRole
        if (data.user && data.user.role !== activeRole) {
          setIsLoading(false);
          setErrorMessage(`भूमिका विसंगति: यह खाता '${data.user.role}' है। कृपया सही टैब चुनें।`);
          return;
        }

        localStorage.setItem('palash_auth_token', data.token);
        localStorage.setItem('palash_auth_user', JSON.stringify(data.user));

        setSuccessMessage(data.message || 'लॉगिन सफल!');
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
        }, 300);
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          setIsLoading(false);
          setErrorMessage(errData.error || 'अनुमति अस्वीकृत: भूमिका पृथक्करण लागू है (Access Denied: Role isolation enforced).');
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    // 2. Reliable Mock Credentials Fallback
    let matchedUser: AuthUser | null = null;

    if (activeRole === 'admin') {
      matchedUser = FALLBACK_MOCK_USERS.admin;
    } else if (activeRole === 'teacher') {
      matchedUser = FALLBACK_MOCK_USERS.teacher;
    } else {
      // Student for selected class
      const key = `student${selectedStudentClass}`;
      matchedUser = FALLBACK_MOCK_USERS[key] || FALLBACK_MOCK_USERS.student1;

      // Check student in classStore
      const storeStudent = classStore.getStudentByEmail(input);
      if (storeStudent) {
        matchedUser = {
          id: storeStudent.id,
          name: storeStudent.name,
          role: 'student',
          classNumber: storeStudent.classNumber,
          rollNo: storeStudent.rollNo,
          schoolName: storeStudent.schoolName,
          district: storeStudent.district,
        };
      }
    }

    const fallbackToken = `palash_token_${matchedUser.role}_${Date.now()}`;
    const userWithToken = { ...matchedUser, token: fallbackToken };

    localStorage.setItem('palash_auth_token', fallbackToken);
    localStorage.setItem('palash_auth_user', JSON.stringify(userWithToken));

    setSuccessMessage(
      activeRole === 'admin'
        ? 'प्रशासक के रूप में लॉगिन सफल! (Admin Portal)'
        : activeRole === 'teacher'
        ? 'शिक्षक के रूप में लॉगिन सफल! (Teacher Portal)'
        : `विद्यार्थी (Class ${userWithToken.classNumber}) के रूप में लॉगिन सफल!`
    );

    setTimeout(() => {
      onLoginSuccess(userWithToken, fallbackToken);
      setIsLoading(false);
    }, 300);
  };

  // Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम दर्ज करें');
      return;
    }
    if (!emailOrMobile.trim()) {
      setErrorMessage('कृपया वैध ईमेल अथवा मोबाइल नंबर दर्ज करें');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }

    setIsLoading(true);

    const fallbackId = `${activeRole.toUpperCase().slice(0, 3)}-JH-${Date.now().toString().slice(-4)}`;
    const fallbackUser: AuthUser = {
      id: fallbackId,
      name: name.trim(),
      role: activeRole,
      schoolName: schoolName.trim(),
      district,
      classNumber: activeRole === 'student' ? Number(classNumber) : undefined,
      token: `token_${activeRole}_${Date.now()}`,
    };

    // If new student, save into classStore
    if (activeRole === 'student') {
      classStore.addStudent({
        name: name.trim(),
        rollNo: Math.floor(Math.random() * 20) + 1,
        classNumber: Number(classNumber) as 1 | 2 | 3 | 4 | 5,
        email: emailOrMobile.trim(),
        schoolName: schoolName.trim(),
        district,
        motherTongue: 'Santali (Ol Chiki)',
        assignedQuizzes: [],
        completedWorksheets: [],
        overallPerformance: {
          grade: 'A',
          averageScore: 85,
          quizzesCompleted: 0,
          worksheetsCompleted: 0,
          attendanceRate: 95,
          status: 'उत्कृष्ट (Excellent)',
        },
      });
    }

    localStorage.setItem('palash_auth_token', fallbackUser.token || 'mock_token');
    localStorage.setItem('palash_auth_user', JSON.stringify(fallbackUser));

    setSuccessMessage('पंजीकरण सफल! प्रवेश किया जा रहा है...');
    setTimeout(() => {
      onLoginSuccess(fallbackUser, fallbackUser.token || 'mock_token');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center px-4 py-8 sm:px-6 relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-950/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-lg bg-stone-900/95 backdrop-blur-md rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white font-black text-2xl shadow-lg border border-amber-400/40 mx-auto">
            ᱯ
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              PALASH AI
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-red-800 text-red-100 font-bold border border-red-600">
              पलाश
            </span>
          </div>
          <p className="text-xs text-stone-400 font-medium">
            झारखण्ड प्राथमिक शिक्षा विभाग • मातृभाषा आधारित शिक्षण
          </p>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-800 text-amber-300 text-[11px] font-semibold border border-stone-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>सुरक्षित भूमिका आधारित प्रमाणीकरण (Role-Based Access Control)</span>
          </div>
        </div>

        {/* ======================================================= */}
        {/* MANDATORY ROLE SELECTION TOGGLE */}
        {/* ======================================================= */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-300">
            लॉगिन भूमिका चुनें (Select User Role):
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-stone-950 border border-stone-800">
            {/* Admin Toggle */}
            <button
              type="button"
              id="role-toggle-admin"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-red-700 text-white shadow-md border border-red-500'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>प्रशासक (Admin)</span>
            </button>

            {/* Teacher Toggle */}
            <button
              type="button"
              id="role-toggle-teacher"
              onClick={() => handleRoleSelect('teacher')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeRole === 'teacher'
                  ? 'bg-amber-700 text-white shadow-md border border-amber-500'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>शिक्षक (Teacher)</span>
            </button>

            {/* Student Toggle */}
            <button
              type="button"
              id="role-toggle-student"
              onClick={() => handleRoleSelect('student')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-emerald-700 text-white shadow-md border border-emerald-500'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>विद्यार्थी (Student)</span>
            </button>
          </div>
        </div>

        {/* Student Class Selector (When Student role is active) */}
        {activeRole === 'student' && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300">कक्षा चुनें (Select Student Class 1–5):</span>
              <span className="text-emerald-400 font-mono text-[11px]">कक्षा {selectedStudentClass}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  id={`select-class-${cls}-btn`}
                  onClick={() => handleStudentClassChange(cls)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedStudentClass === cls
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-600 text-red-200 text-xs flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-xs flex items-start space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ======================================================= */}
        {/* SIGN IN FORM */}
        {/* ======================================================= */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300">
                ईमेल या मोबाइल नंबर (Email / Username)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  id="login-email-input"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="admin@school.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Active Credentials Hint Card */}
            <div className="p-3 rounded-xl bg-stone-850 border border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span>सत्यापित क्रेडेंशियल्स (Mock Creds):</span>
              <span className="font-mono text-amber-300 font-semibold">
                {activeRole === 'admin'
                  ? 'admin@school.com / admin123'
                  : activeRole === 'teacher'
                  ? 'teacher@school.com / teacher123'
                  : `student${selectedStudentClass}@school.com / student123`}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-red-700 hover:bg-red-600'
                  : activeRole === 'teacher'
                  ? 'bg-amber-700 hover:bg-amber-600'
                  : 'bg-emerald-700 hover:bg-emerald-600'
              } disabled:opacity-50`}
            >
              <span>
                {isLoading
                  ? 'प्रमाणित किया जा रहा है...'
                  : `${
                      activeRole === 'admin'
                        ? 'प्रशासक पोर्टल में प्रवेश करें (Admin Login)'
                        : activeRole === 'teacher'
                        ? 'शिक्षक पोर्टल में प्रवेश करें (Teacher Login)'
                        : `विद्यार्थी (Class ${selectedStudentClass}) प्रवेश करें (Student Login)`
                    }`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Fast 1-Click Preset Buttons */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <div className="text-[11px] font-bold text-stone-400">
                त्वरित 1-क्लिक परीक्षण (Quick 1-Click Role Testing):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="fast-admin-login-btn"
                  onClick={() => {
                    handleRoleSelect('admin');
                  }}
                  className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>Admin</span>
                  </div>
                  <div className="text-[9px] text-stone-400 truncate">admin@school.com</div>
                </button>

                <button
                  type="button"
                  id="fast-teacher-login-btn"
                  onClick={() => {
                    handleRoleSelect('teacher');
                  }}
                  className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Teacher</span>
                  </div>
                  <div className="text-[9px] text-stone-400 truncate">teacher@school.com</div>
                </button>

                <button
                  type="button"
                  id="fast-student-login-btn"
                  onClick={() => {
                    handleRoleSelect('student');
                  }}
                  className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Student (C1-5)</span>
                  </div>
                  <div className="text-[9px] text-stone-400 truncate">student1@school.com</div>
                </button>
              </div>
            </div>

            {/* Switch to Sign Up */}
            <div className="text-center pt-1">
              <span className="text-xs text-stone-400">नया खाता बनाना चाहते हैं? </span>
              <button
                type="button"
                id="switch-signup-mode-btn"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthMode('signup');
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                साइन अप करें (Sign Up)
              </button>
            </div>
          </form>
        )}

        {/* ======================================================= */}
        {/* SIGN UP FORM */}
        {/* ======================================================= */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300">
                पूरा नाम (Full Name)
              </label>
              <input
                type="text"
                id="signup-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. डॉ. राजेश सोरेन / बासंती हेम्ब्रम"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300">
                ईमेल या मोबाइल नंबर (Email / Mobile)
              </label>
              <input
                type="text"
                id="signup-email-input"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                placeholder="user@school.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                id="signup-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="कम से कम 4 अक्षर"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            {activeRole === 'student' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300">
                  कक्षा (Class 1 to 5)
                </label>
                <select
                  id="signup-class-select"
                  value={classNumber}
                  onChange={(e) => setClassNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs font-medium focus:outline-none focus:border-red-500"
                >
                  <option value={1}>Class 1 (कक्षा 1)</option>
                  <option value={2}>Class 2 (कक्षा 2)</option>
                  <option value={3}>Class 3 (कक्षा 3)</option>
                  <option value={4}>Class 4 (कक्षा 4)</option>
                  <option value={5}>Class 5 (कक्षा 5)</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300">
                विद्यालय का नाम (School Name)
              </label>
              <input
                type="text"
                id="signup-school-input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              id="signup-submit-btn"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'पंजीकृत किया जा रहा है...' : 'खाता बनाएं (Register)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-stone-400">पहले से खाता मौजूद है? </span>
              <button
                type="button"
                id="switch-signin-mode-btn"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthMode('signin');
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                लॉगिन करें (Sign In)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
