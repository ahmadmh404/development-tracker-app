'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderKanban, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockProjects } from '@/lib/mockData';

export function AppSidebar() {
  const pathname = usePathname();
  const activeProjectId = '1'; // Mock: first project is active

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo/Title */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">
            Dev Tracker
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        <div className="mt-6 px-3">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </h3>
          <div className="space-y-1">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  pathname.startsWith(`/projects/${project.id}`)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                  project.id === activeProjectId && 'border-l-2 border-sidebar-primary'
                )}
              >
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    project.status === 'In Progress' && 'bg-blue-500',
                    project.status === 'Planning' && 'bg-yellow-500',
                    project.status === 'Launched' && 'bg-green-500',
                    project.status === 'Archived' && 'bg-gray-500'
                  )}
                />
                <span className="flex-1 truncate">{project.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border p-4">
        <Button className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
}
