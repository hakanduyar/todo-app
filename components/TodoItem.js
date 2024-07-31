import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mr-2"
        />
        <span className={todo.completed ? "line-through" : ""}>
          {todo.title}
        </span>
      </div>
      <button onClick={() => onDelete(todo.id)} className="text-red-500">
        Sil
      </button>
    </div>
  );
}
