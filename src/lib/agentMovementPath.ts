import { FLOORS, FLOOR_BY_ID, type Point } from "@/data/worldLayout";
import type { WorkFloorId } from "@/types/agentRun";

const floorIndexOfY = (y: number) => {
  let best = FLOORS[0]!;
  for (const f of FLOORS) {
    if (Math.abs(f.desk.y - y) < Math.abs(best.desk.y - y)) best = f;
  }
  return best.index;
};

/**
 * Deterministic waypoint route (no pathfinding): the agent leaves through the
 * door, uses the shared stairwell, passes every intermediate floor's stair
 * point, then walks in through the destination door to its desk.
 */
export function buildAgentPath(from: Point, targetFloorId: WorkFloorId): Point[] {
  const target = FLOOR_BY_ID[targetFloorId];
  const fromIndex = floorIndexOfY(from.y);
  const fromFloor = FLOORS[fromIndex]!;
  const path: Point[] = [];

  if (fromIndex === target.index) {
    // Same floor: just walk along the band to the desk.
    path.push({ x: target.desk.x, y: target.desk.y });
    return path;
  }

  const inStairwell = Math.abs(from.x - fromFloor.stairs.x) < 12;
  if (!inStairwell) {
    path.push({ x: fromFloor.door.x, y: fromFloor.door.y });
    path.push({ x: fromFloor.stairs.x, y: fromFloor.stairs.y });
  }

  const dir = target.index > fromIndex ? 1 : -1;
  for (let i = fromIndex + dir; i !== target.index + dir; i += dir) {
    const floor = FLOORS[i];
    if (!floor) break;
    path.push({ x: floor.stairs.x, y: floor.stairs.y });
  }

  path.push({ x: target.door.x, y: target.door.y });
  path.push({ x: target.desk.x, y: target.desk.y });
  return path;
}
