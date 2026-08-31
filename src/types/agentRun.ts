/** Core domain types for an HQ agent run. Transport-agnostic on purpose. */

export type FloorId = "research" | "drafting" | "writing" | "publish" | "dino";

/** Floors that can receive agent state. The Dino Cabinet never does. */
export type WorkFloorId = Exclude<FloorId, "dino">;

export const WORK_FLOOR_IDS: WorkFloorId[] = ["research", "drafting", "writing", "publish"];

export function isWorkFloor(id: FloorId): id is WorkFloorId {
  return id !== "dino";
}

/** Exactly one display state per work floor. */
export type FloorState = "idle" | "active" | "done";

export type AgentStatus = "working" | "waiting" | "complete" | "failed";

export type NoteStatus = "queued" | "delivered" | "read" | "failed";

export interface SteeringNote {
  id: string;
  runId: string;
  floorId: WorkFloorId;
  text: string;
  createdAt: string;
  status: NoteStatus;
}

export interface AgentAction {
  id: string;
  floorId: WorkFloorId;
  label: string;
  at: string;
}

export interface AgentRunSnapshot {
  runId: string;
  status: AgentStatus;
  startedAt: string;
  /** Floor the backend says the agent is working in right now. */
  currentFloor: WorkFloorId | null;
  floorStates: Record<WorkFloorId, FloorState>;
  latestAction: AgentAction | null;
  notes: SteeringNote[];
  /** Present only when status is "failed". */
  error?: string | null;
}

/* ---------------------------------- Peek ---------------------------------- */

export type PeekBlock =
  | { kind: "text"; text: string }
  | { kind: "markdown"; text: string }
  | { kind: "list"; title?: string; items: string[] }
  | { kind: "headings"; title?: string; items: { level: 1 | 2 | 3; text: string }[] }
  | { kind: "sources"; title?: string; items: { title: string; url?: string; summary?: string }[] }
  | { kind: "links"; title?: string; items: { label: string; url: string }[] }
  | { kind: "code"; text: string; lang?: string }
  | { kind: "actions"; title?: string; items: { label: string; at: string }[] }
  /** Development fallback for payload shapes the UI does not know yet. */
  | { kind: "json"; title?: string; value: unknown };

export interface PeekPayload {
  floorId: WorkFloorId;
  state: FloorState;
  updatedAt: string;
  blocks: PeekBlock[];
}
