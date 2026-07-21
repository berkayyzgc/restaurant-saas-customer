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

export type IyzicoCardDetails = {
  cardHolderName: string
  cardNumber: string
  expireMonth: string
  expireYear: string
  cvc: string
}

type IyzicoPaymentResponse = {
  success: boolean
  message: string
  iyzicoPaymentId: string
  payment: Payment
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

export async function processIyzicoPayment(
  paymentId: number,
  cardDetails: IyzicoCardDetails,
): Promise<Payment> {
  const response = await fetch(
    `${API_URL}/payment/iyzico`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        ...cardDetails,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        'iyzico ödeme işlemi başarısız oldu.',
      ),
    )
  }

  const result =
    (await response.json()) as IyzicoPaymentResponse

  return result.payment
}

export async function payTableBill(
  tableSessionId: number,
  keepSessionOpen: boolean,
  cardDetails: IyzicoCardDetails,
): Promise<Payment> {
  const payment = await createCustomerPayment(
    tableSessionId,
    keepSessionOpen,
  )

  return processIyzicoPayment(
    payment.id,
    cardDetails,
  )
}