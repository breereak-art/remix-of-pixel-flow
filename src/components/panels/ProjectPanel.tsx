import { useProject } from "@/hooks/useProject";
import { FLOOR_THEMES } from "@/components/game/FloorArt";
import type { StageView } from "@/types/project";

const STATUS_LABEL: Record<StageView["status"], string> = {
  completed: "DONE",
  active: "ACTIVE",
  available: "NEXT",
  locked: "LOCKED",
  optional: "OPTIONAL",
};

const STATUS_COLOR: Record<StageView["status"], string> = {
  completed: "#74d66a",
  active: "#f2c94c",
  available: "#8ecbff",
  locked: "#6e7a83",
  optional: "#c9a06a",
};

export function ProjectPanel({ onOpenStage }: { onOpenStage: (id: StageView["id"]) => void }) {
  const { project, stageViews, progress, shipped, resetProject } = useProject();
  const active = stageViews.find((s) => s.status === "active");

  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[300px] lg:shrink-0">
      <section className="pixel-frame bg-card p-3">
        <p className="label-pixel text-[9px] text-idle">PROJECT</p>
        <h1 className="label-pixel mt-1 text-sm text-primary">{project.name}</h1>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="label-pixel text-[9px] text-idle">MILESTONES</span>
          <span className="label-pixel text-[10px] text-foreground">
            {progress.reached} / {progress.total}
          </span>
        </div>
        <div className="mt-2 flex gap-1" role="img" aria-label={`${progress.reached} of ${progress.total} milestones reached`}>
          {progress.list.map((m) => (
            <span
              key={m.id}
              title={m.label}
              className="h-3 flex-1"
              style={{ background: m.reached ? "#74d66a" : "#2f3944", border: "2px solid #15191d" }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {shipped ? "Project shipped. Every stage is complete." : active ? active.nextAction : "Pick a stage to continue."}
        </p>
      </section>

      <section className="pixel-frame bg-card p-3">
        <p className="label-pixel text-[9px] text-idle">WORKFLOW</p>
        <ul className="mt-2 flex flex-col gap-2">
          {stageViews.map((stage) => {
            const theme = FLOOR_THEMES[stage.id];
            const disabled = stage.status === "locked";
            return (
              <li key={stage.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onOpenStage(stage.id)}
                  aria-label={`${stage.title}, ${STATUS_LABEL[stage.status]}`}
                  className="pixel-frame w-full p-2 text-left transition-transform disabled:cursor-not-allowed disabled:opacity-55 enabled:hover:-translate-y-px"
                  style={{ background: theme.wallDark }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="label-pixel text-[10px] text-foreground">
                      {stage.isOptional ? "•" : stage.number} {stage.title}
                    </span>
                    <span className="label-pixel text-[8px]" style={{ color: STATUS_COLOR[stage.status] }}>
                      {STATUS_LABEL[stage.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{stage.description}</p>
                  {!stage.isOptional && (
                    <div className="mt-2 h-2 w-full" style={{ background: "#1b2127", border: "2px solid #15191d" }}>
                      <div
                        className="h-full transition-all"
                        style={{ width: `${stage.percent}%`, background: theme.accent }}
                      />
                    </div>
                  )}
                  {disabled && stage.lockedReason && (
                    <p className="label-pixel mt-2 text-[8px] text-idle">{stage.lockedReason}</p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        type="button"
        onClick={resetProject}
        className="pixel-frame label-pixel bg-secondary px-3 py-2 text-[9px] text-foreground hover:bg-accent"
      >
        Reset demo project
      </button>
    </aside>
  );
}
