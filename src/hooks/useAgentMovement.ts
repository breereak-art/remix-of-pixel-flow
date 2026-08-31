import { useEffect, useRef, useState } from "react";
import { buildAgentPath } from "@/lib/agentMovementPath";
import {
  AGENT_SPEED,
  AGENT_STAIR_SPEED,
  AGENT_HOME,
  CHAR_H,
  CHAR_W,
  FLOOR_BY_ID,
  type Point,
} from "@/data/worldLayout";
import type { WorkFloorId } from "@/types/agentRun";

export type AgentMode = "idle" | "walking" | "working";

export interface UseAgentMovement {
  ref: React.RefObject<HTMLDivElement | null>;
  mode: AgentMode;
  /** True while the agent is physically travelling toward the target floor. */
  traveling: boolean;
  /** Floor the agent is currently standing on (visual truth, not backend truth). */
  visualFloorId: WorkFloorId | null;
}

/**
 * Owns the NPC's position in refs and writes transforms straight to the DOM —
 * no React re-render per animation frame.
 */
export function useAgentMovement(
  targetFloorId: WorkFloorId | null,
  reducedMotion: boolean,
): UseAgentMovement {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useRef<Point>({ ...AGENT_HOME });
  const path = useRef<Point[]>([]);
  const facing = useRef<1 | -1>(1);
  const frameDist = useRef(0);
  const [mode, setMode] = useState<AgentMode>("idle");
  const [traveling, setTraveling] = useState(false);
  const [visualFloorId, setVisualFloorId] = useState<WorkFloorId | null>(null);
  const settled = useRef<WorkFloorId | null>(null);

  // Paint helper — direct DOM write.
  const paint = (frame: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${Math.round(pos.current.x - CHAR_W / 2)}px, ${Math.round(
      pos.current.y - CHAR_H,
    )}px, 0)`;
    el.dataset["frame"] = String(frame);
    el.dataset["facing"] = String(facing.current);
  };

  // Re-plan whenever the backend confirms a new floor.
  useEffect(() => {
    if (!targetFloorId) {
      path.current = [];
      setTraveling(false);
      setMode((m) => (m === "walking" ? "idle" : m));
      return;
    }
    const target = FLOOR_BY_ID[targetFloorId];
    const alreadyThere =
      Math.abs(pos.current.y - target.desk.y) < 2 && Math.abs(pos.current.x - target.desk.x) < 2;
    if (alreadyThere) {
      settled.current = targetFloorId;
      setVisualFloorId(targetFloorId);
      setMode("working");
      setTraveling(false);
      return;
    }
    if (reducedMotion) {
      // Keep the state change visible but skip the long travel.
      pos.current = { ...target.desk };
      path.current = [];
      settled.current = targetFloorId;
      setVisualFloorId(targetFloorId);
      setMode("working");
      setTraveling(false);
      paint(0);
      return;
    }
    // Re-plan from the actual visual position: never teleport, always settle
    // on the latest confirmed floor.
    path.current = buildAgentPath(pos.current, targetFloorId);
    setTraveling(true);
    setMode("walking");
  }, [targetFloorId, reducedMotion]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    paint(0);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const legs = path.current;
      const next = legs[0];

      if (next) {
        const dx = next.x - pos.current.x;
        const dy = next.y - pos.current.y;
        const vertical = Math.abs(dy) > Math.abs(dx);
        const speed = vertical ? AGENT_STAIR_SPEED : AGENT_SPEED;
        const dist = Math.hypot(dx, dy);
        const stepLen = speed * dt;

        if (dist <= stepLen) {
          pos.current = { x: next.x, y: next.y };
          legs.shift();
          if (!legs.length) {
            frameDist.current = 0;
            if (targetFloorId) {
              settled.current = targetFloorId;
              setVisualFloorId(targetFloorId);
            }
            setMode("working");
            setTraveling(false);
          }
        } else {
          pos.current = {
            x: pos.current.x + (dx / dist) * stepLen,
            y: pos.current.y + (dy / dist) * stepLen,
          };
          if (dx > 1) facing.current = 1;
          if (dx < -1) facing.current = -1;
          frameDist.current += stepLen;
        }
        paint(Math.floor(frameDist.current / 7) % 4);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetFloorId]);

  return { ref, mode, traveling, visualFloorId: visualFloorId ?? settled.current };
}
