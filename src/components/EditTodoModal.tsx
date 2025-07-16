"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Todo } from "../types/Todo"

interface EditTodoModalProps {
  isOpen: boolean
  onClose: () => void
  todo: Todo | null
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ isOpen, onClose, todo, onUpdateTodo }) => {
  const [formData, setFormData] = useState<{ title: string; description: string; dueDate: string }>({
    title: "",
    description: "",
    dueDate: "",
  })

  useEffect(() => {
    if (todo) {
      // Ensure todo.dueDate is a Date object before calling toISOString
      const dueDateString =
        todo.dueDate instanceof Date && !isNaN(todo.dueDate.getTime()) ? todo.dueDate.toISOString().slice(0, 16) : ""
      setFormData({
        title: todo.title,
        description: todo.description,
        dueDate: dueDateString,
      })
    }
  }, [todo])

  if (!isOpen || !todo) return null

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (formData.title.trim()) {
      console.log("EditTodoModal: Submitting update for todo:", todo.id, formData.title)
      onUpdateTodo(todo.id, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      })
      // onClose is called by onUpdateTodo in KanbanBoard
    }
  }

  const handleClose = (): void => {
    console.log("EditTodoModal: Closing modal")
    onClose()
  }

  // Set minimum datetime to current time
  const now = new Date()
  const minDateTime = now.toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Task</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              📅 Due Date (Optional)
            </label>
            <input
              id="edit-dueDate"
              type="datetime-local"
              value={formData.dueDate}
              min={minDateTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.dueDate && (
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, dueDate: "" }))}
                className="mt-2 text-sm text-red-700 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 px-2 py-1 rounded"
              >
                🗑️ Remove due date
              </button>
            )}
            <p className="text-xs text-gray-500 mt-1">Set or update the due date for this task</p>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTodoModal
