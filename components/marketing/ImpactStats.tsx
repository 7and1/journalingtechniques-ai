interface Stat {
  label: string;
  value: string;
  detail: string;
}

interface ImpactStatsProps {
  stats: Stat[];
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const now = new Date();
  const updatedLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(now);

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_65%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200">
            At a glance
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            What ships in the current build
          </h2>
          <p className="text-slate-200">
            A quick snapshot of prompts, guides, and the on-device analysis
            pipeline — updated {updatedLabel}.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100">
            Local-first • Privacy-by-design
          </div>
        </div>
        <div className="flex-1 rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_40px_120px_-60px_rgba(37,99,235,0.9)] backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-white/10"
              >
                <p className="text-4xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">
                  {stat.label}
                </p>
                <p className="text-sm text-slate-100/80">{stat.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
