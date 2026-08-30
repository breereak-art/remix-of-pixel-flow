import { useMemo, useState } from "react";
import { useProject } from "@/hooks/useProject";
import { archivedNotes, visibleNotes } from "@/lib/workflowEngine";
import { relativeTime } from "@/lib/helpers";
import type { StageId } from "@/types/project";

export function NotesPanel() {
  const { project, stageViews, addNote, archiveNote, restoreNote, updateNote } = useProject();
  const [draft, setDraft] = useState("");
  const [stageId, setStageId] = useState<StageId>(project.currentStageId);
  const [showArchive, setShowArchive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const notes = useMemo(() => visibleNotes(project), [project]);
  const archived = useMemo(() => archivedNotes(project), [project]);
  const stageTitle = (id: StageId) => stageViews.find((s) => s.id === id)?.title ?? id;

  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[300px] lg:shrink-0">
      <section className="pixel-frame bg-card p-3">
        <div className="flex items-center justify-between">
          <p className="label-pixel text-[9px] text-idle">NOTES RECEIPT</p>
          <span className="label-pixel text-[9px] text-primary">{notes.length}</span>
        </div>
        <ul className="mt-2 flex max-h-[240px] flex-col gap-2 overflow-y-auto pr-1">
          {notes.length === 0 && <li className="text-[11px] text-muted-foreground">No notes yet. Jot the first one below.</li>}
          {notes.map((note) => (
            <li
              key={note.id}
              className="pixel-frame-light p-2"
              style={{ background: "#e9d9a6", color: "#2a2118" }}
            >
              {editingId === note.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateNote(note.id, editValue);
                    setEditingId(null);
                  }}
                >
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full resize-none bg-cream p-1 text-[11px] text-[#2a2118]"
                    rows={3}
                    aria-label="Edit note"
                  />
                  <div className="mt-1 flex gap-1">
                    <button type="submit" className="label-pixel bg-[#2a2118] px-2 py-1 text-[8px] text-cream">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="label-pixel px-2 py-1 text-[8px] underline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-[11px] leading-snug">{note.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="label-pixel text-[8px] opacity-70">
                      {stageTitle(note.workflowStageId)} · {relativeTime(note.createdAt)}
                    </span>
                    <span className="flex gap-2">
                      <button
                        type="button"
                        className="label-pixel text-[8px] underline"
                        onClick={() => {
                          setEditingId(note.id);
                          setEditValue(note.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="label-pixel text-[8px] underline"
                        onClick={() => archiveNote(note.id)}
                      >
                        Archive
                      </button>
                    </span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="pixel-frame bg-card p-3">
        <p className="label-pixel text-[9px] text-idle">ADD NOTE</p>
        <form
          className="mt-2 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (addNote(draft, stageId)) setDraft("");
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Write it down before you lose it…"
            aria-label="Note content"
            className="pixel-frame-light w-full resize-none p-2 text-[11px]"
            style={{ background: "#f3e7c6", color: "#2a2118" }}
          />
          <div className="flex items-center gap-2">
            <select
              value={stageId}
              onChange={(e) => setStageId(e.target.value as StageId)}
              aria-label="Attach note to stage"
              className="pixel-frame label-pixel flex-1 bg-secondary px-2 py-1 text-[9px] text-foreground"
            >
              {stageViews.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="pixel-frame label-pixel bg-primary px-3 py-1 text-[9px] text-primary-foreground disabled:opacity-50"
            >
              Pin
            </button>
          </div>
        </form>
      </section>

      <section className="pixel-frame bg-card p-3">
        <button
          type="button"
          onClick={() => setShowArchive((v) => !v)}
          className="label-pixel flex w-full items-center justify-between text-[9px] text-idle"
          aria-expanded={showArchive}
        >
          <span>DINO CABINET · ARCHIVE</span>
          <span className="text-primary">{archived.length}</span>
        </button>
        {showArchive && (
          <ul className="mt-2 flex flex-col gap-2">
            {archived.length === 0 && <li className="text-[11px] text-muted-foreground">Nothing buried yet.</li>}
            {archived.map((note) => (
              <li key={note.id} className="flex items-start justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="line-clamp-2">{note.content}</span>
                <button type="button" className="label-pixel text-[8px] text-primary underline" onClick={() => restoreNote(note.id)}>
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
