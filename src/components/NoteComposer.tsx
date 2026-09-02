import { useState } from "react";
import type { WorkFloorId } from "@/types/agentRun";

const MAX = 280;

interface NoteComposerProps {
  floorId: WorkFloorId;
  floorName: string;
  onSubmit: (floorId: WorkFloorId, text: string) => Promise<void>;
}

/**
 * Only rendered while the agent is actually active in this room.
 * Notes are queued steering for the agent's NEXT step — never a rewrite.
 */
export function NoteComposer({ floorId, floorName, onSubmit }: NoteComposerProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !sending;

  async function send() {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      await onSubmit(floorId, trimmed.slice(0, MAX));
      setText("");
      setSent(true);
    } catch {
      setError("Could not reach the agent. Your note was not queued — try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pixel-frame bg-secondary/40 p-3">
      <p className="label-pixel text-[9px] text-primary">LEAVE A NOTE</p>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        The agent is working in {floorName} right now. Your note is read before its next step — it will not change
        work that is already done.
      </p>

      <label className="sr-only" htmlFor={`note-${floorId}`}>
        Steering note for {floorName}
      </label>
      <textarea
        id={`note-${floorId}`}
        value={text}
        maxLength={MAX}
        rows={3}
        placeholder="e.g. Keep the tone plain and skip the marketing framing."
        onChange={(e) => {
          setText(e.target.value);
          setSent(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            void send();
          }
        }}
        className="pixel-frame mt-2 w-full resize-none bg-background p-2 text-[12px] leading-snug text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="label-pixel text-[8px] text-idle">
          {trimmed.length}/{MAX} · ⌘/CTRL+ENTER
        </span>
        <button
          type="button"
          disabled={!canSend}
          onClick={() => void send()}
          className="pixel-frame label-pixel bg-primary px-3 py-2 text-[9px] text-primary-foreground disabled:opacity-50"
        >
          {sending ? "QUEUEING…" : "QUEUE NOTE"}
        </button>
      </div>

      {sent && !error && (
        <p className="mt-2 text-[11px] text-done" role="status">
          Queued for the agent's next step.
        </p>
      )}
      {error && (
        <p className="mt-2 text-[11px] text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
