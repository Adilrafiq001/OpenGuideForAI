import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  HelpCircle,
  Mail,
  Send,
  CheckCircle,
  Copy,
  Check,
  BookOpen,
  Layers,
  Sparkles,
  X,
  Cpu,
  Lock,
  ChevronRight,
  Palette,
  ExternalLink
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GitHubStarButton } from './GitHubStarButton';

interface StudioFooterProps {
  onOpenThemes?: () => void;
  onOpenHelp?: () => void;
  onOpenCourses?: () => void;
  onOpenTools?: () => void;
  onOpenMatrix?: () => void;
}

type LegalTab = 'terms' | 'privacy' | 'cookies' | 'byok' | 'licenses';

export const StudioFooter: React.FC<StudioFooterProps> = ({
  onOpenThemes,
  onOpenHelp,
  onOpenCourses,
  onOpenTools,
  onOpenMatrix
}) => {
  const navigate = useNavigate();

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Legal Modal state
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('terms');

  // Contact Modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'Feedback',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Changelog Modal state
  const [changelogModalOpen, setChangelogModalOpen] = useState(false);

  // Commit hash copy state
  const [copiedHash, setCopiedHash] = useState(false);
  const buildHash = '36503a8';
  const buildVersion = 'v2.5.0';
  const buildDate = '2026.09.29-PROD';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(buildHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      try {
        localStorage.setItem('openguide_newsletter_subscribed', newsletterEmail.trim());
      } catch {}
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.message.trim()) {
      const subject = encodeURIComponent(`[OpenGuide ${contactForm.category}] from ${contactForm.name || 'Engineer'}`);
      const body = encodeURIComponent(
        `Hello OpenGuide Team,\n\n${contactForm.message}\n\n---\nSender: ${contactForm.name || 'Anonymous'}\nEmail: ${contactForm.email || 'Not provided'}\nCategory: ${contactForm.category}\nPlatform: OpenGuide AI Studio`
      );
      window.open(`mailto:openguideforai@gmail.com?subject=${subject}&body=${body}`, '_blank');
      try {
        const stored = JSON.parse(localStorage.getItem('openguide_contact_messages') || '[]');
        stored.push({ ...contactForm, timestamp: new Date().toISOString() });
        localStorage.setItem('openguide_contact_messages', JSON.stringify(stored));
      } catch {}
      setContactSubmitted(true);
      setTimeout(() => {
        setContactModalOpen(false);
        setContactSubmitted(false);
        setContactForm({ name: '', email: '', category: 'Feedback', message: '' });
      }, 3000);
    }
  };

  const openLegalModalWithTab = (tab: LegalTab) => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  // Focus trap and keyboard dismiss handler for modal dialogs (WCAG 2.2 AA SC 2.4.3 & SC 2.1.2)
  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, closeModal: () => void) => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const container = e.currentTarget;
      const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  return (
    <footer id="studio-footer" className="relative pt-24 pb-16 px-6 md:px-12 border-t border-[var(--color-border)] max-w-7xl mx-auto text-[var(--color-text-primary)]">
      
      {/* Upper Footer: Heroic Brand Manifesto & Newsletter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[var(--color-border)]">
        
        {/* Brand & Manifesto Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="lg" />
          </div>

          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            OpenGuide is engineered from the ground up to dismantle the black box of artificial intelligence. Built for absolute beginners and rigorous engineers alike who want to master real-world AI systems with <span className="text-emerald-500 font-semibold">$0 cloud infrastructure bills</span>, native in-browser WebAssembly runtimes, and zero corporate gatekeeping.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Live Infrastructure Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-mono font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>100% Client-Side WASM Kernel • $0 Cloud Cost</span>
            </div>

            {/* Architecture Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-mono">
              <Cpu size={13} className="text-cyan-400" />
              <span>Pyodide CPython v0.26 Web Worker</span>
            </div>

            {/* GitHub Star Repository Link */}
            <GitHubStarButton variant="pill" />
          </div>
        </div>

        {/* Newsletter & Changelog Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--color-accent)]" />
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Changelog & Curriculum Updates
                </h3>
              </div>
              <button
                onClick={() => setChangelogModalOpen(true)}
                className="text-[11px] font-mono text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Release Notes</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Stay synchronized with new in-browser labs, WebGPU kernels, and curriculum drops. 100% private local-first subscription stored safely in your browser without third-party ad trackers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  required
                  disabled={newsletterSubmitted}
                  className="flex-1 bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-[var(--color-accent)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--color-text-primary)] outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={newsletterSubmitted}
                  className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-75"
                >
                  {newsletterSubmitted ? (
                    <>
                      <Check size={14} />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Join</span>
                    </>
                  )}
                </button>
              </div>
              {newsletterSubmitted && (
                <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle size={12} /> Stored in local session ledger. Thank you!
                </p>
              )}
            </form>
          </div>
        </div>

      </div>

      {/* Middle Footer: Comprehensive Sitemap (4 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-[var(--color-border)] text-xs">
        
        {/* Column 1: Curriculum Tracks */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-[var(--color-text-secondary)] font-bold text-[11px] flex items-center gap-1.5">
            <Layers size={13} className="text-emerald-400" />
            <span>Learning Tracks</span>
          </h4>
          <ul className="space-y-2.5 text-[var(--color-text-secondary)]">
            <li>
              <button 
                onClick={() => navigate('/track/0/intro')} 
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full group cursor-pointer"
              >
                <span>Track 0: Absolute Zero</span>
                <span className="text-[10px] font-mono opacity-60 group-hover:text-[var(--color-accent)]">9 Labs</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/track/1/intro')} 
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full group cursor-pointer"
              >
                <span>Track 1: Embeddings & Vector Space</span>
                <span className="text-[10px] font-mono opacity-60 group-hover:text-cyan-400">9 Labs</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/track/2/intro')} 
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full group cursor-pointer"
              >
                <span>Track 2: Autonomous Agents & RAG</span>
                <span className="text-[10px] font-mono opacity-60 group-hover:text-violet-400">9 Labs</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/track/3/intro')} 
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full group cursor-pointer"
              >
                <span>Track 3: Production Evals & Guardrails</span>
                <span className="text-[10px] font-mono opacity-60 group-hover:text-amber-400">9 Labs</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Laboratories & Interactive Tools */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-[var(--color-text-secondary)] font-bold text-[11px] flex items-center gap-1.5">
            <Sparkles size={13} className="text-cyan-400" />
            <span>Interactive Labs</span>
          </h4>
          <ul className="space-y-2.5 text-[var(--color-text-secondary)]">
            <li>
              <button 
                onClick={() => navigate('/holodeck')} 
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full cursor-pointer"
              >
                <span>Spatial Holodeck</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/30">3D & VR</span>
              </button>
            </li>
            <li>
              <a href="#synapse-lounge" className="hover:text-[var(--color-text-primary)] transition-colors block">
                The Synapse Lounge
              </a>
            </li>
            <li>
              <a href="#cognitive-accelerator" className="hover:text-[var(--color-text-primary)] transition-colors block">
                Cognitive Accelerator Suite
              </a>
            </li>
            <li>
              <button 
                onClick={() => navigate('/portfolio')} 
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full cursor-pointer"
              >
                <span>Student Portfolio & Verification</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">SHA-256</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Curated Vault & Open Resources */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-[var(--color-text-secondary)] font-bold text-[11px] flex items-center gap-1.5">
            <BookOpen size={13} className="text-amber-400" />
            <span>Knowledge Vault</span>
          </h4>
          <ul className="space-y-2.5 text-[var(--color-text-secondary)]">
            <li>
              <button 
                onClick={onOpenCourses}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full cursor-pointer"
              >
                <span>Free Courses Studio (Karpathy, HF)</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">In-App</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenTools}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left flex items-center justify-between w-full cursor-pointer"
              >
                <span>Four Tools Zero Subscriptions Guide</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">$0 Stack</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenMatrix}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left block cursor-pointer"
              >
                First Principles Knowledge Matrix
              </button>
            </li>
            <li>
              <a href="#vault" className="hover:text-[var(--color-text-primary)] transition-colors block">
                Verified Cognitive Science Vault
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal Disclosures & Help */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-[var(--color-text-secondary)] font-bold text-[11px] flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-blue-400" />
            <span>Legal & Governance</span>
          </h4>
          <ul className="space-y-2.5 text-[var(--color-text-secondary)]">
            <li>
              <button 
                onClick={() => openLegalModalWithTab('terms')}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                onClick={() => openLegalModalWithTab('privacy')}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>Privacy Policy</span>
                <span className="text-[9px] font-mono text-emerald-400">0-Data</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => openLegalModalWithTab('cookies')}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left cursor-pointer"
              >
                Cookie Policy (Zero Cookies)
              </button>
            </li>
            <li>
              <button 
                onClick={() => openLegalModalWithTab('byok')}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                <span>BYOK AI Key Security</span>
                <Lock size={10} className="text-amber-400" />
              </button>
            </li>
            <li>
              <button 
                onClick={() => openLegalModalWithTab('licenses')}
                className="hover:text-[var(--color-text-primary)] transition-colors text-left cursor-pointer"
              >
                Open Source Licenses
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Lower Footer: Attribution, Build Telemetry, Help & Social Channels */}
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--color-text-secondary)] font-mono">
        
        {/* Creator & Copyright Notice */}
        <div className="space-y-1 text-center md:text-left">
          <p className="text-[var(--color-text-primary)] font-sans font-semibold">
            © 2026 OpenGuide. AI Studio. All rights reserved.
          </p>
          <p className="text-[11px] flex items-center justify-center md:justify-start gap-1 flex-wrap">
            <span>Architected & Built with</span>
            <span className="inline-flex items-center text-red-500" title="Crafted with passion">
              <svg 
                viewBox="0 0 24 24" 
                width="13" 
                height="13" 
                fill="currentColor" 
                className="inline-block animate-pulse text-red-500"
                aria-label="love"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span>by <strong className="text-[var(--color-text-primary)] font-bold">Adil Rafiq Dar</strong>.</span>
          </p>
        </div>

        {/* Build Telemetry & Copy Hash */}
        <div className="flex items-center gap-3 bg-[var(--color-secondary)] border border-[var(--color-border)] px-3 py-1.5 rounded-full">
          <span>{buildVersion}</span>
          <span className="text-[var(--color-border)]">•</span>
          <span>{buildDate}</span>
          <span className="text-[var(--color-border)]">•</span>
          <button
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-[var(--color-accent)] hover:underline cursor-pointer"
            title="Copy commit hash to clipboard"
          >
            {copiedHash ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>{buildHash}</span>
          </button>
        </div>

        {/* Direct Action Links & Support */}
        <div className="flex items-center gap-4 text-xs font-sans">
          <button
            onClick={() => setContactModalOpen(true)}
            className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <Mail size={13} />
            <span>Contact & Inquiries</span>
          </button>

          <span className="text-[var(--color-border)]">•</span>

          <button
            onClick={onOpenHelp}
            className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <HelpCircle size={13} />
            <span>Help Center</span>
          </button>

          <span className="text-[var(--color-border)]">•</span>

          <button
            onClick={onOpenThemes}
            className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            title="Theme Engine (20 Calibrated Palettes)"
          >
            <Palette size={13} />
            <span>Theme Settings</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. LEGAL DISCLOSURES MODAL (Interactive Full Text)                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {legalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-full max-w-3xl max-h-[85vh] bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="legal-modal-title"
              tabIndex={-1}
              onKeyDown={(e) => handleModalKeyDown(e, () => setLegalModalOpen(false))}
            >
              {/* Header */}
              <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <h3 id="legal-modal-title" className="text-base font-bold text-[var(--color-text-primary)]">
                    Legal Disclosures & Platform Policies
                  </h3>
                </div>
                <button
                  onClick={() => setLegalModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--color-border)] px-4 bg-[var(--color-primary)]/40 overflow-x-auto text-xs font-mono shrink-0">
                <button
                  onClick={() => setLegalTab('terms')}
                  className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    legalTab === 'terms'
                      ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setLegalTab('privacy')}
                  className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    legalTab === 'privacy'
                      ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setLegalTab('cookies')}
                  className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    legalTab === 'cookies'
                      ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Cookie Policy
                </button>
                <button
                  onClick={() => setLegalTab('byok')}
                  className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    legalTab === 'byok'
                      ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  BYOK Key Security
                </button>
                <button
                  onClick={() => setLegalTab('licenses')}
                  className={`px-4 py-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    legalTab === 'licenses'
                      ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Open Source Licenses
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {legalTab === 'terms' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">1. Educational Purpose & $0 Compute Policy</h4>
                    <p>
                      OpenGuide is an open educational platform engineered to instruct learners on foundational artificial intelligence concepts, vector embeddings, and autonomous agent systems. All curriculum tracks execute natively inside your browser utilizing client-side WebAssembly (CPython via Pyodide). OpenGuide incurs $0 server infrastructure cost and requires zero user subscriptions.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">2. Code Execution & Browser Sandboxing</h4>
                    <p>
                      Code entered into the CoursePlayer executes within an isolated browser Web Worker with a strict 15-second watchdog timer. Users retain full ownership of all code written within the platform.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">3. Disclaimer of Warranties</h4>
                    <p>
                      The platform is provided "as is", without warranty of any kind, express or implied. In no event shall the author or contributors be liable for any claim, damages, or other liability.
                    </p>
                  </div>
                )}

                {legalTab === 'privacy' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">1. Zero-Telemetry Local-First Architecture</h4>
                    <p>
                      OpenGuide does not collect, harvest, store, or sell any personal data. There are zero third-party advertising trackers, analytics SDKs, or session recorders installed.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">2. Local Storage of Progress & Keys</h4>
                    <p>
                      All curriculum progress, completed lesson identifiers, theme preferences, and student names for certificate generation are persisted solely on your device via standard browser <code className="text-[var(--color-accent)]">localStorage</code> and <code className="text-[var(--color-accent)]">IndexedDB</code>. Clearing your browser data clears your local progress.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">3. Cryptographic Certificate Verification</h4>
                    <p>
                      When a certificate is generated, the cryptographic SHA-256 hash is calculated client-side via the W3C Web Cryptography API (<code className="text-[var(--color-accent)]">window.crypto.subtle</code>). No student identity is transmitted across the network.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">4. External CDN Runtime & Video Boundaries</h4>
                    <p>
                      To execute Python code client-side at $0 infrastructure cost, OpenGuide downloads compiled CPython WebAssembly binaries on demand from <code className="text-[var(--color-accent)]">cdn.jsdelivr.net</code> (Pyodide official distribution). In air-gapped or offline environments, an integrated local Standby Engine provides local execution without network calls. Additionally, in the Free Courses Studio, optional educational video lectures are embedded using privacy-enhanced mode (<code className="text-[var(--color-accent)]">youtube-nocookie.com</code>), which prevents tracking cookies until playback is initiated.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">5. Statutory Compliance (DPDP Act 2023 & GDPR)</h4>
                    <p>
                      In compliance with the Indian Digital Personal Data Protection Act, 2023 (DPDP Act) and the EU General Data Protection Regulation (GDPR), OpenGuide enforces absolute data minimization, transparent local storage, and zero centralized processing. All privacy rights (access, erasure, correction) are directly exercised locally on your device. For full details, see our comprehensive <a href="https://github.com/openguideforai/OpenGuideForAI/blob/main/docs/PRIVACY.md" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline">Privacy Policy Charter</a>.
                    </p>
                  </div>
                )}

                {legalTab === 'cookies' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">1. Zero Tracking Cookies</h4>
                    <p>
                      OpenGuide uses zero tracking or advertising cookies. We do not use third-party analytics cookies (such as Google Analytics or Facebook Pixel).
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">2. Essential Browser Storage</h4>
                    <p>
                      We utilize standard HTML5 Web Storage exclusively to remember your preferences across sessions:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-[var(--color-text-primary)]">openguide-settings:</strong> Selected color theme and editor preferences.</li>
                      <li><strong className="text-[var(--color-text-primary)]">openguide_completed_lessons:</strong> Your completed exercise checklist.</li>
                      <li><strong className="text-[var(--color-text-primary)]">openguide_lang:</strong> Selected localization language.</li>
                    </ul>
                  </div>
                )}

                {legalTab === 'byok' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">1. Bring-Your-Own-Key (BYOK) Model</h4>
                    <p>
                      OpenGuide adheres to a strict $0 rule. When you optionally connect a frontier model (such as OpenAI, Anthropic, or Google Gemini) in advanced tracks, all API requests are transmitted directly from your client browser to the model provider's HTTPS endpoint.
                    </p>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">2. Zero Intermediary Servers</h4>
                    <p>
                      Your API keys are never transmitted to OpenGuide servers or any middleman proxy. Keys reside strictly in local client memory.
                    </p>
                  </div>
                )}

                {legalTab === 'licenses' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] font-mono">1. Open Source Frameworks & Runtimes</h4>
                    <p>
                      OpenGuide is built atop world-class open-source libraries:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Pyodide (CPython WebAssembly):</strong> Mozilla Public License 2.0</li>
                      <li><strong>Three.js (3D WebGL Engine):</strong> MIT License</li>
                      <li><strong>React 19 & Vite:</strong> MIT License</li>
                      <li><strong>Tailwind CSS & Framer Motion:</strong> MIT License</li>
                      <li><strong>Lucide Icons:</strong> ISC License</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex justify-end shrink-0">
                <button
                  onClick={() => setLegalModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[var(--color-accent)] text-black font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Understood & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. CONTACT & INQUIRIES MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-full max-w-lg bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              tabIndex={-1}
              onKeyDown={(e) => handleModalKeyDown(e, () => setContactModalOpen(false))}
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-[var(--color-accent)]" />
                  <h3 id="contact-modal-title" className="text-base font-bold text-[var(--color-text-primary)]">
                    Contact & Technical Inquiries
                  </h3>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                    Inquiry Dispatched Directly
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
                    Your email client has been pre-filled addressed directly to OpenGuide, and your message has been recorded in your local browser ledger.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] leading-relaxed text-[var(--color-text-secondary)] font-sans">
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold mb-1">
                      <Sparkles size={13} />
                      <span>Direct Team Dispatch &amp; Open Issues</span>
                    </div>
                    Under OpenGuide's strict zero-cloud-overhead policy ($0 Rule), inquiries dispatch directly to OpenGuide via your email client, or can be tracked publicly on GitHub Issues.
                  </div>

                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1 font-semibold uppercase text-[10px]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Alex / AI Engineer"
                      className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-[var(--color-accent)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1 font-semibold uppercase text-[10px]">
                      Your Email (Optional / for reply)
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="engineer@domain.com"
                      className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-[var(--color-accent)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1 font-semibold uppercase text-[10px]">
                      Category
                    </label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                      className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-[var(--color-accent)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none"
                    >
                      <option value="Feedback">Curriculum Feedback</option>
                      <option value="Bug">Technical Bug Report</option>
                      <option value="Feature">Feature / Lab Suggestion</option>
                      <option value="Collaboration">Collaboration / Academic Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--color-text-secondary)] mb-1 font-semibold uppercase text-[10px]">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Detail your inquiry, proposed lab topic, or bug report..."
                      className="w-full bg-[var(--color-primary)] border border-[var(--color-border)] focus:border-[var(--color-accent)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="https://github.com/openguideforai/OpenGuideForAI/issues/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors inline-flex items-center gap-1.5 font-sans"
                    >
                      <span>Public GitHub Issue</span>
                      <ExternalLink size={12} />
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setContactModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[var(--color-accent)] text-black font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                      >
                        <Send size={13} />
                        <span>Send Email</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. CHANGELOG & MILESTONES MODAL                                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {changelogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-full max-w-2xl max-h-[85vh] bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="changelog-modal-title"
              tabIndex={-1}
              onKeyDown={(e) => handleModalKeyDown(e, () => setChangelogModalOpen(false))}
            >
              <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 id="changelog-modal-title" className="text-base font-bold text-[var(--color-text-primary)]">
                    Platform Changelog & Release Milestones
                  </h3>
                </div>
                <button
                  onClick={() => setChangelogModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono">
                {/* Phase 7-10 / v2.5.0 */}
                <div className="space-y-2 border-l-2 border-[var(--color-accent)] pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      Phase 7–10: Production PWA, Attention Radar, 24 Themes & Bluee Copilot
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                      v2.5.0 • Active
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                    Offline PWA service worker with pre-caching, Cloudflare Pages immutable headers, 12 Special research-calibrated physiological themes (melatonin-preserving Circadian Amber, Scotopic Mariana, E-Ink Papyrus, Biophilic Forest), resizable Bluee Copilot with deep domain intelligence and fluid Apple exit physics, Hero interactive mechanical button, and Synapse Lounge Transformer Attention Radar with dynamic Softmax temperature routing.
                  </p>
                </div>

                {/* Phase 6 */}
                <div className="space-y-2 border-l-2 border-cyan-500 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      Phase 6: In-App Free Courses Studio & Granular Setup Guides
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      v2.4.0
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                    Zero-redirect in-app YouTube studio with 8 Karpathy lectures, chapter timestamp pills, live searchable transcript, runnable Python scalar autograd engine, 9 idiot-proof free stack setup guides (Chroma, Qdrant, LangChain, Colab), header de-cluttering, and certificate milestone gating.
                  </p>
                </div>

                {/* Phase 5 */}
                <div className="space-y-2 border-l-2 border-violet-500 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      Phase 5: Student Certification Ledger & ReAct Flow DAG
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/30">
                      v2.3.0
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                    Student portfolio dashboard, W3C WebCrypto SHA-256 cryptographic verification signatures, printable guilloche certificates, and X-Ray Lens ReAct Agent execution graph visualization.
                  </p>
                </div>

                {/* Phase 4 */}
                <div className="space-y-2 border-l-2 border-cyan-500 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      Phase 4: Track 3 Production Evals & WebGPU Neural Engine
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      v2.2.0
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                    OWASP AI Top 10 security guardrails, LLM-as-a-Judge evaluation rubrics, and in-browser WebGPU local SLM inference tensor pipeline.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="space-y-2 border-l-2 border-amber-500 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      Phase 3: Track 2 Autonomous Agents & Model Context Protocol
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      v2.1.0
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                    RAG sliding-window ingestion, ReAct loop mechanics, and JSON-RPC 2.0 FastMCP tool orchestration.
                  </p>
                </div>

                {/* Phase 2 & Earlier */}
                <div className="space-y-2 border-l-2 border-[var(--color-border)] pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      Phases 0-2: Foundation, Spatial Holodeck & Track 1 Embeddings
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                      v1.0.0
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed font-sans">
                    Initial launch with 20 WCAG AAA calibrated themes, 12 world languages with RTL support, Three.js 3D WebGL / WebXR Holodeck, and in-browser Pyodide WASM runtime.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex justify-end shrink-0">
                <button
                  onClick={() => setChangelogModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[var(--color-accent)] text-black font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Close Changelog
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </footer>
  );
};

export default StudioFooter;
