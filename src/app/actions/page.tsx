

"use client";

import React from "react";
import { AlertCircle, BrainCircuit, CheckCircle, ChevronDown, Play, Save, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { addDocumentNonBlocking, useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { getToolArguments } from "@/ai/flows/get-tool-arguments";
import { useSearchParams } from "next/navigation";


type McpTool = {
  id: string;
  name: string;
  description?: string;
  input_schema?: Record<string, any>; // JSON Schema
};

type ExecuteResponse = {
  runId: string;
  status: "ok" | "error";
  durationMs?: number;
  output?: any;
  error?: string;
  raw?: any;
};

const pretty = (v: any) => JSON.stringify(v, null, 2);

function defaultArgsFromSchema(schema?: Record<string, any>) {
  if (!schema || schema.type !== "object" || !schema.properties) return {};
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries<any>(schema.properties)) {
    if (v.default !== undefined) out[k] = v.default;
    else if (v.type === "string") out[k] = "";
    else if (v.type === "number" || v.type === "integer") out[k] = 0;
    else if (v.type === "boolean") out[k] = false;
    else if (v.type === "array") out[k] = [];
    else if (v.type === "object") out[k] = {};
    else out[k] = null;
  }
  return out;
}

function validateArgs(schema: any, value: any): { ok: boolean; errors?: string[] } {
  if (!schema || schema.type !== "object" || !schema.properties) return { ok: true };
  const errors: string[] = [];
  const required: string[] = schema.required || [];
  for (const r of required) {
    if (value[r] === undefined || value[r] === null || value[r] === "") {
      errors.push(`Missing required field: ${r}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

export default function ActionsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [selected, setSelected] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState(searchParams.get('prompt') || "");
  const [args, setArgs] = React.useState<any>({});
  const [argText, setArgText] = React.useState<string>("{}");
  
  const [busy, setBusy] = React.useState<"idle" | "dry" | "run" | "ai">("idle");
  const [result, setResult] = React.useState<ExecuteResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const toolsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'tools') : null, [firestore]);
  const { data: tools, isLoading: loading } = useCollection<McpTool>(toolsQuery);
  const selectedTool = React.useMemo(() => tools?.find(t => t.name === selected), [tools, selected]);

  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  React.useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(Math.max(el.scrollHeight, 120), 320) + "px";
  }, [prompt]);

  React.useEffect(() => {
    if (tools && tools.length > 0 && !selected) {
        const first = tools[0];
        setSelected(first.name);
        const defArgs = defaultArgsFromSchema(first.input_schema);
        setArgs(defArgs);
        setArgText(pretty(defArgs));
    }
  }, [tools, selected]);
  
  React.useEffect(() => {
    if(selectedTool) {
      const def = defaultArgsFromSchema(selectedTool?.input_schema);
      setArgs(def);
      setArgText(pretty(def));
      setResult(null);
      setError(null);
    }
  }, [selectedTool]);

  React.useEffect(() => {
    if (prompt && selectedTool) {
      getArgsFromPrompt();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, selectedTool]);


  function onSelectTool(name: string) {
    if (!tools) return;
    setSelected(name);
  }

  function onArgTextChange(v: string) {
    setArgText(v);
    try {
      const parsed = JSON.parse(v || "{}");
      setArgs(parsed);
      setError(null);
    } catch (e: any) {
      setError("Args JSON is invalid");
    }
  }

  const payload = React.useMemo(() => ({
    tool: selected,
    prompt: prompt?.trim() || undefined,
    args: args || {}
  }), [selected, prompt, args]);

  async function getArgsFromPrompt() {
    if (!prompt || !selectedTool) {
      toast({ title: "Please enter a prompt and select a tool.", variant: "destructive" });
      return;
    }
    setBusy("ai");
    try {
      const result = await getToolArguments({ prompt, schema: selectedTool.input_schema || {} });
      if (result) {
        setArgs(result);
        setArgText(pretty(result));
        toast({ title: "AI generated arguments from your prompt." });
      } else {
        toast({ title: "Could not generate arguments.", variant: "destructive" });
      }
    } catch (e) {
        toast({ title: "Failed to generate arguments.", variant: "destructive" });
    } finally {
        setBusy("idle");
    }
  }

  async function dryRun() {
    setBusy("dry"); setResult(null); setError(null);
    try {
      const schema = selectedTool?.input_schema;
      const v = validateArgs(schema, args);
      if (!v.ok) throw new Error(v.errors?.join("; "));
      setResult({
        runId: "dry-run-" + Date.now(),
        status: "ok",
        durationMs: 0,
        output: { message: "Valid input. Ready to execute.", request: payload }
      });
    } catch (e: any) {
      setResult({ runId: "dry-run-error", status: "error", error: e.message });
    } finally {
      setBusy("idle");
    }
  }

  async function execute() {
    setBusy("run"); setResult(null); setError(null);
    try {
      const schema = selectedTool?.input_schema;
      const v = validateArgs(schema, args);
      if (!v.ok) throw new Error(v.errors?.join("; "));
      
      // MOCK IMPLEMENTATION
      await new Promise(res => setTimeout(res, 800 + Math.random() * 500));
      const isSuccess = Math.random() > 0.2;
      const mockResponse: ExecuteResponse = isSuccess ? {
        runId: `run_${Date.now()}`,
        status: "ok",
        durationMs: 123,
        output: { success: true, message: `Tool '${selected}' executed successfully.`},
      } : {
        runId: `run_${Date.now()}`,
        status: "error",
        durationMs: 987,
        error: "Failed to connect to upstream service.",
        output: { success: false, error: " upstream_timeout" },
      };

      setResult(mockResponse);
      if (mockResponse.status === 'error') {
         throw new Error(mockResponse.error || `Execution failed`);
      }
    } catch (e: any) {
      setError(e?.message || "Execution failed");
      setResult({ runId: "error-run", status: "error", error: e.message });
    } finally {
      setBusy("idle");
    }
  }

  const saveFavorite = () => {
    if (!user || !firestore) {
      toast({ title: "Please sign in to save favorites.", variant: "destructive" });
      return;
    }
    if (!selectedTool) {
      toast({ title: "Please select a tool.", variant: "destructive" });
      return;
    }

    const favoriteData = {
      userId: user.uid,
      tool: selectedTool.name,
      args: args,
      prompt: prompt,
      timestamp: serverTimestamp(),
    };

    const favsCollection = collection(firestore, 'users', user.uid, 'favoriteActions');
    addDocumentNonBlocking(favsCollection, favoriteData);
    
    toast({ title: "Saved as favorite!" });
  };

  return (
    <div className="w-full space-y-6">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Actions</h1>
          <p className="text-muted-foreground">Natural language → MCP tool + args → result</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={dryRun} disabled={busy !== "idle" || !selected} variant="outline" className="rounded-lg"><BrainCircuit /> Dry Run</Button>
          <Button onClick={execute} disabled={busy !== "idle" || !selected} className="rounded-lg"><Play /> Execute</Button>
          <Button onClick={saveFavorite} variant="secondary" className="rounded-lg"><Save /> Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-6 space-y-6">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>Instruction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <textarea
                  ref={taRef}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Example: “Create a Linear ticket for failed BigQuery load, assign to me, priority high.”"
                  className="w-full resize-none rounded-xl bg-muted/50 p-4 pr-12 text-sm outline-none ring-1 ring-inset ring-border focus:ring-primary/40"
                />
                <Button variant="ghost" size="icon" onClick={getArgsFromPrompt} disabled={busy !== 'idle'} className="absolute top-2 right-2 rounded-full h-8 w-8">
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Use natural language to generate JSON arguments for the selected tool.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Choose Tool</CardTitle></CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-10 w-full rounded-xl" />
              : !tools || tools.length === 0 ? <div className="text-sm text-destructive flex items-center gap-2"><AlertCircle /> No tools available.</div>
              : (
                <Select value={selected} onValueChange={onSelectTool}>
                    <SelectTrigger className="w-full rounded-xl"><SelectValue placeholder="Select a tool" /></SelectTrigger>
                    <SelectContent>
                        {tools.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              )}
              {!!selectedTool?.description && <p className="mt-2 text-xs text-muted-foreground">{selectedTool.description}</p>}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Parameters (JSON)</CardTitle></CardHeader>
            <CardContent>
              <textarea
                spellCheck={false}
                value={argText}
                onChange={e => onArgTextChange(e.target.value)}
                className="font-mono w-full min-h-[220px] rounded-xl bg-muted/50 p-4 text-xs outline-none ring-1 ring-inset ring-border focus:ring-primary/40"
              />
              {selectedTool?.input_schema && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-muted-foreground flex items-center gap-1">View input schema <ChevronDown className="h-3 w-3" /></summary>
                  <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-background p-3 text-[11px] leading-relaxed border">{pretty(selectedTool.input_schema)}</pre>
                </details>
              )}
              {!!error && <p className="mt-3 text-xs text-destructive">{error}</p>}
            </CardContent>
          </Card>
        </section>

        <section className="col-span-12 lg:col-span-6 space-y-6">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Request Preview</CardTitle></CardHeader>
            <CardContent>
              <pre className="max-h-72 overflow-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed border">{pretty(payload)}</pre>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {busy === "run" && <div className="text-sm text-muted-foreground">Running…</div>}
              {result ? (
                <>
                  <div className="text-xs text-muted-foreground">
                    runId: <span className="text-foreground">{result.runId}</span> · status:{" "}
                    <span className={result.status === "ok" ? "text-green-500" : "text-destructive"}>{result.status}</span>
                    {typeof result.durationMs === "number" ? ` · ${result.durationMs} ms` : ""}
                  </div>
                  {result.error && <p className="text-xs text-destructive">{result.error}</p>}
                  {result.output && (
                    <pre className="max-h-[360px] overflow-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed border">{pretty(result.output)}</pre>
                  )}
                  {result.raw && (
                    <details>
                      <summary className="cursor-pointer text-xs text-muted-foreground">Raw</summary>
                      <pre className="mt-2 max-h-[300px] overflow-auto rounded-lg bg-background p-3 text-[11px] leading-relaxed border">{pretty(result.raw)}</pre>
                    </details>
                  )}
                  <div className="pt-2 flex gap-2">
                    <Button onClick={() => { navigator.clipboard.writeText(pretty(result)); toast({ title: "Copied to clipboard."}); }} variant="outline" size="sm" className="rounded-lg">Copy JSON</Button>
                    <a href={`/audit?runId=${encodeURIComponent(result.runId)}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">View in Audit</a>
                  </div>
                </>
              ) : <div className="text-sm text-muted-foreground">No result yet.</div>}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-900/20 p-4 text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-3">
             <AlertCircle className="h-4 w-4 mt-0.5"/>
            <span>Calls send a Firebase ID token in Authorization. Backend must verify every privileged request.</span>
          </Card>
        </section>
      </div>
    </div>
  );
}
