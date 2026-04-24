import type { Task, TaskCreate, ConsultingResponse } from "@/types/task"

const BASE = process.env.NEXT_PUBLIC_API_URL

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(body.detail ?? res.statusText)
  }
  return res.json()
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`)
  return handleResponse(res)
}

export async function getTask(id: number): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`)
  return handleResponse(res)
}

export async function createTask(data: TaskCreate): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateTask(id: number, data: TaskCreate): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function toggleTask(id: number): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}/toggle`, { method: "PUT" })
  return handleResponse(res)
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(body.detail ?? res.statusText)
  }
}

export async function getConsulting(id: number): Promise<ConsultingResponse> {
  const res = await fetch(`${BASE}/tasks/${id}/consulting`)
  return handleResponse(res)
}
