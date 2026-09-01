import { useState } from "react";
import { BuildingScene } from "./BuildingScene";
import { useAgentRun } from "@/hooks/useAgentRun";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FLOORS } from "@/data/worldLayout";
import { isWorkFloor, type FloorId, type FloorState } from "@/types/agentRun";

const STATE_TEXT: Record<FloorState, string> = {
  idle: "Not touched yet",
  active: "Agent working here",
  done: "Agent has worked here",
};

const STATUS_TEXT: Record<string, string> = {
  waiting: "Waiting to start",
  working: "Working",
  complete: "Run complete",
  failed: "Run failed",
};

export function AppShell() {
  const { snapshot, actions } = useAgentRun();
  const reducedMotion = useReducedMotion();
  const [peekFloor, setPeekFloor] = useState<FloorId | null>(null);

  const latest = snapshot?.latestAction ?? null;
  const currentFloorName = latest ? FLOORS.find((f) => f.id === latest.floorId)?.name : null;

  return (
    <main className="min-h-screen bg-background p-3 lg:p-5">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
        <header className="pixel-frame flex flex-wrap items-center justify-between gap-2 bg-card px-3 py-2">
          <div>
            <h1 className="label-pixel text-[11px] text-primary">HQ</h1>
            <p className="mt-1 text-[11px] text-muted-foreground">
              What you see while an AI agent is thinking, instead of a blank loading screen.
            </p>
          </div>
          <p className="label-pixel text-[9px]" style={{ color: snapshot?.status === "failed" ? "#e35b5b" : "#f2c94c" }}>
            {STATUS_TEXT[snapshot?.status ?? "waiting"]}
            {currentFloorName ? ` — ${currentFloorName}: ${latest?.label}` : ""}
          </p>
        </header>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <aside className="flex w-full flex-col gap-3 lg:w-[280px] lg:shrink-0">
            <section className="pixel-frame bg-card p-3">
              <p className="label-pixel text-[9px] text-idle">FLOORS</p>
              <ul className="mt-2 flex flex-col gap-2">
                {FLOORS.filter((f) => isWorkFloor(f.id)).map((floor) => {
                  const state = snapshot?.floorStates[floor.id as "research"] ?? "idle";
                  return (
                    <li key={floor.id} className="pixel-frame p-2" style={{ background: floor.tintDark }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="label-pixel text-[10px]" style={{ color: floor.accent }}>
                          {floor.name.toUpperCase()}
                        </span>
                        <span className="label-pixel text-[8px] text-idle">
                          {state === "active" ? "HERE" : state === "done" ? "WORKED" : "QUIET"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{STATE_TEXT[state]}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>

          <section className="pixel-frame order-first h-[58vh] min-h-[380px] w-full bg-card lg:order-none lg:h-[80vh]">
            <BuildingScene
              snapshot={snapshot}
              reducedMotion={reducedMotion}
              onPeek={setPeekFloor}
              playerEnabled={peekFloor === null}
            />
          </section>

          <aside className="flex w-full flex-col gap-3 lg:w-[280px] lg:shrink-0">
            <section className="pixel-frame bg-card p-3">
              <p className="label-pixel text-[9px] text-idle">ACTIVITY</p>
              <ol className="mt-2 flex flex-col gap-1" aria-live="polite">
                {actions.length === 0 && (
                  <li className="text-[11px] text-muted-foreground">Nothing yet — the agent is starting up.</li>
                )}
                {[...actions].reverse().map((action) => (
                  <li key={action.id} className="text-[11px] text-muted-foreground">
                    <span className="label-pixel text-[8px] text-idle">
                      {FLOORS.find((f) => f.id === action.floorId)?.name.toUpperCase()}
                    </span>{" "}
                    {action.label}
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </div>

      {peekFloor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Peek"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPeekFloor(null)}
        >
          <div className="pixel-frame max-w-md bg-card p-4" onClick={(e) => e.stopPropagation()}>
            <p className="label-pixel text-[10px] text-primary">
              {FLOORS.find((f) => f.id === peekFloor)?.name.toUpperCase()}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Partial output for this floor arrives in the next build step.
            </p>
            <button
              type="button"
              onClick={() => setPeekFloor(null)}
              className="pixel-frame label-pixel mt-3 bg-secondary px-3 py-2 text-[9px] text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
