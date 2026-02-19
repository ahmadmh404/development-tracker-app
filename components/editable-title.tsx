import { Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditableTitle({ value, onChange, isOpen, setIsOpen }: Props) {
  return (
    <>
      {isOpen ? (
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="max-w-md"
          />
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
