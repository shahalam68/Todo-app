"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import type { Todo } from "../types/Todo"
import TodoCard from "./TodoCard"

interface KanbanColumnProps {
  title: string
  status: Todo["status"]
  color: "blue" | "orange" | "green"
  todos: Todo[]
  onAddTask?: () => void
  onViewTask: (todo: Todo) => void
  onRightClick: (e: React.MouseEvent, todoId: string, status: string) => void
  onDragStart: (e: React.DragEvent, todoId: string) => void
  onDrop: (e: React.DragEvent, newStatus: Todo["status"]) => void
  onSetDueDate?: (todoId: string, dueDate: Date) => void
  onEditTask: (todo: Todo) => void
  onDeleteTask: (todo: Todo) => void
  showAddButton?: boolean
  showDueDate?: boolean
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  color,
  todos,
  onAddTask,
  onViewTask,
  onRightClick,
  onDragStart,
  onDrop,
  onSetDueDate,
  onEditTask,
  onDeleteTask,
  showAddButton = false,
  showDueDate = false,
}) => {
  const [draggedOver, setDraggedOver] = useState<boolean>(false)

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDraggedOver(true)
  }

  const handleDragEnter = (e: React.DragEvent): void => {
    e.preventDefault()
    setDraggedOver(true)
  }

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault()
    // Only set draggedOver to false if we're leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(false)
    }
  }

  const handleColumnDrop = (e: React.DragEvent): void => {
    onDrop(e, status) // Pass the drop event and column status up to KanbanBoard
    setDraggedOver(false)
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          dot: "bg-blue-500",
          button: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
          dragOver: "border-blue-300 bg-blue-50",
        }
      case "orange":
        return {
          dot: "bg-orange-500",
          button: "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700",
          dragOver: "border-orange-300 bg-orange-50",
        }
      case "green":
        return {
          dot: "bg-green-500",
          button: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
          dragOver: "border-green-300 bg-green-50",
        }
      default:
        return {
          dot: "bg-gray-500",
          button: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
          dragOver: "border-gray-300 bg-gray-50",
        }
    }
  }

  const colorClasses = getColorClasses(color)

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-2 transition-all duration-200 p-4 ${
        draggedOver ? `${colorClasses.dragOver} border-dashed` : "border-white/20 border-solid"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleColumnDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${colorClasses.dot} rounded-full`}></div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{todos.length}</span>
        </div>
        {showAddButton && onAddTask && (
          <button
            onClick={onAddTask}
            className={`${colorClasses.button} text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors`}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      {draggedOver && (
        <div className="text-center py-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-sm">Drop task here to move to {title}</p>
        </div>
      )}

      <div className="space-y-3 min-h-[400px]">
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onView={onViewTask}
            onRightClick={onRightClick}
            onDragStart={onDragStart}
            onSetDueDate={onSetDueDate}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            showDueDate={showDueDate}
          />
        ))}
      </div>
    </div>
  )
}

export default KanbanColumn
