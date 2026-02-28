"use client";

import { ReactNode, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Decision } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  DecisionFormInput,
  decisionFormSchema,
  transformDecisionDataToForm,
  transformDecisionFormToData,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { createDecision, updateDecision } from "@/app/actions/decisions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { ScrollArea } from "../ui/scroll-area";

interface DecisionDialogProps {
  featureId: string;
  children: ReactNode;
  decision?: Omit<Decision, "createdAt">;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export function DecisionDialog({
  featureId,
  children,
  decision,
  mode,
  onSuccess,
}: DecisionDialogProps) {
  const isEdit = mode === "edit" || !!decision;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<DecisionFormInput>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues: decision
      ? transformDecisionDataToForm(decision)
      : {
          text: "",
          date: "",
          pros: "",
          cons: "",
          alternatives: "",
        },
  });

  function onSubmit(data: DecisionFormInput) {
    startTransition(async () => {
      const formData = transformDecisionFormToData(data);
      if (isEdit && decision) {
        const { error } = await updateDecision(decision.id, formData);
        if (error) toast.error(error);
        else toast.success("Decision updated");
      } else {
        const { error } = await createDecision(featureId, formData);
        if (error) toast.error(error);
        else toast.success("Decision created");
      }
      setOpen(false);
      form.reset();
      onSuccess?.();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Decision" : "Log New Decision"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the decision record"
              : "Record an important technical or design decision"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-[50%]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Decision</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="What did you decide?"
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="pros"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Pros</FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="List benefits (one per line)..."
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />

                    <FieldDescription>One benefit per line</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="cons"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Cons</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="List benefits (one per line)..."
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />
                  </Field>
                )}
              />

              <Controller
                name="alternatives"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Alternatives</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="What other options did you consider?"
                      className={fieldState.invalid ? "border-destructive" : ""}
                    />

                    <FieldDescription>One trade-off per line</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? "Save Changes" : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
