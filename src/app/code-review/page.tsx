
"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, Code, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { automatedCodeReview } from "@/lib/actions";
import type { AutomatedCodeReviewOutput } from "@/ai/flows/automated-code-review";
import { Badge } from "@/components/ui/badge";

const exampleCode = `function insecure_query(userInput) {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database(':memory:');

    // This is vulnerable to SQL injection
    db.all("SELECT * FROM users WHERE name = '" + userInput + "'", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
    });

    db.close();
}`;

export default function CodeReviewPage() {
  const [code, setCode] = useState(exampleCode);
  const [analysis, setAnalysis] = useState<AutomatedCodeReviewOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAnalysis = () => {
    setAnalysis(null);
    startTransition(async () => {
      const result = await automatedCodeReview({
        code: code,
        language: "JavaScript",
      });
      setAnalysis(result);
    });
  };

  const IssueList = ({ title, issues, variant }: { title: string, issues: string[], variant: "destructive" | "default" }) => (
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {issues.length > 0 ? (
        <ul className="space-y-2">
          {issues.map((issue, i) => (
            <li key={i} className="p-3 bg-muted/50 rounded-lg text-sm border-l-2 border-primary">
              <Badge variant={variant} className="mr-2 capitalize">{variant === 'destructive' ? 'Issue' : 'Suggestion'}</Badge>
              {issue}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted-foreground">No issues found.</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Code />
            </div>
            <div>
              <CardTitle className="font-headline">Automated Code Review</CardTitle>
              <CardDescription>Use AI to find security and performance issues in your code.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="h-80 font-mono text-xs rounded-xl"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={runAnalysis} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Analyze Code
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>AI-generated feedback on the provided code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : analysis ? (
            <>
              <IssueList title="Security Issues" issues={analysis.securityIssues} variant="destructive" />
              <IssueList title="Performance Issues" issues={analysis.performanceIssues} variant="destructive" />
              <IssueList title="Suggestions" issues={analysis.suggestions} variant="default" />
            </>
          ) : (
            <div className="text-center text-muted-foreground pt-10">
              <p>Run analysis to see results here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
