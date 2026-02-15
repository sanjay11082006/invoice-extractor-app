// src/types/invoice.ts

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  price: number;
  total?: number;
  taxRate?: number;
}

export interface InvoiceData {
  id?: string;
  merchant: string;
  gstin: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  taxAmount: number;
  subtotal: number;
  lineItems: LineItem[];
  paymentMethod?: string;
  address?: string;
  phone?: string;
  email?: string;
  confidence?: number;
  status?: 'pending' | 'verified' | 'rejected';
  rawText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExtractionResult {
  success: boolean;
  data?: InvoiceData;
  error?: string;
  processingTime?: number;
  ocrConfidence?: number;
}

export interface ExportSettings {
  includeLineItems: boolean;
  includeGST: boolean;
  dateFormat: 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD';
  currencyFormat: 'INR' | 'USD';
  includeMetadata?: boolean;
}

export interface DashboardMetrics {
  accuracy: number;
  timeSaved: number;
  gstCompliance: number;
  documentsProcessed: number;
  avgProcessingTime: number;
  costSavings: number;
}

export interface RecentActivity {
  id: string;
  merchant: string;
  amount: number;
  status: 'verified' | 'pending' | 'rejected';
  time: string;
  date: string;
}

export type ExportFormat = 'json' | 'csv' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  settings: ExportSettings;
  invoices: InvoiceData[];
}
