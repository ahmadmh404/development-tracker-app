"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Feature, Priority, FeatureStatus } from "@/lib/mockData";

interface FeatureDialogProps {
  children: ReactNode;
  feature?: Feature; // If provided, edit mode; otherwise, create mode
  onSave: (data: Partial<Feature>) => void;
}

export function FeatureDialog({
  children,
  feature,
  onSave,
}: FeatureDialogProps) {
  const isEdit = !!feature;

  const [name, setName] = useState(feature?.name || "");
  const [description, setDescription] = useState(feature?.description || "");
  const [priority, setPriority] = useState<Priority>(
    feature?.priority || "Medium",
  );
  const [status, setStatus] = useState<FeatureStatus>(
    feature?.status || "To Do",
  );
  const [effortEstimate, setEffortEstimate] = useState(
    feature?.effortEstimate || "",
  );

  const handleSave = () => {
    const data: Partial<Feature> = {
      name,
      description,
      priority,
      status,
      effortEstimate,
    };
    onSave(data);
  };

  return (
    <Dialog>
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feature-name">Feature Name</Label>
            <Input
              id="feature-name"
              placeholder="e.g., User Authentication"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feature-description">Description</Label>
            <Textarea
              id="feature-description"
              placeholder="Describe the feature..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as FeatureStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="effort">Effort Estimate</Label>
            <Input
              id="effort"
              placeholder="e.g., 8 hours"
              value={effortEstimate}
              onChange={(e) => setEffortEstimate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={!name}>
            {isEdit ? "Save Changes" : "Create Feature"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
