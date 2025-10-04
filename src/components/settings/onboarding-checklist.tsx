
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const checklistItems = [
  { id: "bridge", label: "Connect Bridge URL", done: true },
  { id: "token", label: "Add admin token", done: true },
  { id: "integration", label: "Mark ≥1 integration", done: true },
  { id: "tool", label: "Run sample tool", done: false },
  { id: "health", label: "Verify health", done: false },
];

export function OnboardingChecklist() {
  const [items, setItems] = useState(checklistItems);

  const completedCount = items.filter((item) => item.done).length;
  const progress = (completedCount / items.length) * 100;

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Onboarding Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  item.done ? "bg-muted/50" : ""
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={item.id}
                    checked={item.done}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className={cn(
                      "text-sm font-medium leading-none",
                      item.done ? "text-muted-foreground line-through" : ""
                    )}
                  >
                    {item.label}
                  </label>
                </div>
                {!item.done && (
                  <Button variant="secondary" size="sm" className="h-7 rounded-md px-2 text-xs">
                    Start
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            Complete these steps to get your system fully operational.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
