"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import type { Todo } from "../types/Todo"

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTodo: (newTodoData: Omit<Todo, "id" | "createdAt">) => void
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, onClose, onAddTodo }) => {
  const [formData, setFormData] = useState<{ title: string; description: string; dueDate: string }>({
    title: "",
    description: "",
    dueDate: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (formData.title.trim()) {
      onAddTodo({
        title: formData.title,
        description: formData.description,
        status: "new",
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      })
      setFormData({ title: "", description: "", dueDate: "" }) // Reset form
    }
  }

  const handleClose = (): void => {
    setFormData({ title: "", description: "", dueDate: "" }) // Reset form on close
    onClose()
  }

  // Set minimum datetime to current time
  const now = new Date()
  const minDateTime = now.toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              📅 Due Date (Optional)
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              min={minDateTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty if no due date is needed</p>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddTodoModal
