import { FLOORS } from "@/data/worldLayout";
import type { NoteStatus, SteeringNote } from "@/types/agentRun";
import { clock } from "./PeekBlocks";

const STATUS_TEXT: Record<NoteStatus, string> = {
  queued: "QUEUED",
  delivered: "WITH AGENT",
  read: "READ",
  failed: "FAILED",
};

const STATUS_COLOR: Record<NoteStatus, string> = {
  queued: "#f2c94c",
  delivered: "#6fc2ff",
  read: "#74d66a",
  failed: "#e35b5b",
};

/** Persistent proof that the human's steering notes exist and were seen. */
export function NotesReceipt({
  notes,
  onRetry,
}: {
  notes: SteeringNote[];
  onRetry?: (note: SteeringNote) => void;
}) {
  return (
    <section className="pixel-frame bg-card p-3">
      <p className="label-pixel text-[9px] text-idle">YOUR NOTES</p>
      {notes.length === 0 ? (
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
          No notes yet. Peek into the room the agent is working in to leave one.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id} className="pixel-frame bg-secondary/40 p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="label-pixel text-[8px] text-idle">
                  {FLOORS.find((f) => f.id === note.floorId)?.name.toUpperCase()} · {clock(note.createdAt)}
                </span>
                <span className="label-pixel text-[8px]" style={{ color: STATUS_COLOR[note.status] }}>
                  {STATUS_TEXT[note.status]}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-foreground">{note.text}</p>
              {note.status === "failed" && onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(note)}
                  className="pixel-frame label-pixel mt-2 bg-secondary px-2 py-1 text-[8px] text-foreground"
                >
                  RETRY
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
