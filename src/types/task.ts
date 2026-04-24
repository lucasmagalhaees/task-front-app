export interface Task {
  id: number
  title: string
  description: string | null
  done: boolean
}

export interface TaskCreate {
  title: string
  description?: string | null
  done?: boolean
}

export interface ConsultingResponse {
  task_id: number
  title: string
  action_plan: string
}
