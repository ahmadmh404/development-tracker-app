"use client";

import { Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface Props {
  value: string;
  mode?: "project" | "feature";
}

export function EditableTitle({ value, mode = "project" }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <div className="flex items-center gap-2">
          <Input value={value} className="max-w-md" />
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Save
          </Button>
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
