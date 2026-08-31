import type { AgentRunSnapshot, PeekPayload, SteeringNote, WorkFloorId } from "@/types/agentRun";
import { createMockAgentRunAdapter } from "./mockAgentRunAdapter";

/**
 * The single seam between HQ's UI and a live agent backend.
 * Components never know about SSE, WebSockets, polling or tool names.
 */
export interface AgentRunAdapter {
  subscribe(runId: string, onUpdate: (snapshot: AgentRunSnapshot) => void): () => void;
  sendSteeringNote(input: { runId: string; floorId: WorkFloorId; text: string }): Promise<SteeringNote>;
  getPeekPayload(runId: string, floorId: WorkFloorId): Promise<PeekPayload | null>;
}

/** Optional discreet demo affordances. Real adapters simply omit this. */
export interface DemoControls {
  pause(): void;
  resume(): void;
  next(): void;
  reset(): void;
  isPaused(): boolean;
}

export interface AdapterBundle {
  adapter: AgentRunAdapter;
  demo?: DemoControls;
}

let bundle: AdapterBundle | null = null;

/**
 * Swap this for a live adapter (SSE / WebSocket / polling) in the real-wiring
 * phase. Nothing else in the app needs to change.
 */
export function getAdapter(): AdapterBundle {
  if (!bundle) bundle = createMockAgentRunAdapter();
  return bundle;
}

export function setAdapter(next: AdapterBundle): void {
  bundle = next;
}

export const DEFAULT_RUN_ID = "hq-demo-run";
