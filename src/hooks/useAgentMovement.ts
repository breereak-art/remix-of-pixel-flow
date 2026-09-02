import { useEffect, useRef, useState } from "react";
import { buildAgentPath, type Leg } from "@/lib/agentMovementPath";
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
  /** Floor indexes whose doorway is currently swung open. */
  openDoors: number[];
  /** True while the agent is inside the doorway between floors. */
  inDoorway: boolean;
}

/** Seconds the door stays open before/after the agent steps through. */
const DOOR_OPEN_HOLD = 0.36;
const DOOR_EXIT_HOLD = 0.3;

/**
 * Owns the NPC's position in refs and writes transforms straight to the DOM —
 * no React re-render per animation frame. Floor changes always route through
 * the doorway: walk to door, door opens, step through, exit the target door.
 */
export function useAgentMovement(
  targetFloorId: WorkFloorId | null,
  reducedMotion: boolean,
): UseAgentMovement {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useRef<Point>({ ...AGENT_HOME });
  const path = useRef<Leg[]>([]);
  const facing = useRef<1 | -1>(1);
  const frameDist = useRef(0);
  const hold = useRef(0);
  const [mode, setMode] = useState<AgentMode>("idle");
  const [traveling, setTraveling] = useState(false);
  const [visualFloorId, setVisualFloorId] = useState<WorkFloorId | null>(null);
  const [openDoors, setOpenDoors] = useState<number[]>([]);
  const [inDoorway, setInDoorway] = useState(false);
  const settled = useRef<WorkFloorId | null>(null);

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
      pos.current = { ...target.desk };
      path.current = [];
      hold.current = 0;
      settled.current = targetFloorId;
      setVisualFloorId(targetFloorId);
      setMode("working");
      setTraveling(false);
      setOpenDoors([]);
      setInDoorway(false);
      paint(0);
      return;
    }
    path.current = buildAgentPath(pos.current, targetFloorId);
    hold.current = 0;
    setInDoorway(false);
    setTraveling(true);
    setMode("walking");
  }, [targetFloorId, reducedMotion]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    paint(0);

    const arrive = () => {
      frameDist.current = 0;
      hold.current = 0;
      setOpenDoors([]);
      setInDoorway(false);
      if (targetFloorId) {
        settled.current = targetFloorId;
        setVisualFloorId(targetFloorId);
      }
      setMode("working");
      setTraveling(false);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (hold.current > 0) {
        hold.current -= dt;
        paint(0);
        raf = requestAnimationFrame(tick);
        return;
      }

      const legs = path.current;
      const next = legs[0];

      if (next) {
        const dx = next.x - pos.current.x;
        const dy = next.y - pos.current.y;
        const isDoorTransit = next.kind === "through-door";
        const speed = isDoorTransit ? AGENT_STAIR_SPEED : AGENT_SPEED;
        const dist = Math.hypot(dx, dy);
        const stepLen = speed * dt;

        if (dist <= stepLen) {
          pos.current = { x: next.x, y: next.y };
          legs.shift();

          if (next.kind === "enter-door") {
            // Reached the door: swing it open, then step inside.
            setOpenDoors([next.floorIndex]);
            setInDoorway(true);
            hold.current = DOOR_OPEN_HOLD;
            frameDist.current = 0;
          } else if (next.kind === "through-door") {
            // Came out on the destination floor.
            setOpenDoors([next.floorIndex]);
            setInDoorway(false);
            hold.current = DOOR_EXIT_HOLD;
            const nextLeg = legs[0];
            if (nextLeg) facing.current = nextLeg.x < pos.current.x ? -1 : 1;
          } else if (!legs.length) {
            arrive();
          }
        } else {
          pos.current = {
            x: pos.current.x + (dx / dist) * stepLen,
            y: pos.current.y + (dy / dist) * stepLen,
          };
          if (!isDoorTransit) {
            if (dx > 1) facing.current = 1;
            if (dx < -1) facing.current = -1;
          }
          frameDist.current += stepLen;
        }
        paint(Math.floor(frameDist.current / 7) % 4);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetFloorId]);

  // Close a lingering open door once the agent has settled.
  useEffect(() => {
    if (mode !== "working" || !openDoors.length) return;
    const t = setTimeout(() => setOpenDoors([]), 260);
    return () => clearTimeout(t);
  }, [mode, openDoors]);

  return {

    ref,
    mode,
    traveling,
    visualFloorId: visualFloorId ?? settled.current,
    openDoors,
    inDoorway,
  };
}
