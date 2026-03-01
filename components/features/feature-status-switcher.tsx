"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FeatureStatus, ProjectStatus } from "@/types";
import { updateProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { updateFeature } from "@/app/actions/features";

interface FeatureStatusSwitcherProps {
  featureId: string;
  status: FeatureStatus;
}

function FeatureStatusSwitcher({
  featureId,
  status,
}: FeatureStatusSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: FeatureStatus) {
    startTransition(async () => {
      const { error } = await updateFeature(featureId, { status: newStatus });
      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Feature status update successfully.");
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
  );
}

export default FeatureStatusSwitcher;
