export interface HistoryTooltipProps {
  title: string;
  originalName: string;
  era: string;
  civilization: string;
  history: string[];
  symbolicContext: string[];
}

export const PlanoTooltip = ({
  title,
  originalName,
  era,
  civilization,
  history,
  symbolicContext,
}: HistoryTooltipProps) => {
  return (
    <div className="group relative ml-2 flex cursor-help items-center justify-center">
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/50 transition-colors group-hover:border-violet-500/50 group-hover:bg-violet-500/10 group-hover:text-violet-300">
        i
      </span>

      <div className="absolute bottom-full left-1/2 z-50 mb-3 hidden w-[320px] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-white/10 bg-[#0f172a]/95 p-5 text-sm shadow-2xl shadow-black/50 backdrop-blur-xl group-hover:flex">
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#0f172a]" />

        <div>
          <h4 className="mb-2 font-black text-white">{title}</h4>
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white/80">Original:</span>{" "}
            {originalName}
            <br />
            <span className="font-semibold text-white/80">Época:</span> {era}
            <br />
            <span className="font-semibold text-white/80">
              Civilização:
            </span>{" "}
            {civilization}
          </p>
        </div>

        <div>
          <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-400">
            📖 História
          </h5>
          <ul className="space-y-1 text-xs text-white/70">
            {history.map((line, i) => (
              <li key={i} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            💡 Significado Simbólico
          </h5>
          <ul className="space-y-1 text-xs text-white/70">
            {symbolicContext.map((sym, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-emerald-400/70">👉</span>
                <span>{sym}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
