import { FLOOR_H, WORLD_W, type FloorDef } from "@/data/worldLayout";
import type { StageStatus, StageId } from "@/types/project";

export interface FloorTheme {
  wall: string;
  wallDark: string;
  trim: string;
  accent: string;
  floor: string;
}

export const FLOOR_THEMES: Record<StageId, FloorTheme> = {
  research: { wall: "#3f5a41", wallDark: "#2c4130", trim: "#6f8f63", accent: "#9ed46f", floor: "#5b4a32" },
  drafting: { wall: "#5d4b28", wallDark: "#41341b", trim: "#a8853c", accent: "#ffca3a", floor: "#6a4b2c" },
  writing: { wall: "#2f4a63", wallDark: "#213448", trim: "#4f7fa8", accent: "#42a5f5", floor: "#4a4238" },
  publish: { wall: "#463059", wallDark: "#31213e", trim: "#7d5aa0", accent: "#b56bff", floor: "#4d3f36" },
  dino: { wall: "#3b2f26", wallDark: "#2a211a", trim: "#6b5340", accent: "#c9a06a", floor: "#33291f" },
};

const STATUS_LIGHT: Record<StageStatus, string> = {
  completed: "#74d66a",
  active: "#f2c94c",
  available: "#8ecbff",
  locked: "#6e7a83",
  optional: "#c9a06a",
};

interface FloorArtProps {
  floor: FloorDef;
  status: StageStatus;
  title: string;
  percent: number;
}

/** Static pixel-art interior for one floor band, positioned absolutely in world space. */
export function FloorArt({ floor, status, title, percent }: FloorArtProps) {
  const t = FLOOR_THEMES[floor.stageId];
  const dim = status === "locked";
  const light = STATUS_LIGHT[status];

  return (
    <div
      className="absolute no-select"
      style={{ left: 0, top: floor.top, width: WORLD_W, height: FLOOR_H }}
      aria-hidden
    >
      {/* wall */}
      <div className="absolute inset-0" style={{ background: t.wall }} />
      <div
        className="absolute"
        style={{ left: 0, top: 0, width: WORLD_W, height: 10, background: t.wallDark }}
      />
      {/* wainscot stripe */}
      <div
        className="absolute"
        style={{ left: 0, top: 96, width: WORLD_W, height: 4, background: t.trim, opacity: 0.7 }}
      />
      {/* windows */}
      {[70, 150].map((x) => (
        <div
          key={x}
          className="absolute"
          style={{
            left: x,
            top: 26,
            width: 44,
            height: 42,
            background: status === "locked" ? "#1c2733" : "#2875b9",
            border: "2px solid #15191d",
            boxShadow: "inset 0 0 0 2px rgba(243,231,198,0.12)",
          }}
        >
          <div className="absolute" style={{ left: 20, top: 0, width: 2, height: 38, background: "#15191d" }} />
        </div>
      ))}
      {/* room plaque */}
      <div
        className="absolute label-pixel flex items-center gap-2 px-2 py-1 text-[9px]"
        style={{
          left: 250,
          top: 24,
          background: "#15191d",
          color: "#f3e7c6",
          border: "2px solid " + t.trim,
        }}
      >
        <span style={{ width: 6, height: 6, background: light, display: "inline-block" }} />
        {title}
        {status !== "optional" && <span style={{ color: t.accent }}>{percent}%</span>}
      </div>

      {/* ceiling lamp */}
      <div className="absolute" style={{ left: 470, top: 10, width: 2, height: 12, background: "#15191d" }} />
      <div
        className="absolute"
        style={{
          left: 458,
          top: 22,
          width: 26,
          height: 8,
          background: status === "locked" ? "#4a545c" : "#d4a24c",
          border: "2px solid #15191d",
        }}
      />
      {!dim && (
        <div
          className="absolute"
          style={{
            left: 430,
            top: 30,
            width: 82,
            height: 70,
            background: `linear-gradient(180deg, ${t.accent}33, transparent)`,
          }}
        />
      )}

      {/* furniture blocks derived from collision obstacles */}
      {floor.obstacles.map((o, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: o.x,
            top: o.y - floor.top,
            width: o.w,
            height: o.h,
            background: i % 2 === 0 ? "#6a4b2c" : t.wallDark,
            border: "2px solid #15191d",
            boxShadow: "inset 0 2px 0 0 rgba(243,231,198,0.14)",
          }}
        >
          <div
            className="absolute"
            style={{ left: 4, top: 4, right: 4, height: 3, background: t.trim, opacity: 0.6 }}
          />
        </div>
      ))}

      {/* station marker */}
      {floor.stations.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: s.zone.x,
            top: s.zone.y - floor.top,
            width: s.zone.w,
            height: s.zone.h,
            border: `2px dashed ${light}`,
            opacity: dim ? 0.25 : 0.5,
          }}
        />
      ))}

      {/* stairwell */}
      <div
        className="absolute"
        style={{ left: 530, top: 100, width: 84, height: 90, background: t.wallDark, border: "2px solid #15191d" }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: 6 + i * 14,
              bottom: 4 + i * 14,
              width: 70 - i * 14,
              height: 4,
              background: t.trim,
            }}
          />
        ))}
      </div>

      {/* floor slab */}
      <div
        className="absolute"
        style={{ left: 0, top: FLOOR_H - 12, width: WORLD_W, height: 12, background: t.floor }}
      />
      <div
        className="absolute"
        style={{ left: 0, top: FLOOR_H - 12, width: WORLD_W, height: 3, background: "#15191d", opacity: 0.6 }}
      />
      {dim && <div className="absolute inset-0" style={{ background: "rgba(6,10,14,0.55)" }} />}
    </div>
  );
}
