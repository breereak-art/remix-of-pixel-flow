import { PLAYER_BOX } from "@/data/worldLayout";

interface PlayerProps {
  x: number;
  y: number;
  facing: 1 | -1;
  walking: boolean;
  animate: boolean;
}

/** 20x24 pixel character. `x`/`y` are the top-left of the 20x12 feet box. */
export function Player({ x, y, facing, walking, animate }: PlayerProps) {
  const bodyH = 24;
  const stepping = walking && animate;
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
        animation: stepping ? "neuro-step 260ms steps(2, end) infinite" : undefined,
      }}
      aria-hidden
    >
      {/* shadow */}
      <div
        className="absolute"
        style={{ left: 2, bottom: -2, width: 16, height: 3, background: "rgba(0,0,0,0.45)" }}
      />
      {/* head */}
      <div
        className="absolute"
        style={{ left: 5, top: 0, width: 10, height: 9, background: "#e8b98d", border: "1px solid #15191d" }}
      >
        <div className="absolute" style={{ left: 1, top: -1, width: 8, height: 3, background: "#3a2a1c" }} />
        <div
          className="absolute"
          style={{ left: 5, top: 4, width: 2, height: 2, background: "#15191d", animation: "neuro-blink 4s steps(1,end) infinite" }}
        />
      </div>
      {/* torso */}
      <div
        className="absolute"
        style={{ left: 3, top: 9, width: 14, height: 9, background: "#4f7fbf", border: "1px solid #15191d" }}
      >
        <div className="absolute" style={{ left: 4, top: 2, width: 4, height: 5, background: "#f3e7c6" }} />
      </div>
      {/* legs */}
      <div
        className="absolute"
        style={{
          left: 5,
          top: 18,
          width: 4,
          height: 6,
          background: "#2f3944",
          animation: stepping ? "neuro-leg-a 260ms steps(2,end) infinite" : undefined,
        }}
      />
      <div
        className="absolute"
        style={{
          left: 11,
          top: 18,
          width: 4,
          height: 6,
          background: "#2f3944",
          animation: stepping ? "neuro-leg-b 260ms steps(2,end) infinite" : undefined,
        }}
      />
    </div>
  );
}
