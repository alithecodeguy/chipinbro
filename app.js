// app.js - Core application logic for ChipInBro
const App = {
  // Current application state
  currentLang: 'en',
  receiptData: null,

  // Initialize the application
  init: function() {
    this.currentLang = i18n.setLanguage(i18n.getCurrentLang());
    this.updateUI();
  },

  // Update UI with current language
  updateUI: function() {
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = i18n.t(key, this.currentLang);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = i18n.t(key, this.currentLang);
    });

    // Update form labels for accessibility
    document.querySelectorAll('input, select, textarea').forEach(el => {
      const label = document.querySelector(`label[for="${el.id}"]`);
      if (label && label.hasAttribute('data-i18n')) {
        el.setAttribute('aria-label', label.textContent);
      }
    });
  },

  // Language switching
  switchLanguage: function(lang) {
    if (i18n.languages[lang]) {
      this.currentLang = i18n.setLanguage(lang);
      this.updateUI();

      // Update URL hash if we have data
      if (this.receiptData) {
        this.receiptData.lang = lang;
        const hash = this.encodeData(this.receiptData);
        window.location.hash = hash;
      }
    }
  },

  // Data encoding/decoding
  encodeData: function(data) {
    try {
      const jsonString = JSON.stringify(data);
      return i18n.base64UrlEncode(jsonString);
    } catch (e) {
      console.error('Encoding error:', e);
      return '';
    }
  },

  decodeData: function(hash) {
    try {
      if (!hash) return null;

      const decoded = i18n.base64UrlDecode(hash);
      const data = JSON.parse(decoded);

      // Validate data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data structure');
      }

      // Check version
      if (data.v !== 1) {
        throw new Error('Unsupported version');
      }

      // Validate required fields
      if (!data.receipt || !Array.isArray(data.receipt.participants)) {
        throw new Error('Missing required fields');
      }

      return data;
    } catch (e) {
      console.error('Decoding error:', e);
      throw new Error('Invalid or corrupted receipt data');
    }
  },

  // Calculations
  calculateReceipt: function(receipt) {
    const participants = receipt.participants || [];
    const taxPercent = parseFloat(receipt.taxPercent) || 0;
    const tipValue = parseFloat(receipt.tipValue) || 0;

    // Calculate base sum
    const baseSum = participants.reduce((sum, p) => sum + (parseFloat(p.base) || 0), 0);

    // Calculate tax and tip totals
    const taxValue = baseSum * (taxPercent / 100);
    const finalTotal = baseSum + taxValue + tipValue;

    // Calculate per participant shares
    const calculatedParticipants = participants.map(participant => {
      const base = parseFloat(participant.base) || 0;
      const shareRatio = baseSum > 0 ? base / baseSum : 0;
      const taxShare = taxValue * shareRatio;
      const tipShare = tipValue * shareRatio;
      const finalOwed = base + taxShare + tipShare;

      return {
        ...participant,
        base: base,
        taxShare: taxShare,
        tipShare: tipShare,
        finalOwed: finalOwed,
        shareRatio: shareRatio
      };
    });

    return {
      ...receipt,
      baseSum: baseSum,
      taxValue: taxValue,
      tipValue: tipValue,
      finalTotal: finalTotal,
      participants: calculatedParticipants
    };
  },

  // Form validation
  validateForm: function(formData) {
    const errors = [];

    // Check participants
    if (!formData.participants || formData.participants.length === 0) {
      errors.push(i18n.t('validation_participants_required', this.currentLang));
    } else {
      formData.participants.forEach((participant, index) => {
        if (!participant.name || participant.name.trim() === '') {
          errors.push(`${i18n.t('participant_name', this.currentLang)} ${index + 1}: ${i18n.t('validation_participant_name_required', this.currentLang)}`);
        }
        const base = parseFloat(participant.base);
        if (isNaN(base) || base < 0) {
          errors.push(`${i18n.t('participant_name', this.currentLang)} ${index + 1}: ${i18n.t('validation_invalid_number', this.currentLang)}`);
        }
      });
    }

    // Validate numeric fields
    ['taxPercent', 'tipValue'].forEach(field => {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`${i18n.t(field === 'taxPercent' ? 'tax_percent' : 'tip_value', this.currentLang)}: ${i18n.t('validation_invalid_number', this.currentLang)}`);
      }
    });

    return errors;
  },

  // Form handling
  collectFormData: function() {
    const form = document.getElementById('receiptForm');
    if (!form) return null;

    const participants = [];
    document.querySelectorAll('.participant-row').forEach(row => {
      const name = row.querySelector('.participant-name').value.trim();
      const desc = row.querySelector('.participant-desc').value.trim();
      const base = row.querySelector('.participant-base').value;

      if (name || desc || base) { // Include row if any field has content
        participants.push({
          name: name,
          desc: desc,
          base: parseFloat(base) || 0
        });
      }
    });

    return {
      v: 1,
      lang: this.currentLang,
      receipt: {
        title: document.getElementById('receiptTitle').value.trim(),
        paidBy: document.getElementById('paidBy').value.trim(),
        currency: document.getElementById('currency').value,
        taxPercent: parseFloat(document.getElementById('taxPercent').value) || 0,
        tipValue: parseFloat(document.getElementById('tipValue').value) || 0,
        note: document.getElementById('note').value.trim(),
        participants: participants
      }
    };
  },

  // Participant management
  addParticipant: function(name = '', desc = '', base = 0) {
    const container = document.getElementById('participantsContainer');
    if (!container) return;

    const participantId = Date.now() + Math.random();
    const participantHtml = `
      <div class="participant-row flex items-end space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg" data-id="${participantId}">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="participant_name">Name</label>
          <input type="text" class="participant-name w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="${name}" placeholder="e.g., Alice" data-i18n-placeholder="participant_name_placeholder">
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="participant_desc">Description</label>
          <input type="text" class="participant-desc w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="${desc}" placeholder="Optional description..." data-i18n-placeholder="participant_desc_placeholder">
        </div>
        <div class="w-32">
          <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="participant_base">Amount</label>
          <input type="number" class="participant-base w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01" min="0" value="${base}" placeholder="0.00">
        </div>
        <div class="pb-2">
          <button type="button" class="remove-participant-btn p-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md" aria-label="Remove participant" data-i18n-aria="remove_participant">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', participantHtml);
    this.updateUI();
    this.updateTotal();
  },

  removeParticipant: function(button) {
    const row = button.closest('.participant-row');
    if (row) {
      row.remove();
      this.updateTotal();
    }
  },

  // Update total display
  updateTotal: function() {
    const totalDisplay = document.getElementById('totalDisplay');
    if (!totalDisplay) return;

    const formData = this.collectFormData();
    if (!formData) return;

    const calculated = this.calculateReceipt(formData.receipt);
    const currency = formData.receipt.currency;

    totalDisplay.textContent = i18n.formatCurrency(calculated.finalTotal, currency, this.currentLang);
  },

  // Clipboard operations
  copyToClipboard: async function(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return true;
        } catch (err) {
          document.body.removeChild(textArea);
          return false;
        }
      }
    } catch (e) {
      return false;
    }
  },

  // Page-specific initialization
  initCreatePage: function() {
    this.init();

    // Add first participant
    this.addParticipant();

    // Language selector
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.switchLanguage(lang);

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        e.target.classList.add('bg-blue-600', 'text-white');
      });
    });

    // Set active language button
    document.querySelector(`[data-lang="${this.currentLang}"]`).classList.add('bg-blue-600', 'text-white');

    // Add participant button
    document.getElementById('addParticipantBtn').addEventListener('click', () => {
      this.addParticipant();
    });

    // Participant removal
    document.addEventListener('click', (e) => {
      if (e.target.closest('.remove-participant-btn')) {
        this.removeParticipant(e.target.closest('.remove-participant-btn'));
      }
    });

    // Live total updates
    document.addEventListener('input', (e) => {
      if (e.target.matches('.participant-base, #taxPercent, #tipValue, #currency')) {
        this.updateTotal();
      }
    });

    // Form submission
    document.getElementById('receiptForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = this.collectFormData();
      const errors = this.validateForm(formData.receipt);

      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Calculate and encode
      const calculated = this.calculateReceipt(formData.receipt);
      const finalData = { ...formData, receipt: calculated };
      const hash = this.encodeData(finalData);

      // Navigate to share page
      window.location.href = `share.html#${hash}`;
    });
  },

  initSharePage: function() {
    this.init();

    try {
      const hash = window.location.hash.substring(1);
      if (!hash) {
        throw new Error('No receipt data provided');
      }

      this.receiptData = this.decodeData(hash);
      this.currentLang = this.receiptData.lang;
      this.updateUI();

      // Set up share URL
      const shareUrl = `${window.location.origin}${window.location.pathname.replace('share.html', 'receipt.html')}#${hash}`;
      document.getElementById('shareUrl').value = shareUrl;
      document.getElementById('openReceiptBtn').href = `receipt.html#${hash}`;

      // Copy functionality
      document.getElementById('copyBtn').addEventListener('click', async () => {
        const success = await this.copyToClipboard(shareUrl);
        const status = document.getElementById('copyStatus');
        const message = document.getElementById('copyMessage');

        if (success) {
          message.textContent = i18n.t('link_copied', this.currentLang);
          message.className = 'text-green-600 font-medium';
        } else {
          message.textContent = i18n.t('copy_failed', this.currentLang);
          message.className = 'text-red-600 font-medium';
        }

        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 3000);
      });

      // Show content
      document.getElementById('loadingState').classList.add('hidden');
      document.getElementById('shareContent').classList.remove('hidden');

    } catch (e) {
      this.showError(e.message);
    }
  },

  initReceiptPage: function() {
    this.init();

    try {
      const hash = window.location.hash.substring(1);
      if (!hash) {
        throw new Error('No receipt data provided');
      }

      this.receiptData = this.decodeData(hash);
      this.currentLang = this.receiptData.lang;
      this.updateUI();

      const receipt = this.receiptData.receipt;

      // Populate receipt data
      document.getElementById('receiptTitle').textContent = receipt.title || 'Untitled';
      document.getElementById('receiptPaidBy').textContent = receipt.paidBy || 'Unknown';
      document.getElementById('receiptCurrency').textContent = receipt.currency;
      document.getElementById('receiptDate').textContent = i18n.formatDate(new Date(), this.currentLang);

      // Summary amounts
      document.getElementById('baseAmount').textContent = i18n.formatCurrency(receipt.baseSum, receipt.currency, this.currentLang);
      document.getElementById('taxAmount').textContent = i18n.formatCurrency(receipt.taxValue, receipt.currency, this.currentLang);
      document.getElementById('tipAmount').textContent = i18n.formatCurrency(receipt.tipValue, receipt.currency, this.currentLang);
      document.getElementById('finalTotal').textContent = i18n.formatCurrency(receipt.finalTotal, receipt.currency, this.currentLang);

      // Participants
      const participantsList = document.getElementById('participantsList');
      receipt.participants.forEach(participant => {
        const participantHtml = `
          <div class="border-b border-dashed border-gray-300 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
            <div class="flex justify-between items-center mb-2">
              <div class="font-semibold text-gray-800">${participant.name}</div>
              <div class="font-mono font-bold text-gray-900">${i18n.formatCurrency(participant.finalOwed, receipt.currency, this.currentLang)}</div>
            </div>
            ${participant.desc ? `<div class="text-sm text-gray-600 mb-2">${participant.desc}</div>` : ''}
            <div class="text-xs text-gray-500 space-y-1">
              <div class="flex justify-between">
                <span data-i18n="base_amount">Base Amount</span>
                <span class="font-mono">${i18n.formatCurrency(participant.base, receipt.currency, this.currentLang)}</span>
              </div>
              <div class="flex justify-between">
                <span data-i18n="tax_amount">Tax Share</span>
                <span class="font-mono">${i18n.formatCurrency(participant.taxShare, receipt.currency, this.currentLang)}</span>
              </div>
              <div class="flex justify-between">
                <span data-i18n="tip_amount">Tip Share</span>
                <span class="font-mono">${i18n.formatCurrency(participant.tipShare, receipt.currency, this.currentLang)}</span>
              </div>
            </div>
          </div>
        `;
        participantsList.insertAdjacentHTML('beforeend', participantHtml);
      });

      // Note
      if (receipt.note) {
        document.getElementById('receiptNote').textContent = receipt.note;
        document.getElementById('noteSection').classList.remove('hidden');
      }

      this.updateUI();

      // Print functionality
      document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
      });

      // Show content
      document.getElementById('loadingState').classList.add('hidden');
      document.getElementById('receiptContent').classList.remove('hidden');

    } catch (e) {
      this.showError(e.message);
    }
  },

  // Error handling
  showError: function(message) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
    this.updateUI();
  }
};