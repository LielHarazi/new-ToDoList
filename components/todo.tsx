"use client";

import { Btn } from "zvijude/btns";
import { Input } from "zvijude/form";
import {
  addTask,
  deleteTask,
  toggleCompleted,
  addCategory,
  updateTaskCategory,
} from "@/app/actions";
import { getFormData } from "zvijude/form/funcs";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  categoryId?: number;
  categoryName?: string;
  createdAt: string;
  completedAt?: string;
}

export default function TodosComp({
  todos = [],
  categories = [],
}: {
  todos?: Todo[];
  categories?: any[];
}) {
  const makeOptions = (extra = true) => (
    <>
      {extra && <option value="">General</option>}
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </>
  );

  const grouped = todos.reduce((acc, t) => {
    const cat = t.categoryName || "General";
    (acc[cat] ||= []).push(t);
    return acc;
  }, {} as Record<string, Todo[]>);

  async function handleAddTask(e) {
    const data = getFormData(e);
    await addTask(data);
    e.target.reset();
  }

  async function handleAddCategory(e) {
    const data = getFormData(e);
    await addCategory(data);
    e.target.reset();
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Todo</h1>

      <form onSubmit={handleAddTask} className="space-y-3 mb-8">
        <Input name="text" lbl="Todo" placeholder="Enter task..." required />
        <div className="flex gap-2">
          <select
            name="categoryId"
            className="flex-1 px-3 py-2 border rounded-lg"
          >
            {makeOptions()}
          </select>
          <Btn type="submit" lbl="Add Task" />
        </div>
      </form>

      <form onSubmit={handleAddCategory} className="flex gap-2 mb-8">
        <Input name="name" placeholder="New category..." />
        <Btn type="submit" lbl="+ Category" />
      </form>

      <h2 className="text-xl font-semibold mb-4">Todos ({todos.length})</h2>

      {todos.length === 0 ? (
        <p className="text-gray-500 italic">No todos yet</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, tasks]) => (
            <div key={cat}>
              <h3 className="font-bold mb-2">
                {cat} ({tasks.length})
              </h3>
              <div className="space-y-2">
                {tasks.map(
                  ({ id, text, completed, categoryId, categoryName }) => (
                    <div
                      key={id}
                      className={`flex gap-3 p-2 border rounded ${
                        completed ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <Btn
                        onClick={() => toggleCompleted(id, completed)}
                        lbl={completed ? "✓" : "○"}
                        className={`w-8 h-8 text-sm ${
                          completed ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}
                      />

                      <span
                        className={`flex-1 ${
                          completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {text}
                      </span>

                      <select
                        value={categoryId || ""}
                        onChange={(e) =>
                          updateTaskCategory(id, Number(e.target.value))
                        }
                        className="px-3 py-1 pr-8 border rounded text-sm min-w-[120px]"
                      >
                        {makeOptions()}
                      </select>

                      <Btn
                        onClick={() => deleteTask(id)}
                        lbl="×"
                        className="bg-red-500 text-white w-8 h-8"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
