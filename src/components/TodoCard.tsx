"use client"

import type React from "react"
import { useState } from "react"
import { Clock, AlertTriangle, Eye, Edit, Trash2, GripVertical } from "lucide-react"
import type { Todo } from "../types/Todo"

interface TodoCardProps {
  todo: Todo
  onView: (todo: Todo) => void
  onRightClick: (e: React.MouseEvent, todoId: string, status: string) => void
  onDragStart: (e: React.DragEvent, todoId: string) => void
  onSetDueDate?: (todoId: string, dueDate: Date) => void
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  showDueDate?: boolean
}

const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onView,
  onRightClick,
  onDragStart,
  onSetDueDate,
  onEdit,
  onDelete,
  showDueDate = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [showActions, setShowActions] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const handleSetDueDate = (): void => {
    if (selectedDate && onSetDueDate) {
      onSetDueDate(todo.id, new Date(selectedDate))
      setShowDatePicker(false)
      setSelectedDate("")
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: "text-blue-500"
      },
      Ongoing: {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-200",
        icon: "text-orange-500"
      },
      Done: {
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-200",
        icon: "text-green-500"
      }
    }
    return colors[status as keyof typeof colors] || {
      bg: "bg-gray-50",
      text: "text-gray-800",
      border: "border-gray-200",
      icon: "text-gray-500"
    }
  }

  const statusColors = getStatusColor(todo.status)
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status === "Ongoing"

  const handleView = (e: React.MouseEvent): void => {
    e.stopPropagation()
    onView(todo)
  }

  const handleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation()
    onEdit(todo)
  }

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation()
    onDelete(todo)
  }

  const handleDragStart = (e: React.DragEvent): void => {
    setIsDragging(true)
    onDragStart(e, todo.id)
    e.dataTransfer.setData("text/plain", todo.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = (): void => {
    setIsDragging(false)
  }

  return (
    <div
      className={`relative rounded-lg border p-4 transition-all shadow-sm select-none
        ${isDragging ? "opacity-70 scale-95 shadow-lg cursor-grabbing" : "cursor-grab hover:shadow-md"}
        ${statusColors.bg} ${statusColors.border}
        ${isOverdue ? "!bg-red-50 !border-red-200" : ""}
        hover:translate-y-[-2px] hover:shadow-md`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onContextMenu={(e) => onRightClick(e, todo.id, todo.status)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag Handle */}
      <div className={`absolute left-2 top-2 ${statusColors.icon} cursor-grab active:cursor-grabbing`}>
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Action Buttons */}
      {showActions && !isDragging && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm rounded-md shadow-lg border border-gray-200 p-1">
          <button
            onClick={handleView}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-start justify-between mb-2 pr-20 pl-6">
        <h3 className={`text-sm font-medium flex-1 ${statusColors.text}`}>
          {todo.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${statusColors.bg} ${statusColors.border} ${statusColors.text}`}>
          {todo.status}
        </span>
      </div>

      <div className="pl-6">
        <p className={`text-sm mb-3 line-clamp-2 ${statusColors.text}`}>
          {todo.description}
        </p>

        {/* Due Date Section */}
        {todo.dueDate && (
          <div
            className={`flex items-center gap-2 text-sm mb-3 p-2 rounded-md ${
              isOverdue
                ? "bg-red-100 border-red-200 text-red-800"
                : "bg-amber-100 border-amber-200 text-amber-800"
            } border`}
          >
            <Clock className={`w-4 h-4 ${isOverdue ? "text-red-600" : "text-amber-600"}`} />
            <span className="font-medium">Due: {todo.dueDate.toLocaleString()}</span>
            {isOverdue && (
              <div className="flex items-center gap-1 ml-auto">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-bold">OVERDUE</span>
              </div>
            )}
          </div>
        )}

        {/* Due Date Setter */}
        {showDueDate && todo.status === "Ongoing" && !todo.dueDate && (
          <div className="space-y-2 mb-3">
            {!showDatePicker ? (
              <button
                onClick={() => setShowDatePicker(true)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors
                  ${statusColors.bg} ${statusColors.border} ${statusColors.text} hover:bg-opacity-70`}
              >
                <Clock className={`w-3 h-3 ${statusColors.icon}`} />
                Set Due Date
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSetDueDate}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                >
                  Set
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded border transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className={`flex justify-between items-center text-xs ${statusColors.text} opacity-70`}>
          <span>Created: {todo.createdAt.toLocaleDateString()}</span>
          {todo.completedAt && <span>Completed: {todo.completedAt.toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  )
}

export default TodoCard