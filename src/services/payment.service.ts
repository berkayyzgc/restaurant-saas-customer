export type PaymentMethod = 'ONLINE' | 'CARD' | 'CASH'

export type Payment = {
  id: number
  tableSessionId: number
  amount: string
  method: PaymentMethod
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  keepSessionOpen: boolean
  createdAt: string
  completedAt?: string | null
}

const API_URL = 'http://localhost:3000'

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  const errorBody = await response.json().catch(() => null)
  const message = errorBody?.message ?? fallbackMessage

  return Array.isArray(message)
    ? message.join(', ')
    : String(message)
}

export async function createCustomerPayment(
  tableSessionId: number,
  keepSessionOpen: boolean,
): Promise<Payment> {
  const response = await fetch(`${API_URL}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tableSessionId,
      method: 'ONLINE',
      keepSessionOpen,
    }),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Ödeme başlatılamadı.',
      ),
    )
  }

  return response.json() as Promise<Payment>
}

export async function completeCustomerPayment(
  paymentId: number,
): Promise<Payment> {
  const response = await fetch(
    `${API_URL}/payment/${paymentId}/complete`,
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'Ödeme tamamlanamadı.',
      ),
    )
  }

  return response.json() as Promise<Payment>
}

export async function payTableBill(
  tableSessionId: number,
  keepSessionOpen: boolean,
): Promise<Payment> {
  const payment = await createCustomerPayment(
    tableSessionId,
    keepSessionOpen,
  )

  return completeCustomerPayment(payment.id)
}