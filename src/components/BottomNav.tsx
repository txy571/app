import { ListTodo, Heart, Bot, Settings } from 'lucide-react'

export type TabId = 'plan' | 'health' | 'coach' | 'settings'

interface TabConfig {
  id: TabId
  label: string
  icon: typeof ListTodo
}

const tabs: TabConfig[] = [
  { id: 'plan', label: '计划', icon: ListTodo },
  { id: 'health', label: '健康', icon: Heart },
  { id: 'coach', label: '教练', icon: Bot },
  { id: 'settings', label: '设置', icon: Settings },
]

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="flex border-t border-gray-100 bg-white shrink-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors duration-200 ${
              isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
