# PROJECT: NEURO — Interactive Pixel-Art Workflow Workspace

A real, playable single-screen web app: a cutaway pixel-art office building where a worker character walks between floors, interacts with desks, completes workflow tasks, and drives project progress. Local-first (localStorage), no auth, no backend.

## 1. Architecture

- React + TypeScript on the existing TanStack Start template. Single route `/` (rewrite `src/routes/index.tsx`) with app-specific head metadata.
- Game world rendered as **DOM/CSS pixel art**, not Phaser or canvas. Reason: reliable, inspectable, responsive, keeps crisp pixels, avoids a heavy dependency and asset pipeline. Player position is driven by a `requestAnimationFrame` loop writing directly to a `transform` on a ref (no React re-render per frame); React state only updates on discrete events (floor change, zone enter/exit, interaction).
- World geometry (rooms, walls, obstacles, interaction zones, transition zones) lives in a plain data file so art and layout can be retuned without touching logic.
- All project state flows through a single reducer + context (`ProjectProvider`). Persistence is behind a `projectStorage` adapter interface so a Supabase adapter can replace localStorage later with no component changes.
- Workflow rules (progress, unlock, status derivation) live in a pure `workflowEngine` module — no progress values hardcoded after init.

## 2. Component tree

```text
routes/index.tsx
└── AppShell
    ├── TopStatusBar            room, objective, control hints
    ├── WorkflowSidebar         (drawer on mobile)
    │   ├── ProjectStatusCard   name, current step, segmented bar, "3 / 6"
    │   └── StageCard ×5        research, drafting, writing, publish, dino
    ├── GameScene               viewport, camera pan, rAF loop, input
    │   ├── OfficeFloor ×5      walls, furniture, lighting tint, status sign
    │   ├── PlayerCharacter     CSS sprite, 4 directions, idle/walk
    │   ├── InteractionPrompt   "Press E to use Drafting Desk"
    │   └── MobileControls      d-pad + interact button
    ├── ContextPanel            (bottom sheet on mobile)
    │   ├── StageDetail         desc, %, next action, task list, stage notes
    │   ├── NotesReceipt        newest-first, count, empty state
    │   └── NoteEditor          textarea, counter, save/edit
    ├── TaskModal               per-station checklist
    ├── CompletionModal         stage complete / PROJECT SHIPPED
    ├── SettingsMenu            rename project, export/import JSON, reset
    └── Toasts                  sonner, aria-live
```

Supporting: `hooks/useKeyboardMovement`, `hooks/useProject`, `hooks/useReducedMotion`; `lib/projectStorage`, `lib/workflowEngine`, `lib/collision`, `lib/helpers`; `data/worldLayout`, `data/initialProject`; `types/project`.

## 3. Data model

`Project { id, name, createdAt, updatedAt, currentStageId, stages[], notes[], settings }`
`WorkflowStage { id, number, title, description, status, prerequisiteStageId, tasks[], isOptional, floorId }`
`Task { id, stageId, title, completed, completedAt, order }`
`Note { id, content, workflowStageId, taskId|null, createdAt, updatedAt, archivedAt|null }`
`AppSettings { soundEnabled, reducedMotionOverride, hasSeenKeyboardHint, hasSeenFirstVisitMessages }`

Persisted stage status is derived, not stored raw: `completed` when all tasks done, `locked` when the prerequisite is incomplete, `active` for the first unlocked incomplete stage, `available` otherwise, `optional` for the Dino Cabinet. Seed: Research complete (100%), Drafting active (1/4 tasks → 25%), Writing/Publish empty, one seeded note. Overall progress = completed required stages counted against 6 milestone units, computed live from tasks.

Storage API: `loadProject`, `saveProject`, `resetProject`, `exportProjectJSON`, `importProjectJSON`, `seedProjectIfMissing`. Corrupt or unavailable storage falls back to in-memory state with a warning toast; import is schema-validated with readable errors.

## 4. World coordinate approach

One world space in virtual pixels, e.g. 640 wide × 1000 tall, scaled to fit with `image-rendering: pixelated` and integer-friendly scaling. Each floor is a horizontal band with its own y-range and interior tint.

