import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Layers,
  BookOpen,
  Trash2,
  HardDrive,
} from 'lucide-react';
import { offlineStorage, SyncQueueItem } from '../services/offlineStorage';
import { CURRICULUM_LESSONS } from '../data/curriculum';

export const OfflineSyncManager: React.FC = () => {
  const [syncState, setSyncState] = useState({
    pendingCount: 0,
    isOnline: true,
    isSyncing: false,
  });

  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [downloadedLessons, setDownloadedLessons] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = offlineStorage.subscribe((status) => {
      setSyncState(status);
      setQueueItems(offlineStorage.getSyncQueue());
    });

    setQueueItems(offlineStorage.getSyncQueue());
    setDownloadedLessons(CURRICULUM_LESSONS.map((l) => l.id)); // Preloaded
    return () => unsub();
  }, []);

  const handleToggleNetwork = () => {
    offlineStorage.setSimulatedNetwork(!syncState.isOnline);
  };

  const handleTriggerSync = async () => {
    if (!syncState.isOnline) {
      setSyncNotice('ऑफ़लाइन मोड में सिंक नहीं किया जा सकता। कृपया पहले ऑनलाइन मोड चालू करें।');
      setTimeout(() => setSyncNotice(null), 4000);
      return;
    }
    setSyncNotice('क्लाउड सर्वर के साथ सिंक हो रहा है...');
    await offlineStorage.processSyncQueue();
    setSyncNotice('सभी लंबित कार्य सफलतापूर्वक क्लाउड पर सिंक कर दिए गए!');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleDownloadFullPack = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (!prev) return 20;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 2000);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-900/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2 border border-amber-400/20">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Single-Source Lightweight Offline Architecture</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            ऑफ़लाइन डेटा एवं सिंक प्रबंधक (Offline Data & Sync Manager)
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            दुमका, पाकुड़ और जामताड़ा जैसे ग्रामीण क्षेत्रों में इंटरनेट न होने पर भी सभी पाठ, टेस्ट और अनुवाद स्थानीय सिंगल-सोर्स कैश में सुरक्षित रहते हैं तथा नेटवर्क मिलने पर स्वतः सिंक होते हैं।
          </p>
        </div>

        {/* Network status toggle button */}
        <button
          onClick={handleToggleNetwork}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow transition-all ${
            syncState.isOnline
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
          }`}
        >
          {syncState.isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>ऑनलाइन मोड (Online Active)</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>ऑफ़लाइन मोड (Offline Active)</span>
            </>
          )}
        </button>
      </div>

      {/* Sync Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">सिंक कतार में लंबित:</span>
            <RefreshCw
              className={`w-4 h-4 ${syncState.isSyncing ? 'animate-spin text-amber-500' : 'text-stone-400'}`}
            />
          </div>
          <div className="text-3xl font-black text-stone-900">{syncState.pendingCount}</div>
          <span className="text-[11px] text-stone-400">
            {syncState.pendingCount === 0 ? 'क्लाउड अद्यतन (Up to date)' : 'लंबित डेटा रिकॉर्ड्स'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">स्थानीय डेटाबेस:</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">सक्रिय (IndexedDB)</div>
          <span className="text-[11px] text-stone-400">ज़ीरो-लेटेंसी स्थानीय कैशिंग</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">क्लाउड डेटाबेस:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-stone-900">MongoDB Atlas</div>
          <span className="text-[11px] text-stone-400">द्वि-दिशात्मक सिंक्रनाइज़ेशन</span>
        </div>
      </div>

      {/* Offline Download Package */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-red-700" />
              ऑफ़लाइन शिक्षण पैकेज (Offline Classroom Content Pack):
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              कक्षा 1 से 5 के सभी पाठ, संथाली ऑडियो उच्चारण और कार्यपत्रक एक क्लिक में डाउनलोड करें।
            </p>
          </div>

          <button
            onClick={handleDownloadFullPack}
            disabled={downloadProgress !== null}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>
              {downloadProgress !== null
                ? `डाउनलोड हो रहा है (${downloadProgress}%)...`
                : 'सम्पूर्ण पैकेज डाउनलोड करें (12.4 MB)'}
            </span>
          </button>
        </div>

        {downloadProgress !== null && (
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Downloaded Content Inventory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-red-700 shrink-0" />
            <div>
              <span className="font-bold text-stone-800 block">4 NIPUN पाठ</span>
              <span className="text-stone-500 text-[11px]">कक्षा 1 से 5 (पूर्ण उपलब्ध)</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center space-x-3">
            <Layers className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-stone-800 block">16 सचित्र फ़्लैशकार्ड</span>
              <span className="text-stone-500 text-[11px]">संथाली ऑल चिकी + ऑडियो</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center space-x-3">
            <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-stone-800 block">द्विभाषी कार्यपत्रक कैश</span>
              <span className="text-stone-500 text-[11px]">बिना इंटरनेट मुद्रण योग्य</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Queue Records List */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-stone-700" />
            <h3 className="font-bold text-stone-900 text-base">
              सिंक कतार विवरण (Sync Queue Items):
            </h3>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={syncState.isSyncing || syncState.pendingCount === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
            <span>अभी क्लाउड पर सिंक करें</span>
          </button>
        </div>

        {syncNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncNotice}</span>
          </div>
        )}

        {queueItems.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs">
            सिंक कतार खाली है। सभी ऑफलाइन गतिविधियां क्लाउड पर सिंक हैं।
          </div>
        ) : (
          <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
            {queueItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.status === 'synced'
                        ? 'bg-emerald-500'
                        : item.status === 'syncing'
                        ? 'bg-amber-500 animate-ping'
                        : 'bg-red-500'
                    }`}
                  ></span>
                  <div>
                    <span className="font-bold text-stone-800 block">{item.actionType}</span>
                    <span className="text-[11px] text-stone-400">
                      ID: {item.id} • {new Date(item.timestamp).toLocaleTimeString('hi-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                      item.status === 'synced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'syncing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
