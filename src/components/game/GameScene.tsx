import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  FLOORS,
  FLOOR_BY_ID,
  PLAYER_BOX,
  PLAYER_SPEED,
  PLAYER_START,
  WORLD_H,
  WORLD_W,
  type FloorDef,
  type Station,
  type Transition,
} from "@/data/worldLayout";
import { moveWithCollision, pointInRect, resolveSpawn } from "@/lib/collision";
import { FloorArt } from "./FloorArt";
import { Player } from "./Player";
import type { FloorId, StageId, StageView } from "@/types/project";

export type Interactable =
  | { kind: "station"; station: Station; floor: FloorDef }
  | { kind: "transition"; transition: Transition; floor: FloorDef };

interface GameSceneProps {
  stageViews: StageView[];
  animate: boolean;
  onEnterStation: (stageId: StageId) => void;
  modalOpen: boolean;
}

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

export function GameScene({ stageViews, animate, onEnterStation, modalOpen }: GameSceneProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: PLAYER_START.x, y: PLAYER_START.y });
  const [floorId, setFloorId] = useState<FloorId>(PLAYER_START.floorId);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walking, setWalking] = useState(false);
  const [phase, setPhase] = useState(0);

  const posRef = useRef(pos);
  const floorRef = useRef(floorId);
  const phaseRef = useRef(0);
  const keys = useRef(new Set<string>());
  posRef.current = pos;
  floorRef.current = floorId;


  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const fit = () => {
      const rect = el.getBoundingClientRect();
      setScale(Math.max(0.35, Math.min(rect.width / WORLD_W, rect.height / WORLD_H)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const statusByStage = useMemo(() => {
    const map = {} as Record<StageId, StageView>;
    for (const v of stageViews) map[v.id] = v;
    return map;
  }, [stageViews]);

  const currentFloor = FLOOR_BY_ID[floorId];

  const nearest: Interactable | null = useMemo(() => {
    const cx = pos.x + PLAYER_BOX.w / 2;
    const cy = pos.y + PLAYER_BOX.h / 2;
    for (const s of currentFloor.stations) {
      if (pointInRect(cx, cy, s.zone)) return { kind: "station", station: s, floor: currentFloor };
    }
    for (const t of currentFloor.transitions) {
      if (pointInRect(cx, cy, t.zone)) return { kind: "transition", transition: t, floor: currentFloor };
    }
    return null;
  }, [pos, currentFloor]);

  const nearestRef = useRef(nearest);
  nearestRef.current = nearest;

  const interact = useCallback(() => {
    const target = nearestRef.current;
    if (!target) return;
    if (target.kind === "transition") {
      const next = FLOOR_BY_ID[target.transition.targetFloorId];
      const spawn = resolveSpawn(
        { x: target.transition.spawn.x, y: target.transition.spawn.y, ...PLAYER_BOX },
        next.walkable,
        next.obstacles,
      );
      setFloorId(next.id);
      setPos(spawn);
      return;
    }
    onEnterStation(target.station.stageId);
  }, [onEnterStation]);

  useEffect(() => {
    if (modalOpen) {
      keys.current.clear();
      setWalking(false);
      return;
    }
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      const dir = KEYS[e.key];
      if (dir) {
        e.preventDefault();
        keys.current.add(dir);
      } else if (e.key === "e" || e.key === "E" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        interact();
      }
    };
    const up = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      if (dir) keys.current.delete(dir);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [interact, modalOpen]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const held = keys.current;
      let dx = (held.has("right") ? 1 : 0) - (held.has("left") ? 1 : 0);
      let dy = (held.has("down") ? 1 : 0) - (held.has("up") ? 1 : 0);
      if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
      }
      if (dx !== 0 || dy !== 0) {
        const floor = FLOOR_BY_ID[floorRef.current];
        const box = { ...posRef.current, ...PLAYER_BOX };
        const next = moveWithCollision(box, dx * PLAYER_SPEED * dt, dy * PLAYER_SPEED * dt, floor.walkable, floor.obstacles);
        if (next.x !== posRef.current.x || next.y !== posRef.current.y) {
          posRef.current = { x: next.x, y: next.y };
          setPos(posRef.current);
        }
        if (dx > 0) setFacing(1);
        if (dx < 0) setFacing(-1);
        setWalking(true);
      } else {
        setWalking(false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const promptLabel =
    nearest?.kind === "station"
      ? `Open ${nearest.station.label}`
      : nearest?.kind === "transition"
        ? nearest.transition.label
        : null;

  return (
    <div ref={viewportRef} className="relative h-full w-full overflow-hidden grain" style={{ background: "#0f1317" }}>
      <div
        className="absolute left-1/2 top-1/2 pixelated"
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          outline: "3px solid #15191d",
        }}
      >
        {FLOORS.map((floor) => {
          const view = statusByStage[floor.stageId];
          return (
            <FloorArt
              key={floor.id}
              floor={floor}
              status={view?.status ?? "locked"}
              title={view?.title ?? floor.roomName}
              percent={view?.percent ?? 0}
            />
          );
        })}

        <Player x={pos.x} y={pos.y} facing={facing} walking={walking} animate={animate} />

        {promptLabel && (
          <div
            className="absolute label-pixel px-2 py-1 text-[9px] pixel-frame"
            style={{
              left: Math.min(Math.max(pos.x - 40, 8), WORLD_W - 180),
              top: pos.y - 34,
              background: "#15191d",
              color: "#f2c94c",
              animation: animate ? "neuro-pop 140ms ease-out" : undefined,
              zIndex: 50,
              whiteSpace: "nowrap",
            }}
          >
            [E] {promptLabel}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 label-pixel text-[9px] text-idle">
        WASD / ARROWS to move · E to interact
      </div>
    </div>
  );
}
