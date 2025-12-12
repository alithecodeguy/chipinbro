// i18n.js - Internationalization and localization
const i18n = {
  // Supported languages with direction
  languages: {
    en: { name: 'English', dir: 'ltr' },
    fa: { name: 'فارسی', dir: 'rtl' },
    de: { name: 'Deutsch', dir: 'ltr' }
  },

  // Default language
  defaultLang: 'en',

  // Get current language from URL hash or default
  getCurrentLang: function() {
    try {
      const hash = window.location.hash.substring(1);
      if (!hash) return this.defaultLang;

      const decoded = this.base64UrlDecode(hash);
      const data = JSON.parse(decoded);

      return data.lang && this.languages[data.lang] ? data.lang : this.defaultLang;
    } catch (e) {
      return this.defaultLang;
    }
  },

  // Set language and direction on document
  setLanguage: function(lang) {
    if (!this.languages[lang]) lang = this.defaultLang;

    document.documentElement.lang = lang;
    document.documentElement.dir = this.languages[lang].dir;

    return lang;
  },

  // Base64 URL-safe encoding/decoding utilities
  base64UrlEncode: function(str) {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  },

  base64UrlDecode: function(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return atob(str);
  },

  // Translation strings
  translations: {
    en: {
      // Page titles
      title_create: 'ChipInBro - Split Expenses',
      title_share: 'ChipInBro - Share Receipt',
      title_receipt: 'ChipInBro - Receipt',

      // Meta descriptions
      meta_create: 'Create and split expenses with friends. Privacy-first, no accounts required.',
      meta_share: 'Share your expense receipt with others. Copy the link and send it.',
      meta_receipt: 'View and print your expense receipt. Privacy-first expense splitting.',

      // Common UI
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
      copy: 'Copy',
      share: 'Share',
      print: 'Print',
      back: 'Back',
      next: 'Next',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',

      // Language selector
      select_language: 'Language',

      // Form labels
      receipt_title: 'Receipt Title',
      receipt_title_placeholder: 'e.g., Dinner at Restaurant',
      paid_by: 'Paid by',
      paid_by_placeholder: 'e.g., John Doe',
      currency: 'Currency',
      tax_percent: 'Tax (%)',
      tip_value: 'Tip',
      note: 'Note',
      note_placeholder: 'Optional note...',

      // Participants
      participants: 'Participants',
      participant_name: 'Name',
      participant_name_placeholder: 'e.g., Alice',
      participant_desc: 'Description',
      participant_desc_placeholder: 'Optional description...',
      participant_base: 'Amount',
      participant_base_placeholder: '0.00',
      add_participant: 'Add Participant',
      remove_participant: 'Remove participant',

      // Calculations
      total: 'Total',
      base_amount: 'Base Amount',
      tax_amount: 'Tax Amount',
      tip_amount: 'Tip Amount',
      final_total: 'Final Total',
      you_owe: 'You owe',
      they_owe: 'They owe',

      // Buttons
      generate_receipt: 'Generate Receipt',
      copy_link: 'Copy Link',
      open_receipt: 'Open Receipt',
      new_receipt: 'New Receipt',

      // Share page
      share_title: 'Share Your Receipt',
      share_description: 'Copy the link below and share it with others:',
      link_copied: 'Link copied to clipboard!',
      copy_failed: 'Failed to copy link. Please copy manually.',

      // Receipt page
      receipt_title_text: 'Receipt',
      receipt_paid_by: 'Paid by',
      receipt_date: 'Date',
      receipt_currency: 'Currency',

      // Validation messages
      validation_title_required: 'Please enter a receipt title',
      validation_paid_by_required: 'Please enter who paid',
      validation_participants_required: 'Please add at least one participant',
      validation_participant_name_required: 'Participant name is required',
      validation_invalid_number: 'Please enter a valid number',
      validation_negative_not_allowed: 'Negative values are not allowed',

      // Error messages
      error_invalid_hash: 'Invalid or corrupted receipt link',
      error_missing_data: 'Receipt data is missing',
      error_unsupported_version: 'This receipt version is not supported',
      error_return_home: 'Return to Home',

      // Currency symbols
      currency_EUR: 'EUR',
      currency_USD: 'USD',
      currency_GBP: 'GBP',
      currency_IRR: 'IRR',

      // Date/time formatting
      date_format: { year: 'numeric', month: 'short', day: 'numeric' },
      number_format: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    },

    fa: {
      // Page titles
      title_create: 'چیپ‌این‌برادر - تقسیم هزینه‌ها',
      title_share: 'چیپ‌این‌برادر - اشتراک‌گذاری رسید',
      title_receipt: 'چیپ‌این‌برادر - رسید',

      // Meta descriptions
      meta_create: 'هزینه‌ها را با دوستان تقسیم کنید. حفظ حریم خصوصی، بدون نیاز به حساب.',
      meta_share: 'رسید هزینه خود را با دیگران به اشتراک بگذارید. لینک را کپی کرده و ارسال کنید.',
      meta_receipt: 'رسید هزینه خود را مشاهده و چاپ کنید. تقسیم هزینه با حفظ حریم خصوصی.',

      // Common UI
      loading: 'بارگذاری...',
      error: 'خطا',
      success: 'موفقیت',
      close: 'بستن',
      copy: 'کپی',
      share: 'اشتراک‌گذاری',
      print: 'چاپ',
      back: 'بازگشت',
      next: 'بعدی',
      cancel: 'لغو',
      save: 'ذخیره',
      delete: 'حذف',
      add: 'افزودن',
      remove: 'حذف',
      edit: 'ویرایش',

      // Language selector
      select_language: 'زبان',

      // Form labels
      receipt_title: 'عنوان رسید',
      receipt_title_placeholder: 'مثلاً شام در رستوران',
      paid_by: 'پرداخت شده توسط',
      paid_by_placeholder: 'مثلاً جان دو',
      currency: 'واحد پول',
      tax_percent: 'مالیات (%)',
      tip_value: 'انعام',
      note: 'یادداشت',
      note_placeholder: 'یادداشت اختیاری...',

      // Participants
      participants: 'شرکت‌کنندگان',
      participant_name: 'نام',
      participant_name_placeholder: 'مثلاً آلیس',
      participant_desc: 'توضیحات',
      participant_desc_placeholder: 'توضیحات اختیاری...',
      participant_base: 'مبلغ',
      participant_base_placeholder: '0.00',
      add_participant: 'افزودن شرکت‌کننده',
      remove_participant: 'حذف شرکت‌کننده',

      // Calculations
      total: 'مجموع',
      base_amount: 'مبلغ پایه',
      tax_amount: 'مبلغ مالیات',
      tip_amount: 'مبلغ انعام',
      final_total: 'مجموع نهایی',
      you_owe: 'شما بدهکارید',
      they_owe: 'آنها بدهکارند',

      // Buttons
      generate_receipt: 'ایجاد رسید',
      copy_link: 'کپی لینک',
      open_receipt: 'باز کردن رسید',
      new_receipt: 'رسید جدید',

      // Share page
      share_title: 'رسید خود را به اشتراک بگذارید',
      share_description: 'لینک زیر را کپی کرده و با دیگران به اشتراک بگذارید:',
      link_copied: 'لینک در کلیپ‌بورد کپی شد!',
      copy_failed: 'کپی لینک ناموفق بود. لطفاً به صورت دستی کپی کنید.',

      // Receipt page
      receipt_title_text: 'رسید',
      receipt_paid_by: 'پرداخت شده توسط',
      receipt_date: 'تاریخ',
      receipt_currency: 'واحد پول',

      // Validation messages
      validation_title_required: 'لطفاً عنوان رسید را وارد کنید',
      validation_paid_by_required: 'لطفاً مشخص کنید چه کسی پرداخت کرده',
      validation_participants_required: 'لطفاً حداقل یک شرکت‌کننده اضافه کنید',
      validation_participant_name_required: 'نام شرکت‌کننده ضروری است',
      validation_invalid_number: 'لطفاً عدد معتبر وارد کنید',
      validation_negative_not_allowed: 'مقادیر منفی مجاز نیستند',

      // Error messages
      error_invalid_hash: 'لینک رسید نامعتبر یا خراب است',
      error_missing_data: 'داده‌های رسید موجود نیستند',
      error_unsupported_version: 'این نسخه رسید پشتیبانی نمی‌شود',
      error_return_home: 'بازگشت به صفحه اصلی',

      // Currency symbols
      currency_EUR: 'یورو',
      currency_USD: 'دلار',
      currency_GBP: 'پوند',
      currency_IRR: 'ریال',

      // Date/time formatting
      date_format: { year: 'numeric', month: 'short', day: 'numeric' },
      number_format: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    },

    de: {
      // Page titles
      title_create: 'ChipInBro - Ausgaben teilen',
      title_share: 'ChipInBro - Quittung teilen',
      title_receipt: 'ChipInBro - Quittung',

      // Meta descriptions
      meta_create: 'Erstellen und teilen Sie Ausgaben mit Freunden. Datenschutz zuerst, keine Konten erforderlich.',
      meta_share: 'Teilen Sie Ihre Ausgabenquittung mit anderen. Kopieren Sie den Link und senden Sie ihn.',
      meta_receipt: 'Zeigen und drucken Sie Ihre Ausgabenquittung. Datenschutzorientierte Ausgabenteilung.',

      // Common UI
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      close: 'Schließen',
      copy: 'Kopieren',
      share: 'Teilen',
      print: 'Drucken',
      back: 'Zurück',
      next: 'Weiter',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      add: 'Hinzufügen',
      remove: 'Entfernen',
      edit: 'Bearbeiten',

      // Language selector
      select_language: 'Sprache',

      // Form labels
      receipt_title: 'Quittungstitel',
      receipt_title_placeholder: 'z.B. Abendessen im Restaurant',
      paid_by: 'Bezahlt von',
      paid_by_placeholder: 'z.B. John Doe',
      currency: 'Währung',
      tax_percent: 'Steuer (%)',
      tip_value: 'Trinkgeld',
      note: 'Notiz',
      note_placeholder: 'Optionale Notiz...',

      // Participants
      participants: 'Teilnehmer',
      participant_name: 'Name',
      participant_name_placeholder: 'z.B. Alice',
      participant_desc: 'Beschreibung',
      participant_desc_placeholder: 'Optionale Beschreibung...',
      participant_base: 'Betrag',
      participant_base_placeholder: '0.00',
      add_participant: 'Teilnehmer hinzufügen',
      remove_participant: 'Teilnehmer entfernen',

      // Calculations
      total: 'Gesamt',
      base_amount: 'Grundbetrag',
      tax_amount: 'Steuerbetrag',
      tip_amount: 'Trinkgeldbetrag',
      final_total: 'Endsumme',
      you_owe: 'Du schuldest',
      they_owe: 'Sie schulden',

      // Buttons
      generate_receipt: 'Quittung erstellen',
      copy_link: 'Link kopieren',
      open_receipt: 'Quittung öffnen',
      new_receipt: 'Neue Quittung',

      // Share page
      share_title: 'Teilen Sie Ihre Quittung',
      share_description: 'Kopieren Sie den untenstehenden Link und teilen Sie ihn mit anderen:',
      link_copied: 'Link in die Zwischenablage kopiert!',
      copy_failed: 'Link kopieren fehlgeschlagen. Bitte manuell kopieren.',

      // Receipt page
      receipt_title_text: 'Quittung',
      receipt_paid_by: 'Bezahlt von',
      receipt_date: 'Datum',
      receipt_currency: 'Währung',

      // Validation messages
      validation_title_required: 'Bitte geben Sie einen Quittungstitel ein',
      validation_paid_by_required: 'Bitte geben Sie an, wer bezahlt hat',
      validation_participants_required: 'Bitte fügen Sie mindestens einen Teilnehmer hinzu',
      validation_participant_name_required: 'Teilnehmername ist erforderlich',
      validation_invalid_number: 'Bitte geben Sie eine gültige Zahl ein',
      validation_negative_not_allowed: 'Negative Werte sind nicht erlaubt',

      // Error messages
      error_invalid_hash: 'Ungültiger oder beschädigter Quittungslink',
      error_missing_data: 'Quittungsdaten fehlen',
      error_unsupported_version: 'Diese Quittungsversion wird nicht unterstützt',
      error_return_home: 'Zur Startseite zurückkehren',

      // Currency symbols
      currency_EUR: 'EUR',
      currency_USD: 'USD',
      currency_GBP: 'GBP',
      currency_IRR: 'IRR',

      // Date/time formatting
      date_format: { year: 'numeric', month: 'short', day: 'numeric' },
      number_format: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    }
  },

  // Get translation for current language
  t: function(key, lang = null) {
    const currentLang = lang || this.getCurrentLang();
    const translations = this.translations[currentLang] || this.translations[this.defaultLang];
    return translations[key] || key;
  },

  // Format currency
  formatCurrency: function(amount, currency, lang = null) {
    const currentLang = lang || this.getCurrentLang();
    try {
      return new Intl.NumberFormat(currentLang, {
        style: 'currency',
        currency: currency,
        ...this.translations[currentLang].number_format
      }).format(amount);
    } catch (e) {
      // Fallback for unsupported currencies like IRR
      return `${amount.toFixed(2)} ${this.t('currency_' + currency, currentLang)}`;
    }
  },

  // Format number
  formatNumber: function(amount, lang = null) {
    const currentLang = lang || this.getCurrentLang();
    try {
      return new Intl.NumberFormat(currentLang, this.translations[currentLang].number_format).format(amount);
    } catch (e) {
      return amount.toFixed(2);
    }
  },

  // Format date
  formatDate: function(date, lang = null) {
    const currentLang = lang || this.getCurrentLang();
    try {
      return new Intl.DateTimeFormat(currentLang, this.translations[currentLang].date_format).format(date);
    } catch (e) {
      return date.toLocaleDateString();
    }
  }
};