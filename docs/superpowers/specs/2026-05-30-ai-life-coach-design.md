# AI 私人生活教练 — 设计文档

> 作者: txy571
> 创建日期: 2026-05-30
> 状态: 已批准

---

## 1. 项目概述

**AI 私人生活教练** 是一个纯客户端（BYOK 模式）的 PWA 风格 Web 应用，用户自己配置 API Key 直连大语言模型。应用提供每日计划管理、体重追踪与卡路里计算、AI 驱动每日复盘的核心功能，并采用高扩展性的模块化架构为未来功能（情绪记录、饮水打卡等）预留空间。

### 技术栈

| 层面 | 选择 |
|------|------|
| 框架 | React 19 + Vite |
| 样式 | Tailwind CSS v4 |
| 图标 | lucide-react |
| Markdown 渲染 | react-markdown |
| 路由 | 状态驱动 Tab（无路由库） |
| 状态管理 | Custom Hooks + localStorage |
| PWA | manifest.json（不含 Service Worker） |

### 核心约束

- 最大宽度 `max-w-md` 水平居中，模拟移动端 App 体验
- 全部数据持久化到 `localStorage`
- 不支持离线访问（AI 功能天然需要联网）
- 使用 OpenAI Chat Completions 兼容格式调用大模型

---

## 2. 架构设计

### 2.1 App Shell 布局

```
┌────────────────────────────┐
│  Header（动态标题+日期）      │
├────────────────────────────┤
│                            │
│    Tab 内容区 (scrollable)  │
│   ┌──────────────────────┐ │
│   │  PlanView            │ │
│   │  HealthView          │ │
│   │  CoachView           │ │
│   │  SettingsView        │ │
│   └──────────────────────┘ │
│                            │
├────────────────────────────┤
│   Bottom Navigation Bar    │
│  计划 │ 健康 │ 教练 │ 设置  │
└────────────────────────────┘
```

- 外层容器: `max-w-md mx-auto rounded-3xl shadow-xl overflow-hidden`
- Header 标题随当前 Tab 动态切换
- 内容区 `overflow-y-auto` 独立滚动
- BottomNav 固定在底部，使用 `useState` 控制当前 Tab
- Tab 切换带 `transition-opacity duration-200` 淡入淡出

### 2.2 状态管理层

按功能模块拆分为独立 Custom Hooks，每个 Hook 封装对应模块的数据读写和 localStorage 持久化：

```
useTodos()       → Plan 模块：todos CRUD
useHealthData()  → Health 模块：体重、卡路里参数、目标
useSettings()    → Settings 模块：API Key、URL、模型、目标体重
useCoachData()   → Coach 模块：AI 回复历史
```

每个 Hook 遵循不可变更新模式，返回稳定引用避免不必要的重渲染。

### 2.3 目录结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # App Shell 布局 + Tab 路由
├── index.css                # Tailwind + 全局样式
│
├── components/              # 共享组件
│   ├── BottomNav.tsx
│   └── Header.tsx
│
├── features/
│   ├── plan/
│   │   ├── PlanView.tsx     # 计划页面 UI
│   │   └── useTodos.ts      # 待办状态管理 Hook
│   │
│   ├── health/
│   │   ├── HealthView.tsx   # 健康仪表盘
│   │   ├── WeightCard.tsx   # 体重管理卡片
│   │   ├── CalorieCard.tsx  # 卡路里计算器卡片
│   │   └── useHealthData.ts # 健康数据 Hook
│   │
│   ├── coach/
│   │   ├── CoachView.tsx    # AI 教练页面
│   │   ├── CoachMessage.tsx # AI 回复气泡组件
│   │   └── useCoach.ts      # 教练逻辑 Hook
│   │
│   └── settings/
│       ├── SettingsView.tsx # 设置页面
│       ├── ApiConfigForm.tsx# API 配置表单
│       └── useSettings.ts   # 设置状态 Hook
│
├── hooks/                   # 通用 Hooks
│   └── useLocalStorage.ts   # localStorage 封装
│
└── lib/
    ├── api.ts               # API 请求封装
    ├── prompts.ts           # System Prompt 模板
    └── calorie.ts           # BMR/TDEE 计算函数
