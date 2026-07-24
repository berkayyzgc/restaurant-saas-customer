import type { TableDetails } from '../types/table'

const API_URL = import.meta.env.VITE_API_URL

export async function getTableByQrToken(
  token: string,
): Promise<TableDetails> {
  const response = await fetch(
    `${API_URL}/tables/qr/${token}`,
  )

  if (!response.ok) {
    throw new Error('Masa bilgisi alınamadı')
  }

  return response.json() as Promise<TableDetails>
}

export async function closeTableSession(
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/tables/qr/${token}/close-session`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message ?? 'Masa kapatılamadı',
    )
  }
}