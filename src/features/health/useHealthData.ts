import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Gender, ActivityLevel } from '../../lib/calorie'

export interface CalorieParams {
  gender: Gender
  age: number
  height: number
  weight: number
  activityLevel: ActivityLevel
}

const DEFAULT_CALORIE_PARAMS: CalorieParams = {
  gender: 'male',
  age: 22,
  height: 175,
  weight: 72,
  activityLevel: 'sedentary',
}

export function useHealthData() {
  const [todayWeight, setTodayWeight] = useLocalStorage<number | null>('health-today-weight', null)
  const [goalWeight, setGoalWeight] = useLocalStorage<number>('health-goal-weight', 65)
  const [calorieParams, setCalorieParams] = useLocalStorage<CalorieParams>('health-calorie-params', DEFAULT_CALORIE_PARAMS)

  return {
    todayWeight,
    setTodayWeight,
    goalWeight,
    setGoalWeight,
    calorieParams,
    setCalorieParams,
  }
}
