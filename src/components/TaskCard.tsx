"use client"

import Link from "next/link"
import { Trash2, Pencil, CheckCircle2, Circle, ExternalLink } from "lucide-react"
import type { Task } from "@/types/task"

interface Props {
  task: Task
  onToggle: (id: number) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 transition-opacity ${
        task.done ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="mt-0.5 shrink-0 text-gray-400 hover:text-green-500 transition-colors"
        aria-label={task.done ? "Marcar como pendente" : "Marcar como concluída"}
      >
        {task.done ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <Link href={`/tasks/${task.id}`}>
          <span
            className={`font-medium hover:underline cursor-pointer ${
              task.done ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </span>
        </Link>
        {task.description && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">{task.description}</p>
        )}
      </div>

      <span
        className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
          task.done
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {task.done ? "Concluída" : "Pendente"}
      </span>

      <div className="shrink-0 flex gap-1">
        <Link
          href={`/tasks/${task.id}`}
          className="p-1.5 rounded hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
          aria-label="Ver detalhes e plano de ação"
          title="Ver detalhes / Plano de ação IA"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Deletar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
