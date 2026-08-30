import { PLAYER_BOX } from "@/data/worldLayout";

interface PlayerProps {
  x: number;
  y: number;
  facing: 1 | -1;
  walking: boolean;
  animate: boolean;
  /** Continuous walk-cycle phase in radians, advanced by the game loop. */
  phase: number;
}

const INK = "#15191d";
const SKIN = "#e8b98d";
const HAIR = "#241a13";
const SHIRT = "#2b3340";
const SHIRT_HI = "#3d485a";
const PANTS = "#1d232b";

/**
 * 20x26 pixel character animated with a continuous sine walk cycle:
 * legs counter-swing, arms counter-swing, torso bobs and leans slightly.
 */
export function Player({ x, y, facing, walking, animate, phase }: PlayerProps) {
  const bodyH = 26;
  const active = walking && animate;
  const s = active ? Math.sin(phase) : 0;
  const s2 = active ? Math.sin(phase * 2) : 0;

  const bob = active ? -Math.abs(s2) * 1.6 : 0;
  const legA = s * 22;
  const legB = -s * 22;
  const armA = -s * 26;
  const armB = s * 26;
  const lean = active ? s2 * 1.4 : 0;

  return (
    <div
      className="pointer-events-none absolute no-select"
      style={{
        left: x,
        top: y + PLAYER_BOX.h - bodyH,
        width: PLAYER_BOX.w,
        height: bodyH,
        zIndex: 40,
        transform: `scaleX(${facing})`,
        willChange: "transform",
      }}
      aria-hidden
    >
      {/* ground shadow */}
      <div
        className="absolute"
        style={{
          left: 3,
          bottom: -2,
          width: 14,
          height: 3,
          background: "rgba(0,0,0,0.45)",
          transform: active ? `scaleX(${1 - Math.abs(s) * 0.12})` : undefined,
        }}
      />

      <div className="absolute inset-0" style={{ transform: `translateY(${bob}px) rotate(${lean}deg)`, transformOrigin: "50% 90%" }}>
        {/* back arm */}
        <div
          className="absolute"
          style={{ left: 4, top: 11, width: 3, height: 9, background: "#1f2732", border: `1px solid ${INK}`, transformOrigin: "50% 1px", transform: `rotate(${armB}deg)` }}
        />
        {/* back leg */}
        <div
          className="absolute"
          style={{ left: 6, top: 19, width: 4, height: 7, background: "#141a20", transformOrigin: "50% 0", transform: `rotate(${legB}deg)` }}
        />
        {/* front leg */}
        <div
          className="absolute"
          style={{ left: 11, top: 19, width: 4, height: 7, background: PANTS, transformOrigin: "50% 0", transform: `rotate(${legA}deg)` }}
        >
          <div className="absolute" style={{ left: 0, bottom: 0, width: 5, height: 2, background: INK }} />
        </div>

        {/* torso */}
        <div className="absolute" style={{ left: 4, top: 10, width: 12, height: 10, background: SHIRT, border: `1px solid ${INK}` }}>
          <div className="absolute" style={{ left: 1, top: 1, width: 3, height: 7, background: SHIRT_HI }} />
        </div>

        {/* head */}
        <div className="absolute" style={{ left: 5, top: 1, width: 11, height: 10, background: SKIN, border: `1px solid ${INK}` }}>
          {/* hair */}
          <div className="absolute" style={{ left: -1, top: -2, width: 12, height: 4, background: HAIR }} />
          <div className="absolute" style={{ left: -2, top: -1, width: 3, height: 5, background: HAIR }} />
          <div className="absolute" style={{ left: 7, top: -3, width: 4, height: 3, background: HAIR }} />
          {/* eye */}
          <div
            className="absolute"
            style={{ left: 6, top: 4, width: 2, height: 2, background: INK, animation: animate ? "neuro-blink 4.6s steps(1,end) infinite" : undefined }}
          />
        </div>

        {/* front arm */}
        <div
          className="absolute"
          style={{ left: 13, top: 11, width: 3, height: 9, background: SHIRT_HI, border: `1px solid ${INK}`, transformOrigin: "50% 1px", transform: `rotate(${armA}deg)` }}
        />
      </div>
    </div>
  );
}
