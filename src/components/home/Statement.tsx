import { Reveal } from "@/components/ui/Reveal";
import { InlineText } from "@/components/ui/RichText";
import { statement } from "@/content/home";

export function Statement() {
  const [lead, highlight] = statement.title;
  return (
    <section className="container-site grid items-end gap-4 pt-12 pb-9 lg:grid-cols-2 lg:gap-12 lg:pt-18 lg:pb-14">
      <Reveal as="h2" className="text-[clamp(34px,4vw,54px)]">
        {lead}
        <em>{highlight}</em>
      </Reveal>
      <Reveal as="p" index={1} className="text-[19px] text-muted">
        <InlineText parts={statement.body} />
      </Reveal>
    </section>
  );
}
