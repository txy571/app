export type Gender = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'intense'

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  intense: 1.9,
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: '久坐（很少运动）',
  light: '轻度（每周1-3天）',
  moderate: '中度（每周3-5天）',
  active: '活跃（每周6-7天）',
  intense: '高强度（每日运动）',
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
 */
export function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161)
}

/**
 * Calculate Total Daily Energy Expenditure from BMR and activity level.
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel])
}
