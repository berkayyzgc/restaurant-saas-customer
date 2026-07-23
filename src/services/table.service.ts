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
  tableId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/tables/${tableId}/close-session`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    throw new Error('Masa kapatılamadı')
  }
}