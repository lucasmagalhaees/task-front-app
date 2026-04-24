"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, X } from "lucide-react"
import TaskCard from "./TaskCard"
import TaskForm from "./TaskForm"
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from "@/lib/api"
import type { Task, TaskCreate } from "@/types/task"

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  const load = useCallback(async () => {
    try {
      setError("")
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tarefas.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate(data: TaskCreate) {
    const task = await createTask(data)
    setTasks((prev) => [task, ...prev])
    setShowForm(false)
  }

  async function handleUpdate(data: TaskCreate) {
    if (!editing) return
    const task = await updateTask(editing.id, data)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    setEditing(null)
  }

  async function handleToggle(id: number) {
    try {
      const task = await toggleTask(id)
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar.")
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar.")
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg border bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova tarefa
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")}><X className="h-4 w-4" /></button>
        </div>
      )}

      {(showForm || editing) && (
        <div className="rounded-lg border p-4 bg-gray-50">
          <h2 className="text-sm font-semibold mb-3">
            {editing ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <TaskForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {tasks.length === 0 && !showForm && (
        <p className="text-center text-gray-400 py-12">Nenhuma tarefa ainda.</p>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onEdit={(t) => { setEditing(t); setShowForm(false) }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
