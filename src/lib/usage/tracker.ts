// ============================================================
// SamayYudh 2.0 — Active Application & Study Usage Tracker
// Measures active foreground usage without counting idle or background tabs.
// ============================================================

export type UsageCategory = 'practice' | 'exam' | 'formula' | 'review' | 'general';

export interface DailyUsageBucket {
  date: string; // YYYY-MM-DD
  practiceSeconds: number;
  examSeconds: number;
  formulaSeconds: number;
  reviewSeconds: number;
  generalSeconds: number;
  totalActiveSeconds: number;
  lastActiveTimestamp: number;
}

const STORAGE_KEY = 'samayyudh_app_usage_v2';
const IDLE_TIMEOUT_MS = 60 * 1000; // 60 seconds without interaction considered idle
const FLUSH_INTERVAL_MS = 10 * 1000; // write to storage every 10 seconds

class AppUsageTracker {
  private activeCategory: UsageCategory = 'general';
  private isVisible: boolean = true;
  private isUserActive: boolean = true;
  private lastActivityTime: number = Date.now();
  private lastTickTime: number = Date.now();
  private currentDayBucket: DailyUsageBucket | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private initialized: boolean = false;

  public init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    // Load or create today's bucket
    this.currentDayBucket = this.getOrCreateTodayBucket();

    // Event listeners for page visibility & focus
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);

    // Activity listeners to reset idle timeout
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, this.handleUserActivity, { passive: true });
    });

    // Start background ticker
    this.lastTickTime = Date.now();
    this.timer = setInterval(() => this.tick(), FLUSH_INTERVAL_MS);

    // Detect initial category from pathname
    this.detectCategoryFromPath(window.location.pathname);
  }

  public setCategory(cat: UsageCategory) {
    this.activeCategory = cat;
  }

  public detectCategoryFromPath(pathname: string) {
    if (pathname.includes('/exam') || pathname.includes('/battle')) {
      this.activeCategory = 'exam';
    } else if (pathname.includes('/practice') || pathname.includes('/pyq')) {
      this.activeCategory = 'practice';
    } else if (pathname.includes('/formula')) {
      this.activeCategory = 'formula';
    } else if (pathname.includes('/history') || pathname.includes('/review')) {
      this.activeCategory = 'review';
    } else {
      this.activeCategory = 'general';
    }
  }

  private handleVisibilityChange = () => {
    this.isVisible = document.visibilityState === 'visible';
    if (this.isVisible) {
      this.lastActivityTime = Date.now();
      this.lastTickTime = Date.now();
      this.isUserActive = true;
    }
  };

  private handleFocus = () => {
    this.isVisible = true;
    this.lastActivityTime = Date.now();
    this.lastTickTime = Date.now();
    this.isUserActive = true;
  };

  private handleBlur = () => {
    this.flush();
    this.isUserActive = false;
  };

  private handleUserActivity = () => {
    this.lastActivityTime = Date.now();
    this.isUserActive = true;
  };

  private tick() {
    const now = Date.now();
    const elapsedSeconds = Math.round((now - this.lastTickTime) / 1000);
    this.lastTickTime = now;

    // Only count if visible, window has focus, and user interacted within idle timeout
    const isIdle = now - this.lastActivityTime > IDLE_TIMEOUT_MS;
    if (!this.isVisible || isIdle || elapsedSeconds <= 0 || elapsedSeconds > 60) {
      return;
    }

    if (!this.currentDayBucket || this.currentDayBucket.date !== this.getTodayDateString()) {
      this.currentDayBucket = this.getOrCreateTodayBucket();
    }

    switch (this.activeCategory) {
      case 'practice':
        this.currentDayBucket.practiceSeconds += elapsedSeconds;
        break;
      case 'exam':
        this.currentDayBucket.examSeconds += elapsedSeconds;
        break;
      case 'formula':
        this.currentDayBucket.formulaSeconds += elapsedSeconds;
        break;
      case 'review':
        this.currentDayBucket.reviewSeconds += elapsedSeconds;
        break;
      case 'general':
      default:
        this.currentDayBucket.generalSeconds += elapsedSeconds;
        break;
    }

    this.currentDayBucket.totalActiveSeconds += elapsedSeconds;
    this.currentDayBucket.lastActiveTimestamp = now;

    this.flush();
  }

  private flush() {
    if (!this.currentDayBucket || typeof window === 'undefined') return;
    try {
      const all = this.getAllStoredBuckets();
      all[this.currentDayBucket.date] = this.currentDayBucket;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // Ignore quota errors
    }
  }

  public getAllStoredBuckets(): Record<string, DailyUsageBucket> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getOrCreateTodayBucket(): DailyUsageBucket {
    const today = this.getTodayDateString();
    const all = this.getAllStoredBuckets();
    if (all[today]) {
      return all[today];
    }
    const newBucket: DailyUsageBucket = {
      date: today,
      practiceSeconds: 0,
      examSeconds: 0,
      formulaSeconds: 0,
      reviewSeconds: 0,
      generalSeconds: 0,
      totalActiveSeconds: 0,
      lastActiveTimestamp: Date.now(),
    };
    all[today] = newBucket;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // Ignore
    }
    return newBucket;
  }
}

export const appUsageTracker = new AppUsageTracker();

