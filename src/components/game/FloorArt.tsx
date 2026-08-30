import { FLOOR_H, WORLD_W, type FloorDef } from "@/data/worldLayout";
import type { StageStatus, StageId } from "@/types/project";
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
  Pipe,
  Plant,
  Whiteboard,
} from "./props";

export interface FloorTheme {
  wall: string;
  wallDark: string;
  trim: string;
  accent: string;
  floor: string;
  floorDark: string;
  door: string;
}

export const FLOOR_THEMES: Record<StageId, FloorTheme> = {
  research: { wall: "#4a6a48", wallDark: "#31462f", trim: "#7fa168", accent: "#9ed46f", floor: "#5b4a32", floorDark: "#40331f", door: "#4d6a3f" },
  drafting: { wall: "#7a5f31", wallDark: "#4f3d1e", trim: "#c39a45", accent: "#ffca3a", floor: "#6a4b2c", floorDark: "#4a331d", door: "#7a4c22" },
  writing: { wall: "#38516b", wallDark: "#24374a", trim: "#5b87ad", accent: "#42a5f5", floor: "#4a4238", floorDark: "#332e26", door: "#2c4a63" },
  publish: { wall: "#4c3560", wallDark: "#332144", trim: "#8a63b0", accent: "#b56bff", floor: "#4d3f36", floorDark: "#352a24", door: "#5a3b73" },
  dino: { wall: "#43332a", wallDark: "#2c211a", trim: "#6b5340", accent: "#c9a06a", floor: "#33291f", floorDark: "#231b14", door: "#5a2f24" },
};

const STATUS_LIGHT: Record<StageStatus, string> = {
  completed: "#74d66a",
  active: "#f2c94c",
  available: "#8ecbff",
  locked: "#6e7a83",
  optional: "#c9a06a",
};

const STATUS_BADGE: Record<StageStatus, string> = {
  completed: "✓ DONE",
  active: "ACTIVE",
  available: "IDLE",
  locked: "IDLE",
  optional: "ARCHIVE",
};

interface FloorArtProps {
  floor: FloorDef;
  status: StageStatus;
  title: string;
  percent: number;
}

