import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/lib/mockData';
import { calculateProgress } from '@/lib/mockData';

interface ProjectSummaryProps {
  project: Project;
}

export function ProjectSummary({ project }: ProjectSummaryProps) {
  // Calculate overall progress
  const allTasks = project.features.flatMap((f) => f.tasks);
  const progress = calculateProgress(allTasks);
  const completedTasks = allTasks.filter((t) => t.status === 'Done').length;
  const totalTasks = allTasks.length;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
            <Badge
              variant={
                project.status === 'In Progress'
                  ? 'default'
                  : project.status === 'Planning'
                    ? 'secondary'
                    : project.status === 'Launched'
                      ? 'default'
                      : 'outline'
              }
              className={
                project.status === 'In Progress'
                  ? 'bg-blue-500'
                  : project.status === 'Launched'
                    ? 'bg-green-500'
                    : ''
              }
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date(project.lastUpdated).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