```text
y 0    ┌ roof ──────────────────────────┐
       │ FLOOR 1  RESEARCH   [DONE]     │
 200   ├────────────────────────────────┤
       │ FLOOR 2  DRAFTING   [ACTIVE] ◄ player start
 400   ├────────────────────────────────┤
       │ FLOOR 3  WRITING    [IDLE]     │
 600   ├────────────────────────────────┤
       │ FLOOR 4  PUBLISH    [LOCKED]   │
 800   ├────────────────────────────────┤
       │ BASEMENT DINO CABINET          │
1000   └────────────────────────────────┘
```

Per floor the data declares: walkable band rect, obstacle rects (desks, shelves, cabinets, plants), one interaction zone per station (radius + label + stationId), and stair/door transition zones linking adjacent floors. Collision is axis-separated AABB (resolve x, then y) against the floor's obstacle list only — cheap and predictable. Depth ordering uses z-index bands so the player renders above the floor, behind tall props, and below UI. Camera translates the world container so the player's floor is centered; instant when reduced motion is on.

Movement: 130 px/s, normalized diagonals, four-direction facing, mirrored sprite for left/right, leg-step bob animation, soft shadow.

## 5. Build phases

- **Phase 1** — Shell, sidebar, context panel, types, storage layer, seed data, static building with all five floors and signs.
- **Phase 2** — Player, keyboard + touch movement, collision, floor transitions, camera, interaction prompts (temporary interaction messages only).
- **Phase 3** — Task modals, workflow engine, unlock chain, notes CRUD + archive, Dino Cabinet archive view, locked-room explanations, toasts, Project Shipped end state.
- **Phase 4** — Visual polish, motion, mobile refinement, accessibility pass, reduced motion, export/import, error states, full QA against acceptance criteria.

Each phase ends with a summary, assumptions, acceptance criteria now passing, and manual test steps.

## 6. Risks and assumptions

- Phaser is deliberately not used; DOM/CSS is the reliable path here. Geometry stays data-driven so a canvas or Phaser renderer could swap in later.
- Art is original CSS/SVG pixel composition, not sprite sheets — detail level will be stylized rather than photo-detailed reference art; components are structured so real sprites can replace them.
- Publish room monitors use original generic glyphs, no brand logos.
- "3 / 6" is treated as 6 milestone units across the four required stages; the seeded state reproduces 3/6 and then updates live from real task completion.
- Mobile: sidebar and context panel become a drawer and bottom sheet; the building pans vertically.
- localStorage may be blocked (private mode) — handled as an explicit degraded state.

## 7. Acceptance criteria → implementation

| # | Criterion | Where |
|---|---|---|
| 1 | Opens into the workspace | `routes/index.tsx` → AppShell (placeholder removed) |
| 2 | Premium pixel-art look | styles.css tokens + OfficeFloor art, Phase 4 polish |
| 3 | Five stages in left panel | WorkflowSidebar / StageCard |
| 4 | Research complete, Drafting active | `data/initialProject` + workflowEngine |
| 5 | WASD/arrows movement | useKeyboardMovement + GameScene rAF loop |
| 6 | No walking through walls/furniture | `lib/collision` vs worldLayout obstacles |
| 7 | Floor transitions | transition zones in worldLayout |
| 8 | Interaction prompt on approach | InteractionPrompt + zone proximity |
| 9 | E / click / tap opens task modal | GameScene input + TaskModal |
| 10 | Task checks persist | reducer → projectStorage |
| 11 | Drafting completes → Writing active | workflowEngine unlock chain |
| 12 | Writing completes → Publish active | workflowEngine unlock chain |
| 13 | Publish completes → Project Shipped | CompletionModal |
| 14 | Note create/edit/archive/view | NoteEditor + NotesReceipt |
| 15 | Notes persist | projectStorage |
| 16 | Archived notes in Dino Cabinet | Dino station view |
| 17 | Context panel follows stage/player | ContextPanel + StageDetail |
| 18 | Mobile touch controls | MobileControls + responsive layout |
| 19 | Export/import with validation | SettingsMenu + projectStorage |
| 20 | No dead controls or console errors | Phase 4 QA |
| 21 | Usable desktop and mobile | responsive pass |
| 22 | Art swappable later | data-driven world + isolated art components |
