import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      common: {
        language: 'Dil',
        selectLanguage: 'Dil seçin',
        close: 'Kapat',
        confirm: 'Onayla',
        cancel: 'İptal',
        loading: 'Yükleniyor...',
        error: 'Bir hata oluştu',
        retry: 'Tekrar dene',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Hoş geldiniz',
        description: 'Menüyü görüntülemek için devam edin.',
        continue: 'Menüye Git',
      },

      menu: {
  title: 'Menü',
  explore: 'Menüyü Keşfet',
  categories: 'Kategoriler',
  allProducts: 'Tüm Ürünler',
  unavailable: 'Şu anda mevcut değil',
  noProducts: 'Bu kategoride ürün bulunmuyor.',
  add: 'Ekle',
  added: 'Eklendi',
},

      cart: {
        title: 'Sepetim',
        empty: 'Sepetiniz boş',
        emptyDescription: 'Menüden ürün ekleyebilirsiniz.',
        quantity: 'Adet',
        remove: 'Kaldır',
        subtotal: 'Ara Toplam',
        total: 'Toplam',
        orderNote: 'Sipariş notu',
        orderNotePlaceholder: 'Örneğin: Soğansız olsun',
        placeOrder: 'Sipariş Ver',
        orderSuccess: 'Siparişiniz başarıyla alındı.',
        orderError: 'Sipariş oluşturulamadı.',
      },

      order: {
        activeOrders: 'Aktif Siparişler',
        orderNumber: 'Sipariş No',
        status: 'Durum',
        pending: 'Bekliyor',
        accepted: 'Kabul Edildi',
        preparing: 'Hazırlanıyor',
        ready: 'Hazır',
        served: 'Teslim Edildi',
        cancelled: 'İptal Edildi',
      },

      serviceRequest: {
  title: 'Servis İşlemleri',
  howCanWeHelp: 'Size nasıl yardımcı olabiliriz?',
  callWaiter: 'Garson Çağır',
  callWaiterDescription: 'Garsonun masanıza gelmesini isteyin.',
  requestBill: 'Hesap İste',
  requestBillDescription: 'Hesabınızın hazırlanmasını isteyin.',
  waiterCalled: 'Garson çağrıldı.',
  billRequested: 'Hesap talebiniz iletildi.',
  requestError: 'Talep gönderilemedi.',
},

      payment: {
        title: 'Ödeme',
        payBill: 'Hesabı Öde',
        accountSummary: 'Hesap Özeti',
        totalAmount: 'Toplam Tutar',
        paidAmount: 'Ödenen Tutar',
        remainingAmount: 'Kalan Tutar',
        paymentMethod: 'Ödeme Yöntemi',
        cardPayment: 'Kartla Ödeme',
        cashPayment: 'Nakit Ödeme',
        confirmPayment: 'Ödemeyi Onayla',
        processing: 'Ödeme işleniyor...',
        success: 'Ödeme başarılı',
        failed: 'Ödeme başarısız',
        thankYou: 'Teşekkür ederiz',
        continueSitting: 'Masada oturmaya devam edeceğim',
      },

      table: {
        table: 'Masa',
        tableNumber: 'Masa Numarası',
      },
    },
  },

  en: {
    translation: {
      common: {
        language: 'Language',
        selectLanguage: 'Select language',
        close: 'Close',
        confirm: 'Confirm',
        cancel: 'Cancel',
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Try again',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Welcome',
        description: 'Continue to view the menu.',
        continue: 'View Menu',
      },

      menu: {
        title: 'Menu',
        categories: 'Categories',
        allProducts: 'All Products',
        unavailable: 'Currently unavailable',
        noProducts: 'No products found in this category.',
        add: 'Add',
        added: 'Added',
      },

      cart: {
        title: 'My Cart',
        empty: 'Your cart is empty',
        emptyDescription: 'You can add products from the menu.',
        quantity: 'Quantity',
        remove: 'Remove',
        subtotal: 'Subtotal',
        total: 'Total',
        orderNote: 'Order note',
        orderNotePlaceholder: 'For example: No onions',
        placeOrder: 'Place Order',
        orderSuccess: 'Your order has been received.',
        orderError: 'The order could not be created.',
      },

      order: {
        activeOrders: 'Active Orders',
        orderNumber: 'Order Number',
        status: 'Status',
        pending: 'Pending',
        accepted: 'Accepted',
        preparing: 'Preparing',
        ready: 'Ready',
        served: 'Served',
        cancelled: 'Cancelled',
      },

      serviceRequest: {
        title: 'Service',
        callWaiter: 'Call Waiter',
        requestBill: 'Request Bill',
        waiterCalled: 'The waiter has been called.',
        billRequested: 'Your bill request has been sent.',
        requestError: 'The request could not be sent.',
      },

      payment: {
        title: 'Payment',
        payBill: 'Pay Bill',
        accountSummary: 'Bill Summary',
        totalAmount: 'Total Amount',
        paidAmount: 'Paid Amount',
        remainingAmount: 'Remaining Amount',
        paymentMethod: 'Payment Method',
        cardPayment: 'Card Payment',
        cashPayment: 'Cash Payment',
        confirmPayment: 'Confirm Payment',
        processing: 'Processing payment...',
        success: 'Payment successful',
        failed: 'Payment failed',
        thankYou: 'Thank you',
        continueSitting: 'I will continue sitting at the table',
      },

      table: {
        table: 'Table',
        tableNumber: 'Table Number',
      },
    },
  },

  de: {
    translation: {
      common: {
        language: 'Sprache',
        selectLanguage: 'Sprache auswählen',
        close: 'Schließen',
        confirm: 'Bestätigen',
        cancel: 'Abbrechen',
        loading: 'Wird geladen...',
        error: 'Ein Fehler ist aufgetreten',
        retry: 'Erneut versuchen',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Willkommen',
        description: 'Fahren Sie fort, um die Speisekarte anzuzeigen.',
        continue: 'Zur Speisekarte',
      },

      menu: {
        title: 'Speisekarte',
        categories: 'Kategorien',
        allProducts: 'Alle Produkte',
        unavailable: 'Derzeit nicht verfügbar',
        noProducts: 'In dieser Kategorie wurden keine Produkte gefunden.',
        add: 'Hinzufügen',
        added: 'Hinzugefügt',
      },

      cart: {
        title: 'Mein Warenkorb',
        empty: 'Ihr Warenkorb ist leer',
        emptyDescription: 'Sie können Produkte aus der Speisekarte hinzufügen.',
        quantity: 'Menge',
        remove: 'Entfernen',
        subtotal: 'Zwischensumme',
        total: 'Gesamt',
        orderNote: 'Bestellhinweis',
        orderNotePlaceholder: 'Zum Beispiel: Ohne Zwiebeln',
        placeOrder: 'Bestellung aufgeben',
        orderSuccess: 'Ihre Bestellung wurde aufgenommen.',
        orderError: 'Die Bestellung konnte nicht erstellt werden.',
      },

      order: {
        activeOrders: 'Aktive Bestellungen',
        orderNumber: 'Bestellnummer',
        status: 'Status',
        pending: 'Ausstehend',
        accepted: 'Akzeptiert',
        preparing: 'In Vorbereitung',
        ready: 'Fertig',
        served: 'Serviert',
        cancelled: 'Storniert',
      },

      serviceRequest: {
        title: 'Service',
        callWaiter: 'Kellner rufen',
        requestBill: 'Rechnung anfordern',
        waiterCalled: 'Der Kellner wurde gerufen.',
        billRequested: 'Ihre Rechnungsanfrage wurde gesendet.',
        requestError: 'Die Anfrage konnte nicht gesendet werden.',
      },

      payment: {
        title: 'Zahlung',
        payBill: 'Rechnung bezahlen',
        accountSummary: 'Rechnungsübersicht',
        totalAmount: 'Gesamtbetrag',
        paidAmount: 'Bezahlter Betrag',
        remainingAmount: 'Restbetrag',
        paymentMethod: 'Zahlungsmethode',
        cardPayment: 'Kartenzahlung',
        cashPayment: 'Barzahlung',
        confirmPayment: 'Zahlung bestätigen',
        processing: 'Zahlung wird verarbeitet...',
        success: 'Zahlung erfolgreich',
        failed: 'Zahlung fehlgeschlagen',
        thankYou: 'Vielen Dank',
        continueSitting: 'Ich bleibe weiterhin am Tisch sitzen',
      },

      table: {
        table: 'Tisch',
        tableNumber: 'Tischnummer',
      },
    },
  },

  ru: {
    translation: {
      common: {
        language: 'Язык',
        selectLanguage: 'Выберите язык',
        close: 'Закрыть',
        confirm: 'Подтвердить',
        cancel: 'Отмена',
        loading: 'Загрузка...',
        error: 'Произошла ошибка',
        retry: 'Попробовать снова',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Добро пожаловать',
        description: 'Продолжите, чтобы открыть меню.',
        continue: 'Открыть меню',
      },

      menu: {
        title: 'Меню',
        categories: 'Категории',
        allProducts: 'Все блюда',
        unavailable: 'Сейчас недоступно',
        noProducts: 'В этой категории нет товаров.',
        add: 'Добавить',
        added: 'Добавлено',
      },

      cart: {
        title: 'Моя корзина',
        empty: 'Ваша корзина пуста',
        emptyDescription: 'Добавьте блюда из меню.',
        quantity: 'Количество',
        remove: 'Удалить',
        subtotal: 'Промежуточный итог',
        total: 'Итого',
        orderNote: 'Комментарий к заказу',
        orderNotePlaceholder: 'Например: Без лука',
        placeOrder: 'Оформить заказ',
        orderSuccess: 'Ваш заказ принят.',
        orderError: 'Не удалось создать заказ.',
      },

      order: {
        activeOrders: 'Активные заказы',
        orderNumber: 'Номер заказа',
        status: 'Статус',
        pending: 'Ожидает',
        accepted: 'Принят',
        preparing: 'Готовится',
        ready: 'Готов',
        served: 'Подан',
        cancelled: 'Отменён',
      },

      serviceRequest: {
        title: 'Обслуживание',
        callWaiter: 'Позвать официанта',
        requestBill: 'Попросить счёт',
        waiterCalled: 'Официант вызван.',
        billRequested: 'Запрос счёта отправлен.',
        requestError: 'Не удалось отправить запрос.',
      },

      payment: {
        title: 'Оплата',
        payBill: 'Оплатить счёт',
        accountSummary: 'Сводка счёта',
        totalAmount: 'Общая сумма',
        paidAmount: 'Оплачено',
        remainingAmount: 'Осталось',
        paymentMethod: 'Способ оплаты',
        cardPayment: 'Оплата картой',
        cashPayment: 'Оплата наличными',
        confirmPayment: 'Подтвердить оплату',
        processing: 'Оплата обрабатывается...',
        success: 'Оплата прошла успешно',
        failed: 'Оплата не удалась',
        thankYou: 'Спасибо',
        continueSitting: 'Я останусь сидеть за столом',
      },

      table: {
        table: 'Стол',
        tableNumber: 'Номер стола',
      },
    },
  },

  ar: {
    translation: {
      common: {
        language: 'اللغة',
        selectLanguage: 'اختر اللغة',
        close: 'إغلاق',
        confirm: 'تأكيد',
        cancel: 'إلغاء',
        loading: 'جارٍ التحميل...',
        error: 'حدث خطأ',
        retry: 'حاول مرة أخرى',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'مرحباً بكم',
        description: 'تابع لعرض القائمة.',
        continue: 'عرض القائمة',
      },

      menu: {
        title: 'القائمة',
        categories: 'التصنيفات',
        allProducts: 'جميع المنتجات',
        unavailable: 'غير متاح حالياً',
        noProducts: 'لا توجد منتجات في هذا التصنيف.',
        add: 'إضافة',
        added: 'تمت الإضافة',
      },

      cart: {
        title: 'سلتي',
        empty: 'سلتك فارغة',
        emptyDescription: 'يمكنك إضافة المنتجات من القائمة.',
        quantity: 'الكمية',
        remove: 'إزالة',
        subtotal: 'المجموع الفرعي',
        total: 'الإجمالي',
        orderNote: 'ملاحظة الطلب',
        orderNotePlaceholder: 'مثال: بدون بصل',
        placeOrder: 'إرسال الطلب',
        orderSuccess: 'تم استلام طلبك بنجاح.',
        orderError: 'تعذر إنشاء الطلب.',
      },

      order: {
        activeOrders: 'الطلبات النشطة',
        orderNumber: 'رقم الطلب',
        status: 'الحالة',
        pending: 'قيد الانتظار',
        accepted: 'تم القبول',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        served: 'تم التقديم',
        cancelled: 'ملغي',
      },

      serviceRequest: {
        title: 'الخدمة',
        callWaiter: 'استدعاء النادل',
        requestBill: 'طلب الحساب',
        waiterCalled: 'تم استدعاء النادل.',
        billRequested: 'تم إرسال طلب الحساب.',
        requestError: 'تعذر إرسال الطلب.',
      },

      payment: {
        title: 'الدفع',
        payBill: 'دفع الحساب',
        accountSummary: 'ملخص الحساب',
        totalAmount: 'المبلغ الإجمالي',
        paidAmount: 'المبلغ المدفوع',
        remainingAmount: 'المبلغ المتبقي',
        paymentMethod: 'طريقة الدفع',
        cardPayment: 'الدفع بالبطاقة',
        cashPayment: 'الدفع نقداً',
        confirmPayment: 'تأكيد الدفع',
        processing: 'جارٍ معالجة الدفع...',
        success: 'تم الدفع بنجاح',
        failed: 'فشل الدفع',
        thankYou: 'شكراً لكم',
        continueSitting: 'سأستمر في الجلوس على الطاولة',
      },

      table: {
        table: 'طاولة',
        tableNumber: 'رقم الطاولة',
      },
    },
  },

  fr: {
    translation: {
      common: {
        language: 'Langue',
        selectLanguage: 'Choisir la langue',
        close: 'Fermer',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        retry: 'Réessayer',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Bienvenue',
        description: 'Continuez pour afficher le menu.',
        continue: 'Voir le menu',
      },

      menu: {
        title: 'Menu',
        categories: 'Catégories',
        allProducts: 'Tous les produits',
        unavailable: 'Actuellement indisponible',
        noProducts: 'Aucun produit dans cette catégorie.',
        add: 'Ajouter',
        added: 'Ajouté',
      },

      cart: {
        title: 'Mon panier',
        empty: 'Votre panier est vide',
        emptyDescription: 'Vous pouvez ajouter des produits depuis le menu.',
        quantity: 'Quantité',
        remove: 'Supprimer',
        subtotal: 'Sous-total',
        total: 'Total',
        orderNote: 'Note de commande',
        orderNotePlaceholder: 'Par exemple : Sans oignons',
        placeOrder: 'Commander',
        orderSuccess: 'Votre commande a bien été reçue.',
        orderError: 'La commande n’a pas pu être créée.',
      },

      order: {
        activeOrders: 'Commandes actives',
        orderNumber: 'Numéro de commande',
        status: 'Statut',
        pending: 'En attente',
        accepted: 'Acceptée',
        preparing: 'En préparation',
        ready: 'Prête',
        served: 'Servie',
        cancelled: 'Annulée',
      },

      serviceRequest: {
        title: 'Service',
        callWaiter: 'Appeler le serveur',
        requestBill: 'Demander l’addition',
        waiterCalled: 'Le serveur a été appelé.',
        billRequested: 'Votre demande d’addition a été envoyée.',
        requestError: 'La demande n’a pas pu être envoyée.',
      },

      payment: {
        title: 'Paiement',
        payBill: 'Payer l’addition',
        accountSummary: 'Résumé de l’addition',
        totalAmount: 'Montant total',
        paidAmount: 'Montant payé',
        remainingAmount: 'Montant restant',
        paymentMethod: 'Mode de paiement',
        cardPayment: 'Paiement par carte',
        cashPayment: 'Paiement en espèces',
        confirmPayment: 'Confirmer le paiement',
        processing: 'Paiement en cours...',
        success: 'Paiement réussi',
        failed: 'Échec du paiement',
        thankYou: 'Merci',
        continueSitting: 'Je vais continuer à rester à table',
      },

      table: {
        table: 'Table',
        tableNumber: 'Numéro de table',
      },
    },
  },

  es: {
    translation: {
      common: {
        language: 'Idioma',
        selectLanguage: 'Seleccionar idioma',
        close: 'Cerrar',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        loading: 'Cargando...',
        error: 'Ocurrió un error',
        retry: 'Intentar de nuevo',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Bienvenido',
        description: 'Continúa para ver el menú.',
        continue: 'Ver Menú',
      },

      menu: {
        title: 'Menú',
        categories: 'Categorías',
        allProducts: 'Todos los productos',
        unavailable: 'No disponible actualmente',
        noProducts: 'No hay productos en esta categoría.',
        add: 'Añadir',
        added: 'Añadido',
      },

      cart: {
        title: 'Mi carrito',
        empty: 'Tu carrito está vacío',
        emptyDescription: 'Puedes añadir productos desde el menú.',
        quantity: 'Cantidad',
        remove: 'Eliminar',
        subtotal: 'Subtotal',
        total: 'Total',
        orderNote: 'Nota del pedido',
        orderNotePlaceholder: 'Por ejemplo: Sin cebolla',
        placeOrder: 'Realizar pedido',
        orderSuccess: 'Tu pedido ha sido recibido.',
        orderError: 'No se pudo crear el pedido.',
      },

      order: {
        activeOrders: 'Pedidos activos',
        orderNumber: 'Número de pedido',
        status: 'Estado',
        pending: 'Pendiente',
        accepted: 'Aceptado',
        preparing: 'Preparando',
        ready: 'Listo',
        served: 'Servido',
        cancelled: 'Cancelado',
      },

      serviceRequest: {
        title: 'Servicio',
        callWaiter: 'Llamar al camarero',
        requestBill: 'Pedir la cuenta',
        waiterCalled: 'El camarero ha sido llamado.',
        billRequested: 'Tu solicitud de cuenta ha sido enviada.',
        requestError: 'No se pudo enviar la solicitud.',
      },

      payment: {
        title: 'Pago',
        payBill: 'Pagar la cuenta',
        accountSummary: 'Resumen de la cuenta',
        totalAmount: 'Importe total',
        paidAmount: 'Importe pagado',
        remainingAmount: 'Importe restante',
        paymentMethod: 'Método de pago',
        cardPayment: 'Pago con tarjeta',
        cashPayment: 'Pago en efectivo',
        confirmPayment: 'Confirmar pago',
        processing: 'Procesando el pago...',
        success: 'Pago realizado correctamente',
        failed: 'El pago ha fallado',
        thankYou: 'Gracias',
        continueSitting: 'Seguiré sentado en la mesa',
      },

      table: {
        table: 'Mesa',
        tableNumber: 'Número de mesa',
      },
    },
  },

  it: {
    translation: {
      common: {
        language: 'Lingua',
        selectLanguage: 'Seleziona lingua',
        close: 'Chiudi',
        confirm: 'Conferma',
        cancel: 'Annulla',
        loading: 'Caricamento...',
        error: 'Si è verificato un errore',
        retry: 'Riprova',
        currency: '₺',
      },

      languages: {
        tr: 'Türkçe',
        en: 'English',
        de: 'Deutsch',
        ru: 'Русский',
        ar: 'العربية',
        fr: 'Français',
        es: 'Español',
        it: 'Italiano',
      },

      welcome: {
        title: 'Benvenuto',
        description: 'Continua per visualizzare il menu.',
        continue: 'Visualizza Menu',
      },

      menu: {
        title: 'Menu',
        categories: 'Categorie',
        allProducts: 'Tutti i prodotti',
        unavailable: 'Attualmente non disponibile',
        noProducts: 'Nessun prodotto in questa categoria.',
        add: 'Aggiungi',
        added: 'Aggiunto',
      },

      cart: {
        title: 'Il mio carrello',
        empty: 'Il tuo carrello è vuoto',
        emptyDescription: 'Puoi aggiungere prodotti dal menu.',
        quantity: 'Quantità',
        remove: 'Rimuovi',
        subtotal: 'Subtotale',
        total: 'Totale',
        orderNote: 'Nota dell’ordine',
        orderNotePlaceholder: 'Ad esempio: Senza cipolla',
        placeOrder: 'Invia ordine',
        orderSuccess: 'Il tuo ordine è stato ricevuto.',
        orderError: 'Impossibile creare l’ordine.',
      },

      order: {
        activeOrders: 'Ordini attivi',
        orderNumber: 'Numero ordine',
        status: 'Stato',
        pending: 'In attesa',
        accepted: 'Accettato',
        preparing: 'In preparazione',
        ready: 'Pronto',
        served: 'Servito',
        cancelled: 'Annullato',
      },

      serviceRequest: {
        title: 'Servizio',
        callWaiter: 'Chiama cameriere',
        requestBill: 'Chiedi il conto',
        waiterCalled: 'Il cameriere è stato chiamato.',
        billRequested: 'La richiesta del conto è stata inviata.',
        requestError: 'Impossibile inviare la richiesta.',
      },

      payment: {
        title: 'Pagamento',
        payBill: 'Paga il conto',
        accountSummary: 'Riepilogo del conto',
        totalAmount: 'Importo totale',
        paidAmount: 'Importo pagato',
        remainingAmount: 'Importo rimanente',
        paymentMethod: 'Metodo di pagamento',
        cardPayment: 'Pagamento con carta',
        cashPayment: 'Pagamento in contanti',
        confirmPayment: 'Conferma pagamento',
        processing: 'Pagamento in elaborazione...',
        success: 'Pagamento riuscito',
        failed: 'Pagamento non riuscito',
        thankYou: 'Grazie',
        continueSitting: 'Continuerò a restare seduto al tavolo',
      },

      table: {
        table: 'Tavolo',
        tableNumber: 'Numero tavolo',
      },
    },
  },
};

const savedLanguage = localStorage.getItem('customer-language') ?? 'tr';

void i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'tr',
  supportedLngs: ['tr', 'en', 'de', 'ru', 'ar', 'fr', 'es', 'it'],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  localStorage.setItem('customer-language', language);

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
});

document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';

export default i18n;