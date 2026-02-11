import { Skeleton } from "@/components/ui/skeleton";

export function CommunitySkeleton() {
  return (
    <div className="space-y-4 px-4">
      {/* Tabs skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />
        ))}
      </div>

      {/* Cards skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border overflow-hidden">
          <Skeleton className="h-28 w-full" />
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
