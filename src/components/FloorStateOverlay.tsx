import type { FloorState } from "@/types/agentRun";

interface FloorStateOverlayProps {
  state: FloorState | "hidden";
  accent: string;
  /** Suppress the pulse under reduced motion, keeping brightness. */
  reducedMotion: boolean;
  transitioning?: boolean;
}

/**
 * Non-color cues (labels, residue, character presence) carry the state too;
 * this only handles lighting.
 */
export function FloorStateOverlay({ state, accent, reducedMotion, transitioning }: FloorStateOverlayProps) {
  if (state === "active" || transitioning) {
    return (
      <>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 45% 30%, ${accent}22, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
        <div
          className={`pointer-events-none absolute inset-0 ${reducedMotion ? "" : "hq-pulse"}`}
          style={{ boxShadow: `inset 0 0 40px ${accent}33`, border: `1px solid ${accent}55` }}
        />
      </>
    );
  }
  if (state === "done") {
    return <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(8,10,13,0.12)" }} />;
  }
  // idle / hidden — dim and desaturated
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: "rgba(9,12,16,0.62)", backdropFilter: "saturate(0.35)" }}
    />
  );
}
