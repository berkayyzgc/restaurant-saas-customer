import type { TableDetails } from '../types/table'

export async function getTableByQrToken(
  token: string,
): Promise<TableDetails> {
  const response = await fetch(`http://localhost:3000/tables/qr/${token}`)

  if (!response.ok) {
    throw new Error('Masa bilgisi alınamadı')
  }

  return response.json() as Promise<TableDetails>
}