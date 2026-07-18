import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import { getTableByQrToken } from '../services/table.service'
import type { TableDetails } from '../types/table'

const languages = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
]

export default function CustomerWelcomePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [table, setTable] = useState<TableDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentLanguage =
    languages.find((language) => language.code === i18n.resolvedLanguage) ??
    languages[0]

  useEffect(() => {
    if (!token) {
      setError(
        t('welcome.invalidQr', {
          defaultValue: 'QR code is invalid.',
        }),
      )
      return
    }

    getTableByQrToken(token)
      .then((data) => {
        setTable(data)
        setError(null)
      })
      .catch((requestError) => {
        console.error(requestError)

        setError(
          t('welcome.restaurantLoadError', {
            defaultValue: 'Restaurant information could not be loaded.',
          }),
        )
      })
  }, [token, t])

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode)
  }

  if (error) {
    return (
      <main className="state-page">
        <section className="state-card">
          <p className="state-eyebrow">
            {t('welcome.connectionError', {
              defaultValue: 'Connection error',
            })}
          </p>

          <h1>
            {t('welcome.pageCouldNotOpen', {
              defaultValue: 'The page could not be opened',
            })}
          </h1>

          <p>{error}</p>
        </section>
      </main>
    )
  }

  if (!table) {
    return (
      <main className="state-page">
        <section className="state-card">
          <p className="state-eyebrow">{t('welcome.title')}</p>

          <h2>
            {t('welcome.preparingRestaurant', {
              defaultValue: 'Preparing restaurant...',
            })}
          </h2>

          <p>
            {t('welcome.pleaseWait', {
              defaultValue: 'Please wait a few seconds.',
            })}
          </p>
        </section>
      </main>
    )
  }

  const restaurantInitial = table.restaurant.name.charAt(0).toUpperCase()

  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <div
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            zIndex: 10,
          }}
        >
          <label
            htmlFor="customer-language"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            }}
          >
            <span aria-hidden="true">{currentLanguage.flag}</span>

            <select
              id="customer-language"
              value={i18n.resolvedLanguage ?? 'tr'}
              onChange={(event) =>
                void handleLanguageChange(event.target.value)
              }
              aria-label={t('common.selectLanguage')}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.flag} {language.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="restaurant-logo-placeholder" aria-hidden="true">
          {restaurantInitial}
        </div>

        <p className="welcome-kicker">{t('welcome.title')}</p>

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
          {t('welcome.continue')}
        </button>
      </section>
    </main>
  )
}