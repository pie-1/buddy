// client/src/components/features/Roommates/RoommateSkeleton.jsx
export default function RoommateSkeleton() {
  return (
    <div className="relative bg-[#14121f] border border-white/10 rounded-2xl overflow-hidden">
      <div className="h-40 bg-white/[0.03] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
        <div className="flex justify-between pt-4">
          <div className="h-6 bg-white/10 rounded w-20 animate-pulse" />
          <div className="h-6 bg-white/5 rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}