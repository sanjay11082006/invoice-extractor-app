# Invoice AI - Intelligent Invoice & Receipt Data Extraction System

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Basic understanding of React/Next.js

### Step 1: Create Next.js Project

```bash
# Create new Next.js 15 project
npx create-next-app@latest invoice-ai --typescript --tailwind --app

# Navigate to project
cd invoice-ai
```

When prompted, select:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ❌ Customize default import alias: No

### Step 2: Install Required Dependencies

```bash
# Core dependencies
npm install framer-motion lucide-react

# UI Components (Shadcn/UI)
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-toast @radix-ui/react-tabs

# OCR and File Processing
npm install tesseract.js
npm install react-dropzone
npm install pdf-lib pdfjs-dist

# Data Export
npm install xlsx
npm install file-saver

# State Management (optional)
npm install zustand

# Forms and Validation
npm install react-hook-form zod @hookform/resolvers
```

### Step 3: Project Structure

```
invoice-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── extract/
│   │   │   └── page.tsx                # Extraction Workbench
│   │   ├── export/
│   │   │   └── page.tsx                # Export Flow
│   │   ├── layout.tsx                  # Root Layout
│   │   └── globals.css                 # Global Styles
│   ├── components/
│   │   ├── ui/                         # Shadcn UI components
│   │   ├── dashboard/
│   │   │   ├── BentoCard.tsx
│   │   │   ├── MetricsGrid.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── extraction/
│   │   │   ├── DocumentPreview.tsx
│   │   │   ├── ScanningLaser.tsx
│   │   │   └── ExtractionForm.tsx
│   │   ├── export/
│   │   │   ├── FormatSelector.tsx
│   │   │   └── ExportPreview.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       └── Button.tsx
│   ├── lib/
│   │   ├── ocr/
│   │   │   ├── tesseract.ts           # Tesseract OCR logic
│   │   │   └── vision-api.ts          # Google Vision API
│   │   ├── parsers/
│   │   │   ├── invoice-parser.ts      # Pattern matching
│   │   │   └── gst-validator.ts       # GST validation
│   │   ├── export/
│   │   │   ├── json-export.ts
│   │   │   ├── csv-export.ts
│   │   │   └── excel-export.ts
│   │   └── utils.ts                   # Utility functions
│   ├── hooks/
│   │   ├── useOCR.ts
│   │   ├── useExport.ts
│   │   └── useInvoiceData.ts
│   ├── types/
│   │   └── invoice.ts                 # TypeScript types
│   └── store/
│       └── invoiceStore.ts            # Zustand store
├── public/
│   └── sample-invoices/               # Sample files for testing
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### Step 4: Configure Tailwind CSS

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
      },
      animation: {
        'scan': 'scan 5s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(600%)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
```

### Step 5: Update Global Styles

Add to `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

### Step 6: Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Step 7: Environment Variables

Create `.env.local` file:

```env
# Google Vision API (optional, for production)
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_api_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=InvoiceAI
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FORMATS=image/jpeg,image/png,application/pdf
```

### Step 8: Quick Testing

1. Start the development server:
```bash
npm run dev
```

2. Open browser to `http://localhost:3000`

3. You should see the dashboard with metrics and bento grid layout

### Next Steps

1. ✅ Set up project structure
2. ⏳ Implement OCR logic (Tesseract.js)
3. ⏳ Build extraction form with validation
4. ⏳ Create export functionality
5. ⏳ Add GST validation
6. ⏳ Integrate Google Vision API (optional)
7. ⏳ Deploy to Vercel/Railway

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)

## 🆘 Troubleshooting

**Issue:** Module not found errors
**Solution:** Run `npm install` again

**Issue:** Tailwind classes not working
**Solution:** Restart dev server with `npm run dev`

**Issue:** OCR not working
**Solution:** Check browser console, Tesseract needs CORS headers

---

Ready to proceed? Follow the installation steps above, then I'll provide the implementation files!
