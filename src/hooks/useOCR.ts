// src/hooks/useOCR.ts

'use client';

import { useState, useCallback } from 'react';
import { extractInvoice } from '@/lib/ocr/tesseract';
import { InvoiceData, ExtractionResult } from '@/types/invoice';

interface UseOCRResult {
  isProcessing: boolean;
  progress: number;
  extractedData: InvoiceData | null;
  error: string | null;
  processImage: (file: File) => Promise<void>;
  reset: () => void;
}

export function useOCR(): UseOCRResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setExtractedData(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        throw new Error('Please upload an image or PDF file');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Process with OCR
      const result: ExtractionResult = await extractInvoice(file, (p) => {
        setProgress(p * 100);
      });

      if (result.success && result.data) {
        // Calculate subtotal if not present
        if (!result.data.subtotal) {
          result.data.subtotal = result.data.totalAmount - result.data.taxAmount;
        }

        // Calculate line item totals
        if (result.data.lineItems) {
          result.data.lineItems = result.data.lineItems.map(item => ({
            ...item,
            total: item.quantity * item.price,
          }));
        }

        setExtractedData(result.data);
        setProgress(100);
      } else {
        throw new Error(result.error || 'Failed to extract invoice data');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setExtractedData(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    progress,
    extractedData,
    error,
    processImage,
    reset,
  };
}
