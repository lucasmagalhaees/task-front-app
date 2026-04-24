"use client"

import { useState } from "react"
import { Sparkles, X } from "lucide-react"
import { getConsulting } from "@/lib/api"
import type { ConsultingResponse } from "@/types/task"

interface Props {
  taskId: number
}

export default function ConsultingPanel({ taskId }: Props) {
  const [result, setResult] = useState<ConsultingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGenerate() {
    setLoading(true)
    setError("")
    try {
      const data = await getConsulting(taskId)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar plano.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="font-semibold">Plano de Ação com IA</h2>
        </div>
        {result && (
          <button
            onClick={() => setResult(null)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!result && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Gerando..." : "Gerar plano de ação"}
        </button>
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 rounded bg-gray-200 animate-pulse" style={{ width: `${70 + i * 8}%` }} />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {result && !loading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Plano gerado para: <strong>{result.title}</strong></p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm">
            {result.action_plan.split("\n").filter(Boolean).map((step, i) => (
              <li key={i} className="text-gray-700">
                {step.replace(/^\d+\.\s*/, "")}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
