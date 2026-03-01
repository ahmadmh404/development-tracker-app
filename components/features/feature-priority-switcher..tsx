"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FeaturePriority } from "@/types";
import { toast } from "sonner";
import { updateFeature } from "@/app/actions/features";

interface FeaturePrioritySwitcherProps {
  featureId: string;
  priority: FeaturePriority;
}

function FeaturePrioritySwitcher({
  featureId,
  priority,
}: FeaturePrioritySwitcherProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(newPriority: FeaturePriority) {
    startTransition(async () => {
      const { error } = await updateFeature(featureId, {
        priority: newPriority,
      });
      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Feature priority update successfully.");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={priority}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FeaturePrioritySwitcher;
