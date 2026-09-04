import type { UsePlayerMovement } from "@/hooks/useKeyboardMovement";

interface MobileControlsProps {
  player: UsePlayerMovement;
  onInteract: () => void;
  label: string;
}

type Dir = "up" | "down" | "left" | "right";

const BTN =
  "pixel-frame label-pixel flex h-11 w-11 select-none items-center justify-center bg-secondary text-[11px] text-foreground active:bg-primary/40";

/** Touch d-pad. Optional convenience only — never required to glance or peek. */
export function MobileControls({ player, onInteract, label }: MobileControlsProps) {
  const hold = (dir: Dir) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      player.press(dir, true);
    },
    onPointerUp: () => player.press(dir, false),
    onPointerLeave: () => player.press(dir, false),
    onPointerCancel: () => player.press(dir, false),
  });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 lg:hidden">
      <div
        className="pointer-events-auto grid grid-cols-3 grid-rows-2 gap-1"
        style={{ touchAction: "none" }}
        aria-hidden={false}
      >
        <span />
        <button type="button" className={BTN} aria-label="Move up" {...hold("up")}>
          ▲
        </button>
        <span />
        <button type="button" className={BTN} aria-label="Move left" {...hold("left")}>
          ◀
        </button>
        <button type="button" className={BTN} aria-label="Move down" {...hold("down")}>
          ▼
        </button>
        <button type="button" className={BTN} aria-label="Move right" {...hold("right")}>
          ▶
        </button>
      </div>

      <button
        type="button"
        onClick={onInteract}
        aria-label={`Peek at ${label}`}
        className="pointer-events-auto pixel-frame label-pixel bg-primary/80 px-3 py-3 text-[10px] text-foreground"
      >
        PEEK
      </button>
    </div>
  );
}
