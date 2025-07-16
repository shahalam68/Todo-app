"use client";
import type React from "react";
import {
  Clock,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { Todo } from "../types/Todo";

interface TodoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMoveTodo: (todoId: string, newStatus: Todo["status"]) => void;
}

const TodoDetailsModal: React.FC<TodoDetailsModalProps> = ({
  isOpen,
  onClose,
  todo,
  onEdit,
  onDelete,
  onMoveTodo,
}) => {
  if (!isOpen || !todo) return null;

  const handleClose = (): void => {
    console.log("TodoDetailsModal: Closing modal");
    onClose();
  };

  const handleEdit = (): void => {
    console.log(
      "TodoDetailsModal: Edit clicked for todo:",
      todo.id,
      todo.title
    );
    onEdit(todo);
  };

  const handleDelete = (): void => {
    console.log(
      "TodoDetailsModal: Delete clicked for todo:",
      todo.id,
      todo.title
    );
    onDelete(todo);
  };

  const handleMove = (newStatus: Todo["status"]): void => {
    console.log("TodoDetailsModal: Moving todo:", todo.id, "to", newStatus);
    onMoveTodo(todo.id, newStatus);
    handleClose();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ongoing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailableStatuses = (): { key: Todo["status"]; label: string }[] => {
    const allStatuses: { key: Todo["status"]; label: string }[] = [
      { key: "new", label: "New" },
      { key: "Ongoing", label: "Ongoing" },
      { key: "Done", label: "Done" },
    ];
    return allStatuses.filter((status) => status.key !== todo.status);
  };

  const isOverdue =
    todo.dueDate &&
    new Date(todo.dueDate) < new Date() &&
    todo.status === "Ongoing";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="space-y-4">
            {/* Title and Status */}
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex-1 break-words">
                {todo.title}
              </h2>
              <span
                className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(
                  todo.status
                )} capitalize shrink-0 ml-2`}
              >
                {todo.status}
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h4>
              <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                <p className="text-gray-600 whitespace-pre-wrap break-words">
                  {todo.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Due Date */}
            {todo.dueDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </h4>
                <div
                  className={`flex items-center gap-2 p-3 rounded-md ${
                    isOverdue
                      ? "text-red-700 bg-red-100 border border-red-200"
                      : "text-orange-700 bg-orange-50 border border-orange-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {todo.dueDate.toLocaleString()}
                  </span>
                  {isOverdue && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-bold text-red-800">OVERDUE</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span>
                <br />
                {todo.createdAt.toLocaleString()}
              </div>
              {todo.completedAt && (
                <div>
                  <span className="font-medium">Completed:</span>
                  <br />
                  {todo.completedAt.toLocaleString()}
                </div>
              )}
            </div>

            {/* Move Actions */}
            {getAvailableStatuses().length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Move to:
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {getAvailableStatuses().map((status) => (
                    <button
                      key={status.key}
                      onClick={() => handleMove(status.key)}
                      className="flex items-center gap-1 text-black px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Task
            </button>
            <button
              onClick={handleDelete}
               className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailsModal;