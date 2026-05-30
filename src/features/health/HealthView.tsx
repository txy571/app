import WeightCard from './WeightCard'
import CalorieCard from './CalorieCard'
import { useHealthData } from './useHealthData'

export default function HealthView() {
  const { todayWeight, setTodayWeight, goalWeight, calorieParams, setCalorieParams } = useHealthData()

  return (
    <div className="space-y-3">
      <WeightCard
        todayWeight={todayWeight}
        goalWeight={goalWeight}
        onSave={setTodayWeight}
      />

      <CalorieCard
        defaultWeight={todayWeight}
        params={calorieParams}
        onParamsChange={setCalorieParams}
      />

      {/* Placeholder for future cards */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-sm text-gray-300">
          + 更多健康卡片即将到来
        </p>
        <p className="text-xs text-gray-200 mt-1">
          （饮水打卡 · 睡眠记录 · 运动统计）
        </p>
      </div>
    </div>
  )
}
