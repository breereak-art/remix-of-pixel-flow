import { useEffect, useState } from "react";
import { FLOORS } from "@/data/worldLayout";
import type { AgentRunSnapshot, FloorId, PeekPayload, WorkFloorId } from "@/types/agentRun";
import { isWorkFloor } from "@/types/agentRun";
import { PeekBlocks, clock } from "./PeekBlocks";
import { NoteComposer } from "./NoteComposer";

interface PeekPanelProps {
  floorId: FloorId;
  snapshot: AgentRunSnapshot | null;
  fetchPeek: (floorId: WorkFloorId) => Promise<PeekPayload | null>;
  onSendNote: (floorId: WorkFloorId, text: string) => Promise<void>;
  onClose: () => void;
}

export function PeekPanel({ floorId, snapshot, fetchPeek, onSendNote, onClose }: PeekPanelProps) {
  const floor = FLOORS.find((f) => f.id === floorId);
  const work = isWorkFloor(floorId) ? floorId : null;
  const state = work ? snapshot?.floorStates[work] ?? "idle" : "idle";
  const isActive = work != null && snapshot?.currentFloor === work;

  const [payload, setPayload] = useState<PeekPayload | null>(null);
  const [loading, setLoading] = useState(work != null);
  const [failed, setFailed] = useState(false);

  // Re-reads whenever the backend pushes a new snapshot, so an open Peek stays live.
  const stamp = snapshot?.latestAction?.id ?? "";
  useEffect(() => {
    if (!work) return;
    let alive = true;
    setFailed(false);
    fetchPeek(work)
      .then((next) => {
        if (!alive) return;
        setPayload(next);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setFailed(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [work, fetchPeek, stamp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const title = floor?.name ?? "Room";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Peek into ${title}`}
        className="pixel-frame flex max-h-[86vh] w-full max-w-[520px] flex-col bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex items-center justify-between gap-2 border-b-2 border-black/40 px-3 py-2"
          style={{ background: floor?.tintDark }}
        >
          <div>
            <p className="label-pixel text-[10px]" style={{ color: floor?.accent }}>
              {title.toUpperCase()}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {isActive
                ? "The agent is in this room right now."
                : state === "done"
                  ? "The agent has worked here."
                  : "The agent has not been in here yet."}
              {payload ? ` Last output ${clock(payload.updatedAt)}.` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close peek"
            className="pixel-frame label-pixel bg-secondary px-2 py-1 text-[9px] text-foreground"
          >
            ESC
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3">
          {!work ? (
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              The Dino Cabinet is storage. Nothing here affects the run.
            </p>
          ) : failed ? (
            <p className="text-[12px] text-destructive" role="alert">
              Could not load this room's output. The connection to the agent dropped.
            </p>
          ) : loading ? (
            <p className="text-[12px] text-muted-foreground">Opening the door…</p>
          ) : payload && payload.blocks.length > 0 ? (
            <PeekBlocks blocks={payload.blocks} />
          ) : (
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              This room is still empty. Whatever the agent produces here will show up as it happens.
            </p>
          )}
        </div>

        <footer className="border-t-2 border-black/40 p-3">
          {work && isActive ? (
            <NoteComposer floorId={work} floorName={title} onSubmit={onSendNote} />
          ) : (
            <p className="text-[11px] leading-snug text-muted-foreground">
              {work
                ? "The agent has moved on from this room, so notes here would not be read. Peek into the room it is working in now to steer the next step."
                : "No steering happens from here."}
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
