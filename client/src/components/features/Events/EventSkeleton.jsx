// client/src/components/features/Events/EventSkeleton.jsx
export default function EventSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-stone-200/80">
      <div className="sm:w-64 h-44 sm:h-auto bg-stone-100 animate-pulse shrink-0" />
      <div className="flex-1 p-5 sm:p-6 space-y-3">
        <div className="h-5 bg-stone-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-stone-100 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-stone-100 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-stone-100 rounded w-full animate-pulse" />
        <div className="h-3 bg-stone-100 rounded w-4/5 animate-pulse" />
        <div className="flex gap-1.5 pt-2">
          <div className="h-6 w-14 bg-stone-100 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-stone-100 rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-stone-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}