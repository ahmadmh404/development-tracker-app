"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { FeatureList } from "@/components/feature-list";
import { DecisionCard } from "@/components/decision-card";
import { getProjectById, mockDecisions } from "@/lib/mockData";
import type { Feature } from "@/lib/mockData";
import { FeatureDialog } from "@/components/features/feature-dialog";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(project?.name || "");
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);

  if (!project) {
    return (
      <div className="container mx-auto p-6 md:p-8">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  // Get recent decisions for this project
  const projectDecisions = mockDecisions
    .filter((d) => {
      const feature = project.features.find((f) => f.id === d.featureId);
      return feature !== undefined;
    })
    .slice(0, 5);

  return (
    <div className="container mx-auto space-y-6 p-6 md:p-8">
      {/* Breadcrumb */}
      <AppBreadcrumb
        items={[{ label: "Dashboard", href: "/" }, { label: project.name }]}
      />

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="max-w-md"
                />
                <Button size="sm" onClick={() => setIsEditingName(false)}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-balance text-3xl font-bold tracking-tight">
                  {projectName}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit project name</span>
                </Button>
              </div>
            )}
            <p className="text-pretty text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue={project.status}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Launched">Launched</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs for Features and Decisions */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="decisions">Recent Decisions</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {project.features.length} features in total
            </p>
            <Button onClick={() => setFeatureDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </div>

          <FeatureList features={project.features} projectId={project.id} />
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          {projectDecisions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">
                No decisions logged yet for this project.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projectDecisions.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <FeatureDialog
        open={featureDialogOpen}
        onOpenChange={setFeatureDialogOpen}
        onSave={(data) => {
          console.log("[v0] Creating new feature:", data);
          // In a real app, this would save to database
        }}
      />
    </div>
  );
}
