import { useEffect, useRef, useState } from "react";
import { useProject } from "@/hooks/useProject";
import { FLOOR_THEMES } from "@/components/game/FloorArt";
import { archivedNotes } from "@/lib/workflowEngine";
import { relativeTime } from "@/lib/helpers";
import type { StageId } from "@/types/project";

export function StageModal({ stageId, onClose }: { stageId: StageId; onClose: () => void }) {
  const { project, stageViews, toggleTask, addNote } = useProject();
  const stage = stageViews.find((s) => s.id === stageId)!;
  const theme = FLOOR_THEMES[stage.id];
  const dialogRef = useRef<HTMLDivElement>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const archived = archivedNotes(project);
  const stageNotes = project.notes.filter((n) => !n.archivedAt && n.workflowStageId === stageId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,11,15,0.78)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${stage.title} station`}
        tabIndex={-1}
        className="pixel-frame w-full max-w-lg bg-card p-4"
        style={{ animation: "neuro-pop 160ms ease-out", borderTop: `4px solid ${theme.accent}` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label-pixel text-[9px] text-idle">{stage.stationLabel}</p>
            <h2 className="label-pixel text-sm" style={{ color: theme.accent }}>
              {stage.isOptional ? "" : `${stage.number}. `}
              {stage.title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{stage.detail}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pixel-frame label-pixel bg-secondary px-2 py-1 text-[9px]"
            aria-label="Close station"
          >
            ESC
          </button>
        </div>

        {stage.isOptional ? (
          <div className="mt-4">
            <p className="label-pixel text-[9px] text-idle">ARCHIVED NOTES · {archived.length}</p>
            <ul className="mt-2 flex max-h-64 flex-col gap-2 overflow-y-auto">
              {archived.length === 0 && <li className="text-xs text-muted-foreground">The cabinet is empty.</li>}
              {archived.map((n) => (
                <li key={n.id} className="pixel-frame-light p-2 text-[11px]" style={{ background: "#e9d9a6", color: "#2a2118" }}>
                  {n.content}
                  <div className="label-pixel mt-1 text-[8px] opacity-70">archived {relativeTime(n.archivedAt!)}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center justify-between">
              <p className="label-pixel text-[9px] text-idle">TASKS</p>
              <span className="label-pixel text-[9px]" style={{ color: theme.accent }}>
                {stage.completedTasks}/{stage.totalTasks} · {stage.percent}%
              </span>
            </div>
            {!stage.editable && (
              <p className="label-pixel mt-2 text-[8px] text-idle">{stage.lockedReason}</p>
            )}
            <ul className="mt-2 flex flex-col gap-2">
              {stage.tasks.map((task) => (
                <li key={task.id}>
                  <label
                    className={`pixel-frame flex items-center gap-3 p-2 ${stage.editable ? "cursor-pointer hover:bg-accent" : "opacity-60"}`}
                    style={{ background: "#1b2127" }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      disabled={!stage.editable}
                      onChange={() => toggleTask(stage.id, task.id)}
                      className="size-4 accent-[var(--color-active)]"
                    />
                    <span className={`text-xs ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (addNote(noteDraft, stage.id)) setNoteDraft("");
              }}
            >
              <label className="label-pixel text-[9px] text-idle" htmlFor="stage-note">
                QUICK NOTE · {stageNotes.length} pinned here
              </label>
              <div className="flex gap-2">
                <input
                  id="stage-note"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Note for this stage…"
                  className="pixel-frame-light flex-1 p-2 text-[11px]"
                  style={{ background: "#f3e7c6", color: "#2a2118" }}
                />
                <button
                  type="submit"
                  disabled={!noteDraft.trim()}
                  className="pixel-frame label-pixel bg-primary px-3 text-[9px] text-primary-foreground disabled:opacity-50"
                >
                  Pin
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
