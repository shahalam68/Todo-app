export interface Todo {
  id: string
  title: string
  description: string
  status: "new" | "Ongoing" | "Done"
  createdAt: Date
  dueDate?: Date
  completedAt?: Date
}

export interface ContextMenu {
  x: number
  y: number
  todoId: string
  currentStatus: string
}

export interface NewTodo {
  title: string
  description: string
  dueDate?: string
}

export interface EditTodo {
  id: string
  title: string
  description: string
  dueDate?: string
}

export interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  duration?: number
}
