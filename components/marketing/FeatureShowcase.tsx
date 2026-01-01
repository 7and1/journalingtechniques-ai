const featurePillars = [
  {
    eyebrow: 'Guided focus',
    title: 'Templates that coach instead of judge',
    description:
      'Choose from a daily reflection, a CBT thought record, or gratitude + growth. Each template nudges you toward 50+ words so the AI has signal, not noise.',
    badge: 'Curated prompts',
    bullets: [
      'Snaps open from prompts, bookmarks, or guides',
      'Autosave + URL prefill support',
      'Difficulty filters for every energy level',
    ],
  },
  {
    eyebrow: 'On-device AI',
    title: 'GPU-grade models running in a browser tab',
    description:
      'Transformers.js downloads the emotion + theme models once, then keeps them in IndexedDB. Refresh or go offline — insights still run instantly.',
    badge: '2 on-device models',
    bullets: [
      'DistilBERT emotion classifier',
      'DistilBART theme extractor',
      'Rule-based CBT follow-up engine',
    ],
  },
  {
    eyebrow: 'Exports & continuity',
    title: 'Own the archive with beautiful Markdown + JSON',
    description:
      'Your history stays on-device, complete with detected themes. Export everything as structured Markdown or raw JSON whenever you want.',
    badge: 'Export-ready',
    bullets: [
      'Mood ratio + theme timeline',
      'One-click load + clear controls',
      'No server copy, ever',
    ],
  },
];

export function FeatureShowcase() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Product tour
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            The journal feels luxe because the details do
          </h2>
          <p className="text-lg text-slate-600">
            The marketing site is simple on purpose. The workspace is
            hyper-opinionated about flow, privacy, and recovery so you can get
            in, write 50+ words, and get insights in under a minute.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">
              Line-of-sight roadmap
            </p>
            <p className="mt-1">
              Next up: offline-friendly audio journaling + prompt packs for
              coaching or therapy sessions (if you want to share your notes).
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {featurePillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">
                {pillar.eyebrow}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  {pillar.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {pillar.badge}
                </span>
              </div>
              <p className="mt-3 text-slate-600">{pillar.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                {pillar.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span
                      className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
