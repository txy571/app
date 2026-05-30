import { useCallback } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export interface Todo {
  id: number
  text: string
  completed: boolean
}

const DEFAULT_TODOS: Todo[] = [
  { id: 1, text: '完成C语言二叉树遍历实验', completed: false },
  { id: 2, text: '跑步 3 公里', completed: false },
]

let nextId = 3

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', DEFAULT_TODOS)

  const addTodo = useCallback(
    (text: string) => {
      const id = nextId++
      setTodos((prev) => [...prev, { id, text, completed: false }])
    },
    [setTodos],
  )

  const toggleTodo = useCallback(
    (id: number) => {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    },
    [setTodos],
  )

  const removeTodo = useCallback(
    (id: number) => {
      setTodos((prev) => prev.filter((t) => t.id !== id))
    },
    [setTodos],
  )

  return { todos, addTodo, toggleTodo, removeTodo }
}
