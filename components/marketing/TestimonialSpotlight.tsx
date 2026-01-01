const workflows = [
  {
    title: 'CBT thought record',
    description:
      'Capture a trigger, name the automatic thought, and write a balanced reframe — then ask one follow-up question to go deeper.',
    icon: '🧠',
  },
  {
    title: 'Anxiety decompression',
    description:
      'Write freely for 5–10 minutes, then get a local “theme” summary and a gentle next question to reduce rumination.',
    icon: '🌊',
  },
  {
    title: 'Gratitude + growth',
    description:
      'End the day with a gratitude anchor and one learning — designed to be fast, calm, and repeatable.',
    icon: '🌱',
  },
];

export function TestimonialSpotlight() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Workflows
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Three ways people use on-device journaling
          </h2>
          <p className="text-lg text-slate-600">
            Pick a structured template, write 50+ words, and get local insights
            without uploading your journal text.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {workflows.map((workflow) => (
            <article
              key={workflow.title}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft"
            >
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-2xl"
                aria-hidden="true"
              >
                {workflow.icon}
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {workflow.title}
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                {workflow.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
