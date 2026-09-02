import {
  FLOOR_H,
  STAIR_X,
  STAIR_W,
  WORLD_W,
  type FloorLayout,
} from "@/data/worldLayout";
import type { FloorId, FloorState } from "@/types/agentRun";
import { FloorStateOverlay } from "./FloorStateOverlay";
import {
  Bookshelf,
  Cabinet,
  Chair,
  Clock,
  Crate,
  Desk,
  DinoSkeleton,
  Door,
  Monitor,
  PaperStack,
  Plant,
  Whiteboard,
} from "./props";

const INK = "#15191d";

const px = (style: React.CSSProperties) => ({ position: "absolute" as const, ...style });

const STATE_LABEL: Record<FloorState, string> = {
  idle: "QUIET",
  active: "AGENT HERE",
  done: "WORKED",
};

const STATE_COLOR: Record<FloorState, string> = {
  idle: "#8a969f",
  active: "#f2c94c",
  done: "#74d66a",
};

interface OfficeFloorProps {
  floor: FloorLayout;
  /** "hidden" for the easter-egg basement, which never carries agent state. */
  state: FloorState | "hidden";
  reducedMotion: boolean;
  /** Baseline Peek trigger — clickable without the player avatar. */
  onPeek?: (floorId: FloorId) => void;
  peekable: boolean;
  agentHere: boolean;
  /** Doorway swung open while the agent passes through it. */
  doorOpen?: boolean;
}

export function OfficeFloor({ floor, state, reducedMotion, onPeek, peekable, agentHere, doorOpen = false }: OfficeFloorProps) {
  const worked = state === "done";
  const lit = state === "active";
  const displayState: FloorState = state === "hidden" ? "idle" : state;

  return (
    <div
      className="absolute overflow-hidden"
      style={{ left: 0, top: floor.top, width: WORLD_W, height: FLOOR_H }}
    >
      {/* wall */}
      <div
        style={px({
          inset: 0,
          background: `linear-gradient(180deg, ${floor.tintDark} 0%, ${floor.tint} 62%, ${floor.tintDark} 100%)`,
          borderBottom: `3px solid ${INK}`,
        })}
      />
      {/* ceiling joists */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={px({ left: 10 + i * 44, top: 4, width: 26, height: 5, background: "rgba(0,0,0,0.28)" })} />
      ))}
      {/* wainscot */}
      <div style={px({ left: 0, top: FLOOR_H - 46, width: STAIR_X, height: 22, background: "rgba(0,0,0,0.22)", borderTop: `2px solid ${INK}` })} />
      {/* floorboards */}
      <div style={px({ left: 0, top: FLOOR_H - 24, width: WORLD_W, height: 24, background: "#4c4033", borderTop: `2px solid ${INK}` })}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={px({ left: i * 40, top: 0, width: 2, height: 24, background: "rgba(0,0,0,0.3)" })} />
        ))}
      </div>

      {/* windows */}
      {[70, 150].map((x) => (
        <div key={x} style={px({ left: x, top: 34, width: 54, height: 44, background: lit ? "#8fc7e8" : "#3a556b", border: `3px solid ${INK}` })}>
          <div style={px({ left: 24, top: 0, width: 3, height: 38, background: INK })} />
          <div style={px({ left: 0, top: 18, width: 51, height: 3, background: INK })} />
        </div>
      ))}

      {/* ceiling lamp + cone */}
      <div style={px({ left: 320, top: 6, width: 3, height: 14, background: INK })} />
      <div style={px({ left: 306, top: 20, width: 32, height: 9, background: lit ? "#e8c268" : "#5b5a4e", border: `2px solid ${INK}` })} />
      {lit && (
        <div
          style={px({
            left: 268,
            top: 29,
            width: 110,
            height: FLOOR_H - 60,
            background: `linear-gradient(180deg, ${floor.accent}33, transparent)`,
            clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
          })}
        />
      )}

      {/* door to the stairwell */}
      <Door x={floor.door.x - 16} y={FLOOR_H - 24 - 46} lit={lit} open={doorOpen} />

      {/* stair column */}
      <div style={px({ left: STAIR_X, top: 0, width: STAIR_W, height: FLOOR_H, background: "#2b3238", borderLeft: `3px solid ${INK}` })}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={px({
              left: 6 + i * 8,
              top: 22 + i * 20,
              width: 66 - i * 8,
              height: 5,
              background: "#4a545c",
              borderTop: `1px solid ${INK}`,
            })}
          />
        ))}
        <div style={px({ left: 0, top: FLOOR_H - 24, width: STAIR_W, height: 24, background: "#3a4349", borderTop: `2px solid ${INK}` })} />
      </div>

      {/* per-floor furniture */}
      <FloorProps id={floor.id} accent={floor.accent} lit={lit} worked={worked} deskX={floor.desk.x} />

      <FloorStateOverlay state={state} accent={floor.accent} reducedMotion={reducedMotion} />

      {/* plaque */}
      <div
        style={px({
          left: 16,
          top: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "3px 7px",
          background: "#15191d",
          border: `2px solid ${floor.accent}`,
          zIndex: 30,
        })}
      >
        <span className="label-pixel text-[9px]" style={{ color: floor.accent }}>
          {floor.name.toUpperCase()}
        </span>
        {state !== "hidden" && (
          <span className="label-pixel text-[8px]" style={{ color: STATE_COLOR[displayState] }}>
            {agentHere ? "AGENT HERE" : STATE_LABEL[displayState]}
          </span>
        )}
      </div>

      {peekable && onPeek && (
        <button
          type="button"
          onClick={() => onPeek(floor.id)}
          aria-label={`Peek at ${floor.name} output`}
          className="absolute cursor-pointer"
          style={{ left: 0, top: 0, width: STAIR_X, height: FLOOR_H, background: "transparent", zIndex: 35 }}
        >
          <span
            className="label-pixel absolute text-[8px]"
            style={{ right: 96, bottom: 10, color: "#f3e7c6", background: "#15191dcc", padding: "2px 5px" }}
          >
            PEEK
          </span>
        </button>
      )}
    </div>
  );
}

