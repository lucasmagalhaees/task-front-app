"use client"

import { useState, useEffect } from "react"
import type { Task, TaskCreate } from "@/types/task"

interface Props {
  initial?: Task
  onSubmit: (data: TaskCreate) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [done, setDone] = useState(initial?.done ?? false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description ?? "")
      setDone(initial.done)
    }
  }, [initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError("O título é obrigatório.")
      return
    }
    setError("")
    setLoading(true)
    try {
      await onSubmit({ title: title.trim(), description: description || null, done })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o título da tarefa"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Descrição opcional"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="done"
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-blue-600"
        />
        <label htmlFor="done" className="text-sm">
          Marcar como concluída
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Salvando..." : initial ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  )
}
