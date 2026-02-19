"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Decision } from "@/lib/mockData";

interface DecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision?: Decision; // If provided, edit mode; otherwise, create mode
  onSave: (data: Partial<Decision>) => void;
}

export function DecisionDialog({
  open,
  onOpenChange,
  decision,
  onSave,
}: DecisionDialogProps) {
  const isEdit = !!decision;

  const [decisionText, setDecisionText] = useState(decision?.text || "");
  const [prosText, setProsText] = useState(decision?.pros?.join("\n") || "");
  const [consText, setConsText] = useState(decision?.cons?.join("\n") || "");
  const [alternatives, setAlternatives] = useState(
    decision?.alternatives || "",
  );

  const handleSave = () => {
    const data: Partial<Decision> = {
      text: decisionText,
      pros: prosText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      cons: consText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      alternatives,
    };
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Decision" : "Log New Decision"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the decision record"
              : "Record an important technical or design decision"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decision-text">Decision</Label>
            <Textarea
              id="decision-text"
              placeholder="What did you decide?"
              rows={3}
              value={decisionText}
              onChange={(e) => setDecisionText(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pros">Pros</Label>
            <Textarea
              id="pros"
              placeholder="List benefits (one per line)..."
              rows={3}
              value={prosText}
              onChange={(e) => setProsText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              One benefit per line
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cons">Cons</Label>
            <Textarea
              id="cons"
              placeholder="List trade-offs (one per line)..."
              rows={3}
              value={consText}
              onChange={(e) => setConsText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              One trade-off per line
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alternatives">Alternatives Considered</Label>
            <Textarea
              id="alternatives"
              placeholder="What other options did you consider?"
              rows={2}
              value={alternatives}
              onChange={(e) => setAlternatives(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!decisionText}>
            {isEdit ? "Save Changes" : "Log Decision"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
