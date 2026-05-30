import { useState } from 'react'
import { Key, Globe, Cpu } from 'lucide-react'
import { API_PROVIDERS } from './useSettings'
import type { Settings } from './useSettings'

interface ApiConfigFormProps {
  settings: Settings
  onProviderChange: (provider: string) => void
  onApiKeyChange: (key: string) => void
  onBaseUrlChange: (url: string) => void
  onModelNameChange: (name: string) => void
  onTestConnection: () => Promise<{ success: boolean; message: string }>
}

export default function ApiConfigForm({
  settings,
  onProviderChange,
  onApiKeyChange,
  onBaseUrlChange,
  onModelNameChange,
  onTestConnection,
}: ApiConfigFormProps) {
  const [testState, setTestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')
  const isCustom = settings.provider === 'custom'

  const handleTest = async () => {
    setTestState('loading')
    setTestMessage('')
    const result = await onTestConnection()
    setTestState(result.success ? 'success' : 'error')
    setTestMessage(result.message)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="font-semibold text-gray-900">API 配置</h2>

      {/* Provider selector */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1 block">API 提供商</label>
        <select
          value={settings.provider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        >
          {Object.entries(API_PROVIDERS).map(([key, p]) => (
            <option key={key} value={key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Base URL */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1 block flex items-center gap-1.5">
          <Globe size={12} /> Base URL
        </label>
        <input
          type="text"
          value={settings.baseUrl}
          onChange={(e) => onBaseUrlChange(e.target.value)}
          readOnly={!isCustom}
          className={`w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
            !isCustom ? 'bg-gray-50 text-gray-500' : 'bg-white'
          }`}
        />
      </div>

      {/* Model name */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1 block flex items-center gap-1.5">
          <Cpu size={12} /> 模型名称
        </label>
        <input
          type="text"
          value={settings.modelName}
          onChange={(e) => onModelNameChange(e.target.value)}
          readOnly={!isCustom}
          className={`w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
            !isCustom ? 'bg-gray-50 text-gray-500' : 'bg-white'
          }`}
        />
      </div>

      {/* API Key */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1 block flex items-center gap-1.5">
          <Key size={12} /> API Key
        </label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-..."
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Test + Save */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleTest}
          disabled={testState === 'loading'}
          className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testState === 'loading' ? '测试中...' : '测试连接'}
        </button>
      </div>

      {/* Test result */}
      {testState !== 'idle' && (
        <div
          className={`text-sm px-3.5 py-2.5 rounded-xl ${
            testState === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {testMessage}
        </div>
      )}
    </div>
  )
}
