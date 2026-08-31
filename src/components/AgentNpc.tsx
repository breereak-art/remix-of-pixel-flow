import { PixelCharacter } from "./PixelCharacter";
import type { AgentMode } from "@/hooks/useAgentMovement";

interface AgentNpcProps {
  innerRef: React.RefObject<HTMLDivElement | null>;
  mode: AgentMode;
  /** Screen-reader-only description of what the agent is doing. */
  description: string;
}

/**
 * The agent. Never accepts user input; its position comes from run state only.
 */
export function AgentNpc({ innerRef, mode, description }: AgentNpcProps) {
  return (
    <div
      ref={innerRef}
      className="hq-char hq-char-agent group"
      data-mode={mode}
      style={{ position: "absolute", left: 0, top: 0, zIndex: 42 }}
      tabIndex={0}
      role="img"
      aria-label={description}
    >
      <PixelCharacter outfit="#c8722a" outfitLight="#e79445" accent="#f2c94c" hair="#2b1d14" accessory="scarf" />
      <span className="hq-badge" aria-hidden>
        AGENT
      </span>
    </div>
  );
}
