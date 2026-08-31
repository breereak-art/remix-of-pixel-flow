import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_RUN_ID, getAdapter } from "@/lib/agentRunAdapter";
import { saveNotesFallback } from "@/lib/storage";
import type { AgentAction, AgentRunSnapshot, PeekPayload, WorkFloorId } from "@/types/agentRun";

export interface UseAgentRun {
  snapshot: AgentRunSnapshot | null;
  /** Real actions appended locally as they arrive, newest last. */
  actions: AgentAction[];
  sendNote: (floorId: WorkFloorId, text: string) => Promise<void>;
  retryNote: (text: string, floorId: WorkFloorId) => Promise<void>;
  fetchPeek: (floorId: WorkFloorId) => Promise<PeekPayload | null>;
  demo: ReturnType<typeof getAdapter>["demo"];
  runId: string;
}

export function useAgentRun(runId: string = DEFAULT_RUN_ID): UseAgentRun {
  const { adapter, demo } = useMemo(() => getAdapter(), []);
  const [snapshot, setSnapshot] = useState<AgentRunSnapshot | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    return adapter.subscribe(runId, (next) => {
      setSnapshot(next);
      const action = next.latestAction;
      if (action && !seen.current.has(action.id)) {
        seen.current.add(action.id);
        setActions((prev) => [...prev, action]);
      }
      if (next.notes.length) saveNotesFallback(runId, next.notes);
    });
  }, [adapter, runId]);

  const sendNote = useCallback(
    async (floorId: WorkFloorId, text: string) => {
      await adapter.sendSteeringNote({ runId, floorId, text });
    },
    [adapter, runId],
  );

  const retryNote = useCallback(
    async (text: string, floorId: WorkFloorId) => {
      await adapter.sendSteeringNote({ runId, floorId, text });
    },
    [adapter, runId],
  );

  const fetchPeek = useCallback(
    (floorId: WorkFloorId) => adapter.getPeekPayload(runId, floorId),
    [adapter, runId],
  );

  return { snapshot, actions, sendNote, retryNote, fetchPeek, demo, runId };
}
