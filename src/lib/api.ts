export interface ChatRequestParams {
  baseUrl: string
  apiKey: string
  modelName: string
  systemPrompt: string
  userMessage: string
}

export async function sendChatRequest(params: ChatRequestParams): Promise<string> {
  const { baseUrl, apiKey, modelName, systemPrompt, userMessage } = params

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error?.message || `请求失败 (${res.status})`)
  }

  const data = await res.json()

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('API 返回格式异常：未找到响应内容')
  }

  return content
}
