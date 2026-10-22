type Props = { current: number; total: number; names: string[] };

export function Progress({ current, total, names }: Props) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted">
      <span className="shrink-0 tabular-nums">
        Paso {current} de {total}
      </span>
      <div
        role="progressbar"
        aria-label="Progreso de la calculadora"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        className="h-1 flex-1 overflow-hidden rounded-full bg-sand-100"
      >
        <div
          className="h-full origin-left rounded-full bg-orange transition-transform duration-600"
          style={{ transform: `scaleX(${current / total})` }}
        />
      </div>
      {names.length > 0 && <span className="max-w-[40%] truncate">{names.join(" · ")}</span>}
    </div>
  );
}
