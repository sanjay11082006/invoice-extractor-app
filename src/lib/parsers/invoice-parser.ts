// src/lib/parsers/invoice-parser.ts

import { InvoiceData, LineItem } from '@/types/invoice';
import { validateGSTIN } from './gst-validator';

export function parseInvoiceText(text: string): InvoiceData {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  console.log('Raw OCR Text:', text); // Debug log

  return {
    merchant: extractMerchant(lines, text),
    gstin: extractGSTIN(text),
    invoiceNumber: extractInvoiceNumber(text),
    date: extractDate(text),
    totalAmount: extractTotalAmount(text),
    taxAmount: extractTaxAmount(text),
    subtotal: 0,
    lineItems: extractLineItems(text),
    paymentMethod: extractPaymentMethod(text),
    confidence: 0,
    status: 'pending',
    rawText: text, // Populate raw text
  };
}

function extractMerchant(lines: string[], text: string): string {
  const knownMerchants = [
    'swiggy', 'zomato', 'amazon', 'flipkart', 'myntra', 'bigbasket',
    'dunzo', 'grofers', 'blinkit', 'uber', 'ola', 'paytm', 'phonepe',
    'dominos', 'pizza hut', 'kfc', 'mcdonalds', 'starbucks'
  ];

  for (const line of lines.slice(0, 10)) { // Check more lines
    const lowerLine = line.toLowerCase();
    for (const merchant of knownMerchants) {
      if (lowerLine.includes(merchant)) {
        return capitalizeWords(merchant);
      }
    }
  }

  // Fallback: Use the first non-date, non-number line as a guess
  for (const line of lines.slice(0, 5)) {
    if (line.length > 3 && line.length < 50 && !line.match(/\d{4}/)) {
      return line.replace(/[^\w\s]/gi, ''); // Clean up symbols
    }
  }

  return 'Unknown Merchant';
}

function extractGSTIN(text: string): string {
  // More flexible GSTIN pattern
  const gstinPattern = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/g;
  const matches = text.match(gstinPattern);

  if (matches) {
    for (const match of matches) {
      if (validateGSTIN(match)) return match;
    }
  }
  return '';
}

function extractInvoiceNumber(text: string): string {
  const patterns = [
    /(?:invoice|inv|bill|receipt)\s*(?:no|num|#)?[\s:-]*([A-Z0-9-/]+)/i,
    /#\s*([A-Z0-9-/]+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 3) {
      return match[1].trim();
    }
  }

  return '';
}

function extractDate(text: string): string {
  // Support more date formats including "12 Jan 2024"
  const datePatterns = [
    /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/, // DD-MM-YYYY
    /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/,   // YYYY-MM-DD
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})\b/i // 12 Jan 2024
  ];

  const months: { [key: string]: string } = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      // Handle word-based dates
      if (match[2].length > 2 && isNaN(parseInt(match[2]))) {
        const day = match[1].padStart(2, '0');
        const month = months[match[2].toLowerCase().substring(0, 3)];
        const year = match[3].length === 2 ? `20${match[3]}` : match[3];
        return `${year}-${month}-${day}`;
      }

      // Standard numeric dates
      const [_, p1, p2, p3] = match;
      if (p3.length === 4) return `${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`; // DD-MM-YYYY
      if (p1.length === 4) return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`; // YYYY-MM-DD
    }
  }

  return new Date().toISOString().split('T')[0];
}

function extractTotalAmount(text: string): number {
  // 1. Explicit Total labels
  const explicitPattern = /(?:total|grand total|amount payable|net amount|bal|balance)\s*[:₹-]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi;
  let maxAmount = 0;

  const matches = text.matchAll(explicitPattern);
  for (const match of matches) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    if (val > maxAmount) maxAmount = val;
  }

  // 2. Fallback: Largest number with 2 decimal places at end of lines
  if (maxAmount === 0) {
    const numberLines = text.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/g);
    if (numberLines) {
      numberLines.forEach(num => {
        const val = parseFloat(num.replace(/,/g, ''));
        if (val > maxAmount) maxAmount = val;
      });
    }
  }

  return maxAmount;
}

function extractTaxAmount(text: string): number {
  const taxPattern = /(?:gst|tax|vat)\s*[:₹-]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi;
  let totalTax = 0;

  const matches = text.matchAll(taxPattern);
  for (const match of matches) {
    totalTax += parseFloat(match[1].replace(/,/g, ''));
  }
  return totalTax;
}

function extractLineItems(text: string): LineItem[] {
  // Placeholder - line item extraction via regex is notoriously hard without spatial data
  return [];
}

function extractPaymentMethod(text: string): string {
  const methods = ['upi', 'credit card', 'debit card', 'cash', 'net banking', 'wallet'];
  const lower = text.toLowerCase();
  for (const m of methods) {
    if (lower.includes(m)) return capitalizeWords(m);
  }
  return 'Cash';
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
