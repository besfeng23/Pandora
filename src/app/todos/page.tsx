
"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const initialTodos: Todo[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  text: `Task number ${i + 1}`,
  completed: i < 5,
}));

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const addTodo = () => {
      if (newTodo.trim() === "") return;
      const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
      setTodos([...todos, { id: newId, text: newTodo, completed: false }]);
      setNewTodo("");
  }

  const deleteTodo = (id: number) => {
      setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <Card className="rounded-2xl shadow-lg h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-3xl font-semibold">Todo List</CardTitle>
        <CardDescription>You have 100 tasks to complete. Good luck!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="flex gap-2 mb-4">
            <Input 
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
                placeholder="Add a new task..." 
                className="rounded-xl"
            />
            <Button onClick={addTodo} className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
        </div>

        <ScrollArea className="flex-grow pr-4">
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors cursor-pointer group",
                  todo.completed ? "bg-muted/50 text-muted-foreground" : "bg-card hover:bg-muted/30"
                )}
                onClick={() => toggleTodo(todo.id)}
              >
                <div className={cn(
                    "flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 transition-all",
                    todo.completed ? "bg-primary border-primary text-primary-foreground" : "border-gray-300 group-hover:border-primary"
                )}>
                  {todo.completed && <Check className="h-4 w-4" />}
                </div>
                <span className={cn("flex-grow", todo.completed && "line-through")}>
                  {todo.text}
                </span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
