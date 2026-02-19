'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppBreadcrumb } from '@/components/app-breadcrumb';
import { TaskItem } from '@/components/task-item';
import { DecisionCard } from '@/components/decision-card';
import {
  getProjectById,
  getFeatureById,
  getDecisionsForFeature,
  type Priority,
  type FeatureStatus,
} from '@/lib/mockData';

export default function FeatureDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const featureId = params.featureId as string;

  const project = getProjectById(projectId);
  const feature = getFeatureById(featureId);
  const decisions = getDecisionsForFeature(featureId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [featureName, setFeatureName] = useState(feature?.name || '');
  const [priority, setPriority] = useState<Priority>(feature?.priority || 'Medium');
  const [status, setStatus] = useState<FeatureStatus>(feature?.status || 'To Do');

  if (!project || !feature) {
    return (
      <div className="container mx-auto p-6 md:p-8">
        <p className="text-muted-foreground">Feature not found</p>
      </div>
    );
  }

  const todoTasks = feature.tasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = feature.tasks.filter((t) => t.status === 'In Progress');
  const doneTasks = feature.tasks.filter((t) => t.status === 'Done');

  return (
    <div className="container mx-auto space-y-6 p-6 md:p-8">
      {/* Breadcrumb */}
      <AppBreadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: project.name, href: `/projects/${project.id}` },
          { label: feature.name },
        ]}
      />

      {/* Feature Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="max-w-md"
                />
                <Button size="sm" onClick={() => setIsEditingName(false)}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-balance text-3xl font-bold tracking-tight">
                  {featureName}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit feature name</span>
                </Button>
              </div>
            )}
            <p className="text-pretty text-muted-foreground">
              {feature.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(v) => setStatus(v as FeatureStatus)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">Estimate: {feature.effortEstimate}</Badge>
        </div>
      </div>

      {/* Main Content - Tasks and Decisions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task for this feature
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input id="task-title" placeholder="e.g., Create login form" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Describe the task..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-effort">Effort Estimate</Label>
                    <Input id="task-effort" placeholder="e.g., 2 hours" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Kanban-style task columns */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({feature.tasks.length})</TabsTrigger>
              <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
              <TabsTrigger value="progress">In Progress ({inProgressTasks.length})</TabsTrigger>
              <TabsTrigger value="done">Done ({doneTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {feature.tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No tasks yet. Add your first task to get started.
                  </p>
                </div>
              ) : (
                feature.tasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </TabsContent>

            <TabsContent value="todo" className="space-y-3">
              {todoTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">No tasks in this column</p>
                </div>
              ) : (
                todoTasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-3">
              {inProgressTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">No tasks in this column</p>
                </div>
              ) : (
                inProgressTasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </TabsContent>

            <TabsContent value="done" className="space-y-3">
              {doneTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">No tasks in this column</p>
                </div>
              ) : (
                doneTasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Decisions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Decisions</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Decision
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Decision</DialogTitle>
                  <DialogDescription>
                    Record an important technical or design decision
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="decision-text">Decision</Label>
                    <Textarea
                      id="decision-text"
                      placeholder="What did you decide?"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pros">Pros (one per line)</Label>
                    <Textarea id="pros" placeholder="Benefits..." rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cons">Cons (one per line)</Label>
                    <Textarea id="cons" placeholder="Trade-offs..." rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternatives">Alternatives Considered</Label>
                    <Textarea
                      id="alternatives"
                      placeholder="What else did you consider?"
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Decision</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {decisions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No decisions logged yet for this feature.
                </p>
              </div>
            ) : (
              decisions.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
