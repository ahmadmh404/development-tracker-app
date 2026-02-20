"use client";

import { ReactNode, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import type { Project } from "@/lib/mockData";
import {
  projectFormSchema,
  projectStatuses,
  type ProjectFormInput,
  transformProjectFormToData,
  transformProjectDataToForm,
} from "@/lib/validations";
import { createProject, updateProject } from "@/app/actions/projects";

interface ProjectDialogProps {
  children: ReactNode;
  project?: Project;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function ProjectDialog({
  children,
  project,
  mode,
  onSuccess,
}: ProjectDialogProps) {
  const isEdit = mode === "edit" || !!project;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? transformProjectDataToForm(project)
      : {
          name: "",
          description: "",
          status: "Planning",
          techStack: "",
        },
  });

  function onSubmit(data: ProjectFormInput) {
    startTransition(async () => {
      try {
        const formData = transformProjectFormToData(data);
        if (isEdit) {
          await updateProject(project!.id, formData);
          toast.success("Project updated");
        } else {
          await createProject(formData);
          toast.success("Project created");
        }
        setOpen(false);
        form.reset();
        onSuccess?.();
      } catch (error) {
        toast.error(
          isEdit ? "Failed to update project" : "Failed to create project",
        );
        console.error(error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your project details"
              : "Add a new project to track features and progress"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Project Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., E-Commerce Platform"
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Describe your project..."
                    rows={3}
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={fieldState.invalid ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="techStack"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Tech Stack</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., React, Node.js, PostgreSQL (comma-separated)"
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple technologies with commas
                  </p>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
