import { useEffect, useRef, useState } from "react";
import { CHAR_H, CHAR_W, FLOORS, FLOOR_BY_ID, PLAYER_SPEED, PLAYER_START, STAIR_X } from "@/data/worldLayout";
import { moveWithCollision } from "@/lib/collision";
import type { FloorId } from "@/types/agentRun";

const KEYS: Record<string, "up" | "down" | "left" | "right"> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  W: "up",
  A: "left",
  S: "down",
  D: "right",
};

const isTypingTarget = (el: EventTarget | null) => {
  const node = el as HTMLElement | null;
  if (!node) return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName) || node.isContentEditable;
};

export interface UsePlayerMovement {
  ref: React.RefObject<HTMLDivElement | null>;
  floorId: FloorId;
  /** Directional press helpers for touch controls. */
  press: (dir: "up" | "down" | "left" | "right", down: boolean) => void;
  enabled: boolean;
  onInteract: React.MutableRefObject<(floorId: FloorId) => void>;
}

/**
 * Optional player avatar. Never affects floor state or agent status, and never
 * hijacks the keyboard while the user is typing a note.
 */
export function usePlayerMovement(enabled: boolean): UsePlayerMovement {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: PLAYER_START.x, y: PLAYER_START.y });
  const floorRef = useRef<FloorId>(PLAYER_START.floorId);
  const [floorId, setFloorId] = useState<FloorId>(PLAYER_START.floorId);
  const held = useRef(new Set<string>());
  const facing = useRef<1 | -1>(1);
  const walkDist = useRef(0);
  const onInteract = useRef<(floorId: FloorId) => void>(() => {});

  const press = (dir: "up" | "down" | "left" | "right", down: boolean) => {
    if (down) held.current.add(dir);
    else held.current.delete(dir);
  };

  useEffect(() => {
    if (!enabled) {
      held.current.clear();
      return;
    }
    const down = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const dir = KEYS[e.key];
      if (dir) {
        e.preventDefault();
        held.current.add(dir);
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        onInteract.current(floorRef.current);
      }
    };
    const up = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      if (dir) held.current.delete(dir);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = performance.now();

    const paint = (frame: number, walking: boolean) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate3d(${Math.round(pos.current.x - CHAR_W / 2)}px, ${Math.round(
        pos.current.y - CHAR_H,
      )}px, 0)`;
      el.dataset["frame"] = String(frame);
      el.dataset["facing"] = String(facing.current);
      el.dataset["mode"] = walking ? "walking" : "idle";
    };
    paint(0, false);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const keys = held.current;
      let dx = (keys.has("right") ? 1 : 0) - (keys.has("left") ? 1 : 0);
      let dy = (keys.has("down") ? 1 : 0) - (keys.has("up") ? 1 : 0);
      const inStairwell = pos.current.x > STAIR_X + 4;

      if (!inStairwell) dy = 0; // vertical travel only inside the stair column
      if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
      }

      if (dx !== 0 || dy !== 0) {
        const floor = FLOOR_BY_ID[floorRef.current];
        if (inStairwell && dy !== 0) {
          const ny = Math.min(
            Math.max(pos.current.y + dy * PLAYER_SPEED * dt, FLOORS[0]!.desk.y),
            FLOORS[FLOORS.length - 1]!.desk.y,
          );
          pos.current = { x: pos.current.x + dx * PLAYER_SPEED * dt, y: ny };
          const landed = FLOORS.reduce((best, f) =>
            Math.abs(f.desk.y - ny) < Math.abs(best.desk.y - ny) ? f : best,
          );
          if (landed.id !== floorRef.current) {
            floorRef.current = landed.id;
            setFloorId(landed.id);
          }
        } else {
          const box = { x: pos.current.x - CHAR_W / 2, y: pos.current.y - 10, w: CHAR_W, h: 10 };
          const moved = moveWithCollision(box, dx * PLAYER_SPEED * dt, 0, floor.walkable, floor.obstacles);
          pos.current = { x: moved.x + CHAR_W / 2, y: pos.current.y };
        }
        if (dx > 0) facing.current = 1;
        if (dx < 0) facing.current = -1;
        walkDist.current += Math.abs(dx * PLAYER_SPEED * dt) + Math.abs(dy * PLAYER_SPEED * dt);
        paint(Math.floor(walkDist.current / 7) % 4, true);
      } else {
        paint(0, false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  return { ref, floorId, press, enabled, onInteract };
}
