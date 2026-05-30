import { useState, useMemo } from 'react'
import { Calculator, Flame } from 'lucide-react'
import { calculateBMR, calculateTDEE, ACTIVITY_LABELS } from '../../lib/calorie'
import type { Gender, ActivityLevel, CalorieParams } from './useHealthData'

interface CalorieCardProps {
  defaultWeight: number | null
  params: CalorieParams
  onParamsChange: (params: CalorieParams) => void
}

export default function CalorieCard({ defaultWeight, params, onParamsChange }: CalorieCardProps) {
  const [showResult, setShowResult] = useState(false)

  const result = useMemo(() => {
    const bmr = calculateBMR(params.gender, params.weight, params.height, params.age)
    const tdee = calculateTDEE(bmr, params.activityLevel)
    return { bmr, tdee }
  }, [params])

  const update = (partial: Partial<CalorieParams>) => {
    onParamsChange({ ...params, ...partial })
  }

  const handleCalculate = () => {
    // Sync weight if defaultWeight is available and params weight hasn't been set
    if (defaultWeight && !params.weight) {
      update({ weight: defaultWeight })
    }
    setShowResult(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <Flame size={18} className="text-orange-500" />
        卡路里计算器
      </h2>

      <div className="space-y-3">
        {/* Row 1: Gender + Age */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">性别</label>
            <select
              value={params.gender}
              onChange={(e) => update({ gender: e.target.value as Gender })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">年龄</label>
            <input
              type="number"
              value={params.age}
              onChange={(e) => update({ age: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Row 2: Height + Weight */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">身高 (cm)</label>
            <input
              type="number"
              value={params.height}
              onChange={(e) => update({ height: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              value={params.weight}
              onChange={(e) => update({ weight: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Activity level */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">活动等级</label>
          <select
            value={params.activityLevel}
            onChange={(e) => update({ activityLevel: e.target.value as ActivityLevel })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-medium transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
        >
          <Calculator size={16} />
          计算
        </button>
      </div>

      {/* Results */}
      {showResult && (
        <div className="mt-4 bg-indigo-50 rounded-xl p-4 text-center space-y-3">
          <div>
            <p className="text-xs text-gray-500">每日基础代谢 (BMR)</p>
            <p className="text-2xl font-bold text-indigo-700">{result.bmr}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
          <div className="pt-2 border-t border-indigo-100">
            <p className="text-xs text-gray-500">维持体重每日建议摄入</p>
            <p className="text-xl font-bold text-indigo-700">{result.tdee}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
        </div>
      )}
    </div>
  )
}
