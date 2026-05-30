import { Settings, Target } from 'lucide-react'
import { useSettings } from './useSettings'
import ApiConfigForm from './ApiConfigForm'

export default function SettingsView() {
  const {
    settings,
    updateProvider,
    setApiKey,
    setBaseUrl,
    setModelName,
    setGoalWeight,
    testConnection,
  } = useSettings()

  return (
    <div className="space-y-3">
      <ApiConfigForm
        settings={settings}
        onProviderChange={updateProvider}
        onApiKeyChange={setApiKey}
        onBaseUrlChange={setBaseUrl}
        onModelNameChange={setModelName}
        onTestConnection={testConnection}
      />

      {/* Health goal */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Target size={18} className="text-indigo-500" />
          健康目标
        </h2>
        <div className="flex items-center gap-3 mt-3">
          <input
            type="number"
            step="0.1"
            value={settings.goalWeight}
            onChange={(e) => setGoalWeight(parseFloat(e.target.value) || 65)}
            className="w-24 border border-gray-200 rounded-xl px-3.5 py-2.5 text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <span className="text-sm text-gray-500">kg（目标体重）</span>
        </div>
      </div>
    </div>
  )
}
