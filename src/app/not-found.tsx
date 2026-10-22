import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site pt-40 pb-24 text-center">
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="mx-auto mt-4 max-w-[16ch] text-[clamp(36px,5vw,68px)]">
        Esta página <em>no existe</em>
      </h1>
      <ButtonLink href="/" className="mt-8" arrow>
        Volver al inicio
      </ButtonLink>
    </div>
  );
}
