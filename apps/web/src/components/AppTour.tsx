import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/app-tour.css';

export function startAppTour(isMobile: boolean = typeof window !== 'undefined' && window.innerWidth < 768) {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.78)',
    stagePadding: 6,
    stageRadius: 16,
    popoverClass: 'openguide-tour-popover',
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Start Exploring ✦',
    steps: isMobile ? [
      {
        element: 'header',
        popover: {
          title: '✦ OpenGuide AI Studio',
          description: 'A local-first studio for modern AI engineering. 100% client-side WebAssembly & WebGPU with $0 API cost.\n\n📱 Device Tip: OpenGuide is optimized for high-productivity laptop & desktop keyboards, but provides a full mobile touch accessory bar and responsive navigation!'
        }
      },
      {
        element: '[data-testid="mobile-bottom-nav"]',
        popover: {
          title: '⚡ 5-Item Thumb Navigation',
          description: 'Quickly switch between Home, Curriculum Tracks, 3D Vector Holodeck, and your offline verifiable Portfolio credentials.'
        }
      },
      {
        element: '[data-testid="mobile-nav-more"]',
        popover: {
          title: '🎨 Themes & Workspace Controls',
          description: 'Tap More to open the luxury bottom sheet: select from 24 calibrated themes, 12 world languages, and adjust interface display scale.'
        }
      },
      {
        element: '#abby-copilot',
        popover: {
          title: '🤖 Abby AI Companion',
          description: 'Your offline AI assistant! Push Abby across the screen to experience fluid spring momentum and corner jelly-bounce physics.'
        }
      }
    ] : [
      {
        element: 'header',
        popover: {
          title: '✦ OpenGuide AI Studio',
          description: 'Local-first AI engineering curriculum from Python fundamentals to vector embeddings, autonomous agents, and client-side SLMs.'
        }
      },
      {
        element: '#curriculum',
        popover: {
          title: '🗺️ Hands-On Interactive Tracks',
          description: 'Scaffolded challenges executed inside an in-browser CPython WebAssembly runtime (Pyodide v0.26) with automated test-driven grading.'
        }
      },
      {
        element: '[data-testid="command-dock-wrapper"]',
        popover: {
          title: '🚀 Spring Magnification Dock',
          description: 'Fluid macOS-style dock to launch tracks, activate the 3D Holodeck, switch 24 WCAG AAA themes, and tune editor typography.'
        }
      },
      {
        element: '#abby-copilot',
        popover: {
          title: '🤖 Abby AI Copilot',
          description: 'Draggable with interactive jelly-bounce physics! Powered by client-side WebGPU Small Language Models and offline knowledge.'
        }
      }
    ]
  });

  driverObj.drive();
}
