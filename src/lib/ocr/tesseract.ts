// src/lib/ocr/tesseract.ts

import { InvoiceData, ExtractionResult } from '@/types/invoice';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://invoice-extractor-app.onrender.com/extract';

export class InvoiceOCRService {

  async extractInvoiceData(
    imageFile: File,
    onProgress?: (progress: number) => void
  ): Promise<ExtractionResult> {
    const startTime = Date.now();

    try {
      if (onProgress) onProgress(0.1);

      const formData = new FormData();
      formData.append('file', imageFile);

      if (onProgress) onProgress(0.3);

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      if (onProgress) onProgress(0.6);

      console.log('Response Status:', response.status);
      const text = await response.text();
      console.log('Response Body:', text);

      if (!response.ok) {
        throw new Error(`Backend API Error: ${response.statusText} - ${text}`);
      }

      if (!text) {
        throw new Error('Backend returned empty response');
      }

      const data = JSON.parse(text);

      if (onProgress) onProgress(0.9);

      // Map backend response to InvoiceData
      // Backend returns: merchant_name, gstin, date, total_amount, tax_amount, invoice_number
      const invoiceData: InvoiceData = {
        merchant: data.merchant_name || 'Unknown',
        gstin: data.gstin || '',
        invoiceNumber: data.invoice_number || '',
        date: data.date || new Date().toISOString().split('T')[0],
        totalAmount: data.total_amount || 0,
        taxAmount: data.tax_amount || 0,
        subtotal: (data.total_amount || 0) - (data.tax_amount || 0), // Estimate subtotal
        lineItems: [], // Backend doesn't support line items yet
        paymentMethod: 'Cash', // Default
        rawText: JSON.stringify(data, null, 2), // Store full JSON as raw text for debugging
        confidence: 0.9, // Gemini is usually high confidence
        status: 'pending'
      };

      if (onProgress) onProgress(1.0);

      return {
        success: true,
        data: invoiceData,
        processingTime: Date.now() - startTime,
        ocrConfidence: 0.8, // Placeholder
      };

    } catch (error) {
      console.error('OCR Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OCR processing failed',
        processingTime: Date.now() - startTime,
      };
    }
  }
}

// Singleton instance
let ocrInstance: InvoiceOCRService | null = null;

export function getOCRInstance(): InvoiceOCRService {
  if (!ocrInstance) {
    ocrInstance = new InvoiceOCRService();
  }
  return ocrInstance;
}

// Helper function for quick extraction
export async function extractInvoice(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ExtractionResult> {
  const ocr = getOCRInstance();
  return await ocr.extractInvoiceData(file, onProgress);
}
