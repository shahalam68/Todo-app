"use client"
import type React from "react"
import { AlertTriangle, X, Trash2 } from "lucide-react"
import { Todo } from "@/types/Todo"
// import type { Todo } from "../types/Todo"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  todo: Todo | null
  onDeleteTodo: (id: string) => void
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, todo, onDeleteTodo }) => {
  if (!isOpen || !todo) return null

  const handleConfirmDelete = (): void => {
    console.log("DeleteConfirmModal: Confirming delete for todo:", todo.id, todo.title)
    onDeleteTodo(todo.id)
    // onClose is called by onDeleteTodo in KanbanBoard
  }

  const handleClose = (): void => {
    console.log("DeleteConfirmModal: Closing modal (cancel)")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">Are you sure you want to delete this task? This action cannot be unDone.</p>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-1">{todo.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{todo.description || "No description"}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Status: {todo.status}</span>
              <span>Created: {todo.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
