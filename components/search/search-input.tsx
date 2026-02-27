"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchDropdown } from "./search-dropdown";
import { cn } from "@/lib/utils";
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS } from "@/lib/constants";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleFocus = () => {
    if (query.length >= MIN_SEARCH_LENGTH) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= MIN_SEARCH_LENGTH) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  const handleSelect = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-md", className)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects, features..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="pl-9 pr-8"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && debouncedQuery.length >= MIN_SEARCH_LENGTH && (
        <SearchDropdown query={debouncedQuery} onSelect={handleSelect} />
      )}
    </div>
  );
}
