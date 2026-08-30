import type { FloorId, StageId } from "@/types/project";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WORLD_W = 640;
export const FLOOR_H = 200;
export const WORLD_H = FLOOR_H * 5;
export const PLAYER_BOX = { w: 20, h: 12 };
export const PLAYER_SPEED = 132; // px / second in world units

/** Local walkable band inside every floor (feet area). */
const WALK = { x: 34, y: 112, w: 572, h: 78 };

export interface Station {
  id: string;
  label: string;
  stageId: StageId;
  zone: Rect;
}

export interface Transition {
  id: string;
  label: string;
  direction: "up" | "down";
  targetFloorId: FloorId;
  zone: Rect;
  spawn: { x: number; y: number };
}

export interface FloorDef {
  id: FloorId;
  index: number;
  stageId: StageId;
  roomName: string;
  /** absolute y of the floor band top */
  top: number;
  walkable: Rect;
  obstacles: Rect[];
  stations: Station[];
  transitions: Transition[];
}

const offset = (r: Rect, dy: number): Rect => ({ ...r, y: r.y + dy });

interface RawFloor {
  id: FloorId;
  stageId: StageId;
  roomName: string;
  obstacles: Rect[];
  station: { id: string; label: string; zone: Rect };
}

const RAW: RawFloor[] = [
  {
    id: "floor-research",
    stageId: "research",
    roomName: "Research Office",
    obstacles: [
      { x: 38, y: 150, w: 26, h: 30 },
      { x: 96, y: 124, w: 64, h: 54 },
      { x: 250, y: 132, w: 130, h: 32 },
      { x: 430, y: 134, w: 86, h: 44 },
    ],
    station: { id: "research-desk", label: "Research Desk", zone: { x: 226, y: 112, w: 180, h: 78 } },
  },
  {
    id: "floor-drafting",
    stageId: "drafting",
    roomName: "Drafting Office",
    obstacles: [
      { x: 38, y: 150, w: 26, h: 30 },
      { x: 110, y: 128, w: 80, h: 46 },
      { x: 284, y: 132, w: 150, h: 32 },
      { x: 462, y: 136, w: 60, h: 42 },
    ],
    station: { id: "drafting-desk", label: "Drafting Desk", zone: { x: 262, y: 112, w: 192, h: 78 } },
  },
  {
    id: "floor-writing",
    stageId: "writing",
    roomName: "Writing Office",
    obstacles: [
      { x: 110, y: 132, w: 120, h: 32 },
      { x: 262, y: 132, w: 120, h: 32 },
      { x: 430, y: 126, w: 70, h: 52 },
    ],
    station: { id: "writing-desk", label: "Writing Desk", zone: { x: 96, y: 112, w: 296, h: 78 } },
  },
  {
    id: "floor-publish",
    stageId: "publish",
    roomName: "Publish Office",
    obstacles: [
      { x: 40, y: 152, w: 26, h: 28 },
      { x: 150, y: 136, w: 250, h: 30 },
      { x: 430, y: 126, w: 80, h: 46 },
    ],
    station: { id: "publish-desk", label: "Publish Desk", zone: { x: 140, y: 112, w: 270, h: 78 } },
  },
  {
    id: "floor-basement",
    stageId: "dino",
    roomName: "Dino Cabinet",
    obstacles: [
      { x: 130, y: 126, w: 120, h: 54 },
      { x: 268, y: 146, w: 74, h: 34 },
      { x: 370, y: 130, w: 112, h: 50 },
    ],
    station: { id: "dino-cabinet", label: "Dino Cabinet", zone: { x: 250, y: 112, w: 120, h: 78 } },
  },
];

const UP_ZONE: Rect = { x: 540, y: 112, w: 30, h: 78 };
const DOWN_ZONE: Rect = { x: 576, y: 112, w: 30, h: 78 };
const SPAWN_X = 556;
const SPAWN_LOCAL_Y = 176;

export const FLOORS: FloorDef[] = RAW.map((raw, index) => {
  const top = index * FLOOR_H;
  const transitions: Transition[] = [];
  const prev = RAW[index - 1];
  const next = RAW[index + 1];
  if (index > 0 && prev) {
    transitions.push({
      id: `${raw.id}-up`,
      label: `Go up to ${prev.roomName}`,
      direction: "up",
      targetFloorId: prev.id,
      zone: offset(UP_ZONE, top),
      spawn: { x: SPAWN_X, y: (index - 1) * FLOOR_H + SPAWN_LOCAL_Y },
    });
  }
  if (next) {
    transitions.push({
      id: `${raw.id}-down`,
      label: `Go down to ${next.roomName}`,
      direction: "down",
      targetFloorId: next.id,
      zone: offset(DOWN_ZONE, top),
      spawn: { x: SPAWN_X, y: (index + 1) * FLOOR_H + SPAWN_LOCAL_Y },
    });
  }

  return {
    id: raw.id,
    index,
    stageId: raw.stageId,
    roomName: raw.roomName,
    top,
    walkable: offset(WALK, top),
    obstacles: raw.obstacles.map((o) => offset(o, top)),
    stations: [
      {
        id: raw.station.id,
        label: raw.station.label,
        stageId: raw.stageId,
        zone: offset(raw.station.zone, top),
      },
    ],
    transitions,
  };
});

export const FLOOR_BY_ID: Record<FloorId, FloorDef> = FLOORS.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<FloorId, FloorDef>,
);

export const FLOOR_BY_STAGE: Record<StageId, FloorDef> = FLOORS.reduce(
  (acc, f) => {
    acc[f.stageId] = f;
    return acc;
  },
  {} as Record<StageId, FloorDef>,
);

export const PLAYER_START = {
  floorId: "floor-drafting" as FloorId,
  x: 330,
  y: FLOOR_BY_ID["floor-drafting"].top + 176,
};

/** Local (floor-relative) helpers for the art layer. */
export const FLOOR_LOCAL = { walk: WALK, upZone: UP_ZONE, downZone: DOWN_ZONE };
