import { MOCK_STEPS, MOCK_STEP_MS } from "@/data/mockRunData";
import { resolveFloor } from "@/data/toolToFloorMap";
import { WORK_FLOOR_IDS } from "@/types/agentRun";
import type {
  AgentRunSnapshot,
  FloorState,
  PeekBlock,
  PeekPayload,
  SteeringNote,
  WorkFloorId,
} from "@/types/agentRun";
import type { AdapterBundle } from "./agentRunAdapter";

const idleStates = (): Record<WorkFloorId, FloorState> => ({
  research: "idle",
  drafting: "idle",
  writing: "idle",
  publish: "idle",
});

const emptyPeek = (): Record<WorkFloorId, PeekBlock[]> => ({
  research: [],
  drafting: [],
  writing: [],
  publish: [],
});

const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * Simulates a real changing agent run on a timer. The production UI works
 * without ever touching the demo controls.
 */
export function createMockAgentRunAdapter(): AdapterBundle {
  let stepIndex = -1;
  let snapshot: AgentRunSnapshot = {
    runId: "hq-demo-run",
    status: "waiting",
    startedAt: new Date().toISOString(),
    currentFloor: null,
    floorStates: idleStates(),
    latestAction: null,
    notes: [],
  };
  let peek = emptyPeek();
  let peekUpdatedAt: Record<WorkFloorId, string> = {
    research: "",
    drafting: "",
    writing: "",
    publish: "",
  };
  let paused = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<(s: AgentRunSnapshot) => void>();

  const emit = () => {
    snapshot = { ...snapshot, notes: [...snapshot.notes] };
    for (const l of listeners) l(snapshot);
  };

  const markNotesRead = () => {
    snapshot.notes = snapshot.notes.map((n) => (n.status === "delivered" ? { ...n, status: "read" } : n));
  };

  const applyStep = () => {
    const step = MOCK_STEPS[stepIndex];
    if (!step) return;
    const floorId = resolveFloor(step.tool, snapshot.currentFloor);
    const now = new Date().toISOString();

    markNotesRead();

    const nextStates = { ...snapshot.floorStates, ...(step.states ?? {}) };
    // The agent's live room is always active, even when revisiting a done floor.
    nextStates[floorId] = step.complete ? (step.states?.[floorId] ?? "done") : "active";

    snapshot = {
      ...snapshot,
      status: step.complete ? "complete" : "working",
      currentFloor: step.complete ? null : floorId,
      floorStates: nextStates,
      latestAction: { id: uid(), floorId, label: step.label, at: now },
      notes: snapshot.notes,
    };

    for (const [id, blocks] of Object.entries(step.peek ?? {})) {
      const key = id as WorkFloorId;
      if (!blocks) continue;
      peek[key] = [...peek[key], ...blocks];
      peekUpdatedAt[key] = now;
    }

    emit();
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (paused) return;
    if (stepIndex >= MOCK_STEPS.length - 1) return;
    timer = setTimeout(() => {
      stepIndex += 1;
      applyStep();
      schedule();
    }, stepIndex < 0 ? 900 : MOCK_STEP_MS);
  };

  const reset = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    stepIndex = -1;
    peek = emptyPeek();
    peekUpdatedAt = { research: "", drafting: "", writing: "", publish: "" };
    snapshot = {
      runId: snapshot.runId,
      status: "waiting",
      startedAt: new Date().toISOString(),
      currentFloor: null,
      floorStates: idleStates(),
      latestAction: null,
      notes: [],
    };
    emit();
    schedule();
  };

  return {
    adapter: {
      subscribe(runId, onUpdate) {
        snapshot = { ...snapshot, runId };
        listeners.add(onUpdate);
        onUpdate(snapshot);
        if (!timer && stepIndex < MOCK_STEPS.length - 1) schedule();
        return () => {
          listeners.delete(onUpdate);
        };
      },

      async sendSteeringNote({ runId, floorId, text }) {
        const note: SteeringNote = {
          id: uid(),
          runId,
          floorId,
          text,
          createdAt: new Date().toISOString(),
          status: "queued",
        };
        snapshot.notes = [note, ...snapshot.notes];
        emit();

        // The backend confirms receipt shortly after; it is read at the next step.
        setTimeout(() => {
          snapshot.notes = snapshot.notes.map((n) => (n.id === note.id ? { ...n, status: "delivered" } : n));
          emit();
        }, 1500);

        return note;
      },

      async getPeekPayload(_runId, floorId): Promise<PeekPayload | null> {
        if (!WORK_FLOOR_IDS.includes(floorId)) return null;
        const blocks = peek[floorId];
        if (!blocks.length) return null;
        return {
          floorId,
          state: snapshot.floorStates[floorId],
          updatedAt: peekUpdatedAt[floorId] || snapshot.startedAt,
          blocks,
        };
      },
    },

    demo: {
      pause() {
        paused = true;
        if (timer) clearTimeout(timer);
        timer = null;
      },
      resume() {
        paused = false;
        schedule();
      },
      next() {
        if (stepIndex >= MOCK_STEPS.length - 1) return;
        stepIndex += 1;
        applyStep();
        schedule();
      },
      reset,
      isPaused: () => paused,
    },
  };
}
