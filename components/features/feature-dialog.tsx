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
import type { Feature } from "@/lib/mockData";
import {
  featureFormSchema,
  featureStatuses,
  priorities,
  type FeatureFormInput,
  transformFeatureFormToData,
  transformFeatureDataToForm,
} from "@/lib/validations";
import { createFeature, updateFeature } from "@/app/actions/features";

interface FeatureDialogProps {
  children: ReactNode;
  feature?: Feature;
  projectId: string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function FeatureDialog({
  children,
  feature,
  projectId,
  mode,
  onSuccess,
}: FeatureDialogProps) {
  const isEdit = mode === "edit" || !!feature;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<FeatureFormInput>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: feature
      ? transformFeatureDataToForm(feature)
      : {
          name: "",
          description: "",
          priority: "Medium",
          status: "To Do",
          effortEstimate: "",
          projectId: projectId,
        },
  });

  function onSubmit(data: FeatureFormInput) {
    startTransition(async () => {
      try {
        const formData = transformFeatureFormToData(data);
        if (isEdit) {
          await updateFeature(feature!.id, formData);
          toast.success("Feature updated");
        } else {
          await createFeature(formData);
          toast.success("Feature created");
        }
        setOpen(false);
        form.reset();
        onSuccess?.();
      } catch (error) {
        toast.error(
          isEdit ? "Failed to update feature" : "Failed to create feature",
        );
        console.error(error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Feature" : "Create New Feature"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update feature details"
              : "Add a new feature to your project"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Feature Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., User Authentication"
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
                    placeholder="Describe the feature..."
                    rows={3}
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="priority"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Priority</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          fieldState.invalid ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        className={
                          fieldState.invalid ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {featureStatuses.map((status) => (
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
            </div>

            <Controller
              name="effortEstimate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Effort Estimate</FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g., 8 hours"
                    className={fieldState.invalid ? "border-destructive" : ""}
                  />
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
                {isEdit ? "Save Changes" : "Create Feature"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
