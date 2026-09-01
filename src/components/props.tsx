/**
 * Reusable pixel-art props. All coordinates are floor-local (0..640 x 0..200).
 * Nothing here affects collision — collision comes from worldLayout obstacles.
 */

const INK = "#15191d";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const px = (style: React.CSSProperties) => ({ position: "absolute" as const, ...style });

export function Desk({ x, y, w, h = 30, wood = "#7a5330", woodDark = "#4a3220" }: Omit<Box, "h"> & { h?: number; wood?: string; woodDark?: string }) {
  return (
    <div style={px({ left: x, top: y, width: w, height: h })}>
      <div style={px({ left: 0, top: 0, width: w, height: 7, background: wood, border: `1px solid ${INK}` })}>
        <div style={px({ left: 1, top: 1, width: w - 4, height: 2, background: "rgba(255,240,200,0.22)" })} />
      </div>
      <div style={px({ left: 0, top: 7, width: w, height: h - 7, background: woodDark, borderLeft: `1px solid ${INK}`, borderRight: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` })} />
      <div style={px({ left: 4, top: 11, width: w - 8, height: 1, background: "rgba(0,0,0,0.35)" })} />
      <div style={px({ left: w - 22, top: 12, width: 16, height: 7, background: wood, border: `1px solid ${INK}` })}>
        <div style={px({ left: 5, top: 2, width: 6, height: 2, background: "#c9a06a" })} />
      </div>
      <div style={px({ left: 2, top: h - 3, width: 4, height: 3, background: INK })} />
      <div style={px({ left: w - 6, top: h - 3, width: 4, height: 3, background: INK })} />
    </div>
  );
}

export function Monitor({ x, y, w = 26, h = 20, glow = "#6fd3ff", on = true }: Omit<Box, "w" | "h"> & { w?: number; h?: number; glow?: string; on?: boolean }) {
  return (
    <div style={px({ left: x, top: y, width: w, height: h + 6 })}>
      <div style={px({ left: 0, top: 0, width: w, height: h, background: "#20262c", border: `1px solid ${INK}` })}>
        <div
          style={px({
            left: 2,
            top: 2,
            width: w - 6,
            height: h - 6,
            background: on ? `linear-gradient(160deg, ${glow}, ${glow}55)` : "#141a1f",
            boxShadow: on ? `0 0 10px ${glow}66` : undefined,
          })}
        >
          {on &&
            [0, 1, 2].map((i) => (
              <div key={i} style={px({ left: 2, top: 3 + i * 4, width: w - 12 - i * 3, height: 1, background: "rgba(10,14,18,0.55)" })} />
            ))}
        </div>
      </div>
      <div style={px({ left: w / 2 - 2, top: h, width: 4, height: 4, background: "#2b333a" })} />
      <div style={px({ left: w / 2 - 7, top: h + 4, width: 14, height: 2, background: INK })} />
    </div>
  );
}

export function Chair({ x, y, facing = 1 }: { x: number; y: number; facing?: 1 | -1 }) {
  return (
    <div style={px({ left: x, top: y, width: 16, height: 30, transform: `scaleX(${facing})` })}>
      <div style={px({ left: 0, top: 0, width: 5, height: 18, background: "#2f3b47", border: `1px solid ${INK}` })} />
      <div style={px({ left: 3, top: 15, width: 14, height: 5, background: "#3b4855", border: `1px solid ${INK}` })} />
      <div style={px({ left: 8, top: 20, width: 3, height: 7, background: "#22282e" })} />
      <div style={px({ left: 3, top: 27, width: 13, height: 2, background: INK })} />
    </div>
  );
}

export function Bookshelf({ x, y, w, h, wood = "#4b3520", accent = "#c9a06a" }: Box & { wood?: string; accent?: string }) {
  const shelves = Math.max(2, Math.floor(h / 14));
  const colors = ["#b4552f", "#3f6f8f", "#7a8f3f", "#8f5f9f", "#c9a06a", "#4f7fbf"];
  return (
    <div style={px({ left: x, top: y, width: w, height: h, background: wood, border: `1px solid ${INK}` })}>
      {Array.from({ length: shelves }).map((_, s) => (
        <div key={s} style={px({ left: 1, top: 3 + s * ((h - 4) / shelves), width: w - 2, height: (h - 4) / shelves - 1 })}>
          {Array.from({ length: Math.floor((w - 6) / 4) }).map((_, b) => (
            <div
              key={b}
              style={px({
                left: 2 + b * 4,
                bottom: 1,
                width: 3,
                height: 4 + ((b * 7 + s * 3) % 5),
                background: colors[(b + s) % colors.length],
              })}
            />
          ))}
          <div style={px({ left: 0, bottom: 0, width: w - 2, height: 1, background: accent, opacity: 0.7 })} />
        </div>
      ))}
    </div>
  );
}

export function Plant({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const leaves = [
    { l: 0, t: 2, w: 5, h: 12, c: "#3f7a3f" },
    { l: 5, t: 0, w: 5, h: 15, c: "#5aa04f" },
    { l: 10, t: 3, w: 5, h: 11, c: "#356b36" },
  ];
  return (
    <div style={px({ left: x, top: y, width: 16 * scale, height: 26 * scale, transform: `scale(${scale})`, transformOrigin: "bottom left" })}>
      {leaves.map((lf, i) => (
        <div key={i} style={px({ left: lf.l + 1, top: lf.t, width: lf.w, height: lf.h, background: lf.c, border: `1px solid ${INK}` })} />
      ))}
      <div style={px({ left: 1, top: 15, width: 14, height: 11, background: "#a3512f", border: `1px solid ${INK}` })}>
        <div style={px({ left: 0, top: 0, width: 12, height: 3, background: "#c9663c" })} />
      </div>
    </div>
  );
}

export function Whiteboard({ x, y, w, h, notes = 0 }: Box & { notes?: number }) {
  return (
    <div style={px({ left: x, top: y, width: w, height: h, background: "#dedbcf", border: `2px solid ${INK}` })}>
      <div style={px({ left: 0, top: 0, width: w - 4, height: 2, background: "#f6f3e7" })} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={px({ left: 4, top: 6 + i * 6, width: w - 10 - i * 5, height: 2, background: "#8d99a3" })} />
      ))}
      <div style={px({ left: w - 20, top: 6, width: 14, height: 12, border: "2px solid #8d99a3" })} />
      {Array.from({ length: notes }).map((_, i) => (
        <div key={i} style={px({ left: 6 + (i % 4) * 9, top: h - 14 + Math.floor(i / 4) * 8, width: 7, height: 6, background: "#f2c94c", border: `1px solid ${INK}` })} />
      ))}
    </div>
  );
}

export function PaperStack({ x, y, w = 26, layers = 6, done = false }: { x: number; y: number; w?: number; layers?: number; done?: boolean }) {
  return (
    <div style={px({ left: x, top: y, width: w, height: layers * 3 + 2 })}>
      {Array.from({ length: layers }).map((_, i) => (
        <div
          key={i}
          style={px({
            left: (i % 2) * 2,
            bottom: i * 3,
            width: w - (i % 3),
            height: 3,
            background: i % 2 ? "#e7e2d2" : "#cfc9b6",
            border: `1px solid ${INK}`,
          })}
        />
      ))}
      {done && (
        <div style={px({ left: w - 10, top: -8, width: 12, height: 12, borderRadius: 12, background: "#39a84a", border: `2px solid ${INK}`, color: "#f3e7c6", fontSize: 8, lineHeight: "9px", textAlign: "center" })}>
          ✓
        </div>
      )}
    </div>
  );
}

export function Door({ x, y, color = "#5a3b22", lit = false }: { x: number; y: number; color?: string; lit?: boolean }) {
  return (
    <div style={px({ left: x, top: y, width: 34, height: 60, background: color, border: `2px solid ${INK}` })}>
      <div style={px({ left: 4, top: 6, width: 24, height: 18, background: lit ? "#f2c94c" : "rgba(255,255,255,0.12)", border: `1px solid ${INK}` })} />
      <div style={px({ left: 4, top: 30, width: 24, height: 22, background: "rgba(0,0,0,0.18)", border: `1px solid ${INK}` })} />
      <div style={px({ left: 26, top: 28, width: 4, height: 4, background: "#d8b45a" })} />
    </div>
  );
}

export function Cabinet({ x, y, w, h, wood = "#5a3f26" }: Box & { wood?: string }) {
  const drawers = Math.max(1, Math.round(h / 12));
  return (
    <div style={px({ left: x, top: y, width: w, height: h, background: wood, border: `1px solid ${INK}` })}>
      {Array.from({ length: drawers }).map((_, i) => (
        <div key={i} style={px({ left: 2, top: 2 + i * ((h - 2) / drawers), width: w - 5, height: (h - 4) / drawers - 1, background: "rgba(0,0,0,0.2)", border: `1px solid rgba(0,0,0,0.4)` })}>
          <div style={px({ left: (w - 5) / 2 - 3, top: 2, width: 6, height: 2, background: "#c9a06a" })} />
        </div>
      ))}
    </div>
  );
}

export function Clock({ x, y }: { x: number; y: number }) {
  return (
    <div style={px({ left: x, top: y, width: 14, height: 14, borderRadius: 14, background: "#e7e2d2", border: `2px solid ${INK}` })}>
      <div style={px({ left: 5, top: 2, width: 1, height: 5, background: INK })} />
      <div style={px({ left: 5, top: 6, width: 5, height: 1, background: INK })} />
    </div>
  );
}

export function Crate({ x, y, s = 14 }: { x: number; y: number; s?: number }) {
  return (
    <div style={px({ left: x, top: y, width: s, height: s, background: "#6b4a2a", border: `1px solid ${INK}` })}>
      <div style={px({ left: 0, top: s / 2 - 1, width: s - 2, height: 2, background: "#8a6338" })} />
      <div style={px({ left: s / 2 - 1, top: 0, width: 2, height: s - 2, background: "#8a6338" })} />
    </div>
  );
}

/** Simple bone-white dinosaur silhouettes for the basement. */
export function DinoSkeleton({ x, y, kind = "trex", scale = 1 }: { x: number; y: number; kind?: "trex" | "stego" | "skull"; scale?: number }) {
  const bone = "#d8cfae";
  const boneDark = "#a89a74";
  const parts: Box[] =
    kind === "trex"
      ? [
          { x: 0, y: 6, w: 16, h: 10 },
          { x: 14, y: 14, w: 26, h: 6 },
          { x: 38, y: 16, w: 12, h: 16 },
          { x: 46, y: 30, w: 6, h: 18 },
          { x: 34, y: 30, w: 5, h: 20 },
          { x: 26, y: 22, w: 6, h: 4 },
        ]
      : kind === "stego"
        ? [
            { x: 0, y: 14, w: 12, h: 8 },
            { x: 10, y: 16, w: 30, h: 8 },
            { x: 36, y: 12, w: 14, h: 10 },
            { x: 16, y: 24, w: 5, h: 18 },
            { x: 30, y: 24, w: 5, h: 18 },
            { x: 14, y: 8, w: 6, h: 8 },
            { x: 22, y: 4, w: 7, h: 12 },
            { x: 31, y: 8, w: 6, h: 8 },
          ]
        : [
            { x: 0, y: 4, w: 30, h: 16 },
            { x: 26, y: 10, w: 12, h: 8 },
            { x: 6, y: 20, w: 20, h: 6 },
          ];
  return (
    <div style={px({ left: x, top: y, width: 60 * scale, height: 56 * scale, transform: `scale(${scale})`, transformOrigin: "bottom left" })}>
      {parts.map((p, i) => (
        <div key={i} style={px({ left: p.x, top: p.y, width: p.w, height: p.h, background: i % 2 ? boneDark : bone, border: `1px solid #2a2118` })} />
      ))}
      <div style={px({ left: 0, bottom: 0, width: 56, height: 4, background: "#4a3a28", border: `1px solid #2a2118` })} />
    </div>
  );
}

export function Pipe({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <div style={px({ left: x, top: y, width: 12, height: h, background: "#3a444c", border: `1px solid ${INK}` })}>
      <div style={px({ left: 1, top: 0, width: 3, height: h - 2, background: "rgba(255,255,255,0.12)" })} />
      {Array.from({ length: Math.floor(h / 34) }).map((_, i) => (
        <div key={i} style={px({ left: -2, top: 14 + i * 34, width: 14, height: 5, background: "#4c575f", border: `1px solid ${INK}` })} />
      ))}
    </div>
  );
}
