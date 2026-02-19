'use client';

import { Calendar, ThumbsUp, ThumbsDown, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Decision } from '@/lib/mockData';

interface DecisionCardProps {
  decision: Decision;
}

export function DecisionCard({ decision }: DecisionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 font-medium leading-relaxed">{decision.text}</p>
          <Badge variant="outline" className="gap-1 whitespace-nowrap">
            <Calendar className="h-3 w-3" />
            {new Date(decision.date).toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {decision.pros && decision.pros.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <ThumbsUp className="h-4 w-4" />
              Pros
            </div>
            <ul className="space-y-1 pl-6">
              {decision.pros.map((pro, index) => (
                <li key={index} className="text-sm text-muted-foreground list-disc">
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {decision.cons && decision.cons.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
              <ThumbsDown className="h-4 w-4" />
              Cons
            </div>
            <ul className="space-y-1 pl-6">
              {decision.cons.map((con, index) => (
                <li key={index} className="text-sm text-muted-foreground list-disc">
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}

        {decision.alternatives && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <GitBranch className="h-4 w-4" />
              Alternatives Considered
            </div>
            <p className="text-sm text-muted-foreground pl-6">{decision.alternatives}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
