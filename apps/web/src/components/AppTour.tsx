import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/app-tour.css';

export function startAppTour(isMobile: boolean = typeof window !== 'undefined' && window.innerWidth < 768) {
  // Ensure top element is in view before launching driver overlay
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.82)',
    stagePadding: 6,
    stageRadius: 16,
    popoverClass: 'openguide-tour-popover',
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Start Exploring',
    steps: isMobile ? [
      {
        element: 'header',
        popover: {
          title: 'Welcome to OpenGuide',
          description: 'A 100% sovereign, local-first in-browser AI engineering studio. Built under the $0 Rule: zero server bills, zero telemetry, and zero tracking.'
        }
      },
      {
        element: '[data-testid="mobile-bottom-nav"]',
        popover: {
          title: 'Mobile Thumb Navigation',
          description: 'Fast mobile bottom bar: instantly toggle between Home, Curriculum Tracks, 3D Vector Holodeck, and your cryptographically verifiable Student Portfolio.'
        }
      },
      {
        element: '#pathways',
        popover: {
          title: 'Adaptive Learning Pathways',
          description: 'Follow tailored paths matching your background: Absolute Zero, Software Developer to AI, or Math to Machine Learning.'
        }
      },
      {
        element: '#curriculum',
        popover: {
          title: '8 Core Tracks • 57 Interactive Labs',
          description: 'Code Python directly in your mobile browser with CPython 3.12 WebAssembly (Pyodide). Features our 20-key touch-friendly mobile accessory bar!'
        }
      },
      {
        element: '#synapse-lounge',
        popover: {
          title: 'The Synapse Lounge',
          description: 'Tactile geometric visualizers! Explore vector cosine similarity and single-neuron decision boundaries live on your touchscreen.'
        }
      },
      {
        element: '#vault',
        popover: {
          title: 'Curated Knowledge Vault',
          description: 'All 8 Karpathy lectures with runnable autograd playgrounds, Hugging Face courses, and Microsoft AI guides included in-app.'
        }
      },
      {
        element: '[data-testid="mobile-nav-more"]',
        popover: {
          title: 'Themes & Global Localization',
          description: 'Tap "More" to access 20 WCAG AAA themes, 12 world languages (including native Urdu & Arabic RTL), display scaling, and audio volume.'
        }
      },
      {
        element: '#abby-copilot',
        popover: {
          title: 'Bluee AI Copilot',
          description: 'Your offline AI assistant! Drag Bluee anywhere with organic spring momentum and corner jelly-bounce physics.'
        }
      }
    ] : [
      {
        element: 'header',
        popover: {
          title: 'OpenGuide AI Studio',
          description: 'A sovereign, production-grade AI engineering laboratory running 100% inside your browser.\n\nOperates under the $0 Rule: zero paid backend servers, zero telemetry, and zero corporate gatekeeping. Computing executes locally on your CPU/GPU.'
        }
      },
      {
        element: '#pathways',
        popover: {
          title: 'Adaptive Learning Pathways',
          description: 'Tailored learning roads for everyone: from "Zero to Python Engineer" through "Vector Database Architect" to "Autonomous Reasoning & Frontier Systems".'
        }
      },
      {
        element: '#free-stack',
        popover: {
          title: 'The $0 Free Tools Stack',
          description: 'Master elite, production-grade AI infrastructure that costs $0: Qdrant vector database, Ollama local model runner, Hugging Face models, and uv package manager.'
        }
      },
      {
        element: '#vault',
        popover: {
          title: 'Curated Knowledge Vault',
          description: 'Study legendary courses with zero context switching: all 8 Andrej Karpathy "Zero to Hero" lectures with live autograd playgrounds, Hugging Face Deep RL, and Microsoft GenAI.'
        }
      },
      {
        element: '#pillars',
        popover: {
          title: '11 Engineering Pillars',
          description: 'Core tenets of sovereign AI engineering: $0 Rule, WebAssembly local compute, BYOK client privacy, mathematical intuition, and verifiable credentials.'
        }
      },
      {
        element: '#curriculum',
        popover: {
          title: '8 Core Tracks • 57 Interactive Labs',
          description: 'Scaffolded real-world challenges executed in-browser via CPython 3.12 WebAssembly (Pyodide v0.26). Automated test suites grade your code with 0ms server latency.'
        }
      },
      {
        element: '#cognitive-accelerator',
        popover: {
          title: 'Cognitive Science Accelerator',
          description: 'Ground your learning in modern learning science: Feynman explanation technique, spaced retrieval drilling, blurting cards, and Pareto 80/20 prioritization.'
        }
      },
      {
        element: '#synapse-lounge',
        popover: {
          title: 'The Synapse Lounge: Visual Math Lab',
          description: 'See AI math come alive! Rotate high-dimensional vector embeddings, tune single-neuron decision boundaries, and dissect attention matrices before writing code.'
        }
      },
      {
        element: '[data-testid="command-dock-wrapper"]',
        popover: {
          title: 'Spring Magnification Command Dock',
          description: 'Fluid macOS-style dock: launch curriculum tracks, open the 3D Vector Holodeck, switch across 20 calibrated WCAG AAA themes, and customize editor typography.'
        }
      },
      {
        element: '#abby-copilot',
        popover: {
          title: 'Bluee AI Copilot & Offline Privacy',
          description: 'Draggable AI companion with spring momentum and corner bounce physics! Answers questions with offline knowledge—or connect your own BYOK frontier keys in Settings.'
        }
      }
    ]
  });

  // Restore dock if minimized before starting tour
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('openguide:restore-dock'));
  }

  // Short delay to allow smooth scroll to top before starting tour
  setTimeout(() => {
    driverObj.drive();
  }, 100);
}
