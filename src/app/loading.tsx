export default function Loading() {
  return (
    <div
      className="relative min-h-[70vh] overflow-hidden bg-[#0B0B0B] px-4 py-12 sm:px-6 sm:py-16"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-white/5">
        <div className="h-full w-1/3 animate-[pulse_0.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#f5f5f5] to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl animate-pulse space-y-10">
        <div className="space-y-4">
          <div className="h-3 w-36 rounded-full bg-[#f5f5f5]/20" />
          <div className="h-10 max-w-xl rounded-xl bg-white/[0.07] sm:h-14" />
          <div className="h-4 max-w-2xl rounded-full bg-white/[0.04]" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-48 rounded-[24px] border border-white/[0.06] bg-white/[0.025]"
            />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading the selected Skaleathon page…</span>
    </div>
  );
}
