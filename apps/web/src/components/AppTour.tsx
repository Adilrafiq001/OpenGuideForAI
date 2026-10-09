import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/app-tour.css';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';
import { useLanguageStore } from '../store/useLanguageStore';

export function startAppTour(isMobile: boolean = typeof window !== 'undefined' && window.innerWidth < 768) {
  if (typeof window === 'undefined') return;

  // Restore dock if minimized before starting tour
  window.dispatchEvent(new CustomEvent('openguide:restore-dock'));

  // Ensure top element is in view before launching driver overlay
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const { t } = useLanguageStore.getState();
  const tr = (key: string, fallback: string) => {
    const val = t(key);
    return (val && val !== key) ? val : fallback;
  };

  const rawSteps = isMobile ? [
    {
      element: 'header',
      popover: {
        title: tr('tour_step1_title', 'Welcome to OpenGuide.'),
        description: tr('tour_step1_desc', 'A 100% sovereign, local-first in-browser AI engineering studio. Built under the $0 Rule: zero server bills, zero telemetry, and zero tracking.')
      }
    },
    {
      element: '[data-testid="mobile-bottom-nav"]',
      popover: {
        title: tr('tour_step2_title', 'Mobile Thumb Navigation'),
        description: tr('tour_step2_desc', 'Fast mobile bottom bar: instantly toggle between Home, Curriculum Tracks, 3D Vector Holodeck, and your cryptographically verifiable Student Portfolio.')
      }
    },
    {
      element: '#pathways',
      popover: {
        title: tr('tour_step3_title', 'Adaptive Learning Pathways'),
        description: tr('tour_step3_desc', 'Follow tailored paths matching your background: Absolute Zero, Software Developer to AI, or Math to Machine Learning.')
      }
    },
    {
      element: '#curriculum',
      popover: {
        title: tr('tour_step4_title', '8 Core Tracks • 57 Interactive Labs'),
        description: tr('tour_step4_desc', 'Code Python directly in your mobile browser with CPython 3.12 WebAssembly (Pyodide). Features our 20-key touch-friendly mobile accessory bar!')
      }
    },
    {
      element: '#synapse-lounge',
      popover: {
        title: tr('tour_step5_title', 'The Synapse Lounge'),
        description: tr('tour_step5_desc', 'Tactile geometric visualizers! Explore vector cosine similarity, decision boundaries, and attention matrices live on your touchscreen.')
      }
    },
    {
      element: '#vault',
      popover: {
        title: tr('tour_step6_title', 'Curated Knowledge Vault'),
        description: tr('tour_step6_desc', 'All 8 Karpathy lectures with runnable autograd playgrounds, Hugging Face courses, and Microsoft AI guides included in-app.')
      }
    },
    {
      element: '[data-testid="mobile-nav-more"]',
      popover: {
        title: tr('tour_step7_title', 'Themes & Global Localization'),
        description: tr('tour_step7_desc', 'Tap "More" to access 24 calibrated WCAG AAA themes, 12 world languages (including native Urdu & Arabic RTL), display scaling, and audio volume.')
      }
    },
    {
      element: '#abby-copilot',
      popover: {
        title: tr('tour_step8_title', 'Bluee AI Copilot'),
        description: tr('tour_step8_desc', 'Your offline AI assistant! Drag Bluee anywhere with organic spring momentum and corner jelly-bounce physics.')
      }
    }
  ] : [
    {
      element: 'header',
      popover: {
        title: tr('tour_step1_desktop_title', 'OpenGuide AI Studio'),
        description: tr('tour_step1_desktop_desc', 'A sovereign, production-grade AI engineering laboratory running 100% inside your browser.\n\nOperates under the $0 Rule: zero paid backend servers, zero telemetry, and zero corporate gatekeeping. Computing executes locally on your CPU/GPU.')
      }
    },
    {
      element: '#pathways',
      popover: {
        title: tr('tour_step2_desktop_title', 'Adaptive Pathways & Forward AI Engineering'),
        description: tr('tour_step2_desktop_desc', 'Tailored learning roads: from "Zero to Python Engineer" to the elite "Forward Deployed AI Engineer (FDE)" discipline unifying agentic building and mathematical foundations.')
      }
    },
    {
      element: '#free-stack',
      popover: {
        title: tr('tour_step3_desktop_title', 'The $0 Free Tools Stack'),
        description: tr('tour_step3_desktop_desc', 'Master elite, production-grade AI infrastructure that costs $0: Qdrant vector database, Ollama local model runner, Hugging Face models, and uv package manager.')
      }
    },
    {
      element: '#vault',
      popover: {
        title: tr('tour_step4_desktop_title', 'Curated Knowledge Vault'),
        description: tr('tour_step4_desktop_desc', 'Study legendary courses with zero context switching: all 8 Andrej Karpathy "Zero to Hero" lectures with live autograd playgrounds, Hugging Face Deep RL, and Microsoft GenAI.')
      }
    },
    {
      element: '#pillars',
      popover: {
        title: tr('tour_step5_desktop_title', '11 Engineering Pillars'),
        description: tr('tour_step5_desktop_desc', 'Core tenets of sovereign AI engineering: $0 Rule, WebAssembly local compute, BYOK client privacy, mathematical intuition, and verifiable credentials.')
      }
    },
    {
      element: '#curriculum',
      popover: {
        title: tr('tour_step6_desktop_title', '8 Core Tracks • 57 Interactive Labs'),
        description: tr('tour_step6_desktop_desc', 'Scaffolded real-world challenges executed in-browser via CPython 3.12 WebAssembly (Pyodide v0.26). Automated test suites grade your code with 0ms server latency.')
      }
    },
    {
      element: '#cognitive-accelerator',
      popover: {
        title: tr('tour_step7_desktop_title', 'Cognitive Science Accelerator'),
        description: tr('tour_step7_desktop_desc', 'Ground your learning in modern learning science: Feynman explanation technique, spaced retrieval drilling, blurting cards, and Pareto 80/20 prioritization.')
      }
    },
    {
      element: '#synapse-lounge',
      popover: {
        title: tr('tour_step8_desktop_title', 'The Synapse Lounge: Visual Math Lab'),
        description: tr('tour_step8_desktop_desc', 'See AI math come alive! Rotate high-dimensional vector embeddings, tune single-neuron decision boundaries, and dissect attention matrices before writing code.')
      }
    },
    {
      element: '[data-testid="command-dock-wrapper"]',
      popover: {
        title: tr('tour_step9_desktop_title', 'Spring Magnification Command Dock'),
        description: tr('tour_step9_desktop_desc', 'Fluid macOS-style dock: launch curriculum tracks, open the 3D Vector Holodeck, switch across 24 calibrated WCAG AAA themes, and customize editor typography.')
      }
    },
    {
      element: '#abby-copilot',
      popover: {
        title: tr('tour_step10_desktop_title', 'Bluee AI Copilot & Offline Privacy'),
        description: tr('tour_step10_desktop_desc', 'Draggable AI companion with spring momentum and corner bounce physics! Answers questions with offline knowledge—or connect your own BYOK frontier keys in Settings.')
      }
    }
  ];

  // Resilient step filtering: only target elements actually present in DOM
  const availableSteps = rawSteps.filter(step => {
    try {
      return Boolean(document.querySelector(step.element));
    } catch {
      return false;
    }
  });

  const stepsToRun = availableSteps.length > 0 ? availableSteps : rawSteps;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.82)',
    stagePadding: isMobile ? 4 : 8,
    stageRadius: 16,
    popoverClass: 'openguide-tour-popover',
    nextBtnText: t('tour_next_btn') || 'Next →',
    prevBtnText: t('tour_prev_btn') || '← Back',
    doneBtnText: t('tour_done_btn') || 'Start Exploring',
    steps: stepsToRun,
    onPopoverRender: () => {
      try {
        playTactileSound('click');
        triggerHaptic('light');
      } catch {
        // Safe sound fallback
      }
    },
    onDestroyStarted: () => {
      // Restore focus to tour button on complete or cancel
      const triggerBtn = document.querySelector('[data-testid="header-quick-tour-btn"]') as HTMLElement | null;
      triggerBtn?.focus();
      driverObj.destroy();
    }
  });

  // Short delay to allow smooth scroll to top before starting tour
  setTimeout(() => {
    driverObj.drive();
  }, 120);
}