```

### 2.4 PWA 策略

- 添加 `manifest.json` 定义应用名称、图标、主题色（支持"添加到桌面"）
- 不编写 Service Worker（不追求离线能力）
- 在 `index.html` 中添加 `<meta name="theme-color">` 和 `<link rel="manifest">`
- 使用 Vite 的 PWA 插件或手动放置 manifest 文件

---

## 3. 功能模块详情

### 3.1 📋 计划 (PlanView)

**描述**: 纯粹的待办事项管理页面。

**UI 构成**:
- 日期条显示当前日期（如 "5月30日 周六 · 今日任务"）
- 文本输入框 + "添加" 按钮
- 任务列表，每项包含复选框 + 文本 + 删除按钮

**交互行为**:
- 点击复选框 → 完成状态切换：中划线、文字淡化至 `text-gray-400`、背景变为 `bg-gray-50`
- 点击删除 → 从列表移除
- 空状态 → 显示 "今天还没有安排任务哦"
- 所有操作带 `transition-all duration-200`
- 添加后清空输入框并聚焦

**默认测试数据**:
```
[
  { id: 1, text: '完成C语言二叉树遍历实验', completed: false },
  { id: 2, text: '跑步 3 公里', completed: false }
]
```

**数据接口** (`useTodos`):
```
todos: Todo[]
addTodo(text: string): void
toggleTodo(id: number): void
removeTodo(id: number): void
```

### 3.2 ❤️ 健康 (HealthView)

**描述**: 健康仪表盘，以卡片为基本单位扩展。目前实现两张卡片，下方留白区域暗示未来可拓展。

#### 卡片 1: 体重管理

**UI 构成**:
- 卡片标题 "体重管理"
- 目标体重标签（背景色 badge）
- 进度条：从当前体重到目标体重的可视化进度（线性渐变 indigo → violet）
- 今日体重输入框 + kg 单位
- "保存" 按钮

**交互行为**:
- 进度条百分比 = (当前体重 - 起始体重) / (目标体重 - 起始体重)，但简化实现为直接基于当前值显示
- 保存按钮有 `shadow-md` 和 `active:scale-95` 按压反馈
- 保持后数据持久化，下次打开自动恢复

#### 卡片 2: 卡路里计算器

**UI 构成**:
- 卡片标题 "卡路里计算器"
- 输入行 1：性别（下拉） + 年龄（数字输入）
- 输入行 2：身高 cm + 体重 kg
- 活动等级（下拉：久坐/轻度/中度/活跃/高强度）
- "计算" 按钮
- 结果区域：BMR + 维持体重每日建议摄入

**计算公式** (Mifflin-St Jeor):
```
男性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5
女性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161
TDEE = BMR × 活动系数 (1.2 / 1.375 / 1.55 / 1.725 / 1.9)
```

**交互行为**:
- 体重输入框默认从体重管理卡片同步当前值
- 点击 "计算" 后显示结果区域
- 结果以 indigo 色块突出展示
- 所有输入保存到 `useHealthData`

**可扩展设计**:
- 卡片底部有虚线占位区："+ 更多健康卡片即将到来"
- 未来新增卡片仅需在 `HealthView.tsx` 中添加一个新的 Card 组件

**数据接口** (`useHealthData`):
```
todayWeight: number | null
goalWeight: number
setTodayWeight(weight: number): void
setGoalWeight(weight: number): void
calorieParams: { gender, age, height, weight, activityLevel }
setCalorieParams(params): void
```

### 3.3 💬 教练 (CoachView)

**描述**: AI 交互核心页面，读取 Plan 和 Health 数据，调用大模型生成每日复盘。

**UI 构成**:
- 页面标题 "AI 每日复盘"
- 居中的 "生成今日复盘" 大按钮
  - 渐变背景 `from-indigo-500 to-purple-600`
  - 呼吸动效：`@keyframes pulse` 结合 `box-shadow` 过渡
  - 点击后按钮变为加载状态
- 加载状态：显示 "正在分析你的今日数据..."
- AI 回复区域：淡紫色渐变底色气泡卡片，圆角 `rounded-16`

**数据流**:
```
整理前状态: loading = false, response = null

点击按钮:
1. loading = true
2. 从 useTodos() 读取: completedTasks, uncompletedTasks
3. 从 useHealthData() 读取: currentWeight
4. 从 useSettings() 读取: apiKey, baseUrl, modelName
5. 检查 apiKey 是否配置 → 未配置则提示"请先在设置中配置 API Key"
6. 组装 System Prompt + User Message
7. 发起 POST 请求到 {baseUrl}/v1/chat/completions
8. 解析 response.choices[0].message.content
9. 存入 useCoachData(), loading = false
```

**System Prompt 模板**:
```
你现在是我的专属 AI 生活教练。我叫昕宇。
请基于我提供的客观数据，为我生成一份每日复盘总结。

输出格式要求（使用 Markdown）：
**🎯 执行力诊断：** [一句话锐评今日表现]
**⚖️ 体重简评：** [结合数据的简短反馈]
**💡 明日策略：** [针对未完成任务，给出一条具体、可落地的破局建议]
```

**User Message 模板**:
```
【今日数据汇报】
当前体重：{currentWeight} kg
已完成任务：{completedTasks}
未完成任务：{uncompletedTasks}
```

**错误处理**:
- API Key 未配置 → 提示用户
- 网络错误 → 显示错误信息 + 重试按钮
- API 返回错误 → 解析 error.message 显示

**数据接口** (`useCoachData`):
```
response: string | null
loading: boolean
error: string | null
generateReview(todos, healthData, settings): Promise<void>
clearResponse(): void
```

### 3.4 ⚙️ 设置 (SettingsView)

**描述**: API 配置 + 通用偏好设置。

**UI 构成**:

**API 配置区块**:
- API 提供商下拉选择（DeepSeek（推荐）/ OpenAI / Moonshot (Kimi) / 通义千问 (DashScope) / SiliconFlow / 自定义）
- 选择后自动填充 Base URL + 默认模型
- Base URL 输入框（可手动修改，自定义模式下为可编辑）
- 模型名称输入框（可手动修改）
- API Key 密码框
- "测试连接" 按钮 → 发送简单请求验证
- "保存配置" 按钮

**提供商预置表**:

| 提供商 | Base URL | 默认模型 |
|--------|----------|----------|
| DeepSeek | https://api.deepseek.com | deepseek-chat |
| OpenAI | https://api.openai.com | gpt-4o-mini |
| Moonshot (Kimi) | https://api.moonshot.cn | moonshot-v1-8k |
| 通义千问 (DashScope) | https://dashscope.aliyuncs.com/compatible-mode/v1 | qwen-plus |
| SiliconFlow | https://api.siliconflow.cn | deepseek-ai/DeepSeek-V3 |
| 自定义 | 手动输入 | 手动输入 |

**健康目标区块**:
- 目标体重输入框 + kg 单位

**测试连接逻辑**:
```
POST {baseUrl}/v1/chat/completions
Authorization: Bearer {apiKey}
Body: { model: "{modelName}", messages: [{ role: "user", content: "Hi" }], max_tokens: 5 }
```
- 成功 → 绿色提示 "连接成功"
- 失败 → 红色提示具体错误

**数据接口** (`useSettings`):
```
apiKey: string
baseUrl: string
modelName: string
goalWeight: number
setApiKey(key: string): void
setBaseUrl(url: string): void
setModelName(name: string): void
setGoalWeight(weight: number): void
testConnection(): Promise<boolean>
```

---

## 4. UI/UX 设计规范

### 视觉风格
- **风格**: 现代、精致、高可用。多用留白和色块区分层级，避免多余线条
- **背景**: `bg-gray-50`（极浅灰）
- **卡片**: `bg-white` + `shadow-sm` + `rounded-2xl`
- **强调色**: Indigo 系列 (`#4F46E5` / `#6366F1` / `#EEF2FF`)
- **圆角**: 统一大圆角（12px-16px），营造精致感
- **字体**: 系统字体栈 `font-sans antialiased`

### 动效规范
- Tab 切换: `transition-opacity duration-200`
- 按钮点击: `active:scale-95` + `transition-transform`
- 任务勾选: `transition-all duration-200`
- 呼吸动效 (AI 按钮): CSS `@keyframes pulse` 无限循环
- 无滚动条: `.no-scrollbar` 类隐藏滚动条但保留滚动功能

### 响应式
- 整体: `max-w-md mx-auto` 居中，桌面端显示为居中卡片
- 内边距: 移动端 `p-4`，桌面端 `p-8`

---

## 5. 未来扩展预留

| 功能 | 扩展方式 |
|------|----------|
| 情绪记录 | HealthView 新增 "情绪追踪" 卡片 |
| 饮水打卡 | HealthView 新增 "饮水记录" 卡片 |
| 睡眠记录 | HealthView 新增 "睡眠分析" 卡片 |
| 任务分类 | PlanView 增加标签/分类筛选 |
| 历史趋势 | HealthView 增加体重变化图表（可使用 recharts） |
| 多日回顾 | CoachView 增加时间范围选择 |
| 主题切换 | SettingsView 增加亮/暗色模式切换 |

每个新功能对应一个新卡片或新组件，遵循现有 Custom Hook 模式，不修改已有接口。

---

## 6. 技术风险与注意事项

1. **API Key 安全**: 纯客户端存储，key 仅存 localStorage。风险提示：不要在多设备共用
2. **CORS 限制**: 某些 API 端点可能限制浏览器端请求。解决方案：部分服务商需要添加 `Access-Control-Allow-Origin` 头，或使用代理
3. **localStorage 限额**: 约 5-10MB，纯文本数据足够，但长期积累的 AI 回复历史需控制大小
4. **数据格式兼容**: 确保 weight 等数值字段的 parse/stringify 精度

---

## 7. 依赖清单

| 包 | 用途 | 类型 |
|----|------|------|
| react, react-dom | 框架核心 | dependencies |
| tailwindcss | 样式 | devDependencies |
| @tailwindcss/vite | Tailwind Vite 插件 | devDependencies |
| lucide-react | SVG 图标 | dependencies |
| react-markdown | 渲染 AI Markdown 回复 | dependencies |
| vite | 构建工具 | devDependencies |
| @types/react, @types/react-dom | TypeScript 类型 | devDependencies |
| typescript | 类型检查 | devDependencies |

### 可选（非必需）
- `rehype-highlight` — 代码高亮（当前 AI 回复以文本为主，暂不需要）

---

## 8. 部署

- 任何静态托管服务均可（GitHub Pages、Vercel、Netlify、Nginx 等）
- 仅需 `dist/` 目录
- 无需 HTTPS（没有 Service Worker）
- 建议添加 `_headers` 或 `vercel.json` 确保 SPA 路由（但由于我们使用状态 Tab 而非路由，实际上不需要）
