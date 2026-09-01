import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

const TITLE = "HQ — Watch an AI agent work, floor by floor";
const DESCRIPTION =
  "HQ shows what an AI agent is actually doing while it thinks: a pixel-art building where the agent walks between Research, Drafting, Writing and Publish.";

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
  return <AppShell />;
}
