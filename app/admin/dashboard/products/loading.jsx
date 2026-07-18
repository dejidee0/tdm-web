/**
 * Shown while the products segment's client chunk loads. It mirrors the real
 * layout — header, search, table — rather than showing a spinner, so the page
 * does not jump when the data arrives.
 */
export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded bg-white/5" />
          <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-white/5" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-white/5" />
        </div>
      </div>

      <div className="h-11 w-full animate-pulse rounded-lg bg-white/5" />

      <div className="space-y-2 rounded-xl border border-white/10 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
