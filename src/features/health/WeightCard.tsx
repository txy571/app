import { useState } from 'react'
import { Scale, Save } from 'lucide-react'

interface WeightCardProps {
  todayWeight: number | null
  goalWeight: number
  onSave: (weight: number) => void
}

export default function WeightCard({ todayWeight, goalWeight, onSave }: WeightCardProps) {
  const [inputValue, setInputValue] = useState(todayWeight?.toString() ?? '')

  const progress = todayWeight && goalWeight
    ? Math.min(Math.max(((goalWeight > 0 ? (todayWeight / goalWeight) : 0.5)), 0.2), 1.5)
    : 0.5

  const progressPercent = Math.min(Math.round((1 - (todayWeight && goalWeight ? (todayWeight - goalWeight) / goalWeight : 0)) * 100), 100)
  // Simplified: closer to goal = higher progress
  const displayProgress = todayWeight && goalWeight
    ? Math.min(Math.round(Math.max(0, (1 - (Math.abs(todayWeight - goalWeight) / goalWeight)) * 100)), 100)
    : 0

  const handleSave = () => {
    const w = parseFloat(inputValue)
    if (!isNaN(w) && w > 0) {
      onSave(w)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Scale size={18} className="text-indigo-500" />
          体重管理
        </h2>
        <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
          目标 {goalWeight} kg
        </span>
      </div>

      {/* Progress bar */}
      {todayWeight && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>当前 {todayWeight} kg</span>
            <span>目标 {goalWeight} kg</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Input + Save */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">今日体重</p>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              step="0.1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="00.0"
              className="text-2xl font-bold text-gray-900 w-24 bg-transparent outline-none border-b-2 border-transparent focus:border-indigo-500 transition-colors"
            />
            <span className="text-sm text-gray-500">kg</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Save size={18} />
        </button>
      </div>
    </div>
  )
}
