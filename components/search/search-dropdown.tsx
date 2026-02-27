"use client";

import { useState, useEffect, useTransition } from "react";
import { FolderKanban, Layers, SearchXIcon } from "lucide-react";
import { searchAll, type SearchResults } from "@/app/actions/search";
import { SearchResultItem } from "./search-result-item";
import { SearchSection } from "./search-section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FeaturesSearchResultsLoading,
  ProjectsSearchResultsLoading,
} from "../loading/search-loading";
import { EmptyState } from "../empty-state";

interface SearchDropdownProps {
  query: string;
  onSelect: () => void;
}

export function SearchDropdown({ query, onSelect }: SearchDropdownProps) {
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    features: [],
  });

  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ projects: [], features: [] });
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    startTransition(async () => {
      const searchResults = await searchAll(query);
      setResults(searchResults);
    });
  }, [query]);

  const handleSelect = () => {
    onSelect();
  };

  const hasResults = results.projects.length > 0 || results.features.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-100 overflow-y-auto z-50">
      {isPending ? (
        // Loading state - show skeletons
        <div className="py-2">
          <SearchSection title="Projects" icon={FolderKanban}>
            <ProjectsSearchResultsLoading />
          </SearchSection>
          <SearchSection title="Features" icon={Layers}>
            <FeaturesSearchResultsLoading />
          </SearchSection>
        </div>
      ) : hasSearched && !hasResults ? (
        // Empty state

        <EmptyState
          icon={SearchXIcon}
          title={`No results found for '${query}'`}
          description="Make sure you typed the right sequence of letters"
        />
      ) : hasResults ? (
        // Results
        <div onClick={handleSelect}>
          {results.projects.length > 0 && (
            <SearchSection title="Projects" icon={FolderKanban}>
              {results.projects.map((project) => (
                <SearchResultItem
                  key={project.id}
                  icon={FolderKanban}
                  title={project.name}
                  href={`/projects/${project.id}`}
                  badge={{
                    text: project.status,
                    variant: getProjectStatusVariant(project.status),
                  }}
                />
              ))}
            </SearchSection>
          )}

          {results.features.length > 0 && (
            <SearchSection title="Features" icon={Layers}>
              {results.features.map((feature) => (
                <SearchResultItem
                  key={feature.id}
                  icon={Layers}
                  title={feature.name}
                  subtitle={feature.project?.name}
                  href={`/projects/${feature.projectId}/features/${feature.id}`}
                  badge={{
                    text: feature.priority,
                    variant: getPriorityVariant(feature.priority),
                  }}
                />
              ))}
            </SearchSection>
          )}
        </div>
      ) : null}
    </div>
  );
}

// Helper functions for badge variants
function getProjectStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Planning":
      return "outline";
    case "In Progress":
      return "default";
    case "Launched":
      return "secondary";
    case "Archived":
      return "destructive";
    default:
      return "secondary";
  }
}

function getPriorityVariant(
  priority: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "outline";
    default:
      return "secondary";
  }
}
