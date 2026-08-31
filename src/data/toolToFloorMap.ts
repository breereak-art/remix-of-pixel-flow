import type { WorkFloorId } from "@/types/agentRun";

export type ToolToFloorMap = Record<string, WorkFloorId>;

/** Configurable mapping from backend tool names to HQ floors. */
export const DEFAULT_TOOL_TO_FLOOR: ToolToFloorMap = {
  search_web: "research",
  fetch_url: "research",
  browse: "research",
  retrieval: "research",
  outline: "drafting",
  plan: "drafting",
  structure: "drafting",
  write: "writing",
  compose: "writing",
  revise: "writing",
  format: "publish",
  export: "publish",
  deliver: "publish",
};

/**
 * Unknown tool names fall back to the known current floor, else drafting.
 * Raw tool names are never surfaced outside the developer view.
 */
export function resolveFloor(
  tool: string | null | undefined,
  currentFloor: WorkFloorId | null,
  map: ToolToFloorMap = DEFAULT_TOOL_TO_FLOOR,
): WorkFloorId {
  const key = (tool ?? "").trim().toLowerCase();
  return map[key] ?? currentFloor ?? "drafting";
}
