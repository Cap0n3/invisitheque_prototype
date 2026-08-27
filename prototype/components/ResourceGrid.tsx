import ResourceCard from "./ResourceCard";
import type { Resource } from "@/lib/types";

/**
 * Uniform grid: every result carries the same visual weight.
 * (The bento variant was tried and dropped - it hurt readability.)
 */
export default function ResourceGrid({ resources }: { resources: Resource[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
