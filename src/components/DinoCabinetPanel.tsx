import { useEffect } from "react";
import { FLOOR_BY_ID } from "@/data/worldLayout";

interface DinoCabinetPanelProps {
  onClose: () => void;
}

const FINDS = [
  "A shelved idea about letting the agent narrate its own dead ends.",
  "An abandoned progress bar. It lied, so it was retired down here.",
  "A cardboard box labelled “ROOM WE NEVER BUILT”.",
  "Someone's fossilised sticky note: “ask it fewer, better questions”.",
];

/**
 * Easter egg only. Carries no agent state and no steering — the run is fully
 * understandable without ever opening this room.
 */
export function DinoCabinetPanel({ onClose }: DinoCabinetPanelProps) {
  const floor = FLOOR_BY_ID.dino;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dino Cabinet"
        className="pixel-frame flex max-h-[86vh] w-full max-w-[460px] flex-col bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex items-center justify-between gap-2 border-b-2 border-black/40 px-3 py-2"
          style={{ background: floor.tintDark }}
        >
          <div>
            <p className="label-pixel text-[10px]" style={{ color: floor.accent }}>
              DINO CABINET
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Storage in the basement. Nothing down here is part of the run.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the Dino Cabinet"
            className="pixel-frame label-pixel bg-secondary px-2 py-1 text-[9px] text-foreground"
          >
            ESC
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="label-pixel text-[9px] text-idle">WHAT YOU FIND</p>
          <ul className="mt-2 flex flex-col gap-2">
            {FINDS.map((find) => (
              <li key={find} className="pixel-frame bg-secondary/40 p-2 text-[12px] leading-relaxed text-muted-foreground">
                {find}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            The bones are decoration. The agent never comes down here, so this room never turns amber and never takes
            notes.
          </p>
        </div>
      </div>
    </div>
  );
}
