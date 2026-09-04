# Remix of Pixel Flow

You are the lead product designer, senior frontend engineer, game UI engineer, and QA engineer for this project.

I am building a polished browser-based interactive productivity experience called:

PROJECT: NEURO

Use the attached reference image as the primary visual direction.

IMPORTANT:

This must be a real, functioning interactive web application—not a static landing page, fake dashboard, slideshow, or decorative mockup.

The core experience is a 2D pixel-art vertical office building where a user controls a small worker character. The user walks through office floors, approaches workstations, interacts with them, completes workflow steps, saves notes, and sees project progress update in real time.

The product should feel like:

- A premium indie pixel-art management game

- A focused creative-work operating system

- A visual project workflow dashboard

- A clean, modern, high-polish SaaS product beneath the pixel-art layer

Do not use copyrighted game assets, copyrighted logos, copied artwork, or external assets without clear safe use.

Use original CSS pixel-art styling, procedural UI shapes, original simple vector/rectangle assets, and placeholders that can be replaced later.

==================================================

1. PRODUCT PURPOSE

==================================================

Project: Neuro is a gamified project-execution workspace.

The user moves a character between office departments that represent a workflow:

1. Research

2. Drafting

3. Writing

4. Publish

The user’s goal is to progress a project from research through publication. Walking to a department gives the workflow a physical, memorable interface instead of using a normal checklist alone.

The first release should be single-user and local-first:

- No authentication is required for the first playable version.

- Persist all data in browser localStorage.

- Build the architecture so Supabase can be added later.

- Include a clean abstraction layer for storage functions.

- Do not add payments, teams, or collaboration in version one.

The main user action:

The user navigates the worker character to the currently active office station, presses an interaction button, completes a task, and advances project progress.

==================================================

2. TARGET USER

==================================================

Primary user:

A solo creator, student, founder, writer, researcher, or AI-builder who wants a fun visual system for moving a project through stages.

User needs:

- See the current stage at a glance

- Know what to do next

- Capture project notes quickly

- Complete small workflow tasks

- Feel visible momentum and progress

- Avoid a cluttered corporate dashboard

==================================================

3. CORE EXPERIENCE

==================================================

Build a full-screen responsive web application.

Desktop experience:

- Main visual focus is the large central pixel-art cutaway building.

- Left panel shows the workflow and stage progress.

- Right panel contains notes or contextual interactions.

- The building remains visible and interactive at all times.

- Keyboard movement works when the user is not focused inside an input or modal.

- The experience should feel smooth, deliberate, and game-like.

Mobile/tablet experience:

- Preserve the core functionality.

- Show a compact workflow header.

- Use an on-screen directional pad / touch controls.

- Make notes available from a slide-over drawer or bottom sheet.

- Avoid tiny unreadable text.

- The building can scroll or pan vertically when necessary.

- Do not merely shrink the desktop layout until it becomes unusable.

==================================================

4. VISUAL DIRECTION

==================================================

Use the attached image as visual inspiration, but do not recreate it pixel-for-pixel.

Art direction:

- Detailed 2D pixel art

- Vertical cross-section / dollhouse office building

- Dark charcoal exterior frame

- Warm amber interior lights

- Muted olive and green office walls

- Deep navy, black, charcoal, slate, and brown furniture

- Blue daytime sky behind the building

- Soft clouds and distant muted city skyline

- Moody, cozy, slightly cyberpunk but not neon-heavy

- Subtle film-grain / texture effect if performance remains good

- Crisp pixels; never blurry image scaling

- Strong contrast between active, complete, idle, and locked states

- The app must look premium, intentional, and like a designed game interface

Pixel styling:

- Use CSS `image-rendering: pixelated` where appropriate.

- Avoid glassmorphism.

- Avoid excessive rounded cards.

- Avoid generic gradients, generic SaaS blobs, and giant hero text.

- Avoid a plain white or light background.

- Avoid emojis as interface icons.

- Use icons from a consistent icon library only if needed.

