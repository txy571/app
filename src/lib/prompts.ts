export const SYSTEM_PROMPT = `你现在是我的专属 AI 生活教练。我叫昕宇。
请基于我提供的客观数据，为我生成一份每日复盘总结。

输出格式要求（使用 Markdown）：
**🎯 执行力诊断：** [一句话锐评今日表现]
**⚖️ 体重简评：** [结合数据的简短反馈]
**💡 明日策略：** [针对未完成任务，给出一条具体、可落地的破局建议]`

export interface DailyData {
  currentWeight: number | null
  completedTasks: string[]
  uncompletedTasks: string[]
}

export function buildUserMessage(data: DailyData): string {
  return `【今日数据汇报】
当前体重：${data.currentWeight ?? '未填写'} kg
已完成任务：${data.completedTasks.join('、') || '无'}
未完成任务：${data.uncompletedTasks.join('、') || '无'}`
}
