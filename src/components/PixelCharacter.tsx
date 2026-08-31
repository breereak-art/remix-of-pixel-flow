import { CHAR_H, CHAR_W } from "@/data/worldLayout";

export interface PixelCharacterProps {
  /** Outfit colors keep the two characters unmistakably distinct. */
  outfit: string;
  outfitLight: string;
  accent: string;
  hair: string;
  skin?: string;
  /** Optional accessory: agent wears a scarf, player wears a headset dot. */
  accessory?: "scarf" | "marker" | "none";
  label?: string;
}

/**
 * Frame-consistent CSS sprite. The four walk frames are described declaratively
 * in styles.css and driven by the `data-frame` attribute the movement hooks
 * write directly to the DOM, so the walk cycle is genuinely frame-stepped
 * rather than interpolated. Both characters share this component so the
 * placeholder art can be swapped for a bundled spritesheet later.
 */
export function PixelCharacter({
  outfit,
  outfitLight,
  accent,
  hair,
  skin = "#e8b98d",
  accessory = "none",
  label,
}: PixelCharacterProps) {
  return (
    <div
      className="hq-char-art"
      style={
        {
          width: CHAR_W,
          height: CHAR_H,
          ["--outfit" as string]: outfit,
          ["--outfit-light" as string]: outfitLight,
          ["--accent" as string]: accent,
          ["--hair" as string]: hair,
          ["--skin" as string]: skin,
        } as React.CSSProperties
      }
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <span className="hq-shadow" />
      <span className="hq-body">
        <span className="hq-arm hq-arm-back" />
        <span className="hq-leg hq-leg-back" />
        <span className="hq-leg hq-leg-front" />
        <span className="hq-torso" />
        {accessory === "scarf" && <span className="hq-scarf" />}
        {accessory === "marker" && <span className="hq-marker" />}
        <span className="hq-head">
          <span className="hq-hair" />
          <span className="hq-eye" />
        </span>
        <span className="hq-arm hq-arm-front" />
      </span>
    </div>
  );
}
