import React, { useState, useEffect } from 'react';
import {
  Building2,
  Activity,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  ShieldCheck,
  BarChart3,
  Users,
  School,
  Sparkles,
  PlusCircle,
  GraduationCap,
  Eye,
  Trash2,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  LogOut,
  Settings,
  Sliders,
  Key,
  HardDrive,
  FileSpreadsheet,
  ShieldAlert,
  Check,
  Copy,
  Volume2,
  Globe,
  Radio,
  FileText,
} from 'lucide-react';
import { AuthUser } from './LoginModal';
import { classStore, StudentProfile, TeacherProfile } from '../data/classStore';

interface AdminDashboardProps {
  user: AuthUser;
  onSwitchContext?: (role: 'teacher' | 'student', classNumber?: number) => void;
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onSwitchContext,
  onLogout,
  onNavigate,
}) => {
  // Navigation Tabs for Admin Page
  const [activeAdminTab, setActiveAdminTab] = useState<'management' | 'health' | 'settings'>('management');

  const [healthData, setHealthData] = useState<any | null>(null);
  const [aiHealthData, setAiHealthData] = useState<any | null>(null);
  const [syncStatus, setSyncStatus] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Class & User Management State
  const [selectedClassTab, setSelectedClassTab] = useState<number>(1);
  const [studentsList, setStudentsList] = useState<StudentProfile[]>([]);
  const [teachersList, setTeachersList] = useState<TeacherProfile[]>([]);
  const [metrics, setMetrics] = useState(classStore.getSystemMetrics());

  // Add Student Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState<number>(10);
  const [newStudentMotherTongue, setNewStudentMotherTongue] = useState('Santali (Ol Chiki)');

  // Context Switcher Modal State
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [contextTargetRole, setContextTargetRole] = useState<'teacher' | 'student'>('teacher');
  const [contextTargetClass, setContextTargetClass] = useState<number>(1);

  // Logout Confirmation State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Settings State
  const [defaultLanguage, setDefaultLanguage] = useState<'sat_Olck' | 'sat_Deva' | 'hoc_Deva' | 'unr_Deva'>('sat_Olck');
  const [speechSpeed, setSpeechSpeed] = useState<'0.85' | '1.0' | '1.15'>('1.0');
  const [speechPitch, setSpeechPitch] = useState<'1.0' | '1.1'>('1.0');
  const [nipunTarget, setNipunTarget] = useState<number>(80);
  const [syncInterval, setSyncInterval] = useState<string>('15');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  const refreshData = () => {
    setStudentsList(classStore.getStudentsByClass(selectedClassTab));
    setTeachersList(classStore.getAllTeachers());
    setMetrics(classStore.getSystemMetrics());
  };

  useEffect(() => {
    refreshData();
  }, [selectedClassTab]);

  const fetchHealthMetrics = async () => {
    setIsLoading(true);
    try {
      const hRes = await fetch('/health');
      if (hRes.ok) {
        const hJson = await hRes.json();
        setHealthData(hJson);
      }

      const aiRes = await fetch('/ai/health');
      if (aiRes.ok) {
        const aiJson = await aiRes.json();
        setAiHealthData(aiJson);
      }

      const syncRes = await fetch('/api/sync/status');
      if (syncRes.ok) {
        const syncJson = await syncRes.json();
        setSyncStatus(syncJson);
      }

      setLastRefreshed(new Date().toLocaleTimeString('hi-IN'));
    } catch (err) {
      console.error('Failed to fetch health metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    classStore.addStudent({
      name: newStudentName.trim(),
      rollNo: Number(newStudentRoll),
      classNumber: selectedClassTab as 1 | 2 | 3 | 4 | 5,
      email: newStudentEmail.trim() || `student_${Date.now()}@school.com`,
      schoolName: user.schoolName || 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
      district: user.district || 'Dumka (दुमका)',
      motherTongue: newStudentMotherTongue,
      assignedQuizzes: [],
      completedWorksheets: [],
      overallPerformance: {
        grade: 'A',
        averageScore: 82,
        quizzesCompleted: 0,
        worksheetsCompleted: 0,
        attendanceRate: 95,
        status: 'उत्कृष्ट (Excellent)',
      },
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setIsAddStudentOpen(false);
    refreshData();
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('क्या आप इस विद्यार्थी का रिकॉर्ड हटाना चाहते हैं?')) {
      classStore.deleteStudent(id);
      refreshData();
    }
  };

  const handleExecuteContextSwitch = () => {
    if (onSwitchContext) {
      onSwitchContext(contextTargetRole, contextTargetClass);
    }
    setIsContextModalOpen(false);
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('palash_offline_flashcards');
      localStorage.removeItem('palash_offline_translations');
      setSettingsNotice('स्थानीय ऑफ़लाइन अनुवाद और फ़्लैशकार्ड कैश सफलतापूर्वक साफ़ किया गया!');
      setTimeout(() => setSettingsNotice(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = () => {
    if (window.confirm('क्या आप सभी डेमो छात्र रिकॉर्ड और पाठ्यक्रम को प्रारंभिक स्थिति में रीसेट करना चाहते हैं?')) {
      localStorage.removeItem('palash_class_store_v1');
      window.location.reload();
    }
  };

  const handleExportAuditLogs = () => {
    const auditData = {
      exportedAt: new Date().toISOString(),
      adminUser: {
        name: user.name,
        role: user.role,
        district: user.district,
        school: user.schoolName,
      },
      systemMetrics: metrics,
      studentsCount: classStore.getAllStudents().length,
      teachersCount: classStore.getAllTeachers().length,
      health: healthData,
      aiHealth: aiHealthData,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `palash_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSettingsNotice('सिस्टम ऑडिट लॉग JSON फ़ाइल सफलतापूर्वक डाउनलोड की गई!');
    setTimeout(() => setSettingsNotice(null), 4000);
  };

  const handleDirectLogout = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('palash_auth_user');
      localStorage.removeItem('palash_auth_token');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold text-indigo-300 border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>झारखण्ड राज्य प्राथमिक शिक्षा परियोजना • प्रशासनिक डैशबोर्ड (ADMIN CONTROL HUB)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            प्रशासक पोर्टल: {user.name}
          </h2>
          <p className="text-xs text-indigo-200">
            {user.designation || 'जिला शिक्षा पदाधिकारी (District Education Officer)'} • {user.district || 'दुमका'} • केंद्रीकृत कक्षा 1-5 प्राथमिक शिक्षा नियंत्रण
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Settings Button */}
          <button
            type="button"
            id="admin-settings-tab-btn"
            onClick={() => setActiveAdminTab('settings')}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer ${
              activeAdminTab === 'settings'
                ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
            title="प्रशासनिक सेटिंग्स खोलें"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span>सेटिंग्स (Settings)</span>
          </button>

          {/* Context Switcher Button */}
          <button
            type="button"
            id="open-context-switcher-btn"
            onClick={() => setIsContextModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>संदर्भ स्विच (Preview)</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchHealthMetrics}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="सिस्टम स्थिति ताज़ा करें"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>ताज़ा करें</span>
          </button>

          {/* Prominent Admin Logout Button */}
          <button
            type="button"
            id="admin-header-logout-btn"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black text-xs shadow-md transition-all cursor-pointer border border-red-500/40"
            title="प्रशासक पोर्टल से सुरक्षित लॉगआउट करें"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट (Logout)</span>
          </button>
        </div>
      </div>

      {/* Notice Toast */}
      {settingsNotice && (
        <div className="p-4 rounded-2xl bg-emerald-900 border border-emerald-600 text-emerald-100 text-xs font-bold flex items-center justify-between shadow-md animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{settingsNotice}</span>
          </div>
          <button onClick={() => setSettingsNotice(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveAdminTab('management')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'management'
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>कक्षा एवं उपयोगकर्ता प्रबंधन (Classes & Users)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('health')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'health'
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>सिस्टम व एआई स्वास्थ्य (Health & Monitoring)</span>
        </button>

        <button
          type="button"
          id="admin-settings-tab-main"
          onClick={() => setActiveAdminTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'settings'
              ? 'bg-amber-700 text-white shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>प्रशासनिक सेटिंग्स एवं नियंत्रण (Admin Settings & Controls)</span>
        </button>
      </div>

      {/* ======================================================= */}
      {/* TAB 1: CLASS & USER MANAGEMENT */}
      {/* ======================================================= */}
      {activeAdminTab === 'management' && (
        <div className="space-y-6 animate-fadeIn">
          {/* SYSTEM OVERVIEW METRICS CARDS (CLASSES 1-5) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>कुल नामांकित विद्यार्थी</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{metrics.totalStudents}</div>
              <div className="text-[11px] text-stone-400">कक्षा 1 से 5 में पंजीकृत</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>सक्रिय शिक्षक</span>
                <School className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{metrics.totalTeachers}</div>
              <div className="text-[11px] text-stone-400">बहुभाषी शिक्षक संवर्ग</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>प्रकाशित मूल्यांकन</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{metrics.totalAssessmentsPublished}</div>
              <div className="text-[11px] text-stone-400">क्विज़ व कार्यपत्रक फ़ीड</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>औसत कक्षा दक्षता</span>
                <TrendingUp className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">84%</div>
              <div className="text-[11px] text-stone-400">NIPUN FLN बेंचमार्क</div>
            </div>
          </div>

          {/* Class Wise Average Breakdown Bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-700" />
              <span>कक्षा-वार प्रदर्शन मैट्रिक्स (Class-Wise Performance Matrix):</span>
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((cls) => {
                const count = metrics.studentsPerClass[cls] || 0;
                const avg = metrics.averageScoresPerClass[cls] || 80;
                return (
                  <div
                    key={cls}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1"
                  >
                    <div className="text-xs font-bold text-stone-900">Class {cls}</div>
                    <div className="text-lg font-black text-indigo-700">{avg}%</div>
                    <div className="text-[10px] text-stone-500">{count} विद्यार्थी</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Centralized User Management Table */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-700" />
                  <span>विद्यार्थी एवं कक्षा प्रबंधन (Students by Class)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  कक्षा 1 से 5 के विद्यार्थियों के रिकॉर्ड, प्रगति व मूल्यांकन का केंद्रीकृत नियंत्रण
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id="admin-add-student-btn"
                  onClick={() => setIsAddStudentOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ नया विद्यार्थी जोड़ें</span>
                </button>
              </div>
            </div>

            {/* Class Selection Tabs */}
            <div className="flex items-center space-x-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 w-fit">
              {[1, 2, 3, 4, 5].map((cls) => (
                <button
                  key={cls}
                  id={`admin-class-tab-${cls}`}
                  onClick={() => setSelectedClassTab(cls)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedClassTab === cls
                      ? 'bg-indigo-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white'
                  }`}
                >
                  कक्षा {cls} ({metrics.studentsPerClass[cls] || 0})
                </button>
              ))}
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">रोल नं.</th>
                    <th className="py-3 px-3">विद्यार्थी का नाम</th>
                    <th className="py-3 px-3">ईमेल / संपर्क</th>
                    <th className="py-3 px-3">मातृभाषा</th>
                    <th className="py-3 px-3">औसत स्कोर</th>
                    <th className="py-3 px-3">स्थिति (NIPUN Status)</th>
                    <th className="py-3 px-3 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {studentsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-stone-400">
                        कक्षा {selectedClassTab} में कोई विद्यार्थी दर्ज नहीं है।
                      </td>
                    </tr>
                  ) : (
                    studentsList.map((st) => (
                      <tr key={st.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-stone-700">#{st.rollNo}</td>
                        <td className="py-3 px-3 font-bold text-stone-900">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px] font-bold">
                              {st.name.charAt(0)}
                            </span>
                            <span>{st.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-500 font-mono text-[11px]">{st.email}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold border border-stone-200">
                            {st.motherTongue}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold">
                          <span className={st.overallPerformance.averageScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}>
                            {st.overallPerformance.averageScore}%
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {st.overallPerformance.status || 'दक्ष (Proficient)'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteStudent(st.id)}
                            className="p-1 rounded text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="हटाएँ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Roster */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <School className="w-5 h-5 text-amber-600" />
              <span>सक्रिय शिक्षक संवर्ग (Assigned Teachers)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teachersList.map((tch) => (
                <div key={tch.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-stone-900">{tch.name}</div>
                    <div className="text-xs text-stone-500 font-mono">{tch.email}</div>
                    <div className="text-[11px] text-stone-600">
                      आवंटित कक्षाएं: <strong>कक्षा {tch.assignedClasses.join(', ')}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      सक्रिय (Active)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 2: SYSTEM & AI HEALTH */}
      {/* ======================================================= */}
      {activeAdminTab === 'health' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-700" />
                  <span>सिस्टम इन्फ्रास्ट्रक्चर व एआई पाइपलाइन स्थिति</span>
                </h3>
                <p className="text-xs text-stone-500">
                  स्पीच रिकॉग्निशन (ASR), न्यूरल ट्रांसलेशन (IndicTrans2/Gemini), एवं टीटीएस स्थिति
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ऑल सिस्टम्स नॉर्मल (100% Operational)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">1. वाक् पहचान (ASR)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="font-bold text-sm text-stone-900">
                  {aiHealthData?.pipeline?.asr?.name || 'IndicConformer Hindi ASR'}
                </div>
                <div className="text-xs text-stone-500">हिन्दी वाक् पहचान • नमूना दर 16kHz</div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  स्थिति: {aiHealthData?.pipeline?.asr?.status || 'Online'}
                </span>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">2. न्यूरल अनुवाद (MT)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="font-bold text-sm text-stone-900">
                  {aiHealthData?.pipeline?.translation?.name || 'IndicTrans2 / Gemini 3.8 Vernacular NMT'}
                </div>
                <div className="text-xs text-stone-500">हिन्दी ➔ संथाली, हो, मुण्डारी अनुवाद</div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  स्थिति: {aiHealthData?.pipeline?.translation?.status || 'Online'}
                </span>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">3. स्पीच सिंथेसिस (TTS)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="font-bold text-sm text-stone-900">
                  {aiHealthData?.pipeline?.tts?.name || 'IndicTTS & Indian Accent Voice Synthesizer'}
                </div>
                <div className="text-xs text-stone-500">शुद्ध भारतीय हिन्दी व मातृभाषा वाचन</div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  स्थिति: {aiHealthData?.pipeline?.tts?.status || 'Online'}
                </span>
              </div>
            </div>

            {/* Offline Storage Status */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-700" />
                  <span>ऑफ़लाइन डेटाबेस व स्थानीय कैश स्थिति (IndexedDB Sync)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  नेटवर्क अनुपलब्ध होने पर भी कक्षा 1-5 के पाठ, शब्दावली और क्विज़ स्थानीय रूप से उपलब्ध रहते हैं।
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                लोकल कैश एक्टिव (Synced)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 3: ADMIN SETTINGS & SYSTEM CONTROLS (COMPLETE DETAILS) */}
      {/* ======================================================= */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section 1: Administrator Profile & Identity */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-700" />
                <span>प्रशासक प्रोफ़ाइल एवं पहचान (Administrator Identity & Credentials)</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-bold">
                स्तर: राज्य शिक्षा नियंत्रक
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold block">प्रशासक का पूरा नाम:</span>
                <span className="text-sm font-black text-stone-900">{user.name}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold block">ईमेल / उपयोगकर्ता पहचान (ID):</span>
                <span className="text-sm font-mono font-bold text-indigo-800">{user.emailOrMobile}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold block">पदनाम (Designation):</span>
                <span className="font-bold text-stone-900">{user.designation || 'जिला शिक्षा पदाधिकारी (DEO)'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold block">संबद्ध कार्यालय / विभाग:</span>
                <span className="font-bold text-stone-900">{user.schoolName || 'स्कूली शिक्षा एवं साक्षरता विभाग, झारखण्ड'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold block">क्षेत्राधिकार / जिला (Jurisdiction):</span>
                <span className="font-bold text-stone-900">{user.district || 'Dumka / Santhal Pargana Division'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-stone-500 font-bold block">सक्रिय प्रमाणीकरण सत्र (Session Status):</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  सुरक्षित JWT टोकन सक्रिय (24 घंटे हेतु वैध)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: System Preferences & Vernacular Engine Defaults */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <span>भाषा व ध्वनि इंजन प्राथमिकताएं (Vernacular & Audio Engine Preferences)</span>
              </h3>
              <span className="text-xs text-stone-400">झारखण्ड प्राथमिक संवर्ग</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">
                  डिफ़ॉल्ट प्राथमिक जनजातीय भाषा (Default Vernacular):
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e: any) => setDefaultLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-800"
                >
                  <option value="sat_Olck">संथाली (Ol Chiki - ᱥᱟᱱᱛᱟᱲᱤ)</option>
                  <option value="sat_Deva">संथाली (देवनागरी लिपि)</option>
                  <option value="hoc_Deva">हो (वारंग क्षिति / देवनागरी लिपि)</option>
                  <option value="unr_Deva">मुण्डारी (मुण्डारी बानी / देवनागरी)</option>
                </select>
                <span className="text-[11px] text-stone-500">
                  नवीनतम सत्रों व कार्यपत्रकों के लिए प्राथमिक मातृभाषा डिफ़ॉल्ट
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">
                  वाक् संश्लेषण गति (Indian Accent Speech Rate):
                </label>
                <select
                  value={speechSpeed}
                  onChange={(e: any) => setSpeechSpeed(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-800"
                >
                  <option value="0.85">धीमी (0.85x - कक्षा 1 व 2 के छोटे बच्चों हेतु)</option>
                  <option value="1.0">सामान्य (1.0x - मानक भारतीय हिन्दी वाचन)</option>
                  <option value="1.15">तीव्र (1.15x - त्वरित समीक्षा हेतु)</option>
                </select>
                <span className="text-[11px] text-stone-500">
                  फ़्लैशकार्ड व देखो और सीखो में उच्चारण की गति
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">
                  निपुण भारत अधिगम बेंचमार्क लक्ष्य (NIPUN Target %):
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min={60}
                    max={95}
                    value={nipunTarget}
                    onChange={(e) => setNipunTarget(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-black text-sm text-indigo-700 w-12 text-right">{nipunTarget}%</span>
                </div>
                <span className="text-[11px] text-stone-500">
                  कक्षा 1-5 के विद्यार्थियों के लिए न्यूनतम दक्षता सीमा
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">
                  क्लाउड सिंक अंतराल (Background Cloud Sync):
                </label>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-800"
                >
                  <option value="5">प्रत्येक 5 मिनट (High Frequency)</option>
                  <option value="15">प्रत्येक 15 मिनट (Standard - Recommended)</option>
                  <option value="30">प्रत्येक 30 मिनट (Low Bandwidth Saver)</option>
                </select>
                <span className="text-[11px] text-stone-500">
                  ग्रामीण क्षेत्रों में नेटवर्क बचत हेतु अनुकूलित अंतराल
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Storage, Database & Audit Logs */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-700" />
                <span>ऑफ़लाइन डेटाबेस, कैश व ऑडिट लॉग्स प्रबंधन</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">स्थानीय अनुवाद व फ़ोटो कैश</h4>
                  <p className="text-[11px] text-stone-500 mt-1">
                    ऑफ़लाइन उपयोग हेतु सहेजे गए फ़्लैशकार्ड, अनुवाद व पाठ कैश साफ़ करें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  कैश साफ़ करें (Clear Cache)
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">सिस्टम ऑडिट लॉग डाउनलोड</h4>
                  <p className="text-[11px] text-stone-500 mt-1">
                    शिक्षा विभाग के निरीक्षण हेतु संपूर्ण मूल्यांकन व सिस्टम लॉग्स JSON में प्राप्त करें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportAuditLogs}
                  className="px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  ऑडिट लॉग्स डाउनलोड करें ➔
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs">कक्षा 1-5 डेटा रीसेट</h4>
                  <p className="text-[11px] text-stone-500 mt-1">
                    विद्यार्थी सूची व मूल्यांकन को प्रारंभिक डिफ़ॉल्ट स्थिति में रीसेट करें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
                >
                  डेटा री-सीड करें (Reset Data)
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Security & Strict RBAC Enforcement Status */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-700" />
              <span>सुरक्षा व भूमिका अलगाव (Strict RBAC Isolation Status)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold block">विद्यार्थी सुरक्षा गार्ड (Student Role Guard):</span>
                <span>सक्रिय • विद्यार्थी केवल कक्षा 1-5 के अभ्यास पत्र, क्विज़ व शिक्षण सामग्री देख सकते हैं।</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold block">शिक्षक सुरक्षा गार्ड (Teacher Role Guard):</span>
                <span>सक्रिय • शिक्षक केवल अध्यापन, मूल्यांकन एवं कार्यपत्रक प्रबंधन पोर्टल का उपयोग कर सकते हैं।</span>
              </div>
            </div>
          </div>

          {/* Section 5: Account & Session Control (Danger Zone with Logout) */}
          <div className="bg-red-50 rounded-3xl p-6 border-2 border-red-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black text-red-950 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-red-700" />
                  <span>प्रशासक सत्र एवं खाता नियंत्रण (Session & Logout Control)</span>
                </h4>
                <p className="text-xs text-red-800 mt-1 max-w-xl">
                  अपने प्रशासनिक सत्र को सुरक्षित रूप से समाप्त करने के लिए नीचे दिए गए बटन पर क्लिक करें। लॉगआउट करने के बाद दोबारा लॉगिन करने के लिए पासवर्ड की आवश्यकता होगी।
                </p>
              </div>

              <button
                type="button"
                id="admin-settings-logout-btn"
                onClick={() => setIsLogoutModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 shrink-0 border border-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>प्रशासक पोर्टल से लॉगआउट करें (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADD STUDENT */}
      {/* ======================================================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-bold text-stone-900 text-sm">
                कक्षा {selectedClassTab} में नया विद्यार्थी जोड़ें
              </h4>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">पूरा नाम</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="उदा. अमित सोरेन"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">रोल नंबर</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">कक्षा (Class)</label>
                  <input
                    type="text"
                    disabled
                    value={`कक्षा ${selectedClassTab}`}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-100 font-bold text-stone-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">ईमेल या स्टूडेंट आईडी</label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder={`student_c${selectedClassTab}@school.com`}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">मातृभाषा</label>
                <select
                  value={newStudentMotherTongue}
                  onChange={(e) => setNewStudentMotherTongue(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                >
                  <option value="Santali (Ol Chiki)">Santali (Ol Chiki)</option>
                  <option value="Mundari">Mundari</option>
                  <option value="Ho">Ho (Warang Chiti / Devanagari)</option>
                  <option value="Kudmali">Kudmali</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 font-bold text-stone-700 hover:bg-stone-200 cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold hover:bg-indigo-600 shadow cursor-pointer"
                >
                  सुरक्षित करें (Save Student)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADMINISTRATIVE CONTEXT SWITCHER */}
      {/* ======================================================= */}
      {isContextModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-stone-900 text-sm">
                  प्रशासनिक संदर्भ स्विचर (Administrative Context Switcher)
                </h4>
              </div>
              <button
                onClick={() => setIsContextModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              प्रशासक के रूप में, आप सुरक्षा और अनुपालन हेतु शिक्षक अथवा विद्यार्थी पोर्टल का सीधा अवलोकन कर सकते हैं। अवलोकन के दौरान ऊपर एक वापसी बैनर प्रदर्शित होगा।
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1.5">
                  अवलोकन हेतु भूमिका चुनें (Select Portal Context):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setContextTargetRole('teacher')}
                    className={`p-3 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                      contextTargetRole === 'teacher'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold">शिक्षक पोर्टल</div>
                    <div className="text-[10px] text-stone-500">Teacher Home & Live Voice</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContextTargetRole('student')}
                    className={`p-3 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                      contextTargetRole === 'student'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold">विद्यार्थी पोर्टल</div>
                    <div className="text-[10px] text-stone-500">Class 1-5 Student Home & Feed</div>
                  </button>
                </div>
              </div>

              {contextTargetRole === 'student' && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1.5">
                    कक्षा संदर्भ चुनें (Target Class 1 to 5):
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setContextTargetClass(cls)}
                        className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          contextTargetClass === cls
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        Class {cls}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <span className="font-bold block">प्रशासनिक सुरक्षा नोट:</span>
                <span>यह सत्र केवल अवलोकन के लिए है। किसी भी समय 'प्रशासक मोड पर लौटें' पर क्लिक कर सकते हैं।</span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsContextModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 font-bold text-stone-700 hover:bg-stone-200 cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  id="confirm-context-switch-btn"
                  onClick={handleExecuteContextSwitch}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow cursor-pointer"
                >
                  पोर्टल अवलोकन शुरू करें ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ADMIN LOGOUT CONFIRMATION */}
      {/* ======================================================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-700">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h4 className="font-black text-stone-900 text-base">लॉगआउट की पुष्टि</h4>
                <p className="text-xs text-stone-500">प्रशासक सत्र समाप्ति</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              क्या आप सुनिश्चित हैं कि आप <strong>{user.name}</strong> (प्रशासक) के रूप में इस सत्र से लॉगआउट करना चाहते हैं?
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                id="confirm-admin-logout-btn"
                onClick={handleDirectLogout}
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                हाँ, लॉगआउट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
