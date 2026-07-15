export type ServiceRequestType =
  | 'CALL_WAITER'
  | 'REQUEST_BILL'

export type ServiceRequestStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED'

export type ServiceRequest = {
  id: number
  tableSessionId: number
  type: ServiceRequestType
  status: ServiceRequestStatus
  createdAt: string
  completedAt?: string | null
  updatedAt: string
}

const API_URL = 'http://localhost:3000'

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  const errorBody = await response
    .json()
    .catch(() => null)

  const message =
    errorBody?.message ?? fallbackMessage

  return Array.isArray(message)
    ? message.join(', ')
    : String(message)
}

export async function createServiceRequest(
  tableId: number,
  type: ServiceRequestType,
): Promise<ServiceRequest> {
  const response = await fetch(
    `${API_URL}/service-request`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableId,
        type,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        type === 'CALL_WAITER'
          ? 'Garson çağrılamadı.'
          : 'Hesap talebi gönderilemedi.',
      ),
    )
  }

  return response.json() as Promise<ServiceRequest>
}

export function callWaiter(
  tableId: number,
): Promise<ServiceRequest> {
  return createServiceRequest(
    tableId,
    'CALL_WAITER',
  )
}

export function requestBill(
  tableId: number,
): Promise<ServiceRequest> {
  return createServiceRequest(
    tableId,
    'REQUEST_BILL',
  )
}