- Use a condensed / mono / pixel-inspired typography treatment for labels where practical.

- Maintain readable fallback fonts for body copy.

Suggested palette:

- Exterior charcoal: #15191D

- Deep charcoal: #20252B

- Steel gray: #3D464D

- Olive wall: #526046

- Dark olive: #35402E

- Warm wood: #6A4B2C

- Amber lamp light: #D4A24C

- Bright active yellow: #F2C94C

- Complete green: #74D66A

- Inactive gray: #8A969F

- Drafting amber: #FFCA3A

- Writing blue: #42A5F5

- Publish purple: #B56BFF

- Danger/archive red: #E35B5B

- Sky blue: #2875B9

- Cream UI text: #F3E7C6

Use subtle shadows, inner borders, chunky 1–2px pixel-style strokes, and slight noise/texture.

==================================================

5. APP LAYOUT

==================================================

Build a primary application screen with these regions:

A. LEFT WORKFLOW PANEL

B. CENTER BUILDING / GAME CANVAS

C. RIGHT CONTEXT PANEL

D. MODALS / DRAWERS / TOASTS

E. OPTIONAL COMPACT BOTTOM STATUS BAR ON SMALL SCREENS

The layout must be responsive and must not overlap important controls.

--------------------------------------------------

A. LEFT WORKFLOW PANEL

--------------------------------------------------

Place a persistent left-side panel on desktop.

Top project card:

- Header: “PROJECT: NEURO”

- Current Step label

- Current step name and number

- Example:

  Current Step:

  2. DRAFTING

- Progress label

- Pixel-style segmented progress bar

- Numeric progress format: “3 / 6”

- A small project status indicator

- Project title should be editable from a settings menu, but initially display “PROJECT: NEURO”

Workflow stages below the top project card:

1. Research

2. Drafting

3. Writing

4. Publish

0. Dino Cabinet

Each workflow stage card should include:

- Number badge

- Stage title

- Short description

- Visual status

- Small icon or status mark

- State-aware styling

Exact labels:

1. RESEARCH

   Description: “Gather info and understand the problem.”

2. DRAFTING

   Description: “Outline, structure and plan the content.”

3. WRITING

   Description: “Write the first complete draft.”

4. PUBLISH

   Description: “Create the 3 posts and publish.”

0. DINO CABINET

   Description: “Optional archive. Doesn’t affect the workflow.”

Required stage states:

- Complete: green checkmark and subdued completed card

- Active: bright highlighted border and a left/right arrow indicator pointing toward the building

- Available: normal visible card

- Locked: darkened, disabled-looking card with lock indicator

- Optional: red-accent archive card, never blocks workflow

Initial demo state:

- Research: complete

- Drafting: active

- Writing: available but not active

- Publish: locked

- Dino Cabinet: optional and available

- Progress display: 3 / 6

Clicking a stage card should:

- Focus the related floor or room in the building

- Show its detail panel in the right panel

- Not mark it complete by itself

--------------------------------------------------

B. CENTER BUILDING / GAME AREA

--------------------------------------------------

Create a large vertically stacked, cutaway office building with five levels:

Floor 1, top:

Research Office

Status: completed

Floor 2:

Drafting Office

Status: active

Floor 3:

Writing Office

Status: idle or available

Floor 4:

Publish Office

Status: idle or locked depending on current workflow

Basement:

Dino Cabinet / Archive

Status: optional

Building requirements:

- The building is framed by dark industrial beams.

- Each floor has a distinct interior color tint.

- Each floor contains furniture and work-related visual detail.

- Use CSS/HTML compositional pixel art if a game canvas is difficult.

- If technically feasible, use Phaser 3 in a React integration for the movement zone.

- If Phaser integration is unstable in the Lovable environment, build an HTML/CSS/React simulation with a coordinate-based player movement system. Functionality and reliability matter more than using a specific engine.

- Do not block the build waiting for a full art engine.

- The character must genuinely move around visible office floor areas.

