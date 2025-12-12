# ChipInBro

A privacy-first, static web application for splitting expenses. Create receipts, share them via URL, and print them - all without storing any data on servers.

## ✨ Features

- **Privacy-First**: Entire receipt encoded in URL hash - no backend, no storage, no tracking
- **Multi-Language**: Support for English, Persian (RTL), and German
- **Offline-Ready**: Works completely offline after first load
- **Print-Friendly**: Professional receipt layout optimized for printing
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: Full keyboard navigation and screen reader support
- **Static Deployment**: Deployable to any static hosting service

## 🚀 How It Works

1. **Create**: User fills out receipt details on `index.html`
2. **Encode**: Receipt data is JSON-serialized and Base64 URL-safe encoded into the URL hash
3. **Share**: User gets a shareable URL containing the encoded receipt
4. **View**: Others open the link and see the formatted receipt
5. **Print**: Receipts can be printed with professional formatting

## 📁 Project Structure

```
chipinbro/
├── index.html        # Receipt creation form
├── share.html        # Share URL with copy functionality
├── receipt.html      # Read-only receipt display
├── app.js            # Core application logic
├── i18n.js           # Internationalization and translations
└── README.md         # This documentation
```

## 🛠 Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **Vanilla JavaScript (ES6+)**: No frameworks or build tools
- **TailwindCSS**: Utility-first CSS via CDN
- **Base64 URL-Safe Encoding**: For data serialization

## 🌐 Supported Languages

- **English (en)**: Left-to-right
- **Persian/Farsi (fa)**: Right-to-left with proper RTL layout
- **German (de)**: Left-to-right

## 💰 Supported Currencies

- EUR (Euro)
- USD (US Dollar)
- GBP (British Pound)
- IRR (Iranian Rial)

## 📊 Data Model

All application state lives in the URL hash as a Base64 URL-safe encoded JSON object:

```json
{
  "v": 1,
  "lang": "en|fa|de",
  "receipt": {
    "title": "string",
    "paidBy": "string",
    "currency": "EUR|USD|GBP|IRR",
    "taxPercent": number,
    "tipValue": number,
    "note": "string",
    "participants": [
      {
        "name": "string",
        "desc": "string",
        "base": number
      }
    ]
  }
}
```

## 🔢 Calculations

The app automatically calculates fair splits including tax and tip sharing:

- **Base Sum**: Sum of all participant base amounts
- **Tax Amount**: Base sum × (tax percentage / 100)
- **Final Total**: Base sum + tax amount + tip amount
- **Per Participant**:
  - Share ratio = participant's base / base sum
  - Tax share = tax amount × share ratio
  - Tip share = tip amount × share ratio
  - Final owed = base + tax share + tip share

## 🚀 Local Development

### Option 1: Direct File Access
Simply open `index.html` in your browser:

```bash
# Navigate to the project directory
cd /path/to/chipinbro

# Open in browser (macOS example)
open index.html
```

### Option 2: Local Server
For better development experience, serve via HTTP:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if available)
npx http-server -p 8000

# Then open http://localhost:8000/index.html
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Your app will be available at `your-project.vercel.app`

### Netlify
1. Drag and drop the project folder to Netlify's deploy page
2. Or connect your Git repository
3. Deploy automatically

### Other Static Hosts
- GitHub Pages
- GitLab Pages
- AWS S3 + CloudFront
- Any web server supporting static files

## 📱 Usage Guide

### Creating a Receipt
1. Open `index.html`
2. Select your language (optional)
3. Fill in receipt details:
   - Title and who paid
   - Currency selection
   - Tax percentage and tip amount
   - Add participants with names and amounts
4. Click "Generate Receipt"

### Sharing a Receipt
1. Copy the share URL from the share page
2. Send the link to others
3. Recipients can view and print the receipt

### Viewing a Receipt
1. Open the shared link
2. View the formatted receipt
3. Print if needed (print styles included)

## 🎨 Design Principles

- **Clean & Professional**: Financial application aesthetics
- **Mobile-First**: Responsive design for all screen sizes
- **Accessible**: WCAG compliant with proper ARIA labels
- **RTL-Ready**: Proper right-to-left layout for Persian
- **Print-Optimized**: Clean, professional print styles

## 🔒 Privacy & Security

- **Zero Data Storage**: Nothing is saved anywhere
- **No Backend**: Completely static application
- **No Tracking**: No analytics or external scripts
- **URL-Based**: All data lives in the browser URL
- **Client-Side Only**: All processing happens in the browser

## 🐛 Error Handling

The app gracefully handles:
- Invalid or corrupted URLs
- Missing data
- Unsupported versions
- Network failures (though none required)
- Invalid form inputs

## 🤝 Contributing

1. Fork the repository
2. Make your changes
3. Test locally (open `index.html` in browser)
4. Ensure no console errors
5. Test all languages and RTL layout
6. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Credits

**Developed by NoAiStudio**

Built with modern web standards, focusing on privacy, accessibility, and user experience.

---

*ChipInBro - Split expenses privately, share easily, print professionally.*