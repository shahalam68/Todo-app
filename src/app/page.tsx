"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { useTodoStore } from "@/store/todoStore"
import { ContextMenu, Todo } from "@/types/Todo"
import KanbanColumn from "@/components/KanbanColumn"
import AddTodoModal from "@/components/AddTodoModal"
import EditTodoModal from "@/components/EditTodoModal"
import DeleteConfirmModal from "@/components/DeleteConfirmModal"
import TodoDetailsModal from "@/components/TodoDetailsModal"
import ContextMenuComponent from "@/components/ContextMenu"
import ToastContainer from "@/components/ToastContainer"
// import { useTodoStore } from "../src/store/todoStore"
// import type { Todo, ContextMenu } from "../src/types/Todo"

// Import components
// import KanbanColumn from "../src/components/KanbanColumn"
// import AddTodoModal from "../src/components/AddTodoModal"
// import EditTodoModal from "../src/components/EditTodoModal"
// import DeleteConfirmModal from "../src/components/DeleteConfirmModal"
// import ContextMenuComponent from "../src/components/ContextMenu"
// import TodoDetailsModal from "../src/components/TodoDetailsModal"
// import ToastContainer from "../src/components/ToastContainer"

export default function KanbanTodo(): React.JSX.Element {
  const { todos, addTodo, updateTodo, deleteTodo, moveTodo, setDueDate, addToast } = useTodoStore()

  // Local UI states
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null)
  const [overdueAlerts, setOverdueAlerts] = useState<string[]>([])

  // Check for overdue tasks
  const checkOverdueTasks = (): void => {
    const now = new Date()
    const overdue = todos
      .filter((todo) => todo.status === "Ongoing" && todo.dueDate && new Date(todo.dueDate) < now)
      .map((todo) => todo.id)
    setOverdueAlerts(overdue)
  }

  useEffect(() => {
    const interval = setInterval(checkOverdueTasks, 60000) // Check every minute
    checkOverdueTasks() // Check immediately on mount

    return () => clearInterval(interval)
  }, [todos]) // Re-run when todos change to update alerts

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (): void => setContextMenu(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleAddTodo = (newTodoData: Omit<Todo, "id" | "createdAt">): void => {
    addTodo(newTodoData)
    setIsAddDialogOpen(false)
  }

  const handleUpdateTodo = (id: string, updates: Partial<Todo>): void => {
    updateTodo(id, updates)
    setIsEditDialogOpen(false)
    setSelectedTodo(null) // Clear selected todo after update
  }

  const handleDeleteTodo = (id: string): void => {
    deleteTodo(id)
    setIsDeleteDialogOpen(false)
    setSelectedTodo(null) // Clear selected todo after deletion
    setOverdueAlerts((prev) => prev.filter((alertId) => alertId !== id)) // Also remove from alerts
  }

  const handleMoveTodo = (todoId: string, newStatus: Todo["status"]): void => {
    moveTodo(todoId, newStatus)
    setContextMenu(null)
  }

  const handleSetDueDate = (todoId: string, dueDate: Date): void => {
    setDueDate(todoId, dueDate)
  }

  const handleRightClick = (e: React.MouseEvent, todoId: string, status: string): void => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      todoId,
      currentStatus: status,
    })
  }

  const handleDragStart = (e: React.DragEvent, todoId: string): void => {
    setDraggedTodoId(todoId)
    e.dataTransfer.effectAllowed = "move"
    console.log("KanbanBoard: Drag started for todo:", todoId)
  }

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: Todo["status"]): void => {
    e.preventDefault()
    if (draggedTodoId) {
      console.log("KanbanBoard: Dropping todo:", draggedTodoId, "to status:", newStatus)
      handleMoveTodo(draggedTodoId, newStatus)
      setDraggedTodoId(null)
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Ongoing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Done":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getColumnTodos = (status: Todo["status"]): Todo[] => {
    return todos.filter((todo) => todo.status === status)
  }

  const getContextMenuOptions = (currentStatus: string): string[] => {
    const allStatuses = ["new", "Ongoing", "Done"]
    return allStatuses.filter((status) => status !== currentStatus)
  }

  const dismissAlert = (todoId: string): void => {
    setOverdueAlerts((prev) => prev.filter((id) => id !== todoId))
  }

  const openTodoDetails = (todo: Todo): void => {
    setSelectedTodo(todo)
  }

  const openEditModal = (todo: Todo): void => {
    console.log("KanbanBoard: Opening edit modal for todo:", todo.id)
    setSelectedTodo(todo)
    setIsEditDialogOpen(true)
  }

  const openDeleteModal = (todo: Todo): void => {
    console.log("KanbanBoard: Opening delete modal for todo:", todo.id)
    setSelectedTodo(todo)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Kanban Todo Board
          </h1>
          <p className="text-gray-700 text-lg">Manage your tasks across different stages</p>
          <p className="text-sm text-gray-500 mt-2">
            💡 <strong>Tip:</strong> Drag tasks between columns or right-click for quick actions
          </p>
        </div>

        {/* Overdue Alerts */}
        {overdueAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {overdueAlerts.map((todoId) => {
              const todo = todos.find((t) => t.id === todoId)
              return todo ? (
                <div
                  key={todoId}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-800">
                      Task "{todo.title}" is overdue! Due: {todo.dueDate?.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => dismissAlert(todoId)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Column */}
          <KanbanColumn
            title="New"
            status="new"
            color="blue"
            todos={getColumnTodos("new")}
            onAddTask={() => setIsAddDialogOpen(true)}
            onViewTask={openTodoDetails}
            onRightClick={handleRightClick}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onEditTask={openEditModal}
            onDeleteTask={openDeleteModal}
            showAddButton={true}
          />

          {/* Ongoing Column */}
          <KanbanColumn
            title="Ongoing"
            status="Ongoing"
            color="orange"
            todos={getColumnTodos("Ongoing")}
            onViewTask={openTodoDetails}
            onRightClick={handleRightClick}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onSetDueDate={handleSetDueDate}
            onEditTask={openEditModal}
            onDeleteTask={openDeleteModal}
            showDueDate={true}
          />

          {/* Done Column */}
          <KanbanColumn
            title="Done"
            status="Done"
            color="green"
            todos={getColumnTodos("Done")}
            onViewTask={openTodoDetails}
            onRightClick={handleRightClick}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onEditTask={openEditModal}
            onDeleteTask={openDeleteModal}
          />
        </div>

        {/* Modals */}
        <AddTodoModal isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAddTodo={handleAddTodo} />
        <EditTodoModal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          todo={selectedTodo}
          onUpdateTodo={handleUpdateTodo}
        />
        <DeleteConfirmModal
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          todo={selectedTodo}
          onDeleteTodo={handleDeleteTodo}
        />
        <TodoDetailsModal
          isOpen={!!selectedTodo && !isEditDialogOpen && !isDeleteDialogOpen} // Only open if selectedTodo exists and other modals are closed
          onClose={() => setSelectedTodo(null)}
          todo={selectedTodo}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onMoveTodo={handleMoveTodo}
        />

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenuComponent
            contextMenu={contextMenu}
            options={getContextMenuOptions(contextMenu.currentStatus)}
            onMove={handleMoveTodo}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  )
}
