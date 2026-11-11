import React, { useState } from 'react';
import { 
  Camera, User, FileText, Recycle, Sparkles, Smartphone, 
  AlertTriangle, Plug, HelpCircle, Upload, Trash2, Leaf, 
  Eye, ShieldAlert, CheckCircle2, Lock, Unlock, Flame, 
  RefreshCw, Check, X, ArrowRight, Info, Cpu, Database, Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [nim, setNim] = useState('28421014');
  const [customInput, setCustomInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // State Kamera & Simulasi AI
  const [scanState, setScanState] = useState('idle'); // idle | scanning | result | deposited
  const [selectedScenarioKey, setSelectedScenarioKey] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  
  // State Ceklis Keselamatan Pra-Setor
  const [safetyChecks, setSafetyChecks] = useState({
    notHotOrLeaking: false,
    noSelfDisassembly: false,
    dataWiped: false
  });

  // State Statistik & Antrean Operator (Terhubung Real-time dengan Kios)
  const [stats, setStats] = useState({
    totalWeightKg: 124.5,
    co2SavedKg: 45.2,
    urbanMiningRp: 1250000,
    pointsAwarded: 340
  });

  const [operatorQueue, setOperatorQueue] = useState([
    { 
      id: 'SCN-891', 
      nim: '28421014',
      type: 'PCB Motherboard Korosi (Unverified)', 
      conf: 54, 
      hazard: 'Sedang (Perlu Cek Kapasitor)',
      compartment: 'Baki Tinjauan Operator (Slot #4)',
      time: '16:40 WIB', 
      status: 'Pending',
      image: null
    },
    { 
      id: 'SCN-892', 
      nim: '28421099',
      type: 'Baterai Lithium-Ion Menggembung', 
      conf: 91, 
      hazard: 'Tinggi (Risiko Thermal Runaway B3)',
      compartment: 'Kotak Karantina Tahan Api (Slot #3)',
      time: '16:55 WIB', 
      status: 'Karantina B3',
      image: null
    }
  ]);

  const [depositHistory, setDepositHistory] = useState([
    { id: 'DEP-101', nim: '28421014', item: 'Smartphone Retak (Layar Pecah)', bin: 'Slot #1: Perangkat Utuh & Layar', weight: 0.25, time: '16:20 WIB' },
    { id: 'DEP-102', nim: '28421045', item: 'Kabel Charger & Adaptor Usang', bin: 'Slot #2: Kabel & Aksesoris Logam', weight: 0.15, time: '16:32 WIB' }
  ]);

  // Preset Skenario Uji
  const presetScenarios = {
    smartphone: {
      key: 'smartphone',
      title: 'Smartphone Retak (Layar Pecah)',
      category: 'Kategori A — Perangkat Komputasi & Telekomunikasi Kecil',
      confidence: 94,
      status: 'safe', // safe | danger | warning
      compartment: 'Slot #1: Kompartemen Perangkat Utuh (Berlapis Busa Anti-Benturan)',
      temp: '27.4°C (NORMAL)',
      weightKg: 0.22,
      co2Kg: 1.8,
      valueRp: 25000,
      bboxLabel: 'YOLOv8m: smartphone_cracked_glass (0.94)',
      instructions: [
        'Pastikan kartu SIM dan MicroSD telah dilepas.',
        'Jangan menekan area kaca layar yang retak agar terhindar dari serpihan.',
        'Masukkan perangkat secara perlahan ke Slot #1 yang telah terbuka.'
      ],
      aiNote: 'Identifikasi visual mendeteksi keretakan kaca eksternal tanpa tanda-tanda pembengkakan sasis akibat baterai.'
    },
    battery: {
      key: 'battery',
      title: 'Baterai Lithium-Ion Menggembung / Bocor',
      category: 'Kategori B3 — Limbah Bahan Berbahaya & Beracun (Reaktif)',
      confidence: 91,
      status: 'danger',
      compartment: 'Slot #3: Kotak Karantina Tahan Api (Vermiculite Lined)',
      temp: '36.8°C (PERINGATAN TERMAL)',
      weightKg: 0.18,
      co2Kg: 1.2,
      valueRp: 15000,
      bboxLabel: 'YOLOv8m: swollen_li_ion_hazard (0.91)',
      instructions: [
        'DILARANG KERAS menekan, menusuk, atau membongkar baterai secara mandiri!',
        'Pintu kompartemen reguler DIKUNCI OTOMATIS (Safety Interlock Aktif).',
        'Masukkan baterai dengan hati-hati ke dalam Laci Karantina Tahan Api (Slot #3).',
        'Notifikasi darurat otomatis dikirim ke Tim K3 Kampus & Pengelola B3 berizin.'
      ],
      aiNote: 'PERINGATAN KESELAMATAN: Deteksi deformasi fisik/penggelembungan sel baterai. Risiko tinggi kebakaran (thermal runaway).'
    },
    cable: {
      key: 'cable',
      title: 'Kabel Charger & Adaptor Usang',
      category: 'Kategori B — Aksesoris, Kabel Tembaga & Power Supply Kecil',
      confidence: 96,
      status: 'safe',
      compartment: 'Slot #2: Kompartemen Kabel, PCB & Logam Tembaga',
      temp: '26.9°C (NORMAL)',
      weightKg: 0.15,
      co2Kg: 0.9,
      valueRp: 12000,
      bboxLabel: 'YOLOv8m: e_waste_cable_charger (0.96)',
      instructions: [
        'Gulung kabel secara rapi agar tidak menyangkut pada mekanisme katup.',
        'Pastikan adaptor tidak dalam keadaan basah atau terhubung ke sumber daya.',
        'Masukkan ke dalam Slot #2 untuk proses ekstraksi tembaga (Urban Mining).'
      ],
      aiNote: 'Klasifikasi berkeyakinan tinggi (96%). Material dominan: polimer isolator dan inti tembaga murni.'
    },
    unknown: {
      key: 'unknown',
      title: 'Komponen Elektronik Tak Dikenal (Tertutup Debu)',
      category: 'Unverified — Membutuhkan Peninjauan Operator (Human-in-the-Loop)',
      confidence: 54,
      status: 'warning',
      compartment: 'Slot #4: Baki Tinjauan Sementara (Holding Tray)',
      temp: '27.8°C (NORMAL)',
      weightKg: 0.35,
      co2Kg: 1.5,
      valueRp: 18000,
      bboxLabel: 'YOLOv8m: unidentified_electronic_part (0.54 - LOW CONF)',
      instructions: [
        'Tingkat keyakinan AI (54%) berada di bawah ambang batas keamanan (75%).',
        'Keputusan pemilahan TIDAK dilakukan secara otomatis untuk mencegah kontaminasi silang.',
        'Letakkan barang di Baki Tinjauan (Slot #4). Operator akan memverifikasi dari dashboard.'
      ],
      aiNote: 'Visibilitas terbatas atau bentuk objek tidak standar. Sistem mengaktifkan protokol Human-in-the-Loop.'
    }
  };

  // Fungsi Analisis Kata Kunci untuk Input Teks & Nama File Gambar
  const analyzeKeyword = (textInput, imagePreviewUrl = null) => {
    const lower = textInput.toLowerCase();
    
    if (lower.includes('baterai') || lower.includes('kembung') || lower.includes('bocor') || lower.includes('powerbank') || lower.includes('aki') || lower.includes('li-ion')) {
      return {
        ...presetScenarios.battery,
        title: `Hasil Analisis: ${textInput}`,
        confidence: 93,
        bboxLabel: `YOLOv8m: battery_hazard_detected (0.93)`,
        uploadedPreview: imagePreviewUrl
      };
    }
    if (lower.includes('hp') || lower.includes('phone') || lower.includes('laptop') || lower.includes('layar') || lower.includes('tablet') || lower.includes('monitor')) {
      return {
        ...presetScenarios.smartphone,
        title: `Hasil Analisis: ${textInput}`,
        confidence: 92,
        bboxLabel: `YOLOv8m: personal_device_screen (0.92)`,
        uploadedPreview: imagePreviewUrl
      };
    }
    if (lower.includes('kabel') || lower.includes('charger') || lower.includes('mouse') || lower.includes('keyboard') || lower.includes('adaptor') || lower.includes('earphone')) {
      return {
        ...presetScenarios.cable,
        title: `Hasil Analisis: ${textInput}`,
        confidence: 95,
        bboxLabel: `YOLOv8m: peripheral_cable_unit (0.95)`,
        uploadedPreview: imagePreviewUrl
      };
    }
    
    // Default jika komponen spesifik/asing -> picu Human-in-the-Loop (<75%)
    return {
      ...presetScenarios.unknown,
      title: `Hasil Analisis: ${textInput}`,
      confidence: 62,
      bboxLabel: `YOLOv8m: complex_e_waste_review (0.62 - LOW CONF)`,
      uploadedPreview: imagePreviewUrl
    };
  };

  // Jalankan Scan Skenario Preset
  const handleSelectScenario = (key) => {
    setSelectedScenarioKey(key);
    setUploadedImage(null);
    setScanState('scanning');
    setSafetyChecks({ notHotOrLeaking: false, noSelfDisassembly: false, dataWiped: false });

    setTimeout(() => {
      setScanResult(presetScenarios[key]);
      setScanState('result');
    }, 900);
  };

  // Jalankan Analisis dari Input Teks Kustom
  const handleCustomAnalyze = () => {
    if (!customInput.trim()) return;
    setSelectedScenarioKey('custom');
    setScanState('scanning');
    setSafetyChecks({ notHotOrLeaking: false, noSelfDisassembly: false, dataWiped: false });

    setTimeout(() => {
      const result = analyzeKeyword(customInput, uploadedImage);
      setScanResult(result);
      setScanState('result');
    }, 950);
  };

  // Jalankan Analisis dari Unggah Foto
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setCustomInput(cleanFileName);
    setSelectedScenarioKey('upload');
    setScanState('scanning');
    setSafetyChecks({ notHotOrLeaking: false, noSelfDisassembly: false, dataWiped: false });

    setTimeout(() => {
      const result = analyzeKeyword(cleanFileName, imageUrl);
      setScanResult(result);
      setScanState('result');
    }, 1100);
  };

  // Proses Setor Barang ke Dalam Kompartemen Bin
  const handleConfirmDeposit = () => {
    if (!scanResult) return;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    // Update statistik keberlanjutan
    setStats(prev => ({
      totalWeightKg: +(prev.totalWeightKg + scanResult.weightKg).toFixed(2),
      co2SavedKg: +(prev.co2SavedKg + scanResult.co2Kg).toFixed(2),
      urbanMiningRp: prev.urbanMiningRp + scanResult.valueRp,
      pointsAwarded: prev.pointsAwarded + 15
    }));

    // Jika berstatus warning (<75%) atau danger (B3), masukkan ke antrean Operator Dashboard
    if (scanResult.status === 'warning' || scanResult.status === 'danger') {
      const newQueueItem = {
        id: `SCN-${Math.floor(900 + Math.random() * 99)}`,
        nim: nim || 'Anonim',
        type: scanResult.title,
        conf: scanResult.confidence,
        hazard: scanResult.status === 'danger' ? 'Tinggi (Isolasi B3 Aktif)' : 'Perlu Verifikasi Visual Operator',
        compartment: scanResult.compartment,
        time: nowTime,
        status: scanResult.status === 'danger' ? 'Karantina B3' : 'Pending',
        image: scanResult.uploadedPreview || null
      };
      setOperatorQueue(prev => [newQueueItem, ...prev]);
    }

    // Tambahkan ke riwayat setoran
    setDepositHistory(prev => [
      {
        id: `DEP-${Math.floor(103 + Math.random() * 890)}`,
        nim: nim || 'Anonim',
        item: scanResult.title,
        bin: scanResult.compartment,
        weight: scanResult.weightKg,
        time: nowTime
      },
      ...prev
    ]);

    setScanState('deposited');
  };

  // Fungsi Aksi Operator di Tab 2
  const handleOperatorAction = (id, newStatus) => {
    setOperatorQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const canDeposit = scanResult && (
    scanResult.status === 'danger' 
      ? safetyChecks.noSelfDisassembly // Untuk baterai B3 wajib janji tidak bongkar mandiri
      : (safetyChecks.notHotOrLeaking && safetyChecks.noSelfDisassembly)
  );

  const pendingCount = operatorQueue.filter(q => q.status === 'Pending' || q.status === 'Karantina B3').length;

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-300 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 flex-shrink-0">
              <img 
                src="/LOGO E-ECOBIN.jpg" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                alt="E-EcoBin Logo" 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00d4ff]/40 shadow-[0_0_15px_rgba(0,212,255,0.3)]" 
              />
              <div style={{ display: 'none' }} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f6bff] to-[#00d4ff] items-center justify-center p-[2px] shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                <div className="w-full h-full bg-[#0b1121] rounded-[14px] flex items-center justify-center">
                  <Recycle className="text-[#00d4ff] w-7 h-7" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-bold text-white tracking-wide">E-EcoBin Campus</h1>
                <span className="px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                  SMART E-WASTE SYSTEM
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Sistem Tempat Sampah Elektronik Pintar Berbasis Edge Computer Vision & Ekonomi Sirkular Kampus
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-[#151e2e] border border-slate-800 px-4 py-2.5 rounded-xl">
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Green Points Mahasiswa</p>
              <p className="text-sm font-bold text-[#00d4ff]">{stats.pointsAwarded} Pts</p>
            </div>
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Status Kios</p>
              <p className="text-xs font-semibold text-emerald-400 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-ping"></span> Online
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row p-1.5 gap-2 bg-[#1e293b]/40 rounded-2xl border border-slate-800 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab(0)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 0 
                ? 'bg-gradient-to-r from-[#2f6bff] to-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4 mr-2" /> 1. Simulasi Kios Pintar (UI/UX)
          </button>
          <button 
            onClick={() => setActiveTab(1)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 1 
                ? 'bg-gradient-to-r from-[#2f6bff] to-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4 mr-2" /> 2. Dashboard Operator & Sirkular 
            <span className="ml-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(244,63,94,0.6)]">
              {pendingCount}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab(2)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 2 
                ? 'bg-gradient-to-r from-[#2f6bff] to-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" /> 3. Dokumen 10 Komponen Tugas
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-[#151e2e]/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
          
          {/* ================= TAB 0: SIMULASI KIOS PINTAR ================= */}
          {activeTab === 0 && (
            <div className="space-y-6">
              {/* Top Info Banner */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-xl text-[#00d4ff] flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">Prototipe Layar Sentuh Smart E-Waste Bin (Komponen #8 & #9)</h2>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    Pilih sampel barang elektronik di bawah, ketik nama perangkat, atau unggah foto untuk menguji deteksi 
                    <strong className="text-slate-200 font-medium"> Computer Vision</strong>, 
                    <strong className="text-slate-200 font-medium"> Interlock Bahaya Baterai</strong>, dan 
                    <strong className="text-slate-200 font-medium"> Verifikasi Operator ({'<'}75% Confidence)</strong>.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-slate-400">NPM / NIM Penyetor:</span>
                    <input 
                      type="text" 
                      value={nim} 
                      onChange={(e) => setNim(e.target.value)}
                      className="bg-[#0b1121] border border-slate-700 text-[#00d4ff] px-4 py-1.5 rounded-lg text-sm font-bold w-40 focus:outline-none focus:border-[#00d4ff]" 
                    />
                    <span className="text-xs text-slate-500">• Otomatis tercatat di log keberlanjutan kampus</span>
                  </div>
                </div>
              </div>

              {/* Pilihan Skenario Uji */}
              <div className="bg-[#1e293b]/30 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center tracking-wide">
                    <div className="w-3.5 h-3.5 mr-2.5 border-t-2 border-l-2 border-[#00d4ff] rounded-tl-sm"></div>
                    PILIH SKENARIO UJI E-WASTE DI KAMERA KIOS:
                  </h3>
                  <span className="text-xs text-[#00d4ff]">Klik salah satu objek uji untuk memindai</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  {/* Skenario 1: Smartphone */}
                  <button 
                    onClick={() => handleSelectScenario('smartphone')}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all text-left ${
                      selectedScenarioKey === 'smartphone' 
                        ? 'border-[#00d4ff] bg-[#00d4ff]/15 shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                        : 'border-[#00d4ff]/30 bg-[#00d4ff]/5 hover:bg-[#00d4ff]/10'
                    }`}
                  >
                    <div className="p-3 bg-[#0b1121] rounded-xl text-[#00d4ff]">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm">Smartphone Retak (Layar Pecah)</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded">AI: 94%</span>
                        <span className="text-slate-400">Pemilahan Otomatis (Slot #1)</span>
                      </div>
                    </div>
                  </button>

                  {/* Skenario 2: Baterai Rusak */}
                  <button 
                    onClick={() => handleSelectScenario('battery')}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all text-left ${
                      selectedScenarioKey === 'battery' 
                        ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.25)]' 
                        : 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10'
                    }`}
                  >
                    <div className="p-3 bg-[#0b1121] rounded-xl text-rose-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm">Baterai Lithium-Ion Menggembung / Bocor</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-rose-400 font-medium bg-rose-400/10 px-2 py-0.5 rounded">AI: 91%</span>
                        <span className="text-rose-300">B3 Bahaya (Safety Interlock)</span>
                      </div>
                    </div>
                  </button>

                  {/* Skenario 3: Kabel & Adaptor */}
                  <button 
                    onClick={() => handleSelectScenario('cable')}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all text-left ${
                      selectedScenarioKey === 'cable' 
                        ? 'border-[#00d4ff] bg-[#00d4ff]/15 shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                        : 'border-slate-700/60 bg-[#0b1121]/40 hover:border-[#00d4ff]/40'
                    }`}
                  >
                    <div className="p-3 bg-[#151e2e] rounded-xl text-[#00d4ff]">
                      <Plug className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm">Kabel Charger & Adaptor Usang</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded">AI: 96%</span>
                        <span className="text-slate-400">Pemilahan Otomatis (Slot #2)</span>
                      </div>
                    </div>
                  </button>

                  {/* Skenario 4: Tak Dikenal */}
                  <button 
                    onClick={() => handleSelectScenario('unknown')}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all text-left ${
                      selectedScenarioKey === 'unknown' 
                        ? 'border-amber-400 bg-amber-400/15 shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
                        : 'border-slate-700/60 bg-[#0b1121]/40 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="p-3 bg-[#151e2e] rounded-xl text-amber-400">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-sm">Komponen Elektronik Tak Dikenal (Tertutup Debu)</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded">AI: 54%</span>
                        <span className="text-amber-300">Verifikasi Operator (Human-in-the-Loop)</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Input Kustom & Unggah Foto */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomAnalyze()}
                    placeholder="Atau ketik nama e-waste (mis: 'Baterai laptop kembung', 'Keyboard rusak', 'Motherboard PC')" 
                    className="flex-1 bg-[#0b1121] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d4ff]/60 transition-colors" 
                  />
                  <button 
                    onClick={handleCustomAnalyze}
                    className="flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#2f6bff] to-[#00d4ff] text-white font-medium hover:opacity-95 transition-all text-sm shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Analisis AI
                  </button>
                  <label className="flex items-center justify-center px-5 py-3 rounded-xl bg-[#0b1121] border border-slate-700 text-slate-200 font-medium hover:border-[#00d4ff]/50 hover:bg-[#1e293b] transition-colors text-sm cursor-pointer">
                    <Upload className="w-4 h-4 mr-2 text-[#00d4ff]" /> Unggah Foto
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              </div>

              {/* Layar Kamera & Hasil Pemindaian AI */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Kolom Kiri: Viewfinder Kamera Computer Vision */}
                <div className="lg:col-span-5 bg-[#0b1121] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
                        CAM-FEED // 1080P
                      </span>
                      <span className={scanResult?.status === 'danger' ? 'text-rose-400 font-bold' : 'text-[#00d4ff]'}>
                        {scanResult ? scanResult.temp : 'Temp: 27.2°C'}
                      </span>
                    </div>

                    {/* Area Visual Kamera */}
                    <div className="relative h-64 rounded-xl bg-[#111827] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden">
                      {scanState === 'idle' && (
                        <div className="text-center space-y-2">
                          <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                          <p className="text-sm font-medium text-slate-400">Ruang Pindai Kios Kosong</p>
                          <p className="text-xs text-slate-500">Pilih skenario di atas atau unggah foto e-waste</p>
                        </div>
                      )}

                      {scanState === 'scanning' && (
                        <div className="text-center space-y-3">
                          <RefreshCw className="w-10 h-10 text-[#00d4ff] mx-auto animate-spin" />
                          <p className="text-sm font-bold text-white">Menjalankan Inferensi YOLOv8...</p>
                          <p className="text-xs text-[#00d4ff] font-mono">Mengekstrak fitur visual & anomali fisik</p>
                        </div>
                      )}

                      {(scanState === 'result' || scanState === 'deposited') && scanResult && (
                        <div className="w-full h-full flex flex-col items-center justify-center relative">
                          {/* Bounding Box Simulasi */}
                          <div className={`w-full h-full rounded-lg border-2 p-3 flex flex-col justify-between ${
                            scanResult.status === 'safe' ? 'border-emerald-400 bg-emerald-500/5' :
                            scanResult.status === 'danger' ? 'border-rose-500 bg-rose-500/10' :
                            'border-amber-400 bg-amber-500/5'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                scanResult.status === 'safe' ? 'bg-emerald-400 text-slate-950' :
                                scanResult.status === 'danger' ? 'bg-rose-500 text-white' :
                                'bg-amber-400 text-slate-950'
                              }`}>
                                {scanResult.bboxLabel}
                              </span>
                            </div>

                            <div className="my-auto flex flex-col items-center text-center">
                              {scanResult.uploadedPreview ? (
                                <img 
                                  src={scanResult.uploadedPreview} 
                                  alt="Uploaded E-waste" 
                                  className="max-h-32 rounded-lg object-contain border border-slate-700 mb-2"
                                />
                              ) : (
                                <div className="p-3 rounded-2xl bg-[#0b1121]/80 mb-2">
                                  {scanResult.status === 'safe' && <CheckCircle2 className="w-10 h-10 text-emerald-400" />}
                                  {scanResult.status === 'danger' && <Flame className="w-10 h-10 text-rose-500 animate-bounce" />}
                                  {scanResult.status === 'warning' && <AlertTriangle className="w-10 h-10 text-amber-400" />}
                                </div>
                              )}
                              <p className="text-sm font-bold text-white line-clamp-1">{scanResult.title}</p>
                            </div>

                            <div className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                              <span>Est. Berat: {scanResult.weightKg} kg</span>
                              <span>Confidence: {scanResult.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Catatan Penting Keselamatan AI (Wajib Sesuai Ketentuan) */}
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                    <p className="font-bold text-amber-300 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      CATATAN KESELAMATAN & TANGGUNG JAWAB AI:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                      <li>Computer vision hanya memberi <strong className="text-white">identifikasi visual awal</strong>, bukan sertifikasi keamanan internal perangkat.</li>
                      <li>Baterai rusak/menggembung/panas <strong className="text-rose-300">dilarang dibongkar mandiri</strong>. Serahkan ke pihak kompeten.</li>
                      <li>Prediksi keyakinan rendah ({'<'}75%) wajib ditinjau operator (<strong className="text-white">Human-in-the-Loop</strong>).</li>
                    </ul>
                  </div>
                </div>

                {/* Kolom Kanan: Keputusan Sistem, Safety Interlock & Instruksi Pemilahan */}
                <div className="lg:col-span-7 bg-[#0b1121] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  {!scanResult ? (
                    <div className="my-auto text-center py-12 space-y-3">
                      <Info className="w-12 h-12 text-slate-600 mx-auto" />
                      <h4 className="text-base font-bold text-slate-300">Menunggu Objek E-Waste Dipindai</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Sistem akan menampilkan klasifikasi kategori, status penguncian pintu kompartemen (Interlock), serta petunjuk pemilahan yang aman di panel ini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Header Status Hasil */}
                      <div className={`p-4 rounded-xl border flex items-start justify-between ${
                        scanResult.status === 'safe' ? 'bg-emerald-500/10 border-emerald-500/30' :
                        scanResult.status === 'danger' ? 'bg-rose-500/10 border-rose-500/40' :
                        'bg-amber-500/10 border-amber-500/30'
                      }`}>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            scanResult.status === 'safe' ? 'bg-emerald-400/20 text-emerald-300' :
                            scanResult.status === 'danger' ? 'bg-rose-500/30 text-rose-200' :
                            'bg-amber-400/20 text-amber-300'
                          }`}>
                            {scanResult.status === 'safe' ? 'Lolos Verifikasi Visual (≥75%)' :
                             scanResult.status === 'danger' ? 'INTERLOCK BAHAYA B3 AKTIF' :
                             'KEYAKINAN RENDAH (<75%) — TINJAUAN OPERATOR'}
                          </span>
                          <h3 className="text-base font-bold text-white mt-2">{scanResult.category}</h3>
                          <p className="text-xs text-slate-300 mt-1">{scanResult.aiNote}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className="text-2xl font-black text-white">{scanResult.confidence}%</span>
                          <p className="text-[10px] text-slate-400">AI Confidence</p>
                        </div>
                      </div>

                      {/* Status Kompartemen / Pintu Otomatis */}
                      <div className="p-3.5 rounded-xl bg-[#151e2e] border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {scanResult.status === 'danger' ? (
                            <Lock className="w-5 h-5 text-rose-400" />
                          ) : (
                            <Unlock className="w-5 h-5 text-[#00d4ff]" />
                          )}
                          <div>
                            <p className="text-[11px] text-slate-400">Kompartemen Tujuan yang Diaktifkan:</p>
                            <p className="text-sm font-bold text-white">{scanResult.compartment}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg">
                          +{scanResult.valueRp.toLocaleString('id-ID')} Nilai Sirkular
                        </span>
                      </div>

                      {/* Petunjuk Pemilahan Langkah demi Langkah */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Petunjuk Pemilahan & Prosedur:</h4>
                        <div className="space-y-1.5">
                          {scanResult.instructions.map((inst, idx) => (
                            <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300 bg-[#151e2e]/60 p-2.5 rounded-lg">
                              <span className="w-4 h-4 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{inst}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ceklis Keselamatan Pra-Setor */}
                      {scanState !== 'deposited' ? (
                        <div className="p-4 rounded-xl bg-[#151e2e] border border-slate-800 space-y-3">
                          <p className="text-xs font-bold text-white">Konfirmasi Keselamatan Pengguna (Wajib Dicentang):</p>
                          
                          {scanResult.status !== 'danger' && (
                            <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={safetyChecks.notHotOrLeaking}
                                onChange={(e) => setSafetyChecks(p => ({ ...p, notHotOrLeaking: e.target.checked }))}
                                className="rounded accent-[#00d4ff]" 
                              />
                              <span>Perangkat tidak dalam kondisi panas berlebih, berasap, atau bocor cairan kimia.</span>
                            </label>
                          )}

                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={safetyChecks.noSelfDisassembly}
                              onChange={(e) => setSafetyChecks(p => ({ ...p, noSelfDisassembly: e.target.checked }))}
                              className="rounded accent-[#00d4ff]" 
                            />
                            <span>Saya tidak membongkar paksa baterai/komponen berbahaya secara mandiri.</span>
                          </label>

                          <button 
                            disabled={!canDeposit}
                            onClick={handleConfirmDeposit}
                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                              canDeposit 
                                ? 'bg-gradient-to-r from-[#2f6bff] to-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:opacity-95' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {scanResult.status === 'danger' 
                              ? 'Masukkan ke Kotak Karantina Tahan Api & Lapor K3' 
                              : scanResult.status === 'warning'
                              ? 'Letakkan di Baki Tinjauan Operator (Human-in-the-Loop)'
                              : 'Buka Katup Kompartemen & Setor E-Waste'}
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                          <h4 className="text-sm font-bold text-white">Transaksi E-Waste Berhasil Dicatat!</h4>
                          <p className="text-xs text-slate-300">
                            Data pemindaian telah masuk ke <strong className="text-[#00d4ff]">Dashboard Operator & Sirkular (Tab 2)</strong> dan Anda memperoleh +15 Green Points.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 1: DASHBOARD OPERATOR & SIRKULAR ================= */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Baris Metrik Keberlanjutan (Komponen #10) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b]/30 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Total E-Waste Terkumpul</p>
                    <p className="text-2xl font-bold text-[#00d4ff] mt-1">{stats.totalWeightKg} Kg</p>
                    <p className="text-[11px] text-emerald-400 mt-1">100% Terpilah Sesuai SOP</p>
                  </div>
                  <div className="p-3 bg-[#0b1121] rounded-xl"><Trash2 className="w-6 h-6 text-[#00d4ff]" /></div>
                </div>

                <div className="bg-[#1e293b]/30 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Jejak Karbon Dicegah</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.co2SavedKg} Kg CO₂e</p>
                    <p className="text-[11px] text-slate-400 mt-1">Reduksi emisi tambang baru</p>
                  </div>
                  <div className="p-3 bg-[#0b1121] rounded-xl"><Leaf className="w-6 h-6 text-emerald-400" /></div>
                </div>

                <div className="bg-[#1e293b]/30 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Nilai Ekonomi Urban Mining</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">Rp {stats.urbanMiningRp.toLocaleString('id-ID')}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Emas, Tembaga, Paladium, Li</p>
                  </div>
                  <div className="p-3 bg-[#0b1121] rounded-xl"><Recycle className="w-6 h-6 text-amber-400" /></div>
                </div>

                <div className="bg-[#1e293b]/30 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Mitra Pengelola Resmi</p>
                    <p className="text-base font-bold text-white mt-1">PT Prasadha / Berizin KLHK</p>
                    <p className="text-[11px] text-[#00d4ff] mt-1">Manifest B3 Elektronik Aktif</p>
                  </div>
                  <div className="p-3 bg-[#0b1121] rounded-xl"><ShieldAlert className="w-6 h-6 text-[#00d4ff]" /></div>
                </div>
              </div>

              {/* Tabel Antrean Tinjauan Operator (Human-in-the-Loop) */}
              <div className="bg-[#1e293b]/30 rounded-2xl border border-slate-800/80 overflow-hidden">
                <div className="p-5 border-b border-slate-800/80 bg-[#0b1121]/50 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h3 className="font-bold text-white flex items-center text-sm">
                      <Eye className="w-5 h-5 mr-2.5 text-[#00d4ff]" /> 
                      Antrean Verifikasi Operator & Insiden B3 (Human-in-the-Loop)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Meninjau prediksi AI dengan keyakinan rendah ({'<'}75%) dan penanganan khusus baterai berbahaya.
                    </p>
                  </div>
                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-full">
                    {pendingCount} Perlu Tindakan
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-[#0b1121]/80 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5 font-medium">ID & Waktu</th>
                        <th className="px-5 py-3.5 font-medium">Objek & NPM</th>
                        <th className="px-5 py-3.5 font-medium">AI Confidence</th>
                        <th className="px-5 py-3.5 font-medium">Kompartemen / Risiko</th>
                        <th className="px-5 py-3.5 font-medium">Status</th>
                        <th className="px-5 py-3.5 font-medium">Keputusan Operator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {operatorQueue.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-4 font-mono text-xs">
                            <span className="text-white font-bold">{item.id}</span>
                            <br />
                            <span className="text-slate-500">{item.time}</span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-white font-medium text-xs">{item.type}</p>
                            <p className="text-[11px] text-slate-500">Penyetor: {item.nim}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`font-bold px-2.5 py-1 rounded text-xs ${
                              item.conf < 75 
                                ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' 
                                : 'text-rose-400 bg-rose-400/10 border border-rose-400/20'
                            }`}>
                              {item.conf}%
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs">
                            <p className="text-slate-200">{item.compartment}</p>
                            <p className="text-[11px] text-rose-400">{item.hazard}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              item.status === 'Terverifikasi Aman' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : item.status === 'Dijemput Mitra B3'
                                ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleOperatorAction(item.id, 'Terverifikasi Aman')}
                                className="flex items-center text-xs bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" /> Setujui Pilah
                              </button>
                              <button 
                                onClick={() => handleOperatorAction(item.id, 'Dijemput Mitra B3')}
                                className="flex items-center text-xs bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Serahkan B3
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Log Setoran Otomatis Terbaru */}
              <div className="bg-[#1e293b]/20 rounded-2xl border border-slate-800/60 p-5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Log Transaksi Pemilahan Terakhir (Chain of Custody):
                </h4>
                <div className="space-y-2">
                  {depositHistory.map((log) => (
                    <div key={log.id} className="flex flex-wrap items-center justify-between text-xs bg-[#0b1121]/70 px-4 py-2.5 rounded-xl border border-slate-800/60">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-[#00d4ff] font-bold">{log.id}</span>
                        <span className="text-white font-medium">{log.item}</span>
                        <span className="text-slate-500">({log.nim})</span>
                      </div>
                      <div className="flex items-center space-x-4 text-slate-400">
                        <span>{log.bin}</span>
                        <span className="text-emerald-400 font-mono">{log.weight} kg</span>
                        <span>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DOKUMEN 10 KOMPONEN TUGAS ================= */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    Dokumen Rancangan Solusi Sistem: Smart Recycling Bin for E-Waste
                  </h2>
                  <p className="text-slate-400 mt-1 text-sm">
                    Disusun sesuai 10 Komponen Tugas Mahasiswa & Rubrik Penilaian (Total Bobot 100%)
                  </p>
                </div>
                <span className="text-xs font-mono bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 px-3 py-1.5 rounded-xl self-start">
                  Alessandro Farrel Gerrard Wijaya • 28421014
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    no: 1, 
                    title: 'Identifikasi Masalah (Latar Belakang & Rumusan)', 
                    desc: 'Limbah elektronik kampus (kabel, charger, smartphone rusak, baterai Li-ion) sering tercampur dengan sampah domestik. Hal ini memicu pencemaran logam berat (timbal, merkuri) dan risiko kebakaran (thermal runaway) akibat baterai menggembung yang tertekan di tempat sampah biasa.' 
                  },
                  { 
                    no: 2, 
                    title: 'Analisis Kebutuhan (Fungsional & Nonfungsional)', 
                    desc: 'Fungsional: Deteksi visual kategori e-waste, Safety Interlock pengunci pintu saat terdeteksi baterai rusak, baki karantina tahan api, dan antrean verifikasi operator (<75% confidence). Nonfungsional: Inferensi Edge AI <1.5 detik, ketersediaan sistem 99%, dan kepatuhan penuh terhadap regulasi limbah B3.' 
                  },
                  { 
                    no: 3, 
                    title: 'Identifikasi Pengguna (Aktor & Peran)', 
                    desc: '(1) Sivitas Akademika/Mahasiswa: Penyetor e-waste & penerima Green Points. (2) Petugas Operator/K3 Kampus: Verifikator prediksi AI berkeyakinan rendah & pemantau insiden baterai B3. (3) Pengelola E-Waste Berizin (Pihak Ketiga): Mitra pengangkut & pengolah daur ulang resmi.' 
                  },
                  { 
                    no: 4, 
                    title: 'Perancangan Proses Bisnis (Flowchart)', 
                    desc: 'Mulai -> Mahasiswa scan KTM/input NPM -> Letakkan e-waste di ruang kamera -> Ceklis keselamatan -> Kamera + Sensor Suhu memindai -> [Jika Baterai Rusak/Panas: Buka Laci Tahan Api + Notifikasi K3] -> [Jika Confidence <75%: Masuk Baki Tinjauan Operator] -> [Jika Confidence >=75% & Aman: Buka Katup Kategori A/B] -> Tambah Poin -> Selesai.' 
                  },
                  { 
                    no: 5, 
                    title: 'Pemodelan Sistem (Use Case Diagram)', 
                    desc: 'Mahasiswa: Scan Identitas, Pindai E-Waste, Konfirmasi Ceklis Keselamatan, Terima Insentif Poin. Operator Kampus: Verifikasi Antrean Low-Confidence (Human-in-the-Loop), Tangani Peringatan Karantina B3, Pantau Kapasitas Bin. Mitra Daur Ulang: Ekspor Manifest Pengangkutan E-Waste.' 
                  },
                  { 
                    no: 6, 
                    title: 'Arsitektur Solusi (Aplikasi, IoT & Edge AI)', 
                    desc: 'Edge Layer: Kamera 1080p + Sensor Termal MLX90614 + Mikrokontroler Penggerak Servo Katup & Jetson Nano/Raspberry Pi 5 (YOLOv8m). Backend Layer: REST API Node.js/FastAPI + Database PostgreSQL. Client Layer: Layar Sentuh Kios React + Dashboard Monitoring Operator.' 
                  },
                  { 
                    no: 7, 
                    title: 'Perancangan Data (ERD / Basis Data)', 
                    desc: 'Entitas Utama: USERS (user_id, npm, role, green_points), SMART_BINS (bin_id, location, capacity_pct, temp_celsius), TRANSACTIONS (trx_id, user_id, bin_id, image_url, ai_category, ai_confidence, is_hazardous, compartment_slot), dan OPERATOR_REVIEWS (review_id, trx_id, operator_id, final_decision, timestamp).' 
                  },
                  { 
                    no: 8, 
                    title: 'Desain Antarmuka (UI/UX Prototype)', 
                    desc: 'Diimplementasikan langsung pada Tab 1 (Antarmuka Kios Pintar untuk Mahasiswa) dan Tab 2 (Dashboard Operator & Analitik Ekonomi Sirkular) dengan kontras visual jelas antara status Aman (Hijau), Tinjauan Manual (Kuning), dan Bahaya B3 (Merah).' 
                  },
                  { 
                    no: 9, 
                    title: 'Integrasi AI & Keselamatan (Metode & Alur)', 
                    desc: 'Menggunakan Object Detection YOLOv8m untuk mendeteksi bentuk objek & anomali fisik (seperti baterai menggembung/retak). Menerapkan prinsip Responsible AI: identifikasi visual hanya bersifat skrining awal, larangan keras membongkar baterai mandiri, dan kewajiban peninjauan manusia untuk confidence <75%.' 
                  },
                  { 
                    no: 10, 
                    title: 'Analisis Keberlanjutan (Dampak Ekonomi Sirkular)', 
                    desc: 'Mendorong Urban Mining (pemulihan tembaga, emas, litium, dan plastik rekayasa dari perangkat bekas), menekan emisi CO2e dari penambangan bijih primer, serta menjamin seluruh rantai pengumpulan, penyimpanan sementara, hingga pengangkutan dikelola oleh mitra berizin resmi.' 
                  },
                ].map(item => (
                  <div key={item.no} className="flex bg-[#1e293b]/25 p-4 rounded-2xl border border-slate-800/70 hover:border-[#00d4ff]/40 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 font-bold rounded-xl flex items-center justify-center mr-3.5 text-sm">
                      {item.no}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-slate-400 mt-1.5 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Camera & Telemetry Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-4 bg-[#151e2e]/50 border border-slate-800/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
            <span className="font-mono text-xs text-slate-400 font-semibold tracking-wider uppercase">
              EDGE-CAM 01 // YOLOV8M + THERMAL INTERLOCK (1080P @ 30FPS)
            </span>
          </div>
          <span className="font-mono text-xs text-[#00d4ff] font-semibold">
            {scanResult ? `Sensor Suhu: ${scanResult.temp}` : 'Temp Sensor: 27.2°C (NORMAL)'}
          </span>
        </div>

      </div>
    </div>
  );
}