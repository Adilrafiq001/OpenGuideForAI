import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  Search, 
  ArrowRight
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { FIRST_PRINCIPLES_MATRIX, type QuestionCategory } from '../data/firstPrinciplesData';

interface FirstPrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: QuestionCategory;
}

export function FirstPrinciplesModal({ isOpen, onClose, initialCategory = 'why' }: FirstPrinciplesModalProps) {
  const { language } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState<QuestionCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    FIRST_PRINCIPLES_MATRIX[0]?.id || ''
  );

  useEffect(() => {
    if (isOpen && initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const categoryLabels: Record<QuestionCategory, { label: string; count: number; desc: string }> = {
    why: { 
      label: language === 'es' ? '¿Por Qué?' : language === 'zh' ? '为什么 (Why)' : language === 'hi' ? 'क्यों? (Why)' : language === 'fr' ? 'Pourquoi ?' : language === 'de' ? 'Warum?' : 'Why?', 
      count: FIRST_PRINCIPLES_MATRIX.filter(q => q.category === 'why').length,
      desc: language === 'es' ? 'Motivación fundamental y decisiones arquitectónicas' : language === 'zh' ? '核心动机与架构设计决策' : language === 'hi' ? 'मौलिक प्रेरणा और आर्किटेक्चरल निर्णय' : 'Core motivation & architecture decisions'
    },
    how: { 
      label: language === 'es' ? '¿Cómo Funciona?' : language === 'zh' ? '如何运作 (How)' : language === 'hi' ? 'कैसे काम करता है? (How)' : language === 'fr' ? 'Comment ?' : language === 'de' ? 'Wie?' : 'How Does It Work?', 
      count: FIRST_PRINCIPLES_MATRIX.filter(q => q.category === 'how').length,
      desc: language === 'es' ? 'Mecanismos de ejecución y transformaciones matemáticas' : language === 'zh' ? '执行机制与数学几何映射' : language === 'hi' ? 'निष्पादन तंत्र और गणितीय परिवर्तन' : 'Execution mechanics & mathematical conversions'
    },
    what: { 
      label: language === 'es' ? '¿Qué Es?' : language === 'zh' ? '概念定义 (What)' : language === 'hi' ? 'क्या है? (What)' : language === 'fr' ? 'Qu’est-ce ?' : language === 'de' ? 'Was ist das?' : 'What Is It?', 
      count: FIRST_PRINCIPLES_MATRIX.filter(q => q.category === 'what').length,
      desc: language === 'es' ? 'Definiciones exactas y vocabulario sin jerga' : language === 'zh' ? '精准概念定义与零黑话通俗解析' : language === 'hi' ? 'सटीक परिभाषाएं और स्पष्ट शब्दावली' : 'Exact definitions & jargon-free mental models'
    }
  };

  const filteredQuestions = FIRST_PRINCIPLES_MATRIX.filter(q => {
    const matchesCategory = q.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    const title = (q.title[language] || q.title.en).toLowerCase();
    const explanation = (q.explanation[language] || q.explanation.en).toLowerCase();
    const pill = (q.pillLabel[language] || q.pillLabel.en).toLowerCase();
    return matchesCategory && (title.includes(query) || explanation.includes(query) || pill.includes(query));
  });

  const activeQuestion = FIRST_PRINCIPLES_MATRIX.find(q => q.id === selectedQuestionId) || filteredQuestions[0] || FIRST_PRINCIPLES_MATRIX[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="First Principles Knowledge Matrix"
            className="relative w-full max-w-5xl max-h-[88vh] bg-[var(--color-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent,#10b981)]/20 border border-[var(--color-accent,#10b981)]/40 flex items-center justify-center text-[var(--color-accent,#10b981)]">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                    First Principles Knowledge Matrix
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                    All Why • How • What questions answered with crystal-clear intuition and zero AI slop
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category Tabs & Search Bar */}
            <div className="px-6 py-3.5 bg-[var(--color-secondary)]/80 border-b border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-primary)]/80 border border-[var(--color-border)] w-full sm:w-auto shadow-inner">
                {(['why', 'how', 'what'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      const firstInCat = FIRST_PRINCIPLES_MATRIX.find(q => q.category === cat);
                      if (firstInCat) setSelectedQuestionId(firstInCat.id);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCategory === cat
                        ? 'bg-[var(--color-accent,#10b981)] text-black shadow-sm font-bold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span>{categoryLabels[cat].label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeCategory === cat ? 'bg-black/20 text-black font-bold' : 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
                    }`}>
                      {categoryLabels[cat].count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Live Search Input */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder="Filter questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent,#10b981)] shadow-inner"
                />
              </div>
            </div>

            {/* Split View Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[460px]">
              {/* Question List (Left Column) */}
              <div className="md:col-span-5 p-4 border-r border-[var(--color-border)] overflow-y-auto space-y-2 max-h-[55vh] custom-scrollbar">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold block px-2 mb-1">
                  {categoryLabels[activeCategory].desc}
                </span>

                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[var(--color-text-secondary)]">
                    No matching questions found in this category.
                  </div>
                ) : (
                  filteredQuestions.map(q => {
                    const isSelected = q.id === activeQuestion.id;
                    const pillText = q.pillLabel[language] || q.pillLabel.en;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-[var(--color-secondary)] border-[var(--color-accent,#10b981)]/60 shadow-md ring-1 ring-[var(--color-accent,#10b981)]/30'
                            : 'bg-[var(--color-secondary)]/50 hover:bg-[var(--color-primary)] border-[var(--color-border)] hover:border-[var(--color-accent,#10b981)]/40 shadow-sm'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className={`text-xs font-semibold block transition-colors ${
                            isSelected ? 'text-[var(--color-accent,#10b981)] font-bold' : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-accent,#10b981)]'
                          }`}>
                            {pillText}
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {q.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight size={14} className={`shrink-0 transition-transform ${
                          isSelected ? 'text-[var(--color-accent,#10b981)] translate-x-1' : 'text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100'
                        }`} />
                      </button>
                    );
                  })
                )}
              </div>

              {/* Question Detail View (Right Column) */}
              <div className="md:col-span-7 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[55vh] bg-[var(--color-secondary)]/30 custom-scrollbar">
                <div className="space-y-6">
                  {/* Category Pill Tag */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-accent,#10b981)]/15 border border-[var(--color-accent,#10b981)]/30 text-[var(--color-accent,#10b981)] font-bold">
                      {activeQuestion.category.toUpperCase()} • FIRST PRINCIPLES
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                      ID: {activeQuestion.id}
                    </span>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)] leading-snug">
                    {activeQuestion.title[language] || activeQuestion.title.en}
                  </h3>

                  {/* In-Depth Plain-Language Explanation */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-text-secondary)] font-semibold">
                      <Lightbulb size={14} className="text-amber-400" />
                      <span>The Intuition (Zero AI Slop)</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-primary)] leading-relaxed font-normal bg-[var(--color-secondary)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm">
                      {activeQuestion.explanation[language] || activeQuestion.explanation.en}
                    </p>
                  </div>

                  {/* Concrete Takeaway Pill */}
                  <div className="p-4 rounded-2xl bg-[var(--color-accent,#10b981)]/10 border border-[var(--color-accent,#10b981)]/30 space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent,#10b981)]">
                      <CheckCircle2 size={16} />
                      <span>The Takeaway</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-primary)] leading-normal font-medium">
                      {activeQuestion.takeaway[language] || activeQuestion.takeaway.en}
                    </p>
                  </div>
                </div>

                {/* Bottom Navigation Prompt */}
                <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                  <span>Track 0 & 1 incorporate these principles directly into executable code.</span>
                  <button
                    onClick={onClose}
                    className="font-semibold text-[var(--color-accent,#10b981)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Done Exploring</span>
                    <span>&times;</span>
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
