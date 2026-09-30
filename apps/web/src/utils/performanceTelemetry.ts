/**
 * OpenGuide Client-Side Performance & Web Vitals Telemetry
 * Provides zero-cost, browser-native metrics measurement (FCP, LCP, CLS, TTFB)
 * and Pyodide Web Worker execution duration tracking ($0 Rule).
 */

export interface PerformanceReport {
  fcp: number | null;
  lcp: number | null;
  cls: number;
  domInteractive: number;
  domContentLoaded: number;
  memoryMb?: number;
}

export interface WorkerExecutionTelemetry {
  lessonId: string;
  executionMs: number;
  stdoutLines: number;
  success: boolean;
  timestamp: number;
}

class PerformanceTelemetry {
  private clsScore: number = 0;
  private lcpScore: number | null = null;
  private fcpScore: number | null = null;
  private workerExecutions: WorkerExecutionTelemetry[] = [];

  constructor() {
    this.initObserver();
  }

  private initObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Observe Paint Timing (FCP)
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.fcpScore = Math.round(entry.startTime);
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });

      // Observe Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          this.lcpScore = Math.round(lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Observe Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            this.clsScore += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Gracefully no-op on platforms where specific observer types are unsupported
    }
  }

  public recordWorkerExecution(telemetry: WorkerExecutionTelemetry) {
    this.workerExecutions.push(telemetry);
    // Keep max 50 recent executions in rolling memory
    if (this.workerExecutions.length > 50) {
      this.workerExecutions.shift();
    }
  }

  public getSnapshot(): PerformanceReport {
    const nav = (typeof performance !== 'undefined' && performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming) || null;
    const memory = (typeof performance !== 'undefined' && (performance as any).memory) || null;

    return {
      fcp: this.fcpScore,
      lcp: this.lcpScore,
      cls: Math.round(this.clsScore * 1000) / 1000,
      domInteractive: nav ? Math.round(nav.domInteractive) : 0,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : 0,
      memoryMb: memory ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : undefined
    };
  }

  public getRecentWorkerTelemetry(): WorkerExecutionTelemetry[] {
    return [...this.workerExecutions];
  }
}

export const performanceTelemetry = new PerformanceTelemetry();
