import { Toast, Todo } from "@/types/Todo"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"


interface TodoState {
  todos: Todo[]
  toasts: Toast[]
}

interface TodoActions {
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  moveTodo: (id: string, status: Todo["status"]) => void
  setDueDate: (id: string, dueDate: Date) => void
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name)
    if (!str) return null

    try {
      const parsed = JSON.parse(str)
      
      if (parsed.state?.todos) {
        parsed.state.todos = parsed.state.todos.map((todo: any) => ({
          ...todo,
          createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date(), 
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        }))
      }
      return parsed
    } catch (error) {
      console.error("Error parsing stored data:", error)
      return null
    }
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
  },
}

export const useTodoStore = create<TodoState & TodoActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        todos: [],
        toasts: [],

        // Actions for Todos
        addTodo: (todo) => {
          const newTodo: Todo = {
            ...todo,
            id: Date.now().toString(),
            createdAt: new Date(),
          }
          console.log("Zustand Store: Adding todo:", newTodo.title)
          set((state) => ({
            todos: [newTodo, ...state.todos],
          }))
          get().addToast({
            type: "success",
            title: "Task Created",
            message: `"${newTodo.title}" has been added successfully!`,
            duration: 3000,
          })
        },

        updateTodo: (id, updates) => {
          const todo = get().todos.find((t) => t.id === id)
          console.log("Zustand Store: Updating todo:", id, updates)
          set((state) => ({
            todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          }))
          if (todo) {
            get().addToast({
              type: "success",
              title: "Task Updated",
              message: `"${todo.title}" has been updated successfully!`,
              duration: 3000,
            })
          }
        },

        deleteTodo: (id) => {
          const todo = get().todos.find((t) => t.id === id)
          console.log("Zustand Store: Deleting todo:", id)
          set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
          }))
          if (todo) {
            get().addToast({
              type: "success",
              title: "Task Deleted",
              message: `"${todo.title}" has been deleted successfully!`,
              duration: 3000,
            })
          }
        },

        moveTodo: (id, status) => {
          const todo = get().todos.find((t) => t.id === id)
          console.log("Zustand Store: Moving todo:", id, "to", status)
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: status,
                    completedAt: status === "Done" ? new Date() : t.completedAt,
                  }
                : t,
            ),
          }))
          if (todo) {
            const statusLabels = { new: "New", Ongoing: "Ongoing", Done: "Done" }
            get().addToast({
              type: "info",
              title: "Task Moved",
              message: `"${todo.title}" moved to ${statusLabels[status]}`,
              duration: 2000,
            })
          }
        },

        setDueDate: (id, dueDate) => {
          const todo = get().todos.find((t) => t.id === id)
          console.log("Zustand Store: Setting due date for todo:", id, dueDate)
          set((state) => ({
            todos: state.todos.map((t) => (t.id === id ? { ...t, dueDate: dueDate } : t)),
          }))
          if (todo) {
            get().addToast({
              type: "info",
              title: "Due Date Set",
              message: `Due date set for "${todo.title}"`,
              duration: 2000,
            })
          }
        },

        
        addToast: (toast) => {
          const id = Date.now().toString()
          const newToast: Toast = { ...toast, id }
          console.log("Zustand Store: Adding toast:", newToast.title)
          set((state) => ({
            toasts: [...state.toasts, newToast],
          }))
          if (toast.duration) {
            setTimeout(() => {
              get().removeToast(id)
            }, toast.duration)
          }
        },

        removeToast: (id) => {
          console.log("Zustand Store: Removing toast:", id)
          set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
          }))
        },

        clearToasts: () => {
          console.log("Zustand Store: Clearing all toasts")
          set({ toasts: [] })
        },
      }),
      {
        name: "kanban-todo-storage",
        storage: customStorage,
        partialize: (state) => ({
          todos: state.todos,
        }),
      },
    ),
    {
      name: "todo-store",
    },
  ),
)
