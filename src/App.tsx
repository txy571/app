import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import PlanView from './features/plan/PlanView'
import HealthView from './features/health/HealthView'
import CoachView from './features/coach/CoachView'
import SettingsView from './features/settings/SettingsView'
import type { TabId } from './components/BottomNav'

const tabTitles: Record<TabId, string> = {
  plan: '今日概览',
  health: '健康仪表盘',
  coach: 'AI 每日复盘',
  settings: '应用设置',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('plan')

  return (
    <div className="min-h-dvh flex justify-center p-4 md:p-8 bg-gray-100">
      <div className="w-full max-w-md bg-gray-50 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        <Header title={tabTitles[activeTab]} />

        <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          {activeTab === 'plan' && <PlanView />}
          {activeTab === 'health' && <HealthView />}
          {activeTab === 'coach' && <CoachView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
