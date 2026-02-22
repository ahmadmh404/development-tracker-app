"use client";

import { Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { editFeatureName } from "@/app/actions/features";
import { editProjectName } from "@/app/actions/projects";

interface Props {
  id: string;
  value: string;
  mode: "project" | "feature";
}

export function EditableTitle({ id, value, mode }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(value || "");

  const [isPending, startTransition] = useTransition();

  function handleChange() {
    if (title.trim() === "") {
      toast.error("Title must be at least 5 characters");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await (mode === "feature"
          ? editFeatureName(id, title)
          : editProjectName(id, title));

        if (error != null) {
          toast.error(error);
          return;
        }

        setIsOpen(false);
        toast.success("Title updated successfully");
      } catch (error) {
        toast.error("failed to update title");
      }
    });
  }

  return (
    <>
      {isOpen ? (
        <div className="flex items-center gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value || "")}
            className="max-w-md"
            disabled={isPending}
          />
          <Button
            variant={"outline"}
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleChange}>Save</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            {value}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isPending}
            onClick={() => setIsOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit project name</span>
          </Button>
        </div>
      )}
    </>
  );
}
