"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import type { Todo } from "../types/Todo"
import TodoCard from "./TodoCard"

interface KanbanColumnProps {
  title: string
  status: Todo["status"]
  color: "blue" | "orange" | "green" | "purple" | "red" | "pink" // Added more color options
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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(false)
    }
  }

  const handleColumnDrop = (e: React.DragEvent): void => {
    onDrop(e, status)
    setDraggedOver(false)
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          dot: "bg-blue-500",
          button: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
          dragOver: "border-blue-300 bg-blue-50",
          columnBg: "bg-gradient-to-b from-blue-50 to-blue-100/50",
          headerBg: "bg-blue-100/70",
        }
      case "orange":
        return {
          dot: "bg-orange-500",
          button: "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700",
          dragOver: "border-orange-300 bg-orange-50",
          columnBg: "bg-gradient-to-b from-orange-50 to-orange-100/50",
          headerBg: "bg-orange-100/70",
        }
      case "green":
        return {
          dot: "bg-green-500",
          button: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
          dragOver: "border-green-300 bg-green-50",
          columnBg: "bg-gradient-to-b from-green-50 to-green-100/50",
          headerBg: "bg-green-100/70",
        }
      case "purple":
        return {
          dot: "bg-purple-500",
          button: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700",
          dragOver: "border-purple-300 bg-purple-50",
          columnBg: "bg-gradient-to-b from-purple-50 to-purple-100/50",
          headerBg: "bg-purple-100/70",
        }
      case "red":
        return {
          dot: "bg-red-500",
          button: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
          dragOver: "border-red-300 bg-red-50",
          columnBg: "bg-gradient-to-b from-red-50 to-red-100/50",
          headerBg: "bg-red-100/70",
        }
      case "pink":
        return {
          dot: "bg-pink-500",
          button: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700",
          dragOver: "border-pink-300 bg-pink-50",
          columnBg: "bg-gradient-to-b from-pink-50 to-pink-100/50",
          headerBg: "bg-pink-100/70",
        }
      default:
        return {
          dot: "bg-gray-500",
          button: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
          dragOver: "border-gray-300 bg-gray-50",
          columnBg: "bg-gradient-to-b from-gray-50 to-gray-100/50",
          headerBg: "bg-gray-100/70",
        }
    }
  }

  const colorClasses = getColorClasses(color)

  return (
    <div
      className={`rounded-lg shadow-lg border-2 transition-all duration-200 p-0 overflow-hidden ${
        draggedOver ? `${colorClasses.dragOver} border-dashed` : "border-transparent"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleColumnDrop}
    >
      <div className={`${colorClasses.columnBg} h-full`}>
        <div className={`${colorClasses.headerBg} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${colorClasses.dot} rounded-full`}></div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <span className="bg-white/70 text-gray-600 text-xs px-2 py-1 rounded-full">
                {todos.length}
              </span>
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
        </div>

        {draggedOver && (
          <div className="text-center py-4 mx-4 my-2 border-2 border-dashed border-gray-300 rounded-lg bg-white/70">
            <p className="text-gray-500 text-sm">Drop task here to move to {title}</p>
          </div>
        )}

        <div className="p-4 space-y-3 min-h-[400px]">
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
    </div>
  )
}

export default KanbanColumn