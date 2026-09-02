import type { PeekBlock } from "@/types/agentRun";

/**
 * Flexible renderer for whatever partial output the backend hands us.
 * Unknown shapes degrade to a readable JSON block instead of crashing.
 */
export function PeekBlocks({ blocks }: { blocks: PeekBlock[] }) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function Title({ children }: { children?: string | undefined }) {
  if (!children) return null;
  return <p className="label-pixel mb-1 text-[8px] text-idle">{children.toUpperCase()}</p>;
}

function BlockView({ block }: { block: PeekBlock }) {
  switch (block.kind) {
    case "text":
    case "markdown":
      return (
        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-muted-foreground">{block.text}</p>
      );

    case "list":
      return (
        <div>
          <Title>{block.title}</Title>
          <ul className="flex flex-col gap-1">
            {block.items.map((item, i) => (
              <li key={i} className="text-[12px] leading-snug text-muted-foreground">
                <span className="text-idle">·</span> {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "headings":
      return (
        <div>
          <Title>{block.title}</Title>
          <ul className="flex flex-col gap-1">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="text-[12px] leading-snug text-foreground"
                style={{ paddingLeft: (item.level - 1) * 12, opacity: 1 - (item.level - 1) * 0.18 }}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      );

    case "sources":
      return (
        <div>
          <Title>{block.title}</Title>
          <ul className="flex flex-col gap-2">
            {block.items.map((item, i) => (
              <li key={i} className="pixel-frame bg-secondary/40 p-2">
                <p className="text-[12px] leading-snug text-foreground">{item.title}</p>
                {item.summary && (
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{item.summary}</p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block break-all text-[10px] text-primary underline"
                  >
                    {item.url}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      );

    case "links":
      return (
        <div>
          <Title>{block.title}</Title>
          <ul className="flex flex-col gap-1">
            {block.items.map((item, i) => (
              <li key={i}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] text-primary underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );

    case "code":
      return (
        <pre className="pixel-frame overflow-x-auto bg-secondary/40 p-2 text-[11px] leading-snug text-foreground">
          <code>{block.text}</code>
        </pre>
      );

    case "actions":
      return (
        <div>
          <Title>{block.title}</Title>
          <ul className="flex flex-col gap-1">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-baseline justify-between gap-2 text-[12px] text-muted-foreground">
                <span>{item.label}</span>
                <span className="label-pixel shrink-0 text-[8px] text-idle">{clock(item.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "json":
    default:
      return (
        <div>
          <Title>{"title" in block ? block.title : undefined}</Title>
          <pre className="pixel-frame overflow-x-auto bg-secondary/40 p-2 text-[11px] leading-snug text-muted-foreground">
            <code>{safeJson("value" in block ? block.value : block)}</code>
          </pre>
        </div>
      );
  }
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

export function clock(at: string): string {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