/** Detailed pixel-art interior for one floor band, positioned absolutely in world space. */
export function FloorArt({ floor, status, title, percent }: FloorArtProps) {
  const t = FLOOR_THEMES[floor.stageId];
  const dim = status === "locked" || status === "available";
  const light = STATUS_LIGHT[status];
  const on = status === "active" || status === "completed";
  const basement = floor.stageId === "dino";

  const lamps = [120, 290, 452, 560];

  return (
    <div className="absolute no-select" style={{ left: 0, top: floor.top, width: WORLD_W, height: FLOOR_H }} aria-hidden>
      {/* ---- wall ---- */}
      <div className="absolute inset-0" style={{ background: t.wall }} />
      {/* brick / plaster texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.22,
          backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.28) 1px, transparent 1px)`,
          backgroundSize: basement ? "16px 10px" : "32px 16px",
        }}
      />
      {/* vertical light falloff */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 45%, rgba(0,0,0,0.4))" }} />

      {/* ceiling slab + joists */}
      <div className="absolute" style={{ left: 0, top: 0, width: WORLD_W, height: 12, background: "#22282e", borderBottom: "2px solid #12161a" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute" style={{ left: 8 + i * 32, top: 2, width: 18, height: 8, background: "#2b333a" }} />
        ))}
      </div>

      {/* wainscot rail */}
      <div className="absolute" style={{ left: 0, top: 96, width: WORLD_W, height: 3, background: t.trim, opacity: 0.75 }} />
      <div className="absolute" style={{ left: 0, top: 99, width: WORLD_W, height: 89, background: "rgba(0,0,0,0.14)" }} />

      {/* ---- windows (upper floors only) ---- */}
      {!basement &&
        [64, 148].map((x) => (
          <div
            key={x}
            className="absolute"
            style={{ left: x, top: 26, width: 46, height: 44, background: "#1d2732", border: `3px solid ${t.wallDark}`, boxShadow: `inset 0 0 0 1px ${INKISH}` }}
          >
            <div className="absolute inset-0" style={{ background: on ? "linear-gradient(180deg,#3d8fd6,#1e5c96)" : "linear-gradient(180deg,#22364a,#16232f)" }} />
            <div className="absolute" style={{ left: 4, top: 4, width: 12, height: 14, background: "rgba(255,255,255,0.22)" }} />
            <div className="absolute" style={{ left: 20, top: 0, width: 2, height: 38, background: "#15191d" }} />
            <div className="absolute" style={{ left: 0, top: 19, width: 40, height: 2, background: "#15191d" }} />
            <div className="absolute" style={{ left: -3, top: 38, width: 46, height: 4, background: t.trim }} />
          </div>
        ))}

      {/* entry door */}
      <div className="absolute" style={{ left: 12, top: 128 }}>
        <Door x={0} y={0} color={t.door} lit={on} />
      </div>
      <div className="absolute" style={{ left: 52, top: 140, width: 6, height: 8, background: "#c9c3b2", border: "1px solid #15191d" }} />

      {/* ---- room plaque ---- */}
      <div
        className="absolute label-pixel flex items-center gap-2 px-2 py-1 text-[9px]"
        style={{ left: 244, top: 22, background: "#12161a", color: "#f3e7c6", border: `2px solid ${light}`, boxShadow: `0 0 10px ${light}44` }}
      >
        <span style={{ width: 6, height: 6, background: light, display: "inline-block" }} />
        {title}
        {status !== "optional" && <span style={{ color: t.accent }}>{percent}%</span>}
        <span style={{ color: light }}>{STATUS_BADGE[status]}</span>
      </div>

      {/* ---- ceiling lamps ---- */}
      {lamps.map((lx) => (
        <div key={lx} className="absolute" style={{ left: lx, top: 12 }}>
          <div className="absolute" style={{ left: 12, top: 0, width: 2, height: 10, background: "#15191d" }} />
          <div
            className="absolute"
            style={{ left: 0, top: 10, width: 26, height: 9, background: on ? "#c9922f" : "#4a545c", border: "2px solid #15191d", borderRadius: "12px 12px 3px 3px" }}
          />
          {on && <div className="absolute" style={{ left: 8, top: 18, width: 10, height: 3, background: "#ffe9a8" }} />}
          {on && (
            <div
              className="absolute"
              style={{ left: -22, top: 20, width: 70, height: 88, background: `linear-gradient(180deg, ${t.accent}30, transparent)`, clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)" }}
            />
          )}
        </div>
      ))}

      {/* ---- per-floor interior ---- */}
      {floor.stageId === "research" && (
        <>
          <Whiteboard x={228} y={30} w={92} h={44} notes={3} />
          <Bookshelf x={96} y={124} w={64} h={56} accent={t.trim} />
          <Cabinet x={38} y={150} w={26} h={30} />
          <Desk x={250} y={132} w={130} h={34} />
          <Monitor x={286} y={110} w={30} h={22} glow="#6fd3ff" on={on} />
          <Chair x={252} y={140} facing={1} />
          <Desk x={430} y={134} w={86} h={30} wood="#6b4a2a" />
          <PaperStack x={444} y={116} w={28} layers={6} done={status === "completed"} />
          <Plant x={70} y={154} scale={1} />
          <Plant x={392} y={158} scale={0.85} />
        </>
      )}

      {floor.stageId === "drafting" && (
        <>
          <Whiteboard x={196} y={30} w={100} h={46} notes={5} />
          <Whiteboard x={368} y={32} w={86} h={42} notes={8} />
          <Bookshelf x={110} y={128} w={80} h={48} accent={t.trim} />
          <Cabinet x={38} y={150} w={26} h={30} />
          <Desk x={284} y={132} w={150} h={34} />
          <Monitor x={318} y={108} w={34} h={24} glow="#7fe0ff" on={on} />
          <div className="absolute" style={{ left: 372, top: 120, width: 22, height: 14, background: "#f2e2a8", border: "1px solid #15191d", transform: "rotate(-4deg)" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute" style={{ left: 3, top: 3 + i * 3, width: 15, height: 1, background: "#a8925a" }} />
            ))}
          </div>
          <Chair x={288} y={140} facing={1} />
          <Cabinet x={462} y={136} w={60} h={44} />
          <Plant x={72} y={156} />
          <Plant x={440} y={122} scale={0.7} />
        </>
      )}

      {floor.stageId === "writing" && (
        <>
          <Whiteboard x={214} y={32} w={96} h={42} notes={2} />
          <Desk x={110} y={132} w={120} h={34} wood="#6f4c2b" />
          <Monitor x={132} y={110} w={26} h={20} glow="#8ecbff" on={on} />
          <Monitor x={176} y={110} w={26} h={20} glow="#8ecbff" on={on} />
          <Chair x={116} y={140} />
          <Desk x={262} y={132} w={120} h={34} wood="#6f4c2b" />
          <Monitor x={286} y={110} w={26} h={20} glow="#8ecbff" on={on} />
          <Monitor x={330} y={110} w={26} h={20} glow="#8ecbff" on={on} />
          <Chair x={352} y={140} facing={-1} />
          <Bookshelf x={430} y={126} w={70} h={54} accent={t.trim} />
          <Clock x={404} y={44} />
          <Plant x={196} y={104} scale={0.7} />
        </>
      )}

      {floor.stageId === "publish" && (
        <>
          <Whiteboard x={206} y={34} w={92} h={40} notes={0} />
          <Desk x={150} y={136} w={250} h={30} wood="#5f4128" />
          {[168, 226, 284, 340].map((mx, i) => (
            <Monitor key={mx} x={mx} y={114} w={30} h={22} glow={["#4f9fe0", "#b56bff", "#e05fa0", "#5fd6c0"][i]} on={on} />
          ))}
          <Cabinet x={430} y={126} w={80} h={48} />
          <div className="absolute label-pixel" style={{ left: 442, top: 40, width: 74, padding: 4, background: "#2a2033", border: "2px solid #15191d", color: "#e8dcf5", fontSize: 8 }}>
            3 POSTS
            <div className="absolute" style={{ left: 6, top: 18, display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ display: "inline-block", width: 10, height: 10, border: "2px solid #8a63b0" }} />
              ))}
            </div>
          </div>
          <Cabinet x={40} y={152} w={26} h={28} />
          <Plant x={408} y={152} scale={0.9} />
        </>
      )}

      {basement && (
        <>
          <DinoSkeleton x={130} y={122} kind="trex" scale={1.05} />
          <DinoSkeleton x={370} y={126} kind="stego" scale={1} />
          <DinoSkeleton x={268} y={146} kind="skull" scale={0.9} />
          <div className="absolute label-pixel" style={{ left: 254, top: 96, padding: 4, background: "#2a201a", border: "2px solid #6b5340", color: "#d8cfae", fontSize: 8, textAlign: "center" }}>
            OLD IDEAS
            <br />
            BURIED HERE
          </div>
          {[86, 106, 232, 344, 358, 486].map((cx, i) => (
            <Crate key={cx} x={cx} y={i % 2 ? 164 : 170} s={i % 2 ? 16 : 12} />
          ))}
          <div className="absolute" style={{ left: 24, top: 116, width: 8, height: 8, background: "#ff7a4a", boxShadow: "0 0 10px #ff7a4a" }} />
          <div className="absolute" style={{ left: 96, top: 150, width: 12, height: 12, background: "#c9a33a", border: "2px solid #15191d", color: "#15191d", fontSize: 8, textAlign: "center", lineHeight: "10px" }}>
            !
          </div>
        </>
      )}

      {/* ---- stairwell ---- */}
      <div className="absolute" style={{ left: 530, top: 99, width: 84, height: 89, background: t.wallDark, border: "2px solid #15191d" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.05))" }} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="absolute" style={{ left: 4 + i * 13, bottom: 3 + i * 13, width: 76 - i * 13, height: 5, background: t.trim, borderTop: "1px solid rgba(255,255,255,0.2)" }} />
        ))}
        <div className="absolute" style={{ left: 2, top: 4, width: 80, height: 2, background: "#15191d", opacity: 0.6 }} />
      </div>

      {/* ---- floor slab ---- */}
      <div className="absolute" style={{ left: 0, top: FLOOR_H - 12, width: WORLD_W, height: 12, background: t.floor }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="absolute" style={{ left: i * 20, top: 0, width: 1, height: 12, background: t.floorDark, opacity: 0.7 }} />
        ))}
        <div className="absolute" style={{ left: 0, top: 0, width: WORLD_W, height: 2, background: "rgba(255,240,200,0.14)" }} />
      </div>
      <div className="absolute" style={{ left: 0, top: FLOOR_H - 2, width: WORLD_W, height: 2, background: "#12161a" }} />

      {dim && <div className="absolute inset-0" style={{ background: status === "locked" ? "rgba(6,10,14,0.5)" : "rgba(6,10,14,0.3)" }} />}
    </div>
  );
}

const INKISH = "rgba(243,231,198,0.12)";
