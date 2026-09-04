import type { FloorId, WorkFloorId } from "@/types/agentRun";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

export const WORLD_W = 640;
export const FLOOR_H = 200;
export const FLOOR_COUNT = 5;
export const WORLD_H = FLOOR_H * FLOOR_COUNT;

/** Shared stair column down the right side of the building. */
export const STAIR_X = 536;
export const STAIR_W = 78;
export const STAIR_CENTER = STAIR_X + STAIR_W / 2;

/** Feet band inside every floor (local coordinates). */
export const WALK_BAND = { y: 150, h: 40 };
export const FEET_Y = 182;

export const CHAR_W = 20;
export const CHAR_H = 28;

export const AGENT_SPEED = 132; // px/s horizontal
export const AGENT_STAIR_SPEED = 118; // px/s vertical
export const PLAYER_SPEED = 130;

export interface FloorLayout {
  id: FloorId;
  index: number;
  name: string;
  /** Absolute y of the floor band top. */
  top: number;
  /** Room interior (excludes the stair column). */
  room: Rect;
  /** Absolute walkable band for characters. */
  walkable: Rect;
  /** Absolute obstacle rects (feet-level blockers). */
  obstacles: Rect[];
  /** Absolute waypoints. */
  desk: Point;
  door: Point;
  stairs: Point;
  tint: string;
  tintDark: string;
  accent: string;
}

interface RawFloor {
  id: FloorId;
  name: string;
  deskX: number;
  obstacles: Rect[];
  tint: string;
  tintDark: string;
  accent: string;
}

const DOOR_X = 500;

const RAW: RawFloor[] = [
  {
    id: "research",
    name: "Research",
    deskX: 250,
    tint: "#54613f",
    tintDark: "#39432b",
    accent: "#9fc46a",
    obstacles: [
      { x: 44, y: 128, w: 74, h: 54 },
      { x: 200, y: 158, w: 116, h: 26 },
      { x: 400, y: 150, w: 40, h: 32 },
    ],
  },
  {
    id: "drafting",
    name: "Drafting",
    deskX: 300,
    tint: "#6d5124",
    tintDark: "#4a361634",
    accent: "#ffca3a",
    obstacles: [
      { x: 44, y: 138, w: 62, h: 44 },
      { x: 252, y: 158, w: 120, h: 26 },
      { x: 420, y: 152, w: 52, h: 30 },
    ],
  },
  {
    id: "writing",
    name: "Writing",
    deskX: 236,
    tint: "#39506b",
    tintDark: "#26364a",
    accent: "#6fc2ff",
    obstacles: [
      { x: 48, y: 130, w: 68, h: 52 },
      { x: 186, y: 158, w: 122, h: 26 },
      { x: 396, y: 156, w: 60, h: 26 },
    ],
  },
  {
    id: "publish",
    name: "Publish",
    deskX: 272,
    tint: "#453a72",
    tintDark: "#2e274f",
    accent: "#c39bff",
    obstacles: [
      { x: 44, y: 148, w: 56, h: 34 },
      { x: 222, y: 158, w: 132, h: 26 },
      { x: 404, y: 142, w: 58, h: 40 },
    ],
  },
  {
    id: "dino",
    name: "Dino Cabinet",
    deskX: 300,
    tint: "#3b3733",
    tintDark: "#282523",
    accent: "#a89a74",
    obstacles: [
      { x: 52, y: 136, w: 74, h: 46 },
      { x: 210, y: 150, w: 96, h: 32 },
      { x: 388, y: 132, w: 92, h: 50 },
    ],
  },
];

export const FLOORS: FloorLayout[] = RAW.map((raw, index) => {
  const top = index * FLOOR_H;
  return {
    id: raw.id,
    index,
    name: raw.name,
    top,
    room: { x: 26, y: top + 12, w: STAIR_X - 30, h: FLOOR_H - 16 },
    walkable: { x: 34, y: top + WALK_BAND.y, w: WORLD_W - 60, h: WALK_BAND.h },
    obstacles: raw.obstacles.map((o) => ({ ...o, y: o.y + top })),
    desk: { x: raw.deskX, y: top + FEET_Y },
    door: { x: DOOR_X, y: top + FEET_Y },
    stairs: { x: STAIR_CENTER, y: top + FEET_Y },
    tint: raw.tint,
    tintDark: raw.tintDark,
    accent: raw.accent,
  };
});

export const FLOOR_BY_ID = FLOORS.reduce<Record<FloorId, FloorLayout>>(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<FloorId, FloorLayout>,
);

export const WORK_FLOORS = FLOORS.filter((f) => f.id !== "dino") as (FloorLayout & { id: WorkFloorId })[];

/** Where the agent stands before the first backend snapshot arrives. */
export const AGENT_HOME: Point = FLOOR_BY_ID.research.desk;

/** Clear of every drafting-floor obstacle, a short walk from the stairwell. */
export const PLAYER_START = { floorId: "drafting" as FloorId, x: 492, y: FLOOR_BY_ID.drafting.desk.y };
