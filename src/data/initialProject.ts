import type { Project, StageId, Task, WorkflowStage } from "@/types/project";

export const STORAGE_KEY = "neuro.project.v1";
export const PROJECT_SCHEMA_VERSION = 1;

const now = () => new Date().toISOString();

function makeTasks(stageId: StageId, titles: string[], completedCount = 0): Task[] {
  return titles.map((title, index) => ({
    id: `${stageId}-task-${index + 1}`,
    stageId,
    title,
    completed: index < completedCount,
    completedAt: index < completedCount ? now() : null,
    order: index,
  }));
}

export function createSeedStages(): WorkflowStage[] {
  return [
    {
      id: "research",
      number: 1,
      title: "RESEARCH",
      description: "Gather info and understand the problem.",
      detail: "Collect the raw material the whole project stands on.",
      nextAction: "Review your findings at the research desk.",
      stationLabel: "Research Desk",
      prerequisiteStageId: null,
      isOptional: false,
      floorId: "floor-research",
      tasks: makeTasks("research", ["Understand the problem", "Gather source material", "Define target audience"], 3),
    },
    {
      id: "drafting",
      number: 2,
      title: "DRAFTING",
      description: "Outline, structure and plan the content.",
      detail: "Turn research into a structured outline.",
      nextAction: "Complete the project outline at the drafting desk.",
      stationLabel: "Drafting Desk",
      prerequisiteStageId: "research",
      isOptional: false,
      floorId: "floor-drafting",
      tasks: makeTasks(
        "drafting",
        ["Define audience", "Create content structure", "Add key arguments", "Add one example scenario"],
        1,
      ),
    },
    {
      id: "writing",
      number: 3,
      title: "WRITING",
      description: "Write the first complete draft.",
      detail: "Get every section out of the outline and onto the page.",
      nextAction: "Write the first full draft at the writing desk.",
      stationLabel: "Writing Desk",
      prerequisiteStageId: "drafting",
      isOptional: false,
      floorId: "floor-writing",
      tasks: makeTasks("writing", [
        "Write first draft",
        "Improve clarity",
        "Add supporting details",
        "Review for completeness",
      ]),
    },
    {
      id: "publish",
      number: 4,
      title: "PUBLISH",
      description: "Create the 3 posts and publish.",
      detail: "Package the work and ship it to your channels.",
      nextAction: "Build and ship the three posts at the publish desk.",
      stationLabel: "Publish Desk",
      prerequisiteStageId: "writing",
      isOptional: false,
      floorId: "floor-publish",
      tasks: makeTasks("publish", ["Create post 1", "Create post 2", "Create post 3", "Mark as published"]),
    },
    {
      id: "dino",
      number: 0,
      title: "DINO CABINET",
      description: "Optional archive. Doesn't affect the workflow.",
      detail: "Old ideas buried here. Archived notes rest in this basement.",
      nextAction: "Dig through archived notes whenever you want.",
      stationLabel: "Dino Cabinet",
      prerequisiteStageId: null,
      isOptional: true,
      floorId: "floor-basement",
      tasks: [],
    },
  ];
}

export function createSeedProject(): Project {
  const timestamp = now();
  return {
    id: `neuro-${Math.random().toString(36).slice(2, 10)}`,
    name: "PROJECT: NEURO",
    createdAt: timestamp,
    updatedAt: timestamp,
    currentStageId: "drafting",
    stages: createSeedStages(),
    notes: [
      {
        id: "seed-note-1",
        content: "Focus more on risk engine. Add example trade scenario.",
        workflowStageId: "drafting",
        taskId: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        archivedAt: null,
      },
    ],
    settings: {
      soundEnabled: false,
      reducedMotionOverride: null,
      hasSeenKeyboardHint: false,
      hasSeenFirstVisitMessages: false,
    },
  };
}
