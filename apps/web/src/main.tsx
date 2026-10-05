import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Auto-recover from stale chunk 404s after new deployments
window.addEventListener('vite:preloadError', () => {
  console.warn('[OpenGuide] New deployment chunk mismatch detected. Reloading for fresh assets...');
  window.location.reload();
});

// Register offline-first service worker for PWA caching & installation in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        // Check for updates periodically (hourly)
        setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000);

        // Check for updates on window focus / tab visibility change
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            reg.update().catch(() => {});
          }
        });

        // If a waiting worker already exists, prompt it to take over
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[OpenGuide SW Registration Failed]', err);
      });

    // Reload page once when the new service worker activates and claims the client
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

