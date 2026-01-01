import Link from 'next/link';

const layers = [
  {
    title: 'Browser sandbox',
    description:
      'Everything lives in a single tab. IndexedDB caches the models; localStorage handles drafts and history.',
    meta: 'Zero background sync',
  },
  {
    title: 'Inference pipeline',
    description:
      'Emotion classifier → theme extractor → CBT question engine. All chained locally with Transformers.js.',
    meta: '3 local passes (emotion • theme • reflection)',
  },
  {
    title: 'Review & export',
    description:
      'The history rail renders mood ratios and suggested themes. Export Markdown or JSON when you are done.',
    meta: 'Data leaves device only when you download it',
  },
];

const verifications = [
  'No journal text uploads (models download once, then cache locally)',
  'Anonymous analytics events (no journal text) to measure product quality',
  'All prompts + guides live in this repo (view source any time)',
];

export function PrivacyStack() {
  return (
    <section className="bg-slate-50 py-16" id="privacy-stack">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Privacy proofs
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            On-device AI architecture you can literally inspect
          </h2>
          <p className="text-lg text-slate-600">
            We built this for people who view “cloud AI” as a threat model. Pop
            open DevTools and watch how your journal text never uploads — the
            stack diagram below matches the implementation.
          </p>
          <ul className="space-y-2 text-sm text-slate-500">
            {verifications.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand/10 text-[10px] font-semibold text-brand">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            View the privacy architecture
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            {layers.map((layer, index) => (
              <article
                key={layer.title}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  <span>{layer.title}</span>
                  <span>0{index + 1}</span>
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {layer.description}
                </p>
                <p className="mt-2 text-sm text-slate-500">{layer.meta}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-700">
            <p className="font-semibold">Bring your own threat model</p>
            <p className="mt-1">
              Curious or skeptical? Fork the repo, swap the models, or wire your
              own. The UI stays the same.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