- The player must not walk through clearly defined desk, wall, shelf, cabinet, or exterior boundaries.

- Keep collision logic simple, predictable, and robust.

Floor content:

Research Office:

- Greenish wall tone

- Door

- Bookshelf with books and binders

- Research board / schematic board

- Desk and computer

- Plant

- Stack of completed research papers

- A visible “DONE” sign above or within the floor

- Green check visual

Drafting Office:

- Warm amber lighting

- Active player starting position at the main drafting desk

- Drafting desk with computer

- Yellow notepad / papers

- Planning board with sticky notes

- Filing shelf

- A small side workstation

- Visible “ACTIVE” sign

- Strong gold/yellow visual emphasis

- This is the starting active floor

Writing Office:

- Cooler, dimmer blue-gray lighting

- Door

- Multiple computers / writing desks

- Wall board

- Clock

- Bookshelf or cabinet

- Visible “IDLE” sign initially

- Should become active after Drafting is completed

Publish Office:

- Dark purple/indigo lighting

- Content creation or publishing workstation

- Three small platform-like monitor placeholders with original generic glyphs; do not use brand logos

- A board labeled “3 POSTS”

- Checklist visual

- Visible “IDLE” or “LOCKED” sign initially

- Should become active after Writing is completed

Dino Cabinet basement:

- Dark warm brown/red lighting

- Archive storage boxes

- Fossil/skeleton-inspired original decorative shapes

- Sign: “OLD IDEAS BURIED HERE”

- Hazard/utility door

- This area is optional and does not advance the main progress

- Entering it can reveal archived notes or a playful empty-state message

Use layers so the player correctly appears:

- Behind tall foreground furniture when appropriate

- In front of desks or objects where appropriate

- Above the floor

- Below top UI overlays

Character requirements:

- Small dark-haired worker

- Dark clothing

- Original non-copyrighted sprite or CSS pixel-art avatar

- Readable at small sizes

- Has idle and walking states

- Uses walking animation or a convincing bobbing/leg-step simulation

- Moves in four directions

- Faces the direction of travel

- Can use a mirrored horizontal sprite for left/right

- Has a soft small shadow underneath

- Has a subtle active ring or indicator only when needed for visibility

- Starts sitting/standing near the Drafting desk, but once the user presses a movement key, transitions into normal walking mode

Camera/viewport behavior:

- On desktop, keep the entire building mostly visible where possible.

- If the building is taller than the viewport, allow gentle camera/pan behavior with the player.

- When the player changes floors, smoothly pan to keep them centered.

- Clicking a workflow stage smoothly pans/focuses its room.

- Respect reduced-motion preferences.

--------------------------------------------------

C. RIGHT CONTEXT PANEL

--------------------------------------------------

Create a right-side contextual panel.

Default state:

- Top card titled “NOTES RECEIPT”

- Short helper text: “Notes you add stay here.”

- Notes list below with empty state if no notes exist

- A note count

Active task state:

- Show an “ADD NOTE” panel/card

- Close button

- Multiline note textarea

- Example placeholder:

  “Focus more on risk engine. Add example trade scenario.”

- Character counter

- Save/send button

- Entering text and clicking Send must save the note locally

- After saving, show a success toast and add it to Notes Receipt

- Each note stores:

  - id

  - content

  - createdAt

  - workflowStage

  - optional taskId

  - archived boolean

When a floor or desk is selected:

- Display the stage name

- Display the stage description

- Display completion percentage

- Display a concise “next action”

- Display relevant task checklist

- Display notes attached to that stage

- Include an “Add note” action

Example Drafting content:

Title: DRAFTING

Description: “Turn research into a structured outline.”

Next action: “Complete the project outline at the drafting desk.”

Tasks:

- Define audience

- Create content structure

- Add key arguments

- Add one example scenario

The right panel should update based on where the player is and what workstation they interact with.

--------------------------------------------------

D. TOP / BOTTOM STATUS

--------------------------------------------------

Create a minimal unobtrusive status display:

- Current room

