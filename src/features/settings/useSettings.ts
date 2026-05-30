import { useLocalStorage } from '../../hooks/useLocalStorage'

export interface ApiProvider {
  label: string
  baseUrl: string
  model: string
}

export const API_PROVIDERS: Record<string, ApiProvider> = {
  deepseek: { label: 'DeepSeek（推荐）', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
  openai: { label: 'OpenAI', baseUrl: 'https://api.openai.com', model: 'gpt-4o-mini' },
  moonshot: { label: 'Moonshot (Kimi)', baseUrl: 'https://api.moonshot.cn', model: 'moonshot-v1-8k' },
  dashscope: {
    label: '通义千问 (DashScope)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
  },
  siliconflow: { label: 'SiliconFlow', baseUrl: 'https://api.siliconflow.cn', model: 'deepseek-ai/DeepSeek-V3' },
  custom: { label: '自定义', baseUrl: '', model: '' },
}

export interface Settings {
  provider: string
  apiKey: string
  baseUrl: string
  modelName: string
  goalWeight: number
}

const DEFAULT_SETTINGS: Settings = {
  provider: 'deepseek',
  apiKey: '',
  baseUrl: API_PROVIDERS.deepseek.baseUrl,
  modelName: API_PROVIDERS.deepseek.model,
  goalWeight: 65,
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS)

  const updateProvider = (provider: string) => {
    const p = API_PROVIDERS[provider]
    if (p && provider !== 'custom') {
      setSettings((prev) => ({ ...prev, provider, baseUrl: p.baseUrl, modelName: p.model }))
    } else {
      setSettings((prev) => ({ ...prev, provider }))
    }
  }

  const setApiKey = (apiKey: string) => setSettings((prev) => ({ ...prev, apiKey }))
  const setBaseUrl = (baseUrl: string) => setSettings((prev) => ({ ...prev, baseUrl }))
  const setModelName = (modelName: string) => setSettings((prev) => ({ ...prev, modelName }))
  const setGoalWeight = (goalWeight: number) => setSettings((prev) => ({ ...prev, goalWeight }))

  const testConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${settings.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.modelName,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 5,
        }),
      })
      if (res.ok) {
        return { success: true, message: '连接成功！' }
      } else {
        const data = await res.json().catch(() => ({}))
        return { success: false, message: data.error?.message || `请求失败 (${res.status})` }
      }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : '网络错误' }
    }
  }

  return {
    settings,
    updateProvider,
    setApiKey,
    setBaseUrl,
    setModelName,
    setGoalWeight,
    testConnection,
  }
}
