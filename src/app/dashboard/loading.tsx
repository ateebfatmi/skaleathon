export default function DashboardLoading() {
  return (
    <div
      className="container mx-auto min-h-[calc(100vh-140px)] max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      role="status"
      aria-label="Loading dashboard"
    >
      <div className="animate-pulse space-y-10">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <div className="h-3 w-52 rounded-full bg-[#c19a88]/20" />
          <div className="h-3 w-28 rounded-full bg-white/[0.07]" />
        </div>

        <div className="max-w-3xl space-y-5">
          <div className="h-12 w-3/4 rounded-xl bg-white/[0.08] sm:h-14" />
          <div className="h-3 w-full rounded-full bg-white/[0.06]" />
          <div className="h-3 w-2/3 rounded-full bg-white/[0.05]" />
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3 bg-[#0B0B0B] p-5">
              <div className="h-2.5 w-8 rounded-full bg-[#c19a88]/20" />
              <div className="h-3 w-24 rounded-full bg-white/[0.08]" />
            </div>
          ))}
        </div>

        <div className="grid gap-8 border-t border-white/[0.08] pt-8 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="h-3 w-32 rounded-full bg-[#c19a88]/15" />
              <div className="h-6 w-3/4 rounded-lg bg-white/[0.08]" />
              <div className="h-3 w-full rounded-full bg-white/[0.05]" />
              <div className="h-3 w-4/5 rounded-full bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading your participant workspace…</span>
    </div>
  );
}