- Current objective

- Interaction hint, such as:

  “Move: WASD / Arrow Keys”

  “Interact: E”

- If an interaction zone is near:

  “Press E to use Drafting Desk”

- On mobile:

  “Tap the desk” or a clear interact button

Never let this cover the player or important UI.

==================================================

6. GAMEPLAY AND MOVEMENT

==================================================

This must be functional.

Controls:

Desktop:

- W / A / S / D

- Arrow keys

- E to interact

- Escape closes modal, drawer, or active panel

- N opens the notes panel if practical

- Tab must remain usable for accessibility; do not hijack browser accessibility navigation

Mobile:

- On-screen directional control

- Visible interaction button when near a station

- Tap interaction zones as a secondary way to interact

Movement requirements:

- Four-direction movement

- Smooth movement at a controlled speed, roughly 100–160 pixels per second

- Normalize diagonal movement so diagonal movement is not faster

- Collision with walls, desks, bookcases, cabinets, floor edges, and large props

- No clipping through furniture

- Character stays inside the active building playable area

- Doors/stairs/elevators/transition points move the character to another floor

- Use gentle transitions rather than abrupt page navigation

- Movement must not trigger while the user is typing in a textarea/input or while a modal is open

- Provide a keyboard help tooltip or small hint

Create invisible interaction zones around:

- Research Desk

- Drafting Desk

- Writing Desk

- Publish Desk

- Dino Cabinet archive point

- Stairs/doors between each floor

Interaction behavior:

- When player enters range, show a contextual interaction prompt

- User presses E or clicks/taps the prompt

- Open a task/work modal

- The modal allows completion of one or more tasks

- Completing tasks updates progress, stage state, building sign, left workflow panel, and contextual panel

==================================================

7. WORKFLOW LOGIC

==================================================

Implement a fully functional demo workflow.

Stages:

1. Research

2. Drafting

3. Writing

4. Publish

0. Dino Cabinet optional archive

Initial seeded project state:

- projectName: “PROJECT: NEURO”

- currentStage: “drafting”

- completedStages: [“research”]

- researchProgress: 100

- draftingProgress: 25

- writingProgress: 0

- publishProgress: 0

- overallProgress: 3 / 6 displayed visually

- notes: include one seeded example note:

  “Focus more on risk engine. Add example trade scenario.”

- firstVisit messages: enabled

Task model:

Research tasks:

- Understand the problem

- Gather source material

- Define target audience

- Research is seeded as complete for demo purposes

Drafting tasks:

- Define audience

- Create the outline

- Organize sections

- Add an example scenario

Writing tasks:

- Write first draft

- Improve clarity

- Add supporting details

- Review for completeness

Publish tasks:

- Create post 1

- Create post 2

- Create post 3

- Mark as published

For a lightweight first version:

- Each task has a checkbox.

- Task completion persists to localStorage.

- When a stage reaches 100%, show an optional completion animation and success state.

- Stage completion unlocks the next stage.

- Completing Drafting makes Writing active.

- Completing Writing makes Publish active.

- Completing Publish shows a final “Project shipped” victory/state panel.

- Dino Cabinet never affects required progression.

- A user may revisit completed stages and add notes.

- A user may uncheck a task; if this makes a stage incomplete, progression status should update safely and visibly.

- Confirm before resetting all project data.

Overall progress:

- Display a clear segmented progress bar and numerical progress.

- Compute progress from real task completion but preserve the seeded initial visual state in a logical way.

- Do not hardcode progress after task interaction.

- Clearly show whether progress is based on stages or task count.

Stage statuses:

- completed

- active

- available

- locked

- optional

Do not let a locked stage be completed until prerequisites are satisfied.

If a user clicks or walks into a locked area, show a helpful explanation:

“Finish the previous stage to unlock this office.”

==================================================

8. MODALS AND TASK FLOWS

==================================================

Create an interaction modal for each main station.

Modal visual style:

- Pixel-art dark panel

- Warm paper/card interior where appropriate

