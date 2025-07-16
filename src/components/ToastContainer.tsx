"use client"

import type React from "react"
import { useEffect } from "react"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"
import { useTodoStore } from "../store/todoStore"
import type { Toast } from "../types/Todo"

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTodoStore()

  const getToastIcon = (type: Toast["type"]): React.ReactNode => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getToastStyles = (type: Toast["type"]): string => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
          icon={getToastIcon(toast.type)}
          styles={getToastStyles(toast.type)}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
  icon: React.ReactNode
  styles: string
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, icon, styles }) => {
  useEffect(() => {
    // Auto-remove toast if no duration is set (fallback)
    if (toast.duration) {
      // Only set timeout if duration is explicitly provided
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div className={`${styles} border rounded-lg shadow-lg p-4 animate-in slide-in-from-right-full duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{toast.title}</h4>
          <p className="text-sm opacity-90 mt-1">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 p-1 hover:bg-black/10 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ToastContainer
