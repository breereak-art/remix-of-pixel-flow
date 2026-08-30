import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProjectProvider, useProject } from "@/hooks/useProject";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GameScene } from "@/components/game/GameScene";
import { ProjectPanel } from "@/components/panels/ProjectPanel";
import { NotesPanel } from "@/components/panels/NotesPanel";
import { StageModal } from "@/components/StageModal";
import type { StageId } from "@/types/project";

const TITLE = "PROJECT: NEURO — Pixel-Art Workflow Workspace";
const DESCRIPTION =
  "Walk a pixel-art office building, work each desk, and push a writing project from research to publish in PROJECT: NEURO.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ProjectProvider>
      <Workspace />
    </ProjectProvider>
  );
}

function Workspace() {
  const { project, stageViews, shipped } = useProject();
  const reduced = useReducedMotion(project.settings.reducedMotionOverride);
  const [openStage, setOpenStage] = useState<StageId | null>(null);
  const active = stageViews.find((s) => s.status === "active");

  return (
    <main className="min-h-screen bg-background p-3 lg:p-5">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
        <header className="pixel-frame flex flex-wrap items-center justify-between gap-2 bg-card px-3 py-2">
          <h1 className="label-pixel text-[11px] text-primary">PROJECT: NEURO</h1>
          <p className="label-pixel text-[9px] text-idle">
            {shipped ? "PROJECT SHIPPED" : `OBJECTIVE — ${active?.nextAction ?? "Choose a station"}`}
          </p>
        </header>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <ProjectPanel onOpenStage={setOpenStage} />

          <section className="pixel-frame order-first h-[52vh] min-h-[360px] w-full bg-card lg:order-none lg:h-[76vh]">
            <GameScene
              stageViews={stageViews}
              animate={!reduced}
              modalOpen={openStage !== null}
              onEnterStation={setOpenStage}
            />
          </section>

          <NotesPanel />
        </div>
      </div>

      {openStage && <StageModal stageId={openStage} onClose={() => setOpenStage(null)} />}
    </main>
  );
}
