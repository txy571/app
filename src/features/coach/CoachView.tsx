import { Zap } from 'lucide-react'
import { useTodos } from '../plan/useTodos'
import { useHealthData } from '../health/useHealthData'
import { useCoach } from './useCoach'
import CoachMessage from './CoachMessage'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Settings } from '../settings/useSettings'

export default function CoachView() {
  const { todos } = useTodos()
  const { todayWeight } = useHealthData()
  const { response, loading, error, generateReview, clearResponse } = useCoach()
  const [settings] = useLocalStorage<Settings>('settings', {
    provider: 'deepseek',
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    modelName: 'deepseek-chat',
    goalWeight: 65,
  })

  const handleGenerate = () => {
    generateReview(todos, todayWeight, settings.apiKey, settings.baseUrl, settings.modelName)
  }

  return (
    <div>
      {/* AI button */}
      <div className="text-center py-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base py-4 px-8 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
            !response && !loading ? 'animate-breathe' : ''
          }`}
        >
          <Zap size={20} />
          {loading ? '正在分析...' : response ? '重新生成复盘' : '生成今日复盘'}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          {loading ? '正在分析你的今日数据...' : response ? '' : '点击后读取你的任务和体重数据'}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <p className="text-sm text-gray-500">🤔 正在分析你的今日数据...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={handleGenerate}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            重试
          </button>
        </div>
      )}

      {/* AI response */}
      {response && !loading && <CoachMessage content={response} />}
    </div>
  )
}
