import { useLayoutEffect, useRef, useState } from "react";
import { FLOORS, FLOOR_BY_ID, WORLD_H, WORLD_W } from "@/data/worldLayout";
import type { AgentRunSnapshot, FloorId, FloorState } from "@/types/agentRun";
import { isWorkFloor } from "@/types/agentRun";
import { OfficeFloor } from "./OfficeFloor";
import { AgentNpc } from "./AgentNpc";
import { PlayerAvatar } from "./PlayerAvatar";
import { MobileControls } from "./MobileControls";
import { useAgentMovement } from "@/hooks/useAgentMovement";
import { usePlayerMovement } from "@/hooks/useKeyboardMovement";

interface BuildingSceneProps {
  snapshot: AgentRunSnapshot | null;
  reducedMotion: boolean;
  onPeek: (floorId: FloorId) => void;
  /** Disabled while a dialog or the note composer owns the keyboard. */
  playerEnabled: boolean;
}

export function BuildingScene({ snapshot, reducedMotion, onPeek, playerEnabled }: BuildingSceneProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const fit = () => {
      const rect = el.getBoundingClientRect();
      setScale(Math.max(0.3, Math.min(rect.width / (WORLD_W + 40), rect.height / (WORLD_H + 60))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const agent = useAgentMovement(snapshot?.currentFloor ?? null, reducedMotion);
  const player = usePlayerMovement(playerEnabled);
  player.onInteract.current = onPeek;

  const agentDescription = snapshot?.latestAction
    ? `Agent on the ${snapshot.latestAction.floorId} floor: ${snapshot.latestAction.label}`
    : "Agent waiting to start";

  const playerFloor = FLOOR_BY_ID[player.floorId];
  const playerFloorLabel = playerFloor.id === "dino" ? "the Dino Cabinet" : playerFloor.name;

  return (
    <div
      ref={viewportRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: "#101720" }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg,#132030 0%,#1b2c3d 55%,#101720 100%)" }} />
      {[
        { x: "8%", y: "6%", s: 1 },
        { x: "70%", y: "4%", s: 1.25 },
        { x: "44%", y: "12%", s: 0.85 },
      ].map((c, i) => (
        <div key={i} className="pointer-events-none absolute" style={{ left: c.x, top: c.y, transform: `scale(${c.s})`, opacity: 0.35 }}>
          <div className="absolute" style={{ left: 0, top: 8, width: 64, height: 12, background: "#cfe0ee" }} />
          <div className="absolute" style={{ left: 14, top: 0, width: 34, height: 12, background: "#e8f2fa" }} />
        </div>
      ))}

      <div
        className="absolute left-1/2 top-1/2 pixelated"
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          boxShadow: "0 0 0 4px #15191d, 0 16px 44px rgba(0,0,0,0.6)",
        }}
      >
        {/* roof */}
        <div className="absolute" style={{ left: -10, top: -28, width: WORLD_W + 20, height: 28, background: "#242a30", border: "3px solid #12161a" }}>
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="absolute" style={{ left: 4 + i * 25, top: 6, width: 20, height: 6, background: "#2e363d" }} />
          ))}
          <div className="absolute" style={{ left: 140, top: -14, width: 40, height: 16, background: "#39424a", border: "2px solid #12161a" }} />
          <div className="absolute" style={{ left: 470, top: -30, width: 2, height: 32, background: "#12161a" }} />
          <div className="absolute" style={{ left: 458, top: -30, width: 26, height: 2, background: "#12161a" }} />
        </div>

        {FLOORS.map((floor) => {
          const work = isWorkFloor(floor.id);
          const state: FloorState | "hidden" = work
            ? (snapshot?.floorStates[floor.id as "research"] ?? "idle")
            : "hidden";
          return (
            <OfficeFloor
              key={floor.id}
              floor={floor}
              state={state}
              reducedMotion={reducedMotion}
              onPeek={onPeek}
              peekable
              agentHere={agent.visualFloorId === floor.id}
              doorOpen={agent.openDoors.includes(floor.index)}
            />
          );
        })}

        <AgentNpc innerRef={agent.ref} mode={agent.mode} description={agentDescription} hidden={agent.inDoorway} />
        <PlayerAvatar
          innerRef={player.ref}
          prompt={playerEnabled ? (playerFloor.id === "dino" ? "[E] LOOK" : "[E] PEEK") : null}
        />
      </div>

      <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 hidden label-pixel text-[8px] text-idle lg:block">
        CLICK A FLOOR TO PEEK · WASD / ARROWS TO WALK · E TO PEEK WHERE YOU STAND
      </p>

      <MobileControls player={player} onInteract={() => onPeek(player.floorId)} label={playerFloorLabel} />
    </div>
  );
}
