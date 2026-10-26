import type { Block, Inline } from "@/content/rich";

export function InlineText({ parts }: { parts: readonly Inline[] }) {
  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : "b" in part ? (
      <strong key={i} className="font-semibold text-charcoal">
        {part.b}
      </strong>
    ) : (
      <strong key={i} className="font-semibold text-orange-600">
        {part.accent}
      </strong>
    ),
  );
}

export function RichText({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="grid gap-3">
      {blocks.map((block, i) => {
        if ("p" in block)
          return (
            <p key={i}>
              <InlineText parts={block.p} />
            </p>
          );
        if ("ul" in block)
          return (
            <ul key={i} className="grid list-disc gap-2 pl-5 marker:text-sand">
              {block.ul.map((item, j) => (
                <li key={j}>
                  <InlineText parts={item} />
                </li>
              ))}
            </ul>
          );
        return (
          <ol key={i} className="grid list-decimal gap-4 pl-5 marker:font-semibold marker:text-orange-600">
            {block.ol.map((group) => (
              <li key={group.title}>
                <p className="font-semibold text-charcoal">{group.title}</p>
                <ul className="mt-1.5 grid list-disc gap-1 pl-5 marker:text-sand">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
