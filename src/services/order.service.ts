export interface CreateOrderItem {
  menuItemId: number
  quantity: number
}

export interface CreateOrderPayload {
  tableId: number
  note?: string
  items: CreateOrderItem[]
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'CANCELLED'

export interface CreatedOrder {
  id: number
  tableSessionId: number
  status: OrderStatus
  note: string | null
  totalPrice: number | string
  createdAt: string
  updatedAt: string
}

export interface TableBillSummary {
  tableSessionId: number | null
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  orderCount: number
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreatedOrder> {
  const response = await fetch(
    'http://localhost:3000/orders',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => null)

    const errorMessage =
      errorBody?.message ??
      'Sipariş oluşturulamadı.'

    throw new Error(
      Array.isArray(errorMessage)
        ? errorMessage.join(', ')
        : errorMessage,
    )
  }

  return response.json() as Promise<CreatedOrder>
}

export async function getActiveOrderByTable(
  tableId: number,
): Promise<CreatedOrder | null> {
  const response = await fetch(
    `http://localhost:3000/orders/table/${tableId}/active`,
  )

  if (!response.ok) {
    throw new Error(
      'Aktif sipariş bilgisi alınamadı.',
    )
  }

  const responseText = await response.text()

  if (!responseText) {
    return null
  }

  return JSON.parse(
    responseText,
  ) as CreatedOrder
}

export async function getTableBillSummary(
  tableId: number,
): Promise<TableBillSummary> {
  const response = await fetch(
    `http://localhost:3000/orders/table/${tableId}/bill-summary`,
  )

  if (!response.ok) {
    throw new Error(
      'Masa hesap özeti alınamadı.',
    )
  }

  return response.json() as Promise<TableBillSummary>
}