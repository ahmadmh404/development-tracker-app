"use client";

import {
  Calendar,
  ThumbsUp,
  ThumbsDown,
  GitBranch,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Decision } from "@/lib/db/schema";
import { DecisionDialog } from "./decisions/decision-dialog";
import { DeleteDialog } from "./delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteDecision } from "@/app/actions/decisions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DecisionCardProps {
  decision: Omit<Decision, "createdAt">;
  featureId: string;
}

export function DecisionCard({ decision, featureId }: DecisionCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1 pr-4">
          <p className="font-medium leading-tight tracking-tight text-base">
            {decision.text}
          </p>
        </div>

        {/* Actions Dropdown */}
        <DecisionActionsDropdown featureId={featureId} decision={decision} />
      </CardHeader>

      <CardContent className="grid gap-6">
        {/* Pros & Cons Side-by-Side on larger cards, or stacked on small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decision.pros && decision.pros.length > 0 && (
            <div className="space-y-2 rounded-lg bg-green-50/50 p-3 dark:bg-green-950/20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                <ThumbsUp className="h-3 w-3" /> Pros
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground list-inside list-disc">
                {decision.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>
          )}

          {decision.cons && decision.cons.length > 0 && (
            <div className="space-y-2 rounded-lg bg-red-50/50 p-3 dark:bg-red-950/20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                <ThumbsDown className="h-3 w-3" /> Cons
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground list-inside list-disc">
                {decision.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {decision.alternatives && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
              <GitBranch className="h-4 w-4" /> Alternatives
            </div>
            <p className="text-sm text-muted-foreground italic">
              {decision.alternatives}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/30 px-6 py-3 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          Decided on {new Date(decision.date).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}

interface DecisionActionsDropdownProps {
  featureId: string;
  decision: Omit<Decision, "createdAt">;
}

function DecisionActionsDropdown({
  decision,
  featureId,
}: DecisionActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DecisionDialog featureId={featureId} decision={decision} mode="edit">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </DecisionDialog>

        <DeleteDialog
          title="Delete Decision"
          description="This action cannot be undone."
          onConfirm={deleteDecision.bind(null, decision.id)}
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
