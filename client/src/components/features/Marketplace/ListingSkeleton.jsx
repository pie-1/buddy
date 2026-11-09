// client/src/components/features/Marketplace/ListingSkeleton.jsx
export default function ListingSkeleton() {
  return (
    <div className="relative bg-[#14121f] border border-white/10 rounded-2xl overflow-hidden">
      <div className="h-44 bg-white/[0.03] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
        <div className="flex justify-between pt-4">
          <div className="h-6 bg-white/10 rounded w-20 animate-pulse" />
          <div className="h-6 bg-white/5 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.8s_infinite]" />
      <style>{`@keyframes shimmer { 100% { transform: translateX(200%); } }`}</style>
    </div>
  );
}