function FloorProps({
  id,
  accent,
  lit,
  worked,
  deskX,
}: {
  id: FloorId;
  accent: string;
  lit: boolean;
  worked: boolean;
  deskX: number;
}) {
  const deskTop = FLOOR_H - 24 - 30;
  switch (id) {
    case "research":
      return (
        <>
          <Bookshelf x={44} y={FLOOR_H - 24 - 54} w={74} h={54} accent={accent} />
          <Desk x={deskX - 58} y={deskTop} w={116} />
          <Monitor x={deskX - 40} y={deskTop - 26} glow={accent} on={lit} />
          <Chair x={deskX + 46} y={deskTop + 6} facing={-1} />
          <PaperStack x={deskX + 4} y={deskTop - 8} done={worked} />
          <Plant x={400} y={FLOOR_H - 24 - 34} />
          <Clock x={470} y={40} />
        </>
      );
    case "drafting":
      return (
        <>
          <Whiteboard x={44} y={40} w={92} h={58} notes={worked ? 6 : lit ? 4 : 2} />
          <Desk x={deskX - 60} y={deskTop} w={120} />
          <Monitor x={deskX - 44} y={deskTop - 26} glow={accent} on={lit} />
          <Monitor x={deskX + 4} y={deskTop - 22} w={22} h={16} glow={accent} on={lit} />
          <Chair x={deskX + 48} y={deskTop + 6} facing={-1} />
          <Cabinet x={420} y={FLOOR_H - 24 - 30} w={52} h={30} />
        </>
      );
    case "writing":
      return (
        <>
          <Bookshelf x={48} y={FLOOR_H - 24 - 52} w={68} h={52} accent={accent} />
          <Desk x={deskX - 61} y={deskTop} w={122} />
          <Monitor x={deskX - 30} y={deskTop - 28} w={34} h={24} glow={accent} on={lit} />
          <Chair x={deskX + 50} y={deskTop + 6} facing={-1} />
          <PaperStack x={deskX - 50} y={deskTop - 8} layers={worked ? 9 : 5} done={worked} />
          <Plant x={400} y={FLOOR_H - 24 - 30} scale={0.9} />
        </>
      );
    case "publish":
      return (
        <>
          <Cabinet x={44} y={FLOOR_H - 24 - 34} w={56} h={34} />
          <Desk x={deskX - 66} y={deskTop} w={132} />
          <Monitor x={deskX - 52} y={deskTop - 26} glow={accent} on={lit} />
          <Monitor x={deskX - 12} y={deskTop - 30} w={30} h={22} glow={accent} on={lit} />
          <Monitor x={deskX + 26} y={deskTop - 24} w={22} h={18} glow={accent} on={lit} />
          <Chair x={deskX + 54} y={deskTop + 6} facing={-1} />
          <Whiteboard x={404} y={44} w={62} h={44} notes={worked ? 5 : 3} />
        </>
      );
    case "dino":
      return (
        <>
          <Crate x={52} y={FLOOR_H - 24 - 32} s={16} />
          <Crate x={78} y={FLOOR_H - 24 - 18} s={14} />
          <DinoSkeleton x={196} y={FLOOR_H - 24 - 54} kind="stego" scale={1.1} />
          <DinoSkeleton x={372} y={FLOOR_H - 24 - 62} kind="trex" scale={1.2} />
          <DinoSkeleton x={140} y={FLOOR_H - 24 - 26} kind="skull" scale={1} />
        </>
      );
    default:
      return null;
  }
}
