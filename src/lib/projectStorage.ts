import { z } from "zod";
import { createSeedProject, STORAGE_KEY } from "@/data/initialProject";
import type { Project } from "@/types/project";

const taskSchema = z.object({
  id: z.string(),
  stageId: z.enum(["research", "drafting", "writing", "publish", "dino"]),
  title: z.string(),
  completed: z.boolean(),
  completedAt: z.string().nullable(),
  order: z.number(),
});

const stageSchema = z.object({
  id: z.enum(["research", "drafting", "writing", "publish", "dino"]),
  number: z.number(),
  title: z.string(),
  description: z.string(),
  detail: z.string(),
  nextAction: z.string(),
  stationLabel: z.string(),
  prerequisiteStageId: z.enum(["research", "drafting", "writing", "publish", "dino"]).nullable(),
  isOptional: z.boolean(),
  floorId: z.enum(["floor-research", "floor-drafting", "floor-writing", "floor-publish", "floor-basement"]),
  tasks: z.array(taskSchema),
});

const noteSchema = z.object({
  id: z.string(),
  content: z.string(),
  workflowStageId: z.enum(["research", "drafting", "writing", "publish", "dino"]),
  taskId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().nullable(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  currentStageId: z.enum(["research", "drafting", "writing", "publish", "dino"]),
  stages: z.array(stageSchema).min(5),
  notes: z.array(noteSchema),
  settings: z.object({
    soundEnabled: z.boolean(),
    reducedMotionOverride: z.boolean().nullable(),
    hasSeenKeyboardHint: z.boolean(),
    hasSeenFirstVisitMessages: z.boolean(),
  }),
});

export type StorageMode = "local" | "memory";

export interface LoadResult {
  project: Project;
  mode: StorageMode;
  /** Present when persistence is degraded or stored data had to be replaced. */
  warning: string | null;
  seeded: boolean;
}

let memoryProject: Project | null = null;

function storageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const probe = "__neuro_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Parses unknown data into a Project, returning a readable error message on failure. */
export function parseProject(data: unknown): { ok: true; project: Project } | { ok: false; error: string } {
  const result = projectSchema.safeParse(data);
  if (result.success) return { ok: true, project: result.data as Project };
  const first = result.error.issues[0];
  const path = first?.path.join(".") || "root";
  return { ok: false, error: `Invalid project file — ${path}: ${first?.message ?? "unknown problem"}` };
}

export function loadProject(): LoadResult {
  if (!storageAvailable()) {
    if (!memoryProject) memoryProject = createSeedProject();
    return {
      project: memoryProject,
      mode: "memory",
      warning: "Browser storage is unavailable. Progress will only last for this session.",
      seeded: true,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const project = createSeedProject();
      saveProject(project);
      return { project, mode: "local", warning: null, seeded: true };
    }
    const parsed = parseProject(JSON.parse(raw));
    if (!parsed.ok) {
      const project = createSeedProject();
      saveProject(project);
      return {
        project,
        mode: "local",
        warning: "Saved project data was unreadable, so a fresh demo project was created.",
        seeded: true,
      };
    }
    return { project: parsed.project, mode: "local", warning: null, seeded: false };
  } catch {
    const project = createSeedProject();
    memoryProject = project;
    return {
      project,
      mode: "memory",
      warning: "Could not read saved data. Running in memory-only mode for this session.",
      seeded: true,
    };
  }
}

export function saveProject(project: Project): { ok: boolean; error?: string } {
  memoryProject = project;
  if (!storageAvailable()) return { ok: false, error: "Browser storage unavailable" };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not write to browser storage" };
  }
}

export function resetProject(): Project {
  const project = createSeedProject();
  saveProject(project);
  return project;
}

export function seedProjectIfMissing(): LoadResult {
  return loadProject();
}

export function exportProjectJSON(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function importProjectJSON(json: string): { ok: true; project: Project } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  return parseProject(data);
}
