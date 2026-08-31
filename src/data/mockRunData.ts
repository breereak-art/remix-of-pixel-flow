import type { FloorState, PeekBlock, WorkFloorId } from "@/types/agentRun";

export interface MockStep {
  /** Backend tool name — developer view only, never shown to end users. */
  tool: string;
  floorId: WorkFloorId;
  /** Concise human label for the current action. */
  label: string;
  /** Floor state changes applied when this step starts. */
  states?: Partial<Record<WorkFloorId, FloorState>>;
  /** Peek blocks appended to the floor's payload when this step starts. */
  peek?: Partial<Record<WorkFloorId, PeekBlock[]>>;
  /** Marks the run complete after this step. */
  complete?: boolean;
}

export const MOCK_STEP_MS = 9000;

export const MOCK_STEPS: MockStep[] = [
  {
    tool: "search_web",
    floorId: "research",
    label: "Searching sources",
    states: { research: "active" },
    peek: {
      research: [
        {
          kind: "list",
          title: "Search terms",
          items: [
            "ai agent observability patterns",
            "long-running agent run ui",
            "streaming agent state to frontend",
          ],
        },
      ],
    },
  },
  {
    tool: "fetch_url",
    floorId: "research",
    label: "Reading source material",
    peek: {
      research: [
        {
          kind: "sources",
          title: "Sources read",
          items: [
            {
              title: "Designing for uncertain wait times",
              url: "https://example.com/uncertain-waits",
              summary:
                "Argues that showing what a system is doing beats showing how far along it claims to be, because the total is unknown.",
            },
            {
              title: "Streaming run state without lying",
              url: "https://example.com/streaming-run-state",
              summary: "Event-per-step transport, with the UI treating the last confirmed event as the only truth.",
            },
            {
              title: "Steering long agent runs mid-flight",
              url: "https://example.com/steering",
              summary: "Queued instructions read at step boundaries, never applied retroactively.",
            },
          ],
        },
      ],
    },
  },
  {
    tool: "outline",
    floorId: "drafting",
    label: "Creating outline",
    states: { research: "done", drafting: "active" },
    peek: {
      drafting: [
        {
          kind: "headings",
          title: "Working outline",
          items: [
            { level: 1, text: "HQ — watching an agent think" },
            { level: 2, text: "Glance: the building as status" },
            { level: 2, text: "Peek: real partial output" },
            { level: 2, text: "Steering: one short note" },
          ],
        },
      ],
    },
  },
  {
    tool: "plan",
    floorId: "drafting",
    label: "Defining the core model",
    peek: {
      drafting: [
        {
          kind: "list",
          title: "Key decisions",
          items: [
            "Floors are categories, so the agent may revisit any of them.",
            "No numeric progress: the number of tool calls is unknowable.",
            "Notes affect the next step only.",
          ],
        },
      ],
    },
  },
  {
    tool: "write",
    floorId: "writing",
    label: "Writing draft",
    states: { drafting: "done", writing: "active" },
    peek: {
      writing: [
        {
          kind: "markdown",
          text:
            "## What you see while it thinks\n\nA blank spinner tells you nothing about whether an agent is alive, stuck, or nearly finished. HQ answers the first question honestly and refuses to guess at the last one.\n\nThe building is a status display: one room is lit, the agent is in it, and a short label says what it is doing right now.",
        },
      ],
    },
  },
  {
    tool: "revise",
    floorId: "writing",
    label: "Refining draft",
    peek: {
      writing: [
        {
          kind: "markdown",
          text:
            "### Revision pass\n\nTightened the opening and cut the estimate language entirely. Every remaining time reference is elapsed, never predicted.",
        },
        { kind: "list", title: "Sections in progress", items: ["Opening — revised", "Steering notes — drafting", "Delivery — pending"] },
      ],
    },
  },
  {
    tool: "deliver",
    floorId: "publish",
    label: "Preparing delivery",
    states: { writing: "done", publish: "active" },
    peek: {
      publish: [
        {
          kind: "list",
          title: "Delivery checklist",
          items: ["Draft finalized", "Assets packaged", "Delivery targets prepared"],
        },
      ],
    },
  },
  {
    tool: "export",
    floorId: "publish",
    label: "Sending final package",
    complete: true,
    states: { publish: "done" },
    peek: {
      publish: [
        { kind: "text", text: "Package sent. Three deliveries prepared from the final draft." },
        {
          kind: "links",
          title: "Prepared artifacts",
          items: [
            { label: "hq-product-brief.md", url: "https://example.com/hq-product-brief.md" },
            { label: "hq-summary.txt", url: "https://example.com/hq-summary.txt" },
          ],
        },
      ],
    },
  },
];