- Clear title

- Task checklist

- Progress indicator

- Add note action

- Cancel/close button

- Complete/continue button

- Keyboard-accessible focus management

- Escape to close

- Do not trap the user without an exit

Drafting desk modal example:

Title: “Drafting Desk”

Subtitle: “Turn research into a usable structure.”

Checklist:

- Define audience

- Create content structure

- Add key arguments

- Add one example scenario

Actions:

- Add note

- Save progress

- Close

On completion:

- Mark appropriate tasks complete

- Update progress

- If stage becomes complete:

  - Play a subtle green/gold completion effect

  - Change office sign from ACTIVE to DONE

  - Update left panel state

  - Unlock Writing

  - Move active marker to Writing

  - Show toast:

    “Drafting complete. Writing is now active.”

Writing desk completion:

- Unlock Publish

Publish desk completion:

- Show final celebration overlay:

  “PROJECT SHIPPED”

  “You moved Project: Neuro from research to publish.”

- Include:

  - Review project button

  - Start new project/reset demo button

  - Continue exploring button

==================================================

9. NOTES SYSTEM

==================================================

Build a real notes feature.

Requirements:

- Users can add a note from any stage

- Users can associate notes with the current stage

- Notes save to localStorage

- Notes remain after refresh

- Notes Receipt shows all non-archived notes in newest-first order

- A stage detail view filters notes to that stage

- Users can edit a note

- Users can archive a note

- Archive action requires confirmation

- Dino Cabinet displays archived notes

- Provide empty states

- Preserve line breaks in note display

- Show relative time where practical, with accessible full timestamps

Seed this note at first load:

“Focus more on risk engine. Add example trade scenario.”

==================================================

10. DATA MODEL AND STORAGE

==================================================

Use TypeScript types and a dedicated data layer.

Create types equivalent to:

Project:

- id

- name

- createdAt

- updatedAt

- currentStageId

- stages

- notes

- settings

WorkflowStage:

- id

- number

- title

- description

- status

- prerequisiteStageId

- tasks

- isOptional

- floorId

Task:

- id

- stageId

- title

- completed

- completedAt

- order

Note:

- id

- content

- workflowStageId

- taskId nullable

- createdAt

- updatedAt

- archivedAt nullable

AppSettings:

- soundEnabled

- reducedMotionOverride nullable

- hasSeenKeyboardHint

- hasSeenFirstVisitMessages

Create localStorage functions:

- loadProject()

- saveProject(project)

- resetProject()

- exportProjectJSON()

- importProjectJSON()

- seedProjectIfMissing()

Requirements:

- Validate imported JSON and show user-friendly errors.

- Never crash if localStorage is unavailable or corrupt.

- Fall back to in-memory state with a warning toast if persistence fails.

- Include an export/import option in a small settings menu.

- Keep persistence logic isolated so a future Supabase adapter can replace it.

==================================================

11. TECHNICAL REQUIREMENTS

==================================================

Use:

- React

- TypeScript

- Tailwind CSS or a clean CSS architecture compatible with this environment

- Lucide icons only where non-pixel icons are necessary

- Local state management using React state/context or a lightweight store

- localStorage persistence

- No backend needed in the first version

Preferred implementation:

- Build a reusable game scene component.

- Use coordinate-based movement and collision rectangles.

- Maintain a simple world coordinate system.

- Define rooms, walls, obstacles, transition zones, and interaction zones in data.

- Keep all game geometry configurable.

- Use `requestAnimationFrame` only if needed and clean it up correctly.

- Avoid memory leaks and runaway event listeners.

- Do not use a heavy dependency if a simple reliable implementation is enough.

- If using a `<canvas>`, implement responsive scaling carefully and preserve crisp pixels.

- If using DOM elements for the game world, use transforms for player movement and avoid excessive rerenders on every animation frame.

- Support `prefers-reduced-motion`.

- Use semantic HTML and ARIA labels for interactive controls.

- All buttons must have text or accessible labels.

