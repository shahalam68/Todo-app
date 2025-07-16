"use client"

import type React from "react"
import type { ContextMenu } from "../types/Todo"

interface ContextMenuProps {
  contextMenu: ContextMenu | null
  options: string[]
  onMove: (todoId: string, newStatus: "new" | "Ongoing" | "Done") => void
}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({ contextMenu, options, onMove }) => {
  if (!contextMenu) return null

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50"
      style={{ left: contextMenu.x, top: contextMenu.y }}
    >
      {options.map((status) => (
        <button
          key={status}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
          onClick={() => onMove(contextMenu.todoId, status as "new" | "Ongoing" | "Done")}
        >
          Move to {status}
        </button>
      ))}
    </div>
  )
}

export default ContextMenuComponent
