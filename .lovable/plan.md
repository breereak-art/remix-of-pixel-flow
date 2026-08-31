# HQ — plan

A single-screen pixel-art building that truthfully shows what a real AI agent run is doing. Three verbs only: **Glance**, **Peek**, **Stick a note**. The existing PROJECT: NEURO workflow app is replaced: the task/milestone/percentage model contradicts HQ's honesty rules, so its workflow engine, project store, and panels are removed rather than adapted. The pixel-art building art (floors, props, cutaway framing) is kept and reworked into state-driven floors.

## 1. Architecture

- Route `/` opens straight into HQ (no landing page). Route `src/routes/index.tsx` renders `AppShell`.
- All live truth flows from one adapter interface. Components never know about SSE/WebSocket/tools.
- `useAgentRun` subscribes once, holds the snapshot in React state, and appends an activity log locally per floor.
- `useAgentMovement` owns NPC position in refs + rAF and writes `transform` directly to the sprite node — no per-frame React state.
- No numbers anywhere: no percent, no bars, no counts of stages, no ETA. Elapsed time only ("Running for 01:42").

## 2. Component tree

```text
routes/index.tsx
└─ AppShell
   ├─ HQStatusRail        logo, agent status, current action, elapsed, floor legend, SR summary
   ├─ BuildingScene       cutaway frame, sky, roof, stair column, scaling viewport
   │   ├─ OfficeFloor x5  (research, drafting, writing, publish, dino)
   │   │   ├─ FloorStateOverlay   lighting/glow/dim + residue props + state label
   │   │   ├─ floor/desk/label are semantic buttons → open Peek (baseline trigger)
   │   │   └─ InteractionPrompt   optional [E] Peek on avatar adjacency (Phase 4 only)
   │   ├─ AgentNpc        PixelCharacter (amber), NPC-only, idle/walk/work
   │   └─ PlayerAvatar    PixelCharacter (teal), WASD/arrows/touch
   ├─ PeekPanel           drawer desktop / bottom sheet mobile → PeekContentRenderer
   ├─ NotesReceipt        every note this run, newest first, status chips
   │   └─ StickyNoteComposer  rendered only for the active floor
   ├─ ActivityLog         collapsed disclosure under the building
   ├─ MobileControls      d-pad, mobile only
   ├─ DeveloperDemoControls  discreet: pause/resume, next action, reset
   └─ Toasts              sonner
```

## 3. Data types (`src/types/agentRun.ts`)

```ts
type FloorId = "research" | "drafting" | "writing" | "publish" | "dino";
type WorkFloorId = Exclude<FloorId, "dino">;
type FloorState = "idle" | "active" | "done";
type AgentStatus = "working" | "waiting" | "complete" | "failed";
type NoteStatus = "queued" | "delivered" | "read" | "failed";

type SteeringNote = { id; runId; floorId: WorkFloorId; text; createdAt; status: NoteStatus };

type AgentRunSnapshot = {
  runId; status: AgentStatus; startedAt: string;
  currentFloor: WorkFloorId | null;
  floorStates: Record<WorkFloorId, FloorState>;
  latestAction: { floorId: WorkFloorId; label: string; at: string } | null;
  notes: SteeringNote[];
};

type PeekBlock =
  | { kind: "text"; text }
  | { kind: "markdown"; text }
  | { kind: "list"; items: string[] }
  | { kind: "headings"; items: { level: 1|2|3; text }[] }
  | { kind: "sources"; items: { title; url?; summary? }[] }
  | { kind: "links"; items: { label; url }[] }
  | { kind: "code"; text; lang? }
  | { kind: "actions"; items: { label; at }[] }
  | { kind: "json"; value: unknown };          // dev fallback

type PeekPayload = { floorId: WorkFloorId; state: FloorState; updatedAt: string; blocks: PeekBlock[] };
```

## 4. Adapter design

`src/lib/agentRunAdapter.ts` exports the `AgentRunAdapter` type (`subscribe`, `sendSteeringNote`, `getPeekPayload`) plus a single `getAdapter()` seam.
`src/lib/mockAgentRunAdapter.ts` implements it with a timed script, exposes `pause()/resume()/next()/reset()` on a separate demo-control object, and simulates note lifecycle: `queued` → `delivered` (~1.5s) → `read` at the next agent step. On the frontend side, a real backend means one new adapter file plus a change to `getAdapter()` — but the backend side is real work (see Phase 6): the agent loop must emit a snapshot/event per step and must check-and-clear the steering-note queue before each next step. That is not covered by Phase 5 QA.
`src/data/toolToFloorMap.ts` holds the default tool→floor map (search_web/fetch_url/browse/retrieval → research; outline/plan/structure → drafting; write/compose/revise → writing; format/export/deliver → publish) and `resolveFloor(tool, currentFloor)` falling back to current floor, else drafting. Raw tool names surface only in the dev view.

## 5. Waypoints and movement