- Ensure keyboard focus is visible.

- Ensure contrast is reasonable despite dark styling.

Do not:

- Use fake buttons.

- Use static progress values after the app initializes.

- Use placeholder logic that says “coming soon.”

- Make the character decorative only.

- Implement untested page navigation instead of floor movement.

- Require a database, API key, or third-party account for the core demo.

- Use any proprietary branded social-media logos in the Publish room.

- Build a generic landing page instead of the application.

==================================================

12. COMPONENT ARCHITECTURE

==================================================

Use a modular structure equivalent to:

src/

  components/

    AppShell

    WorkflowSidebar

    ProjectStatusCard

    StageCard

    GameScene

    OfficeFloor

    PlayerCharacter

    CollisionLayer

    InteractionPrompt

    ContextPanel

    NotesReceipt

    NoteEditor

    StageDetail

    TaskModal

    CompletionModal

    SettingsMenu

    MobileControls

    Toasts

  data/

    worldLayout

    initialProject

  hooks/

    useKeyboardMovement

    useLocalStorageProject

    useReducedMotion

  lib/

    projectStorage

    workflowEngine

    collision

    helpers

  types/

    project

Use clear names and avoid one giant component file.

==================================================

13. REQUIRED STATES

==================================================

Implement and visually test these states:

- First visit

- Default seeded demo state

- Player moving

- Player idle

- Player near workstation

- Player interacting with workstation

- Research complete

- Drafting active

- Drafting complete

- Writing unlocked and active

- Publish locked

- Publish unlocked and active

- Project fully shipped

- Note empty state

- Note saved state

- Note editing state

- Note archived state

- Dino Cabinet archive state

- LocalStorage unavailable/failure state

- Imported JSON valid state

- Imported JSON invalid state

- Mobile controls visible

- Reduced motion mode

- Small desktop height / vertical scrolling state

==================================================

14. ACCESSIBILITY AND QUALITY

==================================================

Accessibility:

- Do not make keyboard controls inaccessible.

- Allow controls and buttons to be reached with Tab.

- Provide visible focus styles.

- Use aria-live for key workflow state changes and toast announcements.

- Respect `prefers-reduced-motion`.

- Provide an alternate way to interact by clicking/tapping workstations.

- Ensure modals can be closed with Escape and by an explicit Close button.

- Ensure text is readable and not only conveyed by color.

Quality:

- No console errors.

- No broken imports.

- No dead buttons.

- No horizontal overflow on standard mobile widths.

- No important UI hidden behind other UI.

- No accidental text selection during D-pad usage.

- No page scrolling while using arrow keys for movement in the active game area, unless the user is focused in a text input.

- Include helpful empty, loading, and error states even though local mode is fast.

==================================================

15. ACCEPTANCE CRITERIA

==================================================

The build is complete only when all of the following are true:

1. The app opens directly into the Project: Neuro interactive workspace.

2. The screen visually resembles a premium pixel-art vertical office workflow experience.

3. The left workflow panel shows Research, Drafting, Writing, Publish, and Dino Cabinet.

4. Research starts as complete and Drafting starts as active.

5. The player character is visible and can walk using WASD and arrow keys.

6. The character cannot walk through major walls and furniture.

7. The character can move between office floors through transition zones.

8. Approaching a desk shows a real interaction prompt.

9. Pressing E or clicking/tapping the prompt opens a functional task modal.

10. Checking tasks updates task progress and persists after page refresh.

11. Completing Drafting unlocks and activates Writing.

12. Completing Writing unlocks and activates Publish.

13. Completing Publish shows a Project Shipped completion state.

14. Users can create, edit, archive, and view notes.

15. Notes persist after refresh.

16. Archived notes can be viewed in Dino Cabinet.

17. The right context panel updates based on selected/current stage.

18. Mobile layout contains usable touch movement and interaction controls.

19. Export and import project JSON work with basic validation.

20. There are no fake controls, dead buttons, or console errors.

21. The app remains usable at desktop and mobile screen sizes.

