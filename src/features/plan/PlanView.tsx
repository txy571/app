import { useState, useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTodos } from './useTodos'

export default function PlanView() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos()
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const text = inputValue.trim()
    if (text) {
      addTodo(text)
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div>
      {/* Date header */}
      <p className="text-sm text-gray-400 font-medium mb-3">
        {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })} · 今日任务
      </p>

      {/* Input area */}
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加新任务..."
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        <button
          onClick={handleAdd}
          className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Plus size={16} />
          添加
        </button>
      </div>

      {/* Task list */}
      {todos.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">今天还没有安排任务哦</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                todo.completed
                  ? 'bg-gray-50 border-transparent'
                  : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                    todo.completed
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-gray-300'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-all duration-200 ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'
                  }`}
                >
                  {todo.text}
                </span>
              </button>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-gray-300 hover:text-red-500 p-1 transition-colors shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
