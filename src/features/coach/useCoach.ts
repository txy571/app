import { useState } from 'react'
import { sendChatRequest } from '../../lib/api'
import { SYSTEM_PROMPT, buildUserMessage } from '../../lib/prompts'
import type { Todo } from '../plan/useTodos'

export interface CoachState {
  response: string | null
  loading: boolean
  error: string | null
}

export function useCoach() {
  const [state, setState] = useState<CoachState>({
    response: null,
    loading: false,
    error: null,
  })

  const generateReview = async (
    todos: Todo[],
    todayWeight: number | null,
    apiKey: string,
    baseUrl: string,
    modelName: string,
  ) => {
    if (!apiKey) {
      setState((prev) => ({ ...prev, error: '请先在设置中配置 API Key' }))
      return
    }

    setState({ response: null, loading: true, error: null })

    try {
      const completedTasks = todos.filter((t) => t.completed).map((t) => t.text)
      const uncompletedTasks = todos.filter((t) => !t.completed).map((t) => t.text)

      const userMessage = buildUserMessage({
        currentWeight: todayWeight,
        completedTasks,
        uncompletedTasks,
      })

      const content = await sendChatRequest({
        baseUrl,
        apiKey,
        modelName,
        systemPrompt: SYSTEM_PROMPT,
        userMessage,
      })

      setState({ response: content, loading: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      setState({ response: null, loading: false, error: message })
    }
  }

  const clearResponse = () => {
    setState({ response: null, loading: false, error: null })
  }

  return { ...state, generateReview, clearResponse }
}
