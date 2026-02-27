import { Skeleton } from "../ui/skeleton";

export function ProjectsSearchResultsLoading() {
  return [1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-3 py-2 px-3">
      <Skeleton className="size-4" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  ));
}

export function FeaturesSearchResultsLoading() {
  return [1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-3 py-2 px-3">
      <Skeleton className="size-4" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  ));
}
