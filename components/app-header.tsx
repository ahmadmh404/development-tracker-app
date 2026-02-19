'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MobileSidebar } from './mobile-sidebar';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <MobileSidebar />
        
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects, features, tasks..."
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
