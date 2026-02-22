"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectStatus as ProjectStatusType } from "@/types";
import { updateProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { projectStatuses } from "@/lib/validations";

interface Props {
  id: string;
  status: ProjectStatusType;
}

export function ProjectStatus({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();
  function handleChange(newStatus: ProjectStatusType) {
    startTransition(async () => {
      const { error } = await updateProject(id, { status: newStatus });
      if (error) toast.error(error);
    });
  }

  return (
    <Select
      defaultValue={status}
      onValueChange={(val) => handleChange(val as ProjectStatusType)}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent aria-disabled={isPending}>
        {projectStatuses.map((status, index) => (
          <SelectItem key={index} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
