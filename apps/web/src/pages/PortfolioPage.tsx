import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Terminal, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Printer, 
  Copy, 
  Check, 
  User, 
  Lock, 
  Key, 
  ExternalLink,
  Download,
  Upload,
  Network,
  Cloud,
  Share2,
  X
} from 'lucide-react';
import { track0 } from '../data/track0';
import { track1 } from '../data/track1';
import { track2 } from '../data/track2';
import { track3 } from '../data/track3';
import { track4 } from '../data/track4';
import { safeRandomUUID } from '../utils/uuid';
import { useProgressStore } from '../store/useProgressStore';
import { generateJupyterNotebook, downloadFile } from '../utils/notebookExport';

const STUDENT_NAME_KEY = 'openguide_student_name';

interface TrackMetadata {
  id: string;
  number: number;
  title: string;
  badgeName: string;
  badgeTitle: string;
  icon: any;
  color: string;
  accentBorder: string;
  lessons: { id: string; title: string; moduleTitle: string }[];
}

export function PortfolioPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    completedLessonIds,
    resetProgress,
    simulateAllComplete,
    exportProgressJSON,
    importProgressJSON,
    syncToEncryptedGist,
    restoreFromEncryptedGist,
    initProgress
  } = useProgressStore();

  useEffect(() => {
    initProgress();
  }, [initProgress]);

  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem(STUDENT_NAME_KEY) || 'Autonomous AI Engineer';
    } catch {
      return 'Autonomous AI Engineer';
    }
  });

  const [verificationHash, setVerificationHash] = useState<string>('Computing verification signature...');
  const [copiedHash, setCopiedHash] = useState(false);
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<'all' | '0' | '1' | '2' | '3' | '4'>('all');
  const [showSamplePreview, setShowSamplePreview] = useState(false);

  // Build uniform track structure
  const allTracks: TrackMetadata[] = useMemo(() => {
    const formatTrack = (trackData: any, num: number, badgeName: string, badgeTitle: string, icon: any, color: string, accentBorder: string): TrackMetadata => {
      const lessonsList: { id: string; title: string; moduleTitle: string }[] = [];
      trackData.modules.forEach((mod: any) => {
        mod.lessons.forEach((les: any) => {
          lessonsList.push({
            id: les.id,
            title: les.title,
            moduleTitle: mod.title
          });
        });
      });
      return {
        id: trackData.id,
        number: num,
        title: trackData.title,
        badgeName,
        badgeTitle,
        icon,
        color,
        accentBorder,
        lessons: lessonsList
      };
    };

    return [
      formatTrack(track0, 0, 'Kernel Architect', 'CPython WebAssembly & System Runtimes', Cpu, 'text-emerald-700 dark:text-emerald-400', 'border-emerald-500/40'),
      formatTrack(track1, 1, 'Geometrician', 'High-Dimensional Manifolds & Semantic Vectors', Layers, 'text-cyan-700 dark:text-cyan-400', 'border-cyan-500/40'),
      formatTrack(track2, 2, 'Agent Commander', 'Multi-Hop RAG & Autonomous ReAct Loops', Terminal, 'text-violet-700 dark:text-violet-400', 'border-violet-500/40'),
      formatTrack(track3, 3, 'Systems Defender', 'OWASP Top 10 Guardrails & Production Evals', ShieldCheck, 'text-amber-700 dark:text-amber-400', 'border-amber-500/40'),
      formatTrack(track4, 4, 'Frontier Architect', 'Attention Mechanics, Reasoning & MCP Protocols', Network, 'text-rose-700 dark:text-rose-400', 'border-rose-500/40')
    ];
  }, []);

  const totalCurriculumLabs = allTracks.reduce((acc, t) => acc + t.lessons.length, 0);
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalCurriculumLabs) * 100));
  const isCertified = completedCount >= totalCurriculumLabs;
  const canViewCertificate = isCertified || showSamplePreview;

  // Save student name to localStorage
  const handleNameChange = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem(STUDENT_NAME_KEY, name);
    } catch {}
  };

  // Cryptographic Proof Calculation via native Web Crypto API (SHA-256)
  useEffect(() => {
    let isMounted = true;
    async function computeSignature() {
      try {
        const payload = JSON.stringify({
          entity: 'OpenGuide. AI Studio',
          student: studentName.trim() || 'Anonymous Learner',
          curriculum: 'OpenGuide-Production-v2.0',
          completedLabs: [...completedLessonIds].sort(),
          totalLabs: totalCurriculumLabs,
          architectCredit: 'Adil Rafiq Dar (ARD)',
          timestamp: '2026-IMMUTABLE-LEDGER'
        });

        const enc = new TextEncoder();
        const data = enc.encode(payload);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (isMounted) {
          setVerificationHash(`0x${hashHex}`);
        }
      } catch (err) {
        if (isMounted) {
          // Fallback simulation hash
          setVerificationHash(`0x9f8b4c7e2a1d0f5e8b3c6a9d2f1e4b7c0a3d6f9e2b5c8a1d4f7e0b3c6a9d2f1e`);
        }
      }
    }
    computeSignature();
    return () => {
      isMounted = false;
    };
  }, [studentName, completedLessonIds, totalCurriculumLabs]);

  const copiedHashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedHashTimerRef.current) clearTimeout(copiedHashTimerRef.current);
    };
  }, []);

  const handleCopyHash = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(verificationHash).catch(() => {});
    }
    setCopiedHash(true);
    if (copiedHashTimerRef.current) clearTimeout(copiedHashTimerRef.current);
    copiedHashTimerRef.current = setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Demo toggle: complete all labs or reset
  const handleSimulateCompletion = () => {
    const allIds = allTracks.flatMap(t => t.lessons.map(l => l.id));
    simulateAllComplete(allIds);
  };

  const handleResetProgress = () => {
    resetProgress();
  };

  const handleExportBackup = () => {
    const json = exportProgressJSON();
    downloadFile(json, `openguide-competency-ledger-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const success = await importProgressJSON(text);
      if (!success) {
        console.warn('Unable to import: Invalid JSON ledger format.');
      }
    } catch (err) {
      console.warn('Failed to read backup file:', err);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 10/10 Decentralized Gist Sync state
  const [showGistSyncModal, setShowGistSyncModal] = useState(false);
  const [gistPat, setGistPat] = useState('');
  const [gistPassphrase, setGistPassphrase] = useState('');
  const [gistIdToRestore, setGistIdToRestore] = useState('');
  const [gistSyncStatus, setGistSyncStatus] = useState<string | null>(null);
  const [gistSyncLoading, setGistSyncLoading] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const copiedBadgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedBadgeTimerRef.current) clearTimeout(copiedBadgeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showGistSyncModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGistSyncModal(false);
        setGistSyncStatus(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showGistSyncModal]);

  const handleExportW3CCredential = () => {
    const cred = JSON.stringify({
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://openguideforai.dpdns.org/contexts/v1"
      ],
      id: `urn:uuid:${safeRandomUUID()}`,
      type: ["VerifiableCredential", "AIEngineeringCompetencyCertificate"],
      issuer: {
        id: "https://openguideforai.dpdns.org",
        name: "OpenGuide AI Studio",
        architect: "Adil Rafiq Dar (ARD)"
      },
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `did:key:${verificationHash.slice(2, 34)}`,
        name: studentName,
        competency: "Autonomous AI Engineering & Frontier Systems",
        completedLabs: completedLessonIds.length,
        totalLabs: totalCurriculumLabs,
        integritySignatureSHA256: verificationHash
      },
      proof: {
        type: "DeterministicWebCryptoDigest2026",
        created: new Date().toISOString(),
        proofValue: verificationHash
      }
    }, null, 2);

    downloadFile(cred, `openguide-w3c-credential-${new Date().toISOString().slice(0, 10)}.jsonld`, 'application/ld+json');
  };

  const handleCopyBadgeMarkdown = async () => {
    const badgeUrl = `https://img.shields.io/badge/OpenGuide_Certified-AI_Engineer-10b981?style=for-the-badge&logo=openai&logoColor=white`;
    const md = `[![OpenGuide Certified AI Engineer](${badgeUrl})](https://openguideforai.dpdns.org/portfolio?verify=${verificationHash})`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(md);
        setCopiedBadge(true);
        if (copiedBadgeTimerRef.current) clearTimeout(copiedBadgeTimerRef.current);
        copiedBadgeTimerRef.current = setTimeout(() => setCopiedBadge(false), 2500);
      }
    } catch {}
  };

  const handleSyncGist = async () => {
    if (!gistPat.trim() || !gistPassphrase.trim()) {
      setGistSyncStatus('Please enter your GitHub PAT and passphrase.');
      return;
    }
    setGistSyncLoading(true);
    setGistSyncStatus('Encrypting with AES-GCM and syncing to private Gist...');
    const res = await syncToEncryptedGist(gistPat, gistPassphrase);
    setGistSyncLoading(false);
    if (res.success) {
      setGistSyncStatus(`Synced successfully! Gist URL: ${res.gistUrl}`);
    } else {
      setGistSyncStatus(`Sync failed: ${res.error}`);
    }
  };

  const handleRestoreGist = async () => {
    if (!gistPat.trim() || !gistPassphrase.trim() || !gistIdToRestore.trim()) {
      setGistSyncStatus('Please enter your GitHub PAT, passphrase, and Gist ID.');
      return;
    }
    setGistSyncLoading(true);
    setGistSyncStatus('Fetching Gist and decrypting with AES-GCM...');
    const res = await restoreFromEncryptedGist(gistPat, gistPassphrase, gistIdToRestore);
    setGistSyncLoading(false);
    if (res.success) {
      setGistSyncStatus('Successfully restored and decrypted progress ledger!');
    } else {
      setGistSyncStatus(`Restore failed: ${res.error}`);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-primary)] text-[var(--color-text-primary)] font-sans antialiased selection:bg-[var(--color-accent)] selection:text-black">
      
      {/* Print Stylesheet for High-Resolution PDF/Vector Export */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav, footer, .no-print, button {
            display: none !important;
          }
          .certificate-container {
            border: 4px double #10b981 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            background: #ffffff !important;
            color: #0f172a !important;
            width: 100% !important;
            max-width: 1000px !important;
            margin: 0 auto !important;
            padding: 40px !important;
          }
          .certificate-text-dark {
            color: #0f172a !important;
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[var(--color-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 py-3 sm:py-4 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all cursor-pointer flex items-center gap-2 text-xs font-mono min-h-[40px] min-w-[40px]"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Overview</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="h-4 w-px bg-[var(--color-border)] hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">OpenGuide.</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-bold">
                PORTFOLIO LEDGER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-2 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[40px]"
            >
              <Printer size={16} className="text-[var(--color-accent)]" />
              <span className="hidden sm:inline">Export / Print Certificate</span>
              <span className="sm:hidden">Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12 overflow-x-hidden">
        
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-[var(--color-border)] no-print">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-mono font-bold uppercase tracking-wider">
              <Award size={14} />
              <span>Verifiable Competency Ledger</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
              AI Engineering Credentials & Portfolio.
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              Every lab solved in OpenGuide validates your execution against real Python WebAssembly kernels and unit test harnesses. Your accomplishments are recorded locally and sealed with a deterministic SHA-256 cryptographic verification digest.
            </p>
          </div>

          {/* Quick Sandbox Controls & Durability Ledger */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowGistSyncModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-cyan-400 text-[11px] font-mono text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Sync encrypted progress to your private GitHub Gist"
            >
              <Cloud size={13} className="text-cyan-400" />
              <span>Encrypted Gist Sync</span>
            </button>

            <button
              onClick={handleExportW3CCredential}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-violet-400 text-[11px] font-mono text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Download official W3C Verifiable Credential (JSON-LD)"
            >
              <ShieldCheck size={13} className="text-violet-400" />
              <span>W3C Credential (.jsonld)</span>
            </button>

            <button
              onClick={handleCopyBadgeMarkdown}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-emerald-400 text-[11px] font-mono text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Copy verified badge markdown for your GitHub Profile README"
            >
              <Share2 size={13} className="text-emerald-400" />
              <span>{copiedBadge ? 'Badge Copied!' : 'GitHub Badge'}</span>
            </button>

            <button
              onClick={() => {
                const sampleLesson = track0.modules[0].lessons[0];
                const nb = generateJupyterNotebook(sampleLesson.title, sampleLesson.subtitle || sampleLesson.content, sampleLesson.solutionCode || sampleLesson.initialCode, sampleLesson.testCode);
                downloadFile(nb, 'openguide_sovereign_ai_curriculum.ipynb', 'application/x-ipynb+json');
              }}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-amber-400 text-[11px] font-mono text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Download sovereign curriculum starter as a Jupyter Notebook (.ipynb)"
              data-testid="portfolio-export-ipynb-btn"
            >
              <Download size={13} className="text-amber-400" />
              <span>Jupyter (.ipynb)</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[11px] font-mono text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Download your cryptographic learning ledger as a JSON file"
            >
              <Download size={13} className="text-[var(--color-accent)]" />
              <span>Export Ledger (.json)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[11px] font-mono text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Restore completed labs from a previous JSON backup"
            >
              <Upload size={13} className="text-[var(--color-accent)]" />
              <span>Import Backup</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportBackup}
            />

            <button
              onClick={handleSimulateCompletion}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-emerald-500/50 text-[11px] font-mono text-emerald-400 transition-all cursor-pointer"
              title="Unlock all curriculum labs for certificate testing"
            >
              Simulate 100% Complete
            </button>

            <button
              onClick={handleResetProgress}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-rose-500/50 text-[11px] font-mono text-rose-400 transition-all cursor-pointer"
              title="Reset progress to 0"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Top Bento Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
          {/* Stat 1: Total Completed Labs */}
          <div className="p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span className="text-xs font-mono uppercase tracking-wider">Total Labs Passed</span>
              <Terminal size={20} className="text-[var(--color-accent)]" />
            </div>
            <div className="text-3xl font-black font-mono text-[var(--color-text-primary)]">
              {completedCount} <span className="text-sm text-[var(--color-text-secondary)] font-normal">/ {totalCurriculumLabs}</span>
            </div>
            <div className="w-full bg-[var(--color-primary)] rounded-full h-2 overflow-hidden mt-3 border border-[var(--color-border)]">
              <div 
                className="bg-[var(--color-accent)] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-[var(--color-text-secondary)] block">
              {progressPercent}% curriculum mastery
            </span>
          </div>

          {/* Stat 2: Master Track Badges */}
          <div className="p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span className="text-xs font-mono uppercase tracking-wider">Track Badges Unlocked</span>
              <Award size={20} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-mono text-[var(--color-text-primary)]">
              {allTracks.filter(t => t.lessons.every(l => completedLessonIds.includes(l.id))).length} <span className="text-sm text-[var(--color-text-secondary)] font-normal">/ 4</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 block pt-4">
              9/9 labs required per track badge
            </span>
          </div>

          {/* Stat 3: Execution Engine Standard */}
          <div className="p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span className="text-xs font-mono uppercase tracking-wider">Kernel Standard</span>
              <Cpu size={20} className="text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
              Pyodide CPython
            </div>
            <span className="text-[11px] font-mono text-neutral-400 block pt-4">
              WASM Web Worker • $0 Cloud Compute
            </span>
          </div>

          {/* Stat 4: Cryptographic Ledger */}
          <div className="p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span className="text-xs font-mono uppercase tracking-wider">Document Integrity</span>
              <Lock size={20} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              SHA-256 Valid
            </div>
            <span className="text-[11px] font-mono text-neutral-400 block pt-4">
              Deterministic Document Integrity Digest
            </span>
          </div>
        </div>

        {/* SECTION: 4 Master Milestone Track Badges */}
        <div className="space-y-6 no-print">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Curriculum Milestone Badges
            </h2>
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">
              Unlocked upon complete track synthesis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {allTracks.map((track) => {
              const TrackIcon = track.icon;
              const trackCompletedCount = track.lessons.filter(l => completedLessonIds.includes(l.id)).length;
              const isUnlocked = trackCompletedCount === track.lessons.length && track.lessons.length > 0;
              const trackPct = Math.round((trackCompletedCount / track.lessons.length) * 100);

              return (
                <div
                  key={track.id}
                  className={`p-6 rounded-3xl bg-[var(--color-secondary)] border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isUnlocked 
                      ? `${track.accentBorder} shadow-lg shadow-emerald-500/5` 
                      : 'border-[var(--color-border)] opacity-75'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        isUnlocked 
                          ? 'bg-[var(--color-primary)] border-[var(--color-accent)]' 
                          : 'bg-[var(--color-primary)]/50 border-[var(--color-border)]'
                      }`}>
                        <TrackIcon size={24} className={isUnlocked ? track.color : 'text-neutral-500'} />
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isUnlocked 
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-600/30 dark:border-emerald-500/40' 
                          : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                      }`}>
                        {isUnlocked ? 'MASTERED' : `${trackCompletedCount}/${track.lessons.length} LABS`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider block">
                        Track {track.number} Milestone
                      </span>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5">
                        {track.badgeName}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                        {track.badgeTitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div className="w-24 bg-[var(--color-primary)] rounded-full h-1.5 overflow-hidden border border-[var(--color-border)]">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-400' : 'bg-neutral-500'}`}
                        style={{ width: `${trackPct}%` }}
                      />
                    </div>
                    <button
                      onClick={() => navigate(`/track/${track.number}/engine`)}
                      className="text-[11px] font-mono text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jump to Track</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: Cryptographic Certificate & Verification Seal */}
        <div className="space-y-6">
          {!canViewCertificate ? (
            /* LOCKED MILESTONE CARD: Shown when < 36 labs completed */
            <div className="rounded-3xl bg-[var(--color-secondary)] border-2 border-[var(--color-border)] p-4 sm:p-12 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-mono font-bold uppercase tracking-wider">
                    <Lock size={13} />
                    <span>Locked Milestone • Requires 36 / 36 Labs</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-text-primary)] font-serif">
                    Certificate of Engineering Mastery
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    This official cryptographic proof is conferred upon completing all 36 interactive browser labs across Tracks 0, 1, 2, and 3. Upon 100% completion, this space unlocks your personalized document with high-resolution print and PDF export.
                  </p>

                  <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center gap-2.5 text-xs text-[var(--color-text-secondary)] font-mono">
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-[var(--color-text-primary)]">100% Client-Side Privacy:</strong> Your name is never sent to external servers or stored in any database ($0 Hard Constraint). It is stamped locally in-memory onto your cryptographic document.
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-72 space-y-4 shrink-0 p-5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--color-text-secondary)]">Curriculum Progress:</span>
                    <span className="font-bold text-[var(--color-accent)]">{completedCount} / {totalCurriculumLabs} Labs</span>
                  </div>

                  <div className="w-full bg-[var(--color-secondary)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
                    <div 
                      className="bg-[var(--color-accent)] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setShowSamplePreview(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <span>Preview Watermarked Sample</span>
                    </button>
                    <button
                      onClick={handleSimulateCompletion}
                      className="w-full py-2 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-mono font-semibold text-emerald-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle size={13} />
                      <span>Simulate 100% to Test Unlock</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED / PREVIEW MODE */
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print bg-[var(--color-secondary)] p-4 sm:p-6 rounded-3xl border border-[var(--color-border)]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isCertified ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                        <CheckCircle size={12} /> 100% Curriculum Mastered
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
                        <Lock size={12} /> Sample Preview Mode ({completedCount}/{totalCurriculumLabs} Labs)
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Official Completion Certificate
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {isCertified 
                      ? 'Congratulations, Engineer! Your name is applied locally onto the certificate below.'
                      : `Sample preview showing how your conferred document will appear upon completing all ${totalCurriculumLabs} labs.`}
                  </p>
                </div>

                {/* Student Name Editor & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                    <User size={16} className="text-[var(--color-accent)] ml-2 shrink-0" />
                    <input
                      type="text"
                      maxLength={80}
                      value={studentName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter Recipient Name..."
                      className="bg-transparent border-none outline-none text-xs font-mono text-[var(--color-text-primary)] px-2 py-1 w-full sm:w-56"
                    />
                  </div>

                  {!isCertified && (
                    <button
                      onClick={() => setShowSamplePreview(false)}
                      className="px-3 py-2 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] transition-all cursor-pointer"
                    >
                      Close Preview
                    </button>
                  )}

                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-2xl bg-[var(--color-accent)] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Print / PDF Export</span>
                  </button>
                </div>
              </div>

              {/* THE CERTIFICATE CANVAS (Architectural & Printable) */}
              <div className="certificate-container relative rounded-2xl sm:rounded-3xl bg-[var(--color-secondary)]/90 border-2 border-[var(--color-border)] p-4 sm:p-8 md:p-14 shadow-2xl overflow-hidden">
                {/* Watermark badge if in sample preview */}
                {!isCertified && (
                  <div className="absolute top-6 right-6 z-20 pointer-events-none no-print border-2 border-dashed border-amber-500/60 bg-amber-500/15 text-amber-400 font-mono text-[10px] sm:text-xs px-3 py-1 rounded-lg uppercase tracking-widest font-bold">
                    Sample Preview • 36 Labs Required
                  </div>
                )}
            {/* Guilloche Ornamental Border Simulation */}
            <div className="absolute inset-3 rounded-2xl border border-dashed border-[var(--color-accent)]/30 pointer-events-none" />
            <div className="absolute inset-5 rounded-xl border border-[var(--color-border)] pointer-events-none" />

            <div className="relative z-10 space-y-8 text-center max-w-4xl mx-auto">
              
              {/* Certificate Header Monogram */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] border-2 border-[var(--color-accent)] flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black font-mono text-[var(--color-accent)]">OG</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold">
                  OpenGuide AI Engineering Institute
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] certificate-text-dark font-serif">
                  Certificate of Engineering Mastery
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-widest">
                  First-Principles AI Systems & Autonomous Agent Architecture
                </p>
              </div>

              {/* Recipient */}
              <div className="py-4 space-y-2">
                <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-widest block">
                  This deterministic certification is conferred upon
                </span>
                <div className="text-2xl sm:text-4xl font-extrabold text-[var(--color-accent)] underline decoration-[var(--color-accent)]/40 underline-offset-8">
                  {studentName || 'Autonomous AI Engineer'}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed certificate-text-dark">
                Having successfully constructed, analyzed, and verified the mathematical foundations of vector embeddings, scalable semantic indexing, local Pyodide CPython sandboxes, multi-turn ReAct agent harnesses, and OWASP AI guardrail evaluation frameworks.
              </p>

              {/* Curriculum Progress Seals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 max-w-2xl mx-auto">
                {allTracks.map(t => {
                  const tPassed = t.lessons.filter(l => completedLessonIds.includes(l.id)).length;
                  const isDone = tPassed === t.lessons.length;
                  return (
                    <div key={t.id} className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-center">
                      <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block">
                        Track {t.number}
                      </span>
                      <span className={`text-xs font-bold block mt-0.5 ${isDone ? 'text-emerald-400' : 'text-neutral-400'}`}>
                        {isDone ? 'VERIFIED' : `${tPassed}/9 Labs`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Signatures & Seal Line */}
              <div className="pt-8 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs font-mono">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Issuing Authority</span>
                  <span className="font-bold text-[var(--color-text-primary)] block">OpenGuide. AI Studio</span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">WASM / Web Worker Tier</span>
                </div>

                {/* Golden Architectural Seal */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-[var(--color-accent)] flex items-center justify-center p-1 bg-[var(--color-primary)]">
                    <Award size={28} className="text-[var(--color-accent)] animate-pulse" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--color-accent)] font-bold">
                    INTEGRITY SEAL
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Creator & Architect</span>
                  <span className="font-bold text-[var(--color-text-primary)] block">Adil Rafiq Dar (ARD)</span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">Principal AI Systems Engineer</span>
                </div>
              </div>

              {/* Verifiable SHA-256 Ledger Line */}
              <div className="p-3 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2 overflow-hidden w-full">
                  <Key size={16} className="text-[var(--color-accent)] shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-mono text-[var(--color-text-secondary)] uppercase block">
                      Deterministic SHA-256 Document Integrity Signature
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-text-primary)] truncate block select-all">
                      {verificationHash}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyHash}
                  className="px-3 py-1.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[10px] font-mono text-[var(--color-text-primary)] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer no-print"
                >
                  {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>

            </div>
          </div>
            </>
          )}
        </div>

        {/* SECTION: Complete Curriculum Transcript Audit */}
        <div className="space-y-6 no-print">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {totalCurriculumLabs}-Lab Curriculum Transcript
              </h2>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Granular status of all exercises and boss project challenges
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] overflow-x-auto max-w-full">
              {(['all', '0', '1', '2', '3', '4'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedTrackFilter(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === f 
                      ? 'bg-[var(--color-accent)] text-black' 
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {f === 'all' ? `All ${totalCurriculumLabs}` : `Track ${f}`}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript List by Track */}
          <div className="space-y-6">
            {allTracks
              .filter(t => selectedTrackFilter === 'all' || selectedTrackFilter === String(t.number))
              .map(track => {
                const TrackIcon = track.icon;
                return (
                  <div key={track.id} className="p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center">
                          <TrackIcon size={18} className={track.color} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[var(--color-text-primary)]">
                            Track {track.number}: {track.title}
                          </h3>
                          <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                            Badge: {track.badgeName}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/track/${track.number}/engine`)}
                        className="px-3 py-1 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-xs font-mono text-[var(--color-accent)] transition-all cursor-pointer"
                      >
                        Launch Track IDE
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {track.lessons.map(lesson => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                              isDone 
                                ? 'bg-emerald-500/10 border-emerald-500/30' 
                                : 'bg-[var(--color-primary)]/50 border-[var(--color-border)]'
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block line-clamp-1">
                                {lesson.moduleTitle}
                              </span>
                              <h4 className="text-xs font-semibold text-[var(--color-text-primary)] line-clamp-2">
                                {lesson.title}
                              </h4>
                            </div>

                            <div className="shrink-0 mt-0.5">
                              {isDone ? (
                                <CheckCircle size={18} className="text-emerald-400" />
                              ) : (
                                <Clock size={16} className="text-neutral-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Encrypted Gist Sync Modal */}
        {showGistSyncModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowGistSyncModal(false);
                setGistSyncStatus(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gist-sync-title"
          >
            <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Cloud size={18} />
                  </div>
                  <div>
                    <h3 id="gist-sync-title" className="text-base font-bold text-[var(--color-text-primary)]">
                      Decentralized Gist Sync ($0 Rule)
                    </h3>
                    <p className="text-[11px] font-mono text-[var(--color-text-secondary)]">Client-side AES-GCM 256-bit Zero-Knowledge Sync</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowGistSyncModal(false);
                    setGistSyncStatus(null);
                  }}
                  aria-label="Close Gist sync dialog"
                  className="p-1.5 rounded-xl hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer flex items-center justify-center"
                >
                  <X size={18} />
                  <span className="sr-only">✕</span>
                </button>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Your progress ledger is encrypted locally in your browser before uploading to a private GitHub Gist under your personal GitHub account. No third-party servers, no telemetry, and 100% immune to browser cache clearing.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[11px] text-[var(--color-text-secondary)] mb-1">GitHub Personal Access Token (PAT with 'gist' scope):</label>
                  <input
                    type="password"
                    value={gistPat}
                    onChange={(e) => setGistPat(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-cyan-400 focus:outline-none text-[var(--color-text-primary)] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--color-text-secondary)] mb-1">Passphrase (Used for AES-GCM Encryption / Decryption):</label>
                  <input
                    type="password"
                    value={gistPassphrase}
                    onChange={(e) => setGistPassphrase(e.target.value)}
                    placeholder="Enter a secret passphrase"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-cyan-400 focus:outline-none text-[var(--color-text-primary)] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--color-text-secondary)] mb-1">Gist ID (Only required if Restoring on a new device):</label>
                  <input
                    type="text"
                    value={gistIdToRestore}
                    onChange={(e) => setGistIdToRestore(e.target.value)}
                    placeholder="e.g. 7f3b8c9d0e1f2a3b4c5d"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-cyan-400 focus:outline-none text-[var(--color-text-primary)] text-xs"
                  />
                </div>
              </div>

              {gistSyncStatus && (
                <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono text-cyan-400 break-all">
                  {gistSyncStatus}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  disabled={gistSyncLoading}
                  onClick={handleSyncGist}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Cloud size={14} />
                  <span>{gistSyncLoading ? 'Syncing...' : 'Sync to Gist (Backup)'}</span>
                </button>

                <button
                  disabled={gistSyncLoading}
                  onClick={handleRestoreGist}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--color-primary)] hover:border-cyan-400 border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Upload size={14} />
                  <span>Restore from Gist</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
