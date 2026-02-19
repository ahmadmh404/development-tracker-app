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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Task, TaskStatus } from "@/lib/mockData";

interface TaskDialogProps {
  children: ReactNode;
  task?: Task; // If provided, edit mode; otherwise, create mode
  onSave: (data: Partial<Task>) => void;
}

export function TaskDialog({ children, task, onSave }: TaskDialogProps) {
  const isEdit = !!task;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "To Do");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [effortEstimate, setEffortEstimate] = useState(
    task?.effortEstimate || "",
  );

  const handleSave = () => {
    const data: Partial<Task> = {
      title,
      description,
      status,
      dueDate,
      effortEstimate,
    };
    onSave(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update task details" : "Add a new task to the feature"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              placeholder="e.g., Create login form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Describe the task..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as TaskStatus)}
            >
              <SelectTrigger id="task-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-effort">Effort Estimate</Label>
              <Input
                id="task-effort"
                placeholder="e.g., 2 hours"
                value={effortEstimate}
                onChange={(e) => setEffortEstimate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!title}>
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
