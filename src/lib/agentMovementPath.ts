import { FLOORS, FLOOR_BY_ID, type Point } from "@/data/worldLayout";
import type { WorkFloorId } from "@/types/agentRun";

const floorIndexOfY = (y: number) => {
  let best = FLOORS[0]!;
  for (const f of FLOORS) {
    if (Math.abs(f.desk.y - y) < Math.abs(best.desk.y - y)) best = f;
  }
  return best.index;
};

export type LegKind =
  /** Normal walk along the floor band. */
  | "walk"
  /** Standing in the open doorway before stepping through. */
  | "enter-door"
  /** Travelling between floors, hidden inside the doorway. */
  | "through-door";

export interface Leg extends Point {
  kind: LegKind;
  /** Floor the doorway belongs to, for open/close animation. */
  floorIndex: number;
}

/**
 * Doors are the only way between floors: the agent walks to its floor's door,
 * the door opens, it steps through, and it comes out of the destination door.
 */
export function buildAgentPath(from: Point, targetFloorId: WorkFloorId): Leg[] {
  const target = FLOOR_BY_ID[targetFloorId];
  const fromIndex = floorIndexOfY(from.y);
  const fromFloor = FLOORS[fromIndex]!;

  if (fromIndex === target.index) {
    return [{ x: target.desk.x, y: target.desk.y, kind: "walk", floorIndex: target.index }];
  }

  return [
    { x: fromFloor.door.x, y: fromFloor.door.y, kind: "enter-door", floorIndex: fromIndex },
    { x: target.door.x, y: target.door.y, kind: "through-door", floorIndex: target.index },
    { x: target.desk.x, y: target.desk.y, kind: "walk", floorIndex: target.index },
  ];
}
