export type StageId = "research" | "drafting" | "writing" | "publish" | "dino";

export type StageStatus = "completed" | "active" | "available" | "locked" | "optional";

export type FloorId = "floor-research" | "floor-drafting" | "floor-writing" | "floor-publish" | "floor-basement";

export interface Task {
  id: string;
  stageId: StageId;
  title: string;
  completed: boolean;
  completedAt: string | null;
  order: number;
}

export interface WorkflowStage {
  id: StageId;
  number: number;
  title: string;
  description: string;
  /** Longer description used in the context panel / modal subtitle. */
  detail: string;
  nextAction: string;
  stationLabel: string;
  prerequisiteStageId: StageId | null;
  isOptional: boolean;
  floorId: FloorId;
  tasks: Task[];
}

export interface Note {
  id: string;
  content: string;
  workflowStageId: StageId;
  taskId: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface AppSettings {
  soundEnabled: boolean;
  reducedMotionOverride: boolean | null;
  hasSeenKeyboardHint: boolean;
  hasSeenFirstVisitMessages: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentStageId: StageId;
  stages: WorkflowStage[];
  notes: Note[];
  settings: AppSettings;
}

/** Runtime-derived (never persisted) view of a stage. */
export interface StageView extends WorkflowStage {
  status: StageStatus;
  completedTasks: number;
  totalTasks: number;
  percent: number;
  /** Tasks may only be edited when the stage is active or already completed. */
  editable: boolean;
  lockedReason: string | null;
}
