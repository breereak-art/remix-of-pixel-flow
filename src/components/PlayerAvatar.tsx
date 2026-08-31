import { PixelCharacter } from "./PixelCharacter";

interface PlayerAvatarProps {
  innerRef: React.RefObject<HTMLDivElement | null>;
}

/** Optional human-controlled avatar. Never represents agent status. */
export function PlayerAvatar({ innerRef }: PlayerAvatarProps) {
  return (
    <div
      ref={innerRef}
      className="hq-char hq-char-player"
      data-mode="idle"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 41 }}
      role="img"
      aria-label="You — the visitor avatar"
    >
      <PixelCharacter outfit="#215b6b" outfitLight="#2f7f92" accent="#6fe3d2" hair="#1b2028" accessory="marker" />
      <span className="hq-badge hq-badge-player" aria-hidden>
        YOU
      </span>
    </div>
  );
}
