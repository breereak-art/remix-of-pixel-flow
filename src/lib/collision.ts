import type { Rect } from "@/data/worldLayout";

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function pointInRect(x: number, y: number, r: Rect): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Axis-separated AABB movement. Resolves the x axis first, then y, clamping the
 * box into `walkable` and rejecting any step that lands inside an obstacle.
 */
export function moveWithCollision(
  box: Rect,
  dx: number,
  dy: number,
  walkable: Rect,
  obstacles: Rect[],
): { x: number; y: number; blockedX: boolean; blockedY: boolean } {
  let x = box.x;
  let y = box.y;
  let blockedX = false;
  let blockedY = false;

  if (dx !== 0) {
    const nextX = clamp(x + dx, walkable.x, walkable.x + walkable.w - box.w);
    const probe: Rect = { x: nextX, y, w: box.w, h: box.h };
    if (obstacles.some((o) => rectsOverlap(probe, o))) {
      blockedX = true;
    } else {
      if (nextX !== x + dx) blockedX = true;
      x = nextX;
    }
  }

  if (dy !== 0) {
    const nextY = clamp(y + dy, walkable.y, walkable.y + walkable.h - box.h);
    const probe: Rect = { x, y: nextY, w: box.w, h: box.h };
    if (obstacles.some((o) => rectsOverlap(probe, o))) {
      blockedY = true;
    } else {
      if (nextY !== y + dy) blockedY = true;
      y = nextY;
    }
  }

  return { x, y, blockedX, blockedY };
}

/** Nudges a box out of any obstacle it is currently intersecting. */
export function resolveSpawn(box: Rect, walkable: Rect, obstacles: Rect[]): { x: number; y: number } {
  let x = clamp(box.x, walkable.x, walkable.x + walkable.w - box.w);
  let y = clamp(box.y, walkable.y, walkable.y + walkable.h - box.h);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const probe: Rect = { x, y, w: box.w, h: box.h };
    if (!obstacles.some((o) => rectsOverlap(probe, o))) break;
    y = clamp(y + 4, walkable.y, walkable.y + walkable.h - box.h);
    if (y === walkable.y + walkable.h - box.h) x = clamp(x - 6, walkable.x, walkable.x + walkable.w - box.w);
  }
  return { x, y };
}
