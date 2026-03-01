"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ProjectStatus } from "@/types";
import { updateProject } from "@/app/actions/projects";
import { toast } from "sonner";

interface ProjectStatusSwitcherProps {
  projectId: string;
  status: ProjectStatus;
}

function ProjectStatusSwitcher({
  projectId,
  status,
}: ProjectStatusSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: ProjectStatus) {
    startTransition(async () => {
      const { error } = await updateProject(projectId, { status: newStatus });
      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Project status update successfully.");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={status}
        onValueChange={handleChange}
        disabled={isPending}
      >
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
  );
}

export default ProjectStatusSwitcher;
