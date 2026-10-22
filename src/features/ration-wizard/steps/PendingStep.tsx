// TODO(fase 5): remove when the remaining steps (activity, duration, diet, supplements, contact) exist.
export function PendingStep() {
  return (
    <div className="py-10 text-center">
      <p className="eyebrow text-muted">En construcción</p>
      <h2 className="mt-3 text-[clamp(28px,3.2vw,40px)]">
        Los pasos siguientes llegan en la <em>fase 5</em>
      </h2>
      <p className="mt-3 text-muted">Actividad, duración, dieta, suplementos, contacto y envío por WhatsApp.</p>
    </div>
  );
}
