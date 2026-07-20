export interface AiSuggestion {
  id: number
  name: string
  description: string | null
  price: number
  category: string | null
}

export interface AiChatResponse {
  reply: string
  suggestions: AiSuggestion[]
}

interface AiChatPayload {
  message: string
  restaurantId: number
}

const API_URL = 'http://localhost:3000'

export async function sendAiMessage(
  payload: AiChatPayload,
): Promise<AiChatResponse> {
  const response = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => null)

    const errorMessage =
      typeof errorBody?.message === 'string'
        ? errorBody.message
        : 'AI önerisi alınamadı.'

    throw new Error(errorMessage)
  }

  return response.json() as Promise<AiChatResponse>
}