const highlights = [
  {
    title: 'No accounts',
    detail: 'Start journaling instantly',
  },
  {
    title: 'On-device AI',
    detail: 'Runs in your browser tab',
  },
  {
    title: 'Vault lock',
    detail: 'Optional password encryption',
  },
  {
    title: 'PWA offline',
    detail: 'Works after models cache',
  },
  {
    title: 'Export anytime',
    detail: 'Markdown + JSON downloads',
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-white/70 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Built for privacy-first journaling
        </div>
        <div className="grid flex-1 gap-4 text-sm sm:grid-cols-5">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center justify-center rounded-lg border border-slate-100 bg-white/80 px-3 py-2 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
