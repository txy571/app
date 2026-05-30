interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <header className="px-5 py-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{dateStr}</p>
      </div>
    </header>
  )
}
