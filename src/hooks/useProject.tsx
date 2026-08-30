import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { loadProject, saveProject, resetProject as resetStored, type StorageMode } from "@/lib/projectStorage";
import { deriveStageViews, overallProgress, projectShipped } from "@/lib/workflowEngine";
import { uid } from "@/lib/helpers";
import type { AppSettings, Note, Project, StageId, StageView } from "@/types/project";

interface ProjectContextValue {
  project: Project;
  stageViews: StageView[];
  progress: ReturnType<typeof overallProgress>;
  shipped: boolean;
  storageMode: StorageMode;
  toggleTask: (stageId: StageId, taskId: string) => void;
  addNote: (content: string, stageId: StageId, taskId?: string | null) => Note | null;
  updateNote: (id: string, content: string) => void;
  archiveNote: (id: string) => void;
  restoreNote: (id: string) => void;
  renameProject: (name: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  replaceProject: (project: Project, message?: string) => void;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

const stamp = () => new Date().toISOString();

export function ProjectProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadProject());
  const [project, setProject] = useState<Project>(initial.current.project);
  const [storageMode, setStorageMode] = useState<StorageMode>(initial.current.mode);
  const warnedRef = useRef(false);
  const skipSaveRef = useRef(true);

  useEffect(() => {
    if (warnedRef.current) return;
    warnedRef.current = true;
    if (initial.current.warning) {
      toast.warning("Storage notice", { description: initial.current.warning });
    }
  }, []);

  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    const result = saveProject(project);
    if (!result.ok && storageMode !== "memory") {
      setStorageMode("memory");
      toast.warning("Saving is unavailable", {
        description: "Changes are kept in memory only and will be lost on refresh.",
      });
    }
  }, [project, storageMode]);

  const mutate = useCallback((fn: (draft: Project) => Project) => {
    setProject((current) => ({ ...fn(current), updatedAt: stamp() }));
  }, []);

  const toggleTask = useCallback(
    (stageId: StageId, taskId: string) => {
      mutate((current) => ({
        ...current,
        stages: current.stages.map((stage) =>
          stage.id !== stageId
            ? stage
            : {
                ...stage,
                tasks: stage.tasks.map((task) =>
                  task.id !== taskId
                    ? task
                    : { ...task, completed: !task.completed, completedAt: !task.completed ? stamp() : null },
                ),
              },
        ),
      }));
    },
    [mutate],
  );

  const addNote = useCallback(
    (content: string, stageId: StageId, taskId: string | null = null) => {
      const trimmed = content.trim();
      if (!trimmed) return null;
      const note: Note = {
        id: uid("note"),
        content: trimmed,
        workflowStageId: stageId,
        taskId,
        createdAt: stamp(),
        updatedAt: stamp(),
        archivedAt: null,
      };
      mutate((current) => ({ ...current, notes: [note, ...current.notes] }));
      return note;
    },
    [mutate],
  );

  const updateNote = useCallback(
    (id: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      mutate((current) => ({
        ...current,
        notes: current.notes.map((n) => (n.id === id ? { ...n, content: trimmed, updatedAt: stamp() } : n)),
      }));
    },
    [mutate],
  );

  const archiveNote = useCallback(
    (id: string) => {
      mutate((current) => ({
        ...current,
        notes: current.notes.map((n) => (n.id === id ? { ...n, archivedAt: stamp(), updatedAt: stamp() } : n)),
      }));
    },
    [mutate],
  );

  const restoreNote = useCallback(
    (id: string) => {
      mutate((current) => ({
        ...current,
        notes: current.notes.map((n) => (n.id === id ? { ...n, archivedAt: null, updatedAt: stamp() } : n)),
      }));
    },
    [mutate],
  );

  const renameProject = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      mutate((current) => ({ ...current, name: trimmed }));
    },
    [mutate],
  );

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      mutate((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
    },
    [mutate],
  );

  const replaceProject = useCallback((next: Project, message?: string) => {
    setProject(next);
    if (message) toast.success(message);
  }, []);

  const resetProject = useCallback(() => {
    setProject(resetStored());
    toast.success("Demo project reset", { description: "Research is complete and Drafting is active again." });
  }, []);

  const stageViews = useMemo(() => deriveStageViews(project), [project]);
  const progress = useMemo(() => overallProgress(project), [project]);
  const shipped = useMemo(() => projectShipped(project), [project]);

  const value = useMemo<ProjectContextValue>(
    () => ({
      project,
      stageViews,
      progress,
      shipped,
      storageMode,
      toggleTask,
      addNote,
      updateNote,
      archiveNote,
      restoreNote,
      renameProject,
      updateSettings,
      replaceProject,
      resetProject,
    }),
    [
      project,
      stageViews,
      progress,
      shipped,
      storageMode,
      toggleTask,
      addNote,
      updateNote,
      archiveNote,
      restoreNote,
      renameProject,
      updateSettings,
      replaceProject,
      resetProject,
    ],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used inside <ProjectProvider>");
  return ctx;
}