22. The implementation is modular enough to replace placeholder art with final sprites later.

==================================================

16. DELIVERY PROCESS

==================================================

Do not immediately write the entire application in one unreviewed pass.

First, respond with:

1. A concise architecture plan

2. The proposed component tree

3. The data model

4. The world/room coordinate approach

5. The build phases

6. Risks or assumptions

7. A checklist mapping each acceptance criterion to a planned implementation

Then wait for approval.

After approval, build in these phases only:

Phase 1:

- Responsive application shell

- Left workflow panel

- Right context panel

- Initial data model

- localStorage persistence

- Seed data

- Basic building visual layout

- No final animation yet

Phase 2:

- Player character

- Keyboard and mobile movement

- Collision boundaries

- Floor transitions

- Player camera/focus behavior

- Interaction prompts

Phase 3:

- Task modals

- Workflow progression logic

- Notes creation/editing/archiving

- Dino Cabinet archive display

- Completion states

Phase 4:

- Visual polish

- Pixel-art effects

- Responsive refinements

- Accessibility pass

- Reduced motion

- Export/import

- Error states

- Final QA

At the end of each phase:

- Summarize exactly what was built

- List any assumptions

- Confirm which acceptance criteria now pass

- List manual tests I should perform

- Fix any discovered errors before moving to the next phase

Start now by producing the plan only. Do not build until I explicitly approve the plan.

Proceed with Phase 2 only.

Implement the actual playable character system. It must include keyboard movement with WASD and Arrow keys, mobile touch controls, four-direction player orientation, an idle/walk visual state, collision with walls and furniture, desk interaction ranges, floor transition zones, and a contextual “Press E to interact” prompt.

Important:

- Do not move the character while an input, textarea, or modal has focus.

- Prevent arrow keys from scrolling the page when the playable scene has focus.

- Keep Tab navigation functional.

- Clicking or tapping an interaction zone must also work as an alternative to E.

- Use configurable world data for obstacles and zones.

- Test collision boundaries carefully.

- Keep the player inside the active playable areas.

Do not start Phase 3 task progression yet. Use temporary interaction messages only where required to validate the system.

When finished, provide:

1. manual movement test plan

2. all collision/interactions implemented

3. known limitations

4. confirmation of no console errors

Proceed with Phase 3 only.

Replace temporary interactions with the full workflow engine, task modals, notes functionality, progression logic, and end-state.

Implement:

- Working station task modals

- Persistent task checkboxes

- Accurate stage progress

- Drafting completion unlocks Writing

- Writing completion unlocks Publish

- Publish completion triggers Project Shipped modal

- Add, edit, archive, and filter notes

- Notes Receipt updated newest-first

- Dino Cabinet shows archived notes

- Helpful locked-stage explanations

- Status updates in left panel, room signs, and right context panel

- Toast feedback for saves, completions, errors, imports, and resets

All actions must persist across refresh.

Provide specific manual test steps for:

- Completing each stage

- Refreshing after progress changes

- Creating/editing/archiving notes

- Viewing archived notes

- Trying to use a locked room

- Finishing the project

Proceed with Phase 4 only.

Perform a polish, responsive, accessibility, and QA pass.

Improve:

- Pixel-art visual hierarchy

- Motion and transition quality

- Character walk feel

- Lighting and office detail

- Stage state readability

- Mobile layout

- Touch controls

- Reduced-motion behavior

- Keyboard focus states

- ARIA labels and aria-live announcements

- Empty, error, and persistence-failure states

- JSON export/import with validation

- Settings menu

- Final project reset confirmation flow

Run through every acceptance criterion from the master specification.

Fix all console errors, broken behavior, layout overflow, dead controls, and state persistence issues.

At the end, provide:

1. final implemented feature list

2. final acceptance-criteria checklist with pass/fail status

3. manual QA checklist

4. recommended next upgrades, separated into “high impact” and “nice to have”

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b694853b-ea28-4212-a151-e27f4239a738).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
