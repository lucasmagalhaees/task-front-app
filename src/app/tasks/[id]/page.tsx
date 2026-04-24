"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"
import ConsultingPanel from "@/components/ConsultingPanel"
import { getTask } from "@/lib/api"
import type { Task } from "@/types/task"

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getTask(Number(id))
      .then(setTask)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar tarefa."))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-24 w-full rounded bg-gray-200 animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.push("/")} className="text-blue-600 hover:underline">
          Voltar para a lista
        </button>
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <div className="rounded-lg border bg-white p-6 space-y-3">
        <div className="flex items-start gap-3">
          {task.done ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
          ) : (
            <Circle className="mt-0.5 h-5 w-5 text-gray-400 shrink-0" />
          )}
          <div>
            <h1
              className={`text-xl font-bold ${task.done ? "line-through text-gray-400" : ""}`}
            >
              {task.title}
            </h1>
            <span
              className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                task.done
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {task.done ? "Concluída" : "Pendente"}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm pl-8">{task.description}</p>
        )}
      </div>

      <ConsultingPanel taskId={task.id} />
    </div>
  )
}
