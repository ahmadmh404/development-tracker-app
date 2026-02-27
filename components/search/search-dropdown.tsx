"use client";

import { useState, useEffect, useTransition } from "react";
import { FolderKanban, Layers, SearchXIcon } from "lucide-react";
import { searchAll, type SearchResults } from "@/app/actions/search";
import { SearchResultItem } from "./search-result-item";
import { SearchSection } from "./search-section";
import {
  FeaturesSearchResultsLoading,
  ProjectsSearchResultsLoading,
} from "../loading/search-loading";
import { EmptyState } from "../empty-state";
import { MIN_SEARCH_LENGTH } from "@/lib/constants";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    let cancelled = false;

    if (query.length < MIN_SEARCH_LENGTH) {
      setResults({ projects: [], features: [] });
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    startTransition(async () => {
      const searchResults = await searchAll(query);
      if (!cancelled) {
        setResults(searchResults);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleSelect = () => {
    onSelect();
  };

  const hasResults = results.projects.length > 0 || results.features.length > 0;

  // Flatten results for keyboard navigation
  const allResults = [
    ...results.projects.map((p) => ({ type: "project" as const, data: p })),
    ...results.features.map((f) => ({ type: "feature" as const, data: f })),
  ];

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!hasResults) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < allResults.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allResults.length - 1,
          );
          break;
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < allResults.length) {
            event.preventDefault();
            const item = allResults[selectedIndex];
            if (item.type === "project") {
              window.location.href = `/projects/${item.data.id}`;
            } else {
              window.location.href = `/projects/${item.data.projectId}/features/${item.data.id}`;
            }
            onSelect();
          }
          break;
        case "Escape":
          setSelectedIndex(-1);
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasResults, allResults, selectedIndex, onSelect]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  return (
    <div
      className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-md max-h-100 overflow-y-auto z-50"
      role="listbox"
      aria-label="Search results"
    >
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
              {results.projects.map((project, index) => (
                <SearchResultItem
                  key={project.id}
                  icon={FolderKanban}
                  title={project.name}
                  href={`/projects/${project.id}`}
                  isSelected={selectedIndex === index}
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
              {results.features.map((feature, index) => (
                <SearchResultItem
                  key={feature.id}
                  icon={Layers}
                  title={feature.name}
                  subtitle={feature.project?.name}
                  href={`/projects/${feature.projectId}/features/${feature.id}`}
                  isSelected={selectedIndex === results.projects.length + index}
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
