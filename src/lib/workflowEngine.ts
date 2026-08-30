import type { Note, Project, StageId, StageView, WorkflowStage } from "@/types/project";

export const REQUIRED_ORDER: StageId[] = ["research", "drafting", "writing", "publish"];

export function stagePercent(stage: WorkflowStage): number {
  if (stage.tasks.length === 0) return 0;
  const done = stage.tasks.filter((t) => t.completed).length;
  return Math.round((done / stage.tasks.length) * 100);
}

export function isStageComplete(stage: WorkflowStage): boolean {
  return stage.tasks.length > 0 && stage.tasks.every((t) => t.completed);
}

/**
 * Milestone model: overall progress is 6 explicit milestones across the four
 * required stages. This is shown in the UI as "MILESTONES x / 6".
 */
export interface Milestone {
  id: string;
  label: string;
  reached: boolean;
}

export function milestones(project: Project): Milestone[] {
  const byId = (id: StageId) => project.stages.find((s) => s.id === id)!;
  const pct = (id: StageId) => stagePercent(byId(id));
  const done = (id: StageId) => isStageComplete(byId(id));
  return [
    { id: "research-start", label: "Research started", reached: pct("research") > 0 },
    { id: "research-done", label: "Research complete", reached: done("research") },
    { id: "drafting-start", label: "Drafting started", reached: pct("drafting") > 0 },
    { id: "drafting-done", label: "Drafting complete", reached: done("drafting") },
    { id: "writing-done", label: "Writing complete", reached: done("writing") },
    { id: "publish-done", label: "Publish complete", reached: done("publish") },
  ];
}

export function overallProgress(project: Project): { reached: number; total: number; list: Milestone[] } {
  const list = milestones(project);
  return { reached: list.filter((m) => m.reached).length, total: list.length, list };
}

/** The first required stage that is not complete, or null when everything ships. */
export function activeStageId(project: Project): StageId | null {
  for (const id of REQUIRED_ORDER) {
    const stage = project.stages.find((s) => s.id === id);
    if (stage && !isStageComplete(stage)) return id;
  }
  return null;
}

export function projectShipped(project: Project): boolean {
  return REQUIRED_ORDER.every((id) => {
    const stage = project.stages.find((s) => s.id === id);
    return stage ? isStageComplete(stage) : false;
  });
}

export function deriveStageViews(project: Project): StageView[] {
  const active = activeStageId(project);
  const activeIndex = active ? REQUIRED_ORDER.indexOf(active) : REQUIRED_ORDER.length;

  return project.stages.map((stage) => {
    const totalTasks = stage.tasks.length;
    const completedTasks = stage.tasks.filter((t) => t.completed).length;
    const percent = stagePercent(stage);

    if (stage.isOptional) {
      return {
        ...stage,
        status: "optional" as const,
        completedTasks,
        totalTasks,
        percent,
        editable: true,
        lockedReason: null,
      };
    }

    const index = REQUIRED_ORDER.indexOf(stage.id);
    const complete = isStageComplete(stage);
    let status: StageView["status"];
    if (complete) status = "completed";
    else if (index === activeIndex) status = "active";
    else if (index === activeIndex + 1) status = "available";
    else status = "locked";

    const prereq = stage.prerequisiteStageId
      ? project.stages.find((s) => s.id === stage.prerequisiteStageId)
      : undefined;

    const lockedReason =
      status === "locked" || status === "available"
        ? prereq
          ? `Finish ${prereq.title} to unlock this office.`
          : "Finish the previous stage to unlock this office."
        : null;

    return {
      ...stage,
      status,
      completedTasks,
      totalTasks,
      percent,
      editable: status === "active" || status === "completed",
      lockedReason,
    };
  });
}

export function stageView(views: StageView[], id: StageId): StageView {
  return views.find((v) => v.id === id)!;
}

export function visibleNotes(project: Project): Note[] {
  return project.notes
    .filter((n) => !n.archivedAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function archivedNotes(project: Project): Note[] {
  return project.notes
    .filter((n) => n.archivedAt)
    .sort((a, b) => new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime());
}
