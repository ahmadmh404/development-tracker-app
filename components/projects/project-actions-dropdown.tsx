"use client";

import { deleteProject } from "@/app/actions/projects";
import { DeleteDialog } from "../delete-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ProjectDialog } from "./project-dialog";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Project } from "@/types";
import { useState, useTransition } from "react";

interface ProjectActionsDropdownProps {
  project: Omit<Project, "createdAt">;
}

export function ProjectActionsDropdown({
  project,
}: ProjectActionsDropdownProps) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    deleteProject(project.id);
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onSelect={(e) => e.preventDefault()} asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <ProjectDialog project={project} mode="edit">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </ProjectDialog>

        <DeleteDialog
          title="Delete Project"
          description="This action cannot be undone."
          onConfirm={handleDelete}
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
