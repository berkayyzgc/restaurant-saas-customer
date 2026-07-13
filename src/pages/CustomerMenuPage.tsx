import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import '../App.css'
import { useCart } from '../hooks/useCart'
import {
  createOrder,
  getActiveOrderByTable,
  type CreatedOrder,
  type OrderStatus,
} from '../services/order.service'
import { getTableByQrToken } from '../services/table.service'
import type { MenuCategory, TableDetails } from '../types/table'

interface OrderUpdatedEvent {
  id: number
  status: OrderStatus
  updatedAt?: string
}

const orderSteps: Array<{
  status: OrderStatus
  title: string
  description: string
}> = [
  {
    status: 'PENDING',
    title: 'Sipariş alındı',
    description: 'Siparişiniz restorana iletildi.',
  },
  {
    status: 'ACCEPTED',
    title: 'Sipariş kabul edildi',
    description: 'Restoran siparişinizi kabul etti.',
  },
  {
    status: 'PREPARING',
    title: 'Hazırlanıyor',
    description: 'Mutfağımız siparişinizi hazırlıyor.',
  },
  {
    status: 'READY',
    title: 'Hazır',
    description: 'Siparişiniz servise hazır.',
  },
  {
    status: 'SERVED',
    title: 'Teslim edildi',
    description: 'Siparişiniz masanıza teslim edildi.',
  },
]

export default function CustomerMenuPage() {
  const { token } = useParams<{ token: string }>()

  const [table, setTable] = useState<TableDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderNote, setOrderNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [trackedOrder, setTrackedOrder] = useState<CreatedOrder | null>(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  const {
    cartItems,
    totalQuantity,
    totalPrice,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  } = useCart(token ? `restaurant-cart:${token}` : undefined)

  useEffect(() => {
    if (!token) {
      setError('QR kodu geçersiz.')
      return
    }

    getTableByQrToken(token)
      .then(async (data) => {
        setTable(data)
        setError(null)

        const firstCategory = data.restaurant.menuCategories[0]

        if (firstCategory) {
          setActiveCategoryId(firstCategory.id)
        }

        try {
          const activeOrder = await getActiveOrderByTable(data.id)
          setTrackedOrder(activeOrder)
        } catch (activeOrderError) {
          console.error(
            'Aktif sipariş bilgisi alınamadı:',
            activeOrderError,
          )
        }
      })
      .catch((requestError: unknown) => {
        console.error(requestError)
        setError('Masa ve menü bilgileri alınamadı.')
      })
  }, [token])

  useEffect(() => {
    if (!trackedOrder) {
      setIsSocketConnected(false)
      return
    }

    const socket = io('http://localhost:3000')

    socket.on('connect', () => {
      setIsSocketConnected(true)
    })

    socket.on('disconnect', () => {
      setIsSocketConnected(false)
    })

    socket.on('order-updated', (updatedOrder: OrderUpdatedEvent) => {
      if (updatedOrder.id !== trackedOrder.id) {
        return
      }

      setTrackedOrder((currentOrder) => {
        if (!currentOrder) {
          return currentOrder
        }

        return {
          ...currentOrder,
          status: updatedOrder.status,
          updatedAt: updatedOrder.updatedAt ?? currentOrder.updatedAt,
        }
      })
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('order-updated')
      socket.disconnect()
    }
  }, [trackedOrder?.id])

  useEffect(() => {
    if (!orderSuccess) {
      return
    }

    const timer = window.setTimeout(() => {
      setOrderSuccess(false)
    }, 4000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [orderSuccess])

  const categories = useMemo(
    () => table?.restaurant.menuCategories ?? [],
    [table],
  )

  const activeCategory = useMemo<MenuCategory | null>(() => {
    if (categories.length === 0) {
      return null
    }

    return (
      categories.find(
        (category) => category.id === activeCategoryId,
      ) ?? categories[0]
    )
  }, [activeCategoryId, categories])

  const activeOrderStepIndex = useMemo(() => {
    if (!trackedOrder) {
      return -1
    }

    return orderSteps.findIndex(
      (step) => step.status === trackedOrder.status,
    )
  }, [trackedOrder])

  function formatPrice(price: number | string) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 2,
    }).format(Number(price))
  }

  async function handleCreateOrder() {
    if (!table || cartItems.length === 0 || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setOrderError(null)
    setOrderSuccess(false)

    try {
      const createdOrder = await createOrder({
        tableId: table.id,
        note: orderNote.trim() || undefined,
        items: cartItems.map((cartItem) => ({
          menuItemId: cartItem.item.id,
          quantity: cartItem.quantity,
        })),
      })

      setTrackedOrder(createdOrder)
      clearCart()
      setOrderNote('')
      setOrderSuccess(true)
      setIsCartOpen(false)
    } catch (requestError: unknown) {
      console.error(requestError)

      setOrderError(
        requestError instanceof Error
          ? requestError.message
          : 'Sipariş gönderilemedi.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <main className="state-page">
        <section className="state-card">
          <p className="state-eyebrow">Bağlantı hatası</p>
          <h1>Menü açılamadı</h1>
          <p>{error}</p>
        </section>
      </main>
    )
  }

  if (!table) {
    return (
      <main className="state-page">
        <section className="state-card">
          <p className="state-eyebrow">Dijital menü</p>
          <h2>Menü yükleniyor...</h2>
          <p>Lütfen birkaç saniye bekleyin.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="customer-page">
      <header className="customer-hero">
        <div className="hero-copy">
          <p className="restaurant-kicker">Dijital Menü</p>

          <h1>{table.restaurant.name}</h1>

          <div className="hero-meta">
            <span className="table-badge">{table.name}</span>

            {table.restaurant.city && (
              <span className="location-badge">
                {table.restaurant.city}
              </span>
            )}
          </div>

          {table.restaurant.description && (
            <p className="restaurant-description">
              {table.restaurant.description}
            </p>
          )}
        </div>

        <button
          className="floating-cart-button"
          type="button"
          aria-label={`Sepetinizde ${totalQuantity} ürün var`}
          onClick={() => setIsCartOpen(true)}
        >
          <span>Sepet</span>
          <strong>{totalQuantity}</strong>
        </button>
      </header>

      {trackedOrder && (
        <section className="order-tracking-section">
          <div className="order-tracking-header">
            <div>
              <p className="section-kicker">
                Canlı sipariş takibi
              </p>

              <h2>
  {trackedOrder.status === 'PENDING' &&
    'Siparişiniz alındı'}

  {trackedOrder.status === 'ACCEPTED' &&
    'Siparişiniz kabul edildi'}

  {trackedOrder.status === 'PREPARING' &&
    'Siparişiniz hazırlanıyor'}

  {trackedOrder.status === 'READY' &&
    'Siparişiniz servise hazır'}

  {trackedOrder.status === 'SERVED' &&
    'Afiyet olsun'}

  {trackedOrder.status === 'CANCELLED' &&
    'Siparişiniz iptal edildi'}
</h2>
<p className="order-tracking-table">
  {table.name} • {table.restaurant.name}
</p>
            </div>

            <span
              className={`socket-status ${
                isSocketConnected
                  ? 'connected'
                  : 'disconnected'
              }`}
            >
              {isSocketConnected
                ? 'Canlı bağlantı'
                : 'Bağlanıyor'}
            </span>
          </div>

          {trackedOrder.status === 'CANCELLED' ? (
            <p className="order-cancelled-message">
              Siparişiniz iptal edildi. Lütfen restoran
              görevlisiyle iletişime geçin.
            </p>
          ) : (
            <div className="order-tracking-steps">
              {orderSteps.map((step, index) => {
                const isCompleted =
                  index < activeOrderStepIndex
                const isActive =
                  index === activeOrderStepIndex

                return (
                  <article
                    key={step.status}
                    className={`order-tracking-step${
                      isCompleted ? ' completed' : ''
                    }${isActive ? ' active' : ''}`}
                  >
                    <div className="order-step-indicator">
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}

      <section className="category-navigation">
        <div className="section-heading">
          <div>
            <p className="section-kicker">
              Menüyü keşfet
            </p>

            <h2>Kategoriler</h2>
          </div>
        </div>

        <div className="category-tabs" role="tablist">
          {categories.map((category) => {
            const isActive =
              category.id === activeCategory?.id

            return (
              <button
                key={category.id}
                className={`category-tab${
                  isActive ? ' active' : ''
                }`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() =>
                  setActiveCategoryId(category.id)
                }
              >
                <span>{category.name}</span>

                <small>
                  {category.menuItems.length} ürün
                </small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="active-category-section">
        {activeCategory ? (
          <>
            <div className="active-category-header">
              <div>
                <p className="section-kicker">
                  Seçili kategori
                </p>

                <h2>{activeCategory.name}</h2>
              </div>

              <span className="product-count">
                {activeCategory.menuItems.length} ürün
              </span>
            </div>

            {activeCategory.menuItems.length === 0 ? (
              <p className="empty-message">
                Bu kategoride henüz ürün bulunmuyor.
              </p>
            ) : (
              <div className="product-grid">
                {activeCategory.menuItems.map((item) => (
                  <article
                    className="premium-product-card"
                    key={item.id}
                  >
                    <div className="product-card-top">
                      <div>
                        <p className="product-category-label">
                          {activeCategory.name}
                        </p>

                        <h3>{item.name}</h3>
                      </div>

                      <strong className="product-price">
                        {formatPrice(item.price)}
                      </strong>
                    </div>

                    {item.description && (
                      <p className="product-description">
                        {item.description}
                      </p>
                    )}

                    <div className="product-card-bottom">
                      <button
                        className="product-detail-button"
                        type="button"
                      >
                        Detay
                      </button>

                      <button
                        className="add-to-cart-button"
                        type="button"
                        onClick={() => addItem(item)}
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="empty-message">
            Henüz menü kategorisi bulunmuyor.
          </p>
        )}
      </section>

      {cartItems.length > 0 && (
        <section className="cart-summary">
          <div>
            <span>{totalQuantity} ürün</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
          >
            Sepeti Gör
          </button>
        </section>
      )}

      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        >
          <aside
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-panel-header">
              <div>
                <p className="section-kicker">
                  Siparişiniz
                </p>

                <h2>Sepet</h2>
              </div>

              <button
                className="cart-close-button"
                type="button"
                onClick={() => setIsCartOpen(false)}
              >
                Kapat
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="empty-message">
                Sepetiniz şu anda boş.
              </p>
            ) : (
              <>
                <div className="cart-item-list">
                  {cartItems.map((cartItem) => (
                    <article
                      className="cart-item"
                      key={cartItem.item.id}
                    >
                      <div className="cart-item-info">
                        <h3>{cartItem.item.name}</h3>

                        <p>
                          {formatPrice(
                            cartItem.item.price,
                          )}{' '}
                          / adet
                        </p>

                        <div className="cart-quantity-controls">
                          <button
                            type="button"
                            aria-label={`${cartItem.item.name} adedini azalt`}
                            onClick={() =>
                              decreaseItem(
                                cartItem.item.id,
                              )
                            }
                          >
                            −
                          </button>

                          <strong>
                            {cartItem.quantity}
                          </strong>

                          <button
                            type="button"
                            aria-label={`${cartItem.item.name} adedini artır`}
                            onClick={() =>
                              increaseItem(
                                cartItem.item.id,
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <strong>
                          {formatPrice(
                            Number(
                              cartItem.item.price,
                            ) * cartItem.quantity,
                          )}
                        </strong>

                        <button
                          className="cart-remove-button"
                          type="button"
                          onClick={() =>
                            removeItem(
                              cartItem.item.id,
                            )
                          }
                        >
                          Sil
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Toplam</span>

                  <strong>
                    {formatPrice(totalPrice)}
                  </strong>
                </div>

                <div className="order-note-section">
                  <label htmlFor="order-note">
                    Sipariş Notu
                  </label>

                  <textarea
                    id="order-note"
                    value={orderNote}
                    onChange={(event) =>
                      setOrderNote(event.target.value)
                    }
                    placeholder="Örn: Soğansız olsun..."
                    maxLength={300}
                  />
                </div>

                {orderError && (
                  <p className="order-message order-message-error">
                    {orderError}
                  </p>
                )}

                <button
                  className="submit-order-button"
                  type="button"
                  disabled={
                    isSubmitting ||
                    cartItems.length === 0
                  }
                  onClick={handleCreateOrder}
                >
                  {isSubmitting
                    ? 'Sipariş Gönderiliyor...'
                    : 'Siparişi Gönder'}
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {orderSuccess && (
        <div className="order-success-toast">
          Siparişiniz başarıyla mutfağa gönderildi.
        </div>
      )}
    </main>
  )
}