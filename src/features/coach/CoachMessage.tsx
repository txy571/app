import ReactMarkdown from 'react-markdown'
import { Bot } from 'lucide-react'

interface CoachMessageProps {
  content: string
}

export default function CoachMessage({ content }: CoachMessageProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={20} className="text-indigo-600" />
        <span className="font-semibold text-sm text-indigo-700">
          AI 教练 · 昕宇的每日复盘
        </span>
      </div>
      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-indigo-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
