/** localStorage only for UI preferences and a notes-receipt fallback. */

const PREFIX = "hq.";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — memory only */
  }
}

export interface UiPrefs {
  activityLogOpen: boolean;
  reducedMotionOverride: boolean | null;
  showDemoControls: boolean;
}

const DEFAULT_PREFS: UiPrefs = {
  activityLogOpen: false,
  reducedMotionOverride: null,
  showDemoControls: true,
};

export function loadPrefs(): UiPrefs {
  return { ...DEFAULT_PREFS, ...(read<Partial<UiPrefs>>("prefs") ?? {}) };
}

export function savePrefs(prefs: UiPrefs): void {
  write("prefs", prefs);
}

export function loadNotesFallback<T>(runId: string): T[] {
  return read<T[]>(`notes.${runId}`) ?? [];
}

export function saveNotesFallback(runId: string, notes: unknown[]): void {
  write(`notes.${runId}`, notes);
}
