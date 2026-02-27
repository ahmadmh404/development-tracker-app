"use client";

import { ReactNode, useState, useTransition } from "react";
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
import type { Task } from "@/types";
import { Controller, useForm } from "react-hook-form";
import {
  TaskFormInput,
  taskFormSchema,
  taskStatuses,
  transformTaskDataToForm,
  transformTaskFormToData,
} from "@/lib/validations";
import { createTask, updateTask } from "@/app/actions/tasks";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface TaskDialogProps {
  featureId: string;
  children: ReactNode;
  task?: Omit<Task, "createdAt">;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function TaskDialog({
  featureId,
  children,
  task,
  mode,
  onSuccess,
}: TaskDialogProps) {
  const isEdit = mode === "edit" || !!task;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? transformTaskDataToForm(task)
      : {
          title: "",
          description: "",
          dueDate: "",
          status: "To Do",
          effortEstimate: "",
        },
  });

  function onSubmit(data: TaskFormInput) {
    startTransition(async () => {
      const formData = transformTaskFormToData(data);
      if (isEdit && task) {
        const { error } = await updateTask(task.id, formData);
        if (error) toast.error(error);
        else toast.success("Project updated");
      } else {
        const { error } = await createTask(featureId, formData);
        if (error) toast.error(error);
        else toast.success("Project created");
      }
      setOpen(false);
      form.reset();
      onSuccess?.();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-y-hidden">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update task details" : "Add a new task to the feature"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="overflow-y-auto space-y-4"
          >
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Task Title</FieldLabel>
                  <Input
                    {...field}
                    disabled={fieldState.invalid}
                    placeholder="e.g., Create login form"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Task Description</FieldLabel>
                  <Textarea
                    {...field}
                    disabled={fieldState.invalid}
                    placeholder="Describe the task..."
                    rows={3}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                      {taskStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Due Date</FieldLabel>
                  <Input {...field} type="date" disabled={fieldState.invalid} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="effortEstimate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Error Estimate</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 2 hours"
                    disabled={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isEdit ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
