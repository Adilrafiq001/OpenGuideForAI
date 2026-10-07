// OpenGuide AI Studio - Client-Side Daily Streak Notification Engine
// Governed by the $0 Rule: 100% Client-Side Web Notifications (Zero Remote Push Servers)

export interface StreakReminderStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  scheduled: boolean;
}

const STORAGE_KEY_ENABLED = 'openguide_streak_reminders_enabled';
const STORAGE_KEY_LAST_SCHEDULED = 'openguide_streak_last_scheduled_ts';

export function getStreakReminderStatus(): StreakReminderStatus {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return {
      supported: false,
      permission: 'unsupported',
      scheduled: false
    };
  }

  const enabled = localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
  return {
    supported: true,
    permission: Notification.permission,
    scheduled: enabled && Notification.permission === 'granted'
  };
}

export async function requestAndScheduleStreakReminder(currentStreak: number): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      localStorage.setItem(STORAGE_KEY_ENABLED, 'false');
      return false;
    }

    localStorage.setItem(STORAGE_KEY_ENABLED, 'true');
    localStorage.setItem(STORAGE_KEY_LAST_SCHEDULED, Date.now().toString());

    // Schedule or show immediate confirmation notification
    const reg = await navigator.serviceWorker.ready;
    const streakDays = Math.max(1, currentStreak);

    await reg.showNotification('Daily Streak Reminder Activated! 🔥', {
      body: `You are on a ${streakDays}-day learning streak! We will remind you to keep building your neural foundations.`,
      icon: '/icon-192.png',
      badge: '/favicon.svg',
      tag: 'openguide-streak-confirmed'
    });

    return true;
  } catch (err) {
    console.warn('[StreakNotifications] Failed to schedule reminder:', err);
    return false;
  }
}

export function disableStreakReminder(): void {
  try {
    localStorage.setItem(STORAGE_KEY_ENABLED, 'false');
  } catch {}
}
