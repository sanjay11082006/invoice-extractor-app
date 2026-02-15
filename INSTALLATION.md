# 🚀 InvoiceAI - Complete Installation Guide

## Quick Start (3 Steps)

### Step 1: Create Project
```bash
npx create-next-app@latest invoice-ai --typescript --tailwind --app --src-dir
cd invoice-ai
```

### Step 2: Install Dependencies
```bash
npm install framer-motion lucide-react tesseract.js react-dropzone xlsx zustand
```

### Step 3: Copy Files
Copy all provided files to the locations specified below, then run:
```bash
npm run dev
```

---

## 📂 Complete File Structure & Placement Guide

```
invoice-ai/
│
├── 📄 Root Configuration Files
│   ├── package.json                          ← Copy provided package.json
│   ├── tsconfig.json                         ← Copy provided tsconfig.json
│   ├── tailwind.config.ts                    ← Copy provided tailwind.config.ts
│   ├── next.config.js                        ← Copy provided next.config.js
│   └── .env.local                            ← Copy .env.local.example and rename
│
├── src/
│   │
│   ├── app/                                  # Next.js 15 App Router
│   │   ├── layout.tsx                        ← Copy provided layout.tsx
│   │   ├── page.tsx                          ← Copy provided page.tsx (Dashboard)
│   │   ├── globals.css                       ← Copy provided globals.css
│   │   │
│   │   ├── extract/                          # Extraction Workbench
│   │   │   └── page.tsx                      ← Copy provided extract/page.tsx
│   │   │
│   │   └── export/                           # Export Flow
│   │       └── page.tsx                      ← Copy provided export/page.tsx
│   │
│   ├── types/                                # TypeScript Interfaces
│   │   └── invoice.ts                        ← Copy types-invoice.ts
│   │
│   ├── lib/                                  # Business Logic
│   │   ├── ocr/
│   │   │   └── tesseract.ts                  ← Copy lib-ocr-tesseract.ts
│   │   │
│   │   ├── parsers/
│   │   │   ├── invoice-parser.ts             ← Copy lib-parsers-invoice-parser.ts
│   │   │   └── gst-validator.ts              ← Copy lib-parsers-gst-validator.ts
│   │   │
│   │   └── export/
│   │       └── exporters.ts                  ← Copy lib-export-exporters.ts
│   │
│   ├── hooks/                                # React Hooks
│   │   └── useOCR.ts                         ← Copy hooks-useOCR.ts
│   │
│   └── store/                                # State Management
│       └── invoiceStore.ts                   ← Copy store-invoiceStore.ts
│
└── public/                                   # Static Assets
    └── sample-invoices/                      # Sample test files (optional)
```

---

## 📋 Step-by-Step File Copying Instructions

### 1. Root Configuration
```bash
# In your invoice-ai folder
cp path/to/package.json ./package.json
cp path/to/tsconfig.json ./tsconfig.json
cp path/to/tailwind.config.ts ./tailwind.config.ts
cp path/to/next.config.js ./next.config.js
cp path/to/.env.local.example ./.env.local
```

### 2. App Files (Pages & Layouts)
```bash
# Create app directory structure first
mkdir -p src/app/extract src/app/export

# Copy app files
cp path/to/layout.tsx ./src/app/layout.tsx
cp path/to/page.tsx ./src/app/page.tsx
cp path/to/globals.css ./src/app/globals.css
cp path/to/extract-page.tsx ./src/app/extract/page.tsx
cp path/to/export-page.tsx ./src/app/export/page.tsx
```

### 3. Type Definitions
```bash
mkdir -p src/types
cp path/to/types-invoice.ts ./src/types/invoice.ts
```

### 4. Business Logic (lib)
```bash
mkdir -p src/lib/ocr src/lib/parsers src/lib/export

cp path/to/lib-ocr-tesseract.ts ./src/lib/ocr/tesseract.ts
cp path/to/lib-parsers-invoice-parser.ts ./src/lib/parsers/invoice-parser.ts
cp path/to/lib-parsers-gst-validator.ts ./src/lib/parsers/gst-validator.ts
cp path/to/lib-export-exporters.ts ./src/lib/export/exporters.ts
```

### 5. Hooks & Store
```bash
mkdir -p src/hooks src/store

cp path/to/hooks-useOCR.ts ./src/hooks/useOCR.ts
cp path/to/store-invoiceStore.ts ./src/store/invoiceStore.ts
```

---

## 🎯 Verification Checklist

After copying all files, verify your structure:

```bash
# Run this command in your project root
tree src -L 3
```

You should see:
```
src
├── app
│   ├── extract
│   │   └── page.tsx
│   ├── export
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── hooks
│   └── useOCR.ts
├── lib
│   ├── export
│   │   └── exporters.ts
│   ├── ocr
│   │   └── tesseract.ts
│   └── parsers
│       ├── gst-validator.ts
│       └── invoice-parser.ts
├── store
│   └── invoiceStore.ts
└── types
    └── invoice.ts
```

---

## 🔧 Installation Commands (Copy & Paste)

### Option 1: Manual Setup
```bash
# 1. Create project
npx create-next-app@latest invoice-ai --typescript --tailwind --app --src-dir
cd invoice-ai

# 2. Install all dependencies
npm install framer-motion lucide-react tesseract.js react-dropzone pdf-lib pdfjs-dist xlsx file-saver zustand react-hook-form zod @hookform/resolvers class-variance-authority clsx tailwind-merge @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast @radix-ui/react-tabs

# 3. Create directories
mkdir -p src/types src/lib/ocr src/lib/parsers src/lib/export src/hooks src/store src/app/extract src/app/export

# 4. Copy all provided files (see file structure above)

# 5. Run development server
npm run dev
```

### Option 2: Using Setup Script
```bash
chmod +x setup.sh
./setup.sh
# Then copy all provided files
npm run dev
```

---

## 🧪 Testing Your Installation

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:3000`

### 3. Test Features
- ✅ Dashboard loads with metrics
- ✅ Click "Upload Invoice" → Goes to extraction page
- ✅ Upload a test invoice image
- ✅ OCR processes and extracts data
- ✅ Save invoice → Returns to dashboard
- ✅ Navigate to Export page → Select format and export

---

## 🐛 Troubleshooting

### Issue: Module not found errors
```bash
# Solution: Install dependencies again
npm install
# or
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
```bash
# Solution: Check tsconfig.json paths
# Ensure paths: { "@/*": ["./src/*"] }
```

### Issue: Tailwind styles not working
```bash
# Solution: Restart dev server
# Press Ctrl+C
npm run dev
```

### Issue: OCR not working
```bash
# Solution: Check browser console for CORS errors
# Tesseract.js needs to download language files
# Ensure internet connection is active
```

---

## 📦 Dependencies Explained

| Package | Purpose |
|---------|---------|
| `framer-motion` | Smooth animations |
| `lucide-react` | Modern icons |
| `tesseract.js` | OCR engine |
| `react-dropzone` | File upload |
| `xlsx` | Excel export |
| `zustand` | State management |
| `react-hook-form` | Form handling |
| `zod` | Validation |

---

## 🚀 Production Build

When ready to deploy:

```bash
# Build for production
npm run build

# Test production build
npm start

# Deploy to Vercel (recommended)
npm install -g vercel
vercel --prod
```

---

## 📝 File Descriptions

### Core Pages
- `src/app/page.tsx` - Dashboard with Bento grid
- `src/app/extract/page.tsx` - Extraction workbench with OCR
- `src/app/export/page.tsx` - Export data in JSON/CSV/Excel

### Business Logic
- `src/lib/ocr/tesseract.ts` - OCR processing
- `src/lib/parsers/invoice-parser.ts` - Extract invoice fields
- `src/lib/parsers/gst-validator.ts` - Validate Indian GSTIN
- `src/lib/export/exporters.ts` - Export functionality

### State & Hooks
- `src/hooks/useOCR.ts` - OCR React hook
- `src/store/invoiceStore.ts` - Zustand store

### Types
- `src/types/invoice.ts` - TypeScript interfaces

---

## ✅ Success Indicators

You've successfully installed InvoiceAI when:

1. ✅ `npm run dev` starts without errors
2. ✅ Dashboard displays at `localhost:3000`
3. ✅ Can navigate between pages
4. ✅ Can upload an invoice image
5. ✅ OCR extracts data from invoice
6. ✅ Can edit and save invoice data
7. ✅ Can export data to JSON/CSV/Excel

---

## 🎉 You're Ready!

Your InvoiceAI application is now ready for development!

**Next Steps:**
1. Test with sample invoices
2. Customize colors/branding
3. Add more invoice formats
4. Deploy to production

**Need Help?**
- Check the DEVELOPMENT_ROADMAP.md
- Review individual file comments
- Test with provided sample invoices

---

**Happy Coding! 🚀**
