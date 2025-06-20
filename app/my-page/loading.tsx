import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      
      <div className="space-y-4">
        <Skeleton className="h-10 w-full mb-4" />
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
} 