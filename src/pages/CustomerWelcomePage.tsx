import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import { getTableByQrToken } from '../services/table.service'
import type { TableDetails } from '../types/table'

export default function CustomerWelcomePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()

  const [table, setTable] = useState<TableDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('QR kodu geçersiz.')
      return
    }

    getTableByQrToken(token)
      .then((data) => {
        setTable(data)
        setError(null)
      })
      .catch((requestError) => {
        console.error(requestError)
        setError('Restoran bilgileri alınamadı.')
      })
  }, [token])

  if (error) {
    return (
      <main className="state-page">
        <section className="state-card">
          <p className="state-eyebrow">Bağlantı hatası</p>
          <h1>Sayfa açılamadı</h1>
          <p>{error}</p>
        </section>
      </main>
    )
  }

  if (!table) {
    return (
      <main className="state-page">
        <section className="state-card">
          <p className="state-eyebrow">Hoş geldiniz</p>
          <h2>Restoran hazırlanıyor...</h2>
          <p>Lütfen birkaç saniye bekleyin.</p>
        </section>
      </main>
    )
  }

  const restaurantInitial = table.restaurant.name.charAt(0).toUpperCase()

  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <div className="restaurant-logo-placeholder" aria-hidden="true">
          {restaurantInitial}
        </div>

        <p className="welcome-kicker">Hoş geldiniz</p>

        <h1>{table.restaurant.name}</h1>

        <div className="welcome-meta">
          <span>{table.name}</span>
          <span>{table.restaurant.city}</span>
        </div>

        {table.restaurant.description && (
          <p className="welcome-description">
            {table.restaurant.description}
          </p>
        )}

        <button
          className="welcome-menu-button"
          type="button"
          onClick={() => navigate(`/qr/${token}/menu`)}
        >
          Menüyü İncele
        </button>
      </section>
    </main>
  )
}