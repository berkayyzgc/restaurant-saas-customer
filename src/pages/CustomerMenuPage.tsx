import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../App.css";
import { useCart } from "../hooks/useCart";
import {
  createOrder,
  getActiveOrderByTable,
  getTableBillSummary,
  type CreatedOrder,
  type OrderStatus,
  type TableBillSummary,
} from "../services/order.service";
import { payTableBill } from "../services/payment.service";
import { sendAiMessage, type AiSuggestion } from "../services/ai.service";
import {
  getWeatherByCity,
  type WeatherDetails,
} from "../services/weather.service";
import {
  callWaiter,
  requestBill,
  type ServiceRequestType,
} from "../services/service-request.service";
import { getTableByQrToken } from "../services/table.service";
import type { MenuCategory, TableDetails } from "../types/table";

type CustomerTrackedOrder = CreatedOrder & {
  tableSessionId: number;
  paymentStatus?: "UNPAID" | "PAID";
  paidAt?: string | null;
};

interface OrderUpdatedEvent {
  id: number;
  status: OrderStatus;
  updatedAt?: string;
}

const orderSteps: Array<{
  status: OrderStatus;
  title: string;
  description: string;
}> = [
  {
    status: "PENDING",
    title: "Sipariş alındı",
    description: "Siparişiniz restorana iletildi.",
  },
  {
    status: "ACCEPTED",
    title: "Sipariş kabul edildi",
    description: "Restoran siparişinizi kabul etti.",
  },
  {
    status: "PREPARING",
    title: "Hazırlanıyor",
    description: "Mutfağımız siparişinizi hazırlıyor.",
  },
  {
    status: "READY",
    title: "Hazır",
    description: "Siparişiniz servise hazır.",
  },
  {
    status: "SERVED",
    title: "Teslim edildi",
    description: "Siparişiniz masanıza teslim edildi.",
  },
];
const customerLanguages = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];
export default function CustomerMenuPage() {
  const { token } = useParams<{ token: string }>();
  const { t, i18n } = useTranslation();

  const currentLanguage =
    customerLanguages.find(
      (language) => language.code === i18n.resolvedLanguage,
    ) ?? customerLanguages[0];
   

  const [table, setTable] = useState<TableDetails | null>(null);
  const [weather, setWeather] = useState<WeatherDetails | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<CustomerTrackedOrder | null>(
    null,
  );
  const [billSummary, setBillSummary] = useState<TableBillSummary | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [keepSessionOpen, setKeepSessionOpen] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<
    string | null
  >(null);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [sendingServiceRequest, setSendingServiceRequest] =
    useState<ServiceRequestType | null>(null);
  const [serviceRequestMessage, setServiceRequestMessage] = useState<
    string | null
  >(null);
  const [serviceRequestError, setServiceRequestError] = useState<string | null>(
    null,
  );
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const {
    cartItems,
    totalQuantity,
    totalPrice,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
  } = useCart(token ? `restaurant-cart:${token}` : undefined);

  useEffect(() => {
    if (!token) {
      setError("QR kodu geçersiz.");
      return;
    }

    getTableByQrToken(token)
      .then(async (data) => {
        setTable(data);
        setError(null);

        const firstCategory = data.restaurant.menuCategories[0];

        if (firstCategory) {
          setActiveCategoryId(firstCategory.id);
        }

        try {
          const [activeOrder, currentBillSummary] = await Promise.all([
            getActiveOrderByTable(data.id),
            getTableBillSummary(data.id),
          ]);

          setTrackedOrder(activeOrder as CustomerTrackedOrder | null);

          setBillSummary(currentBillSummary);
        } catch (requestError) {
          console.error("Sipariş veya hesap bilgisi alınamadı:", requestError);
        }
      })
      .catch((requestError: unknown) => {
        console.error(requestError);
        setError("Masa ve menü bilgileri alınamadı.");
      });
  }, [token]);

  useEffect(() => {
    if (!trackedOrder) {
      setIsSocketConnected(false);
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL

const socket = io(SOCKET_URL)

    socket.on("connect", () => {
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("order-updated", (updatedOrder: OrderUpdatedEvent) => {
      if (updatedOrder.id !== trackedOrder.id) {
        return;
      }

      setTrackedOrder((currentOrder) => {
        if (!currentOrder) {
          return currentOrder;
        }

        return {
          ...currentOrder,
          status: updatedOrder.status,
          updatedAt: updatedOrder.updatedAt ?? currentOrder.updatedAt,
        };
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order-updated");
      socket.disconnect();
    };
  }, [trackedOrder?.id]);

  useEffect(() => {
    if (!orderSuccess) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOrderSuccess(false);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [orderSuccess]);

  useEffect(() => {
    if (!paymentSuccessMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPaymentSuccessMessage(null);
    }, 6000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [paymentSuccessMessage]);

  useEffect(() => {
    if (!table) {
      return;
    }

    let isCancelled = false;

    const refreshBillSummary = async () => {
      try {
        const updatedBillSummary = await getTableBillSummary(table.id);

        if (!isCancelled) {
          setBillSummary(updatedBillSummary);
        }
      } catch (requestError) {
        console.error("Hesap özeti güncellenemedi:", requestError);
      }
    };

    refreshBillSummary();

    const intervalId = window.setInterval(refreshBillSummary, 2000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [table?.id]);

  useEffect(() => {
    const city = table?.restaurant.city?.trim();

    if (!city) {
      setWeather(null);
      setWeatherError(null);
      return;
    }

    let isCancelled = false;

    async function loadWeather() {
      setIsWeatherLoading(true);
      setWeatherError(null);

      try {
        const weatherDetails = await getWeatherByCity(city as string)

        if (!isCancelled) {
          setWeather(weatherDetails);
        }
      } catch (requestError: unknown) {
        console.error("Hava durumu alınamadı:", requestError);

        if (!isCancelled) {
          setWeather(null);
          setWeatherError(
            requestError instanceof Error
              ? requestError.message
              : "Hava durumu alınamadı.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsWeatherLoading(false);
        }
      }
    }

    void loadWeather();

    const intervalId = window.setInterval(
      () => void loadWeather(),
      15 * 60 * 1000,
    );

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [table?.restaurant.city]);

  const categories = useMemo(
    () => table?.restaurant.menuCategories ?? [],
    [table],
  );

  const activeCategory = useMemo<MenuCategory | null>(() => {
    if (categories.length === 0) {
      return null;
    }

    return (
      categories.find((category) => category.id === activeCategoryId) ??
      categories[0]
    );
  }, [activeCategoryId, categories]);

  const activeOrderStepIndex = useMemo(() => {
    if (!trackedOrder) {
      return -1;
    }

    return orderSteps.findIndex((step) => step.status === trackedOrder.status);
  }, [trackedOrder]);

  const canPayOrder =
    trackedOrder?.status === "SERVED" && trackedOrder.paymentStatus !== "PAID";

  function formatPrice(price: number | string) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 2,
    }).format(Number(price));
  }

  async function handleCreateOrder() {
    if (!table || cartItems.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);
    setOrderSuccess(false);

    try {
      const createdOrder = await createOrder({
        tableId: table.id,
        note: orderNote.trim() || undefined,
        items: cartItems.map((cartItem) => ({
          menuItemId: cartItem.item.id,
          quantity: cartItem.quantity,
        })),
      });

      setTrackedOrder(createdOrder as CustomerTrackedOrder);

      const updatedBillSummary = await getTableBillSummary(table.id);

      setBillSummary(updatedBillSummary);

      clearCart();
      setOrderNote("");
      setOrderSuccess(true);
      setIsCartOpen(false);
    } catch (requestError: unknown) {
      console.error(requestError);

      setOrderError(
        requestError instanceof Error
          ? requestError.message
          : "Sipariş gönderilemedi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openPaymentModal() {
    setPaymentError(null);
    setKeepSessionOpen(true);
    setIsPaymentOpen(true);
  }

  function closePaymentModal() {
    if (isPaying) {
      return;
    }

    setIsPaymentOpen(false);
    setPaymentError(null);
  }

  async function handlePayBill() {
    if (!trackedOrder || isPaying) {
      return;
    }
    const cardDigits = cardNumber.replace(/\s/g, "");

    if (
      cardholderName.trim().length < 3 ||
      cardDigits.length !== 16 ||
      !/^\d{2}\/\d{2}$/.test(cardExpiry) ||
      cardCvv.length !== 3
    ) {
      setPaymentError("Lütfen demo kart bilgilerini eksiksiz doldurun.");
      return;
    }

    if (!trackedOrder.tableSessionId) {
      setPaymentError("Masa oturumu bilgisi bulunamadı.");
      return;
    }

    setIsPaying(true);
    setPaymentError(null);

    try {
      const [expireMonth, shortExpireYear] = cardExpiry.split("/");
const expireYear = `20${shortExpireYear}`;

const payment = await payTableBill(
  trackedOrder.tableSessionId,
  keepSessionOpen,
  {
    cardHolderName: cardholderName.trim(),
    cardNumber: cardDigits,
    expireMonth,
    expireYear,
    cvc: cardCvv,
  },
);

      setTrackedOrder((currentOrder) => {
        if (!currentOrder) {
          return currentOrder;
        }

        return {
          ...currentOrder,
          paymentStatus: "PAID",
          paidAt: payment.completedAt ?? new Date().toISOString(),
        };
      });

      setIsPaymentOpen(false);

      setCardholderName("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");

      if (keepSessionOpen) {
        setPaymentSuccessMessage(
          "Ödemeniz başarıyla tamamlandı. Masada kalmaya ve yeni sipariş vermeye devam edebilirsiniz.",
        );
      } else {
        setPaymentSuccessMessage(
          "Ödemeniz başarıyla tamamlandı. Masa hesabınız kapatıldı.",
        );

        setTrackedOrder(null);
      }
    } catch (requestError: unknown) {
      console.error("Ödeme işlemi başarısız:", requestError);

      setPaymentError(
        requestError instanceof Error
          ? requestError.message
          : "Ödeme tamamlanamadı.",
      );
    } finally {
      setIsPaying(false);
    }
  }

  async function handleServiceRequest(type: ServiceRequestType) {
    if (!table || sendingServiceRequest) {
      return;
    }

    setSendingServiceRequest(type);
    setServiceRequestError(null);
    setServiceRequestMessage(null);

    try {
      if (type === "CALL_WAITER") {
        await callWaiter(table.id);

        setServiceRequestMessage(
          "Garson çağrınız iletildi. En kısa sürede masanıza gelecektir.",
        );
      } else {
        await requestBill(table.id);

        setServiceRequestMessage(
          "Hesap talebiniz iletildi. Garsonunuz kısa süre içinde yardımcı olacaktır.",
        );
      }
    } catch (requestError: unknown) {
      console.error("Servis talebi gönderilemedi:", requestError);

      setServiceRequestError(
        requestError instanceof Error
          ? requestError.message
          : "Talebiniz gönderilemedi.",
      );
    } finally {
      setSendingServiceRequest(null);
    }
  }

  async function handleAiMessage() {
    if (!table || !aiMessage.trim() || isAiLoading) {
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setAiReply(null);
    setAiSuggestions([]);

    try {
      const response = await sendAiMessage({
        message: aiMessage.trim(),
        restaurantId: table.restaurant.id,
      });

      setAiReply(response.reply);
      setAiSuggestions(response.suggestions);
    } catch (requestError: unknown) {
      console.error("AI önerisi alınamadı:", requestError);

      setAiError(
        requestError instanceof Error
          ? requestError.message
          : "AI önerisi alınamadı.",
      );
    } finally {
      setIsAiLoading(false);
    }
  }

  function handleAddAiSuggestionToCart(suggestion: AiSuggestion) {
    const menuItem = categories
      .flatMap((category) => category.menuItems)
      .find((item) => item.id === suggestion.id);

    if (!menuItem) {
      setAiError("Önerilen ürün menüde bulunamadı.");
      return;
    }

    addItem(menuItem);
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
    );
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
    );
  }

  return (
    <main className="customer-page">
      <header className="customer-hero">
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 20,
          }}
        >
          <label
            htmlFor="menu-language-select"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 12px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.94)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.18)",
            }}
          >
            <span aria-hidden="true">{currentLanguage.flag}</span>

            <select
              id="menu-language-select"
              value={i18n.resolvedLanguage ?? "tr"}
              onChange={(event) => void i18n.changeLanguage(event.target.value)}
              aria-label={t("common.selectLanguage")}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {customerLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.flag} {language.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="hero-copy"></div>
        <div className="hero-copy">
          <p className="restaurant-kicker">{t("menu.title")}</p>

          <h1>{table.restaurant.name}</h1>

          <div className="hero-meta">
            <span className="table-badge">{table.name}</span>

            {table.restaurant.city && (
              <span className="location-badge">{table.restaurant.city}</span>
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
          <span>{t("cart.title")}</span>
          <strong>{totalQuantity}</strong>
        </button>
      </header>


      <section className="customer-weather-section">
        <div className="customer-weather-heading">
          <div>
            <p className="customer-weather-kicker">Güncel Hava Durumu</p>
            <h2>{table.restaurant.city || "Restoran Konumu"}</h2>
          </div>
          <span className="customer-weather-live">Canlı</span>
        </div>

        {isWeatherLoading && !weather && (
          <div className="customer-weather-loading">
            <span>🌤️</span>
            <div>
              <strong>Hava durumu yükleniyor</strong>
              <p>Lütfen kısa bir süre bekleyin.</p>
            </div>
          </div>
        )}

        {weatherError && !weather && (
          <div className="customer-weather-error">
            <strong>Hava durumu gösterilemedi</strong>
            <p>{weatherError}</p>
          </div>
        )}

        {weather && (
          <div className="customer-weather-card">
            <div className="customer-weather-main">
              <span className="customer-weather-icon">
  {weather.icon}
</span>
              <div>
                <strong className="customer-weather-temperature">
                  {Math.round(weather.temperature)}°
                </strong>
                <p>{weather.description}</p>
                <small>
                  Hissedilen {Math.round(weather.apparentTemperature)}°
                </small>
              </div>
            </div>

            <div className="customer-weather-details">
              <div>
                <span>💧</span>
                <p>Nem</p>
                <strong>%{Math.round(weather.humidity)}</strong>
              </div>
              <div>
                <span>🌧️</span>
                <p>Yağış</p>
                <strong>{weather.precipitation} mm</strong>
              </div>
              <div>
                <span>💨</span>
                <p>Rüzgâr</p>
                <strong>{Math.round(weather.windSpeed)} km/sa</strong>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="customer-service-actions">
        <div className="customer-service-heading">
          <p className="section-kicker">{t("serviceRequest.title")}</p>

          <h3>{t("serviceRequest.howCanWeHelp")}</h3>
        </div>

        <div className="customer-service-buttons">
          <button
            type="button"
            className="customer-service-button"
            disabled={sendingServiceRequest !== null}
            onClick={() => handleServiceRequest("CALL_WAITER")}
          >
            <span>🔔</span>

            <div>
              <strong>
                {sendingServiceRequest === "CALL_WAITER"
                  ? t("serviceRequest.sending")
                  : t("serviceRequest.callWaiter")}
              </strong>

              <small>{t("serviceRequest.callWaiterDescription")}</small>
            </div>
          </button>

          <button
            type="button"
            className="customer-service-button bill"
            disabled={sendingServiceRequest !== null}
            onClick={() => handleServiceRequest("REQUEST_BILL")}
          >
            <span>🧾</span>

            <div>
              <strong>
                {sendingServiceRequest === "REQUEST_BILL"
                  ? t("serviceRequest.sending")
                  : t("serviceRequest.requestBill")}
              </strong>

              <small>{t("serviceRequest.requestBillDescription")}</small>
            </div>
          </button>
        </div>

        {serviceRequestMessage && (
          <p className="service-request-message success">
            {serviceRequestMessage}
          </p>
        )}

        {serviceRequestError && (
          <p className="service-request-message error">{serviceRequestError}</p>
        )}
      </div>

{billSummary && (
  <section className="order-tracking-section">
    <div className="customer-bill-summary">
      <div>
        <p className="section-kicker">Hesabım</p>
        <h3>Güncel Toplam</h3>
        <small>Masadaki tüm siparişlerin kalan toplamı</small>
      </div>

      <strong>
        {formatPrice(billSummary.remainingAmount ?? 0)}
      </strong>
    </div>
  </section>
)}

      {trackedOrder && (
        <section className="order-tracking-section">
          <div className="order-tracking-header">
            <div>
              <div className="customer-bill-summary">
                <div>
                  <p className="section-kicker">Hesabım</p>

                  <h3>Güncel Toplam</h3>

                  <small>Masadaki tüm siparişlerin kalan toplamı</small>
                </div>

                <strong>
                  {formatPrice(billSummary?.remainingAmount ?? 0)}
                </strong>
              </div>
              <p className="section-kicker">Canlı sipariş takibi</p>

              <h2>
                {trackedOrder.status === "PENDING" && "Siparişiniz alındı"}

                {trackedOrder.status === "ACCEPTED" &&
                  "Siparişiniz kabul edildi"}

                {trackedOrder.status === "PREPARING" &&
                  "Siparişiniz hazırlanıyor"}

                {trackedOrder.status === "READY" && "Siparişiniz servise hazır"}

                {trackedOrder.status === "SERVED" && "Afiyet olsun"}

                {trackedOrder.status === "CANCELLED" &&
                  "Siparişiniz iptal edildi"}
              </h2>

              <p className="order-tracking-table">
                {table.name} • {table.restaurant.name}
              </p>
            </div>

            <span
              className={`socket-status ${
                isSocketConnected ? "connected" : "disconnected"
              }`}
            >
              {isSocketConnected ? "Canlı bağlantı" : "Bağlanıyor"}
            </span>
          </div>

          {trackedOrder.status === "CANCELLED" ? (
            <p className="order-cancelled-message">
              Siparişiniz iptal edildi. Lütfen restoran görevlisiyle iletişime
              geçin.
            </p>
          ) : (
            <>
              <div className="order-tracking-steps">
                {orderSteps.map((step, index) => {
                  const isCompleted = index < activeOrderStepIndex;
                  const isActive = index === activeOrderStepIndex;

                  return (
                    <article
                      key={step.status}
                      className={`order-tracking-step${
                        isCompleted ? " completed" : ""
                      }${isActive ? " active" : ""}`}
                    >
                      <div className="order-step-indicator">
                        {isCompleted ? "✓" : index + 1}
                      </div>

                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              {trackedOrder.paymentStatus === "PAID" && (
                <div className="customer-payment-paid">
                  <strong>✓ Ödeme tamamlandı</strong>
                  <p>Bu sipariş için ödeme başarıyla alındı.</p>
                </div>
              )}

              {canPayOrder && (
                <div className="customer-payment-action">
                  <div>
                    <p className="section-kicker">Masadan ödeme</p>
                    <h3>Hesabınızı ödeyin</h3>
                    <p>
                      Ödeme sonrasında masada kalmayı veya hesabı kapatmayı
                      seçebilirsiniz.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="customer-pay-button"
                    onClick={openPaymentModal}
                  >
                    💳 Hesabı Öde
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <section className="category-navigation">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{t("menu.explore")}</p>

            <h2>{t("menu.categories")}</h2>
          </div>
        </div>

        <div className="category-tabs" role="tablist">
          {categories.map((category) => {
            const isActive = category.id === activeCategory?.id;

            return (
              <button
                key={category.id}
                className={`category-tab${isActive ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategoryId(category.id)}
              >
                <span>{category.name}</span>

                <small>{category.menuItems.length} ürün</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="active-category-section">
        {activeCategory ? (
          <>
            <div className="active-category-header">
              <div>
                <p className="section-kicker">Seçili kategori</p>

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
                  <article className="premium-product-card" key={item.id}>
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
                      <p className="product-description">{item.description}</p>
                    )}

                    <div className="product-card-bottom">
                      <button className="product-detail-button" type="button">
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
          <p className="empty-message">Henüz menü kategorisi bulunmuyor.</p>
        )}
      </section>

      {cartItems.length > 0 && (
        <section className="cart-summary">
          <div>
            <span>{totalQuantity} ürün</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <button type="button" onClick={() => setIsCartOpen(true)}>
            Sepeti Gör
          </button>
        </section>
      )}

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <aside
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-panel-header">
              <div>
                <p className="section-kicker">Siparişiniz</p>

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
              <p className="empty-message">Sepetiniz şu anda boş.</p>
            ) : (
              <>
                <div className="cart-item-list">
                  {cartItems.map((cartItem) => (
                    <article className="cart-item" key={cartItem.item.id}>
                      <div className="cart-item-info">
                        <h3>{cartItem.item.name}</h3>

                        <p>{formatPrice(cartItem.item.price)} / adet</p>

                        <div className="cart-quantity-controls">
                          <button
                            type="button"
                            aria-label={`${cartItem.item.name} adedini azalt`}
                            onClick={() => decreaseItem(cartItem.item.id)}
                          >
                            −
                          </button>

                          <strong>{cartItem.quantity}</strong>

                          <button
                            type="button"
                            aria-label={`${cartItem.item.name} adedini artır`}
                            onClick={() => increaseItem(cartItem.item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <strong>
                          {formatPrice(
                            Number(cartItem.item.price) * cartItem.quantity,
                          )}
                        </strong>

                        <button
                          className="cart-remove-button"
                          type="button"
                          onClick={() => removeItem(cartItem.item.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Toplam</span>

                  <strong>{formatPrice(totalPrice)}</strong>
                </div>

                <div className="order-note-section">
                  <label htmlFor="order-note">Sipariş Notu</label>

                  <textarea
                    id="order-note"
                    value={orderNote}
                    onChange={(event) => setOrderNote(event.target.value)}
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
                  disabled={isSubmitting || cartItems.length === 0}
                  onClick={handleCreateOrder}
                >
                  {isSubmitting ? "Sipariş Gönderiliyor..." : "Siparişi Gönder"}
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {isPaymentOpen && trackedOrder && (
        <div className="payment-overlay" onClick={closePaymentModal}>
          <section
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-header">
              <div>
                <p className="section-kicker">Güvenli ödeme</p>

                <h2 id="payment-modal-title">Hesabı Öde</h2>
              </div>

              <button
                type="button"
                className="payment-close-button"
                disabled={isPaying}
                onClick={closePaymentModal}
              >
                ×
              </button>
            </div>

            <p className="payment-modal-description">
              Ödeme tamamlandıktan sonra ne yapmak istediğinizi seçin.
            </p>

            <div className="payment-stay-options">
              <button
                type="button"
                className={`payment-stay-option${
                  keepSessionOpen ? " selected" : ""
                }`}
                onClick={() => setKeepSessionOpen(true)}
              >
                <strong>Masada kalmaya devam edeceğim</strong>
                <span>
                  Ödeme tamamlanır, masa açık kalır ve yeniden sipariş
                  verebilirsiniz.
                </span>
              </button>

              <button
                type="button"
                className={`payment-stay-option${
                  !keepSessionOpen ? " selected" : ""
                }`}
                onClick={() => setKeepSessionOpen(false)}
              >
                <strong>Öde ve masadan ayrılacağım</strong>
                <span>Ödeme tamamlanır ve masa hesabı kapatılır.</span>
              </button>
            </div>

            {paymentError && (
              <p className="payment-error-message">{paymentError}</p>
            )}
            <div className="demo-payment-form">
              <div className="demo-payment-badge">
                <span>💳</span>

                <div>
                  <strong>Demo Kart Ödemesi</strong>
                  <small>Gerçek para çekilmez</small>
                </div>
              </div>

              <label className="payment-field">
                <span>Kart Üzerindeki İsim</span>

                <input
                  type="text"
                  value={cardholderName}
                  onChange={(event) => setCardholderName(event.target.value)}
                  placeholder="AD SOYAD"
                  autoComplete="cc-name"
                />
              </label>

              <label className="payment-field">
                <span>Kart Numarası</span>

                <input
                  type="text"
                  value={cardNumber}
                  onChange={(event) => {
                    const digits = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);

                    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

                    setCardNumber(formatted);
                  }}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
              </label>

              <div className="payment-field-row">
                <label className="payment-field">
                  <span>Son Kullanma</span>

                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(event) => {
                      const digits = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

                      const formatted =
                        digits.length > 2
                          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                          : digits;

                      setCardExpiry(formatted);
                    }}
                    placeholder="AA/YY"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                </label>

                <label className="payment-field">
                  <span>CVV</span>

                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(event) =>
                      setCardCvv(
                        event.target.value.replace(/\D/g, "").slice(0, 3),
                      )
                    }
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              className="payment-confirm-button"
              disabled={isPaying}
              onClick={handlePayBill}
            >
              {isPaying ? "Ödeme İşleniyor..." : "Ödemeyi Tamamla"}
            </button>

            <small className="payment-test-notice">
              Şu anda test ödeme akışı kullanılmaktadır. Gerçek kart çekimi
              sonraki sağlayıcı entegrasyonunda etkinleştirilecektir.
            </small>
          </section>
        </div>
      )}

      <button
        type="button"
        className="ai-floating-button"
        onClick={() => setIsAiOpen(true)}
      >
        ✨ AI Garson
      </button>

      {isAiOpen && (
        <div className="ai-chat-overlay" onClick={() => setIsAiOpen(false)}>
          <section
            className="ai-chat-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ai-chat-header">
              <div>
                <p className="section-kicker">Akıllı Öneri</p>
                <h2>AI Garson</h2>
              </div>
              <button
                type="button"
                className="ai-chat-close-button"
                onClick={() => setIsAiOpen(false)}
              >
                ×
              </button>
            </div>

            <p className="ai-chat-description">
              Ne yemek istediğinizi, bütçenizi veya damak zevkinizi yazın. Size
              menüden öneri sunalım.
            </p>

            <div className="ai-example-messages">
              <button
                type="button"
                onClick={() => setAiMessage("300 TL altında bir şey öner")}
              >
                300 TL altında
              </button>
              <button
                type="button"
                onClick={() => setAiMessage("Hafif bir şey öner")}
              >
                Hafif bir şey
              </button>
              <button type="button" onClick={() => setAiMessage("İçecek öner")}>
                İçecek öner
              </button>
            </div>

            <textarea
              className="ai-chat-input"
              value={aiMessage}
              onChange={(event) => setAiMessage(event.target.value)}
              placeholder="Örn: 300 TL altında hafif bir şey öner..."
              maxLength={300}
            />

            <button
              type="button"
              className="ai-chat-send-button"
              disabled={isAiLoading || !aiMessage.trim()}
              onClick={handleAiMessage}
            >
              {isAiLoading ? "Öneri hazırlanıyor..." : "Öneri Al"}
            </button>

            {aiError && <p className="ai-chat-error">{aiError}</p>}

            {aiReply && (
              <div className="ai-chat-reply">
                <strong>AI Garson</strong>
                <p>{aiReply}</p>
              </div>
            )}

            {aiSuggestions.length > 0 && (
              <div className="ai-suggestion-list">
                {aiSuggestions.map((suggestion) => (
                  <article key={suggestion.id} className="ai-suggestion-card">
                    <div>
                      <small>{suggestion.category ?? "Menü"}</small>
                      <h3>{suggestion.name}</h3>
                      {suggestion.description && (
                        <p>{suggestion.description}</p>
                      )}
                      <strong>{formatPrice(suggestion.price)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddAiSuggestionToCart(suggestion)}
                    >
                      Sepete Ekle
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {orderSuccess && (
        <div className="order-success-toast">
          Siparişiniz başarıyla mutfağa gönderildi.
        </div>
      )}

      {paymentSuccessMessage && (
        <div className="payment-success-toast">{paymentSuccessMessage}</div>
      )}
    </main>
  );
}