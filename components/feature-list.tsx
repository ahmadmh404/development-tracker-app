import Link from "next/link";
import { Edit2, Trash2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeatureStatus, Priority } from "@/lib/mockData";
import { Feature, tasks } from "@/lib/db";
import { calculateProgress } from "@/app/actions/projects";
import { EmptyState } from "@/components/empty-state";

interface FeatureListProps {
  features: Omit<
    Feature & { tasks: Pick<typeof tasks.$inferSelect, "status">[] },
    "createdAt"
  >[];
  projectId: string;
}

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusColor(status: FeatureStatus) {
  switch (status) {
    case "Done":
      return "bg-green-500";
    case "In Progress":
      return "bg-blue-500";
    case "To Do":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

export function FeatureList({ features, projectId }: FeatureListProps) {
  if (features.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No features yet"
        description="Add your first feature to start tracking progress."
      />
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => {
            const progress = calculateProgress(projectId);
            const completedTasks = feature.tasks.filter(
              (t) => t.status === "Done",
            ).length;
            const totalTasks = feature.tasks.length;

            return (
              <TableRow key={feature.id}>
                <TableCell>
                  <Link
                    href={`/projects/${projectId}/features/${feature.id}`}
                    className="font-medium hover:underline"
                  >
                    {feature.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(feature.priority)}
                  >
                    {feature.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(feature.status)}
                  >
                    {feature.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} done
                    {totalTasks > 0 && (
                      <span className="ml-2 text-xs">({progress}%)</span>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit feature</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete feature</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