`src/data/worldLayout.ts` keeps world size, per-floor bands and props, and adds per work floor: `desk`, `door`, `stairs` points, plus a shared stair column x. `src/lib/agentMovementPath.ts` builds the leg list deterministically (no pathfinding):
`current position → door → stairs → each intermediate floor's stairs → destination stairs → destination door → destination desk`.
`useAgentMovement` walks legs at a brisk constant speed with a frame-stepped walk cycle (4 frames, ~10fps, flipped by direction), swaps to a `working` animation on arrival, and on a new `currentFloor` mid-transit re-plans from the actual visual position (never teleports, always settles on the latest confirmed floor). Reduced motion shortens travel to a fast slide but keeps location visible.

## 6. Floor-state rendering rules

| State | Lighting | Agent | Note input | Peek | Residue |
| --- | --- | --- | --- | --- | --- |
| idle | dim, desaturated, grayscale filter | absent | no | "The agent has not reached this room yet." | none |
| active | bright + warm glow pulse (off under reduced motion) | present/arriving + action label | yes | live partial output | prior residue if returning |
| done | fully lit, no pulse | absent | no | latest available output | category residue |

Residue is meaningful, never a checkmark: research → pinned source cards + paper stack; drafting → filled outline board + arranged stickies; writing → stacked draft pages with highlighted lines; publish → sealed package + sent stamp + "3 POSTS" tally board. During transit, the destination floor reads as transitioning-to-active with a "Moving to Writing" label. Dino Cabinet has no state, no agent, cooler dim palette, "OLD IDEAS BURIED HERE" sign, and is excluded from the legend/status hierarchy.

## 7. Mock event sequence

Research "Searching sources" → Research "Reading source material" → Research done / Drafting "Creating outline" → Drafting "Defining the core model" → Drafting done / Writing "Writing draft" → Writing "Refining draft" → Writing done / Publish "Preparing delivery" → Publish done, status `complete`. Steps every ~9s. Peek payloads grow with each step: research search terms + source cards; drafting headings + decisions; writing partial draft prose; publish delivery checklist + artifacts.

## 8. Phases

1. **Glance foundation** — remove workflow app; types, adapter + mock snapshot, world layout, AppShell, HQStatusRail, BuildingScene, five OfficeFloors with idle/active/done art and residue, static Agent-NPC and Player Avatar placeholders.
2. **Movement + live simulation** — waypoint path, `useAgentMovement`, walk/work frames, timed mock events, activity log accumulation, demo controls.
3. **Note + Peek** — Peek opens by clicking the floor / desk / floor label (no avatar required, so this phase does not depend on Phase 4), PeekPanel + PeekContentRenderer (safe rendering, JSON fallback), StickyNoteComposer (active floor only, 280 chars, counter, Cmd/Ctrl+Enter, Escape blurs), NotesReceipt with statuses and retry.
4. **Player avatar + Dino Cabinet** — WASD/arrow movement with collision, avatar-adjacency `[E]` as an *additional* Peek trigger over the existing click trigger, mobile d-pad, dino easter egg.
5. **Polish + QA** — reduced motion, responsive/mobile sheets, aria-live announcements, focus states, error/failed run states, Playwright pass with zero console errors.
6. **Real adapter wiring** — replace the mock with a live adapter (SSE/WebSocket/polling) plus the two required backend hooks: emit a run snapshot/event per agent step, and check-and-clear the steering-note queue before each next step. Includes snapshot normalization via `resolveFloor`, reconnect/backoff, and a debug view showing raw tool names. Not covered by Phase 5; budget separate backend time. Acceptance: real tool calls move the NPC to the correct floor, Peek shows real payloads, a note submitted mid-run reaches the agent and advances queued → delivered → read, disconnect shows a truthful "waiting/failed" status instead of a stale active floor.

Each phase ends with: what was built, files changed, acceptance criteria passing, manual test steps, known limits, deferrals.

## 9. Risks and assumptions

- Mock timings are a stand-in; real runs may burst updates — movement collapses stale transitions.
- Rapid backend flips could cause visual thrash; mitigated by re-planning from the live position and only marking a floor active when the snapshot says so.
- Walk frames come from a sourced, locally bundled CC0 spritesheet (Kenney or LPC-style, license-compatible, no share-alike), stepped with CSS `steps()` background offsets — not hand-pixeled from scratch and not AI-generated. Character components stay isolated so the sheet can be swapped later.
- Notes are optimistic in the UI but always reflect adapter-confirmed status, including failure.
- No backend, auth, or Cloud in this version; localStorage only for UI prefs, notes fallback, and demo state.

## 10. Acceptance criteria mapping

- Glance: at a distance, exactly one floor glows, holds the NPC, and shows an action label; idle floors dim; done floors lit with residue. No numeric progress exists anywhere in the DOM.
- Movement: floor change makes the NPC walk desk → door → stairs → stairs → door → desk with a visible walk cycle; never teleports; settles on the latest floor.
- Notes: composer exists only on the active floor; queued note appears instantly in the receipt and advances queued → delivered → read; floor change before submit disables it with the explanatory message.
- Peek: active/done floors show real mock partial output labeled "Live partial output"; unreached floors say the agent hasn't arrived; unknown payloads render via JSON fallback.
- Two characters: distinct sprites/palettes visible at once; player input never moves the NPC or changes floor state.
- Accessibility: keyboard-only Peek and note flow, Escape closes panels, aria-live announces moves and note status, reduced motion keeps state legible.
