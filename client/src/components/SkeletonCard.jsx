export default function SkeletonCard() {
  return (
    <div className="glass animate-pulse rounded-xl p-4">
      <div className="mb-3 h-4 w-2/3 rounded bg-white/20" />
      <div className="mb-2 h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-5/6 rounded bg-white/10" />
    </div>
  );
}
