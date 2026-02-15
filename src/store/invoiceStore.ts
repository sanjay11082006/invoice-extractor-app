// src/store/invoiceStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InvoiceData, DashboardMetrics } from '@/types/invoice';

interface InvoiceStore {
  // State
  invoices: InvoiceData[];
  metrics: DashboardMetrics;
  
  // Actions
  addInvoice: (invoice: InvoiceData) => void;
  updateInvoice: (id: string, updates: Partial<InvoiceData>) => void;
  deleteInvoice: (id: string) => void;
  clearInvoices: () => void;
  updateMetrics: () => void;
}

const initialMetrics: DashboardMetrics = {
  accuracy: 0,
  timeSaved: 0,
  gstCompliance: 0,
  documentsProcessed: 0,
  avgProcessingTime: 0,
  costSavings: 0,
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      metrics: initialMetrics,

      addInvoice: (invoice) => {
        const newInvoice = {
          ...invoice,
          id: invoice.id || `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: invoice.createdAt || new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          invoices: [...state.invoices, newInvoice],
        }));

        get().updateMetrics();
      },

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, ...updates, updatedAt: new Date() }
              : inv
          ),
        }));

        get().updateMetrics();
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        }));

        get().updateMetrics();
      },

      clearInvoices: () => {
        set({ invoices: [], metrics: initialMetrics });
      },

      updateMetrics: () => {
        const { invoices } = get();

        if (invoices.length === 0) {
          set({ metrics: initialMetrics });
          return;
        }

        // Calculate accuracy (average confidence)
        const totalConfidence = invoices.reduce(
          (sum, inv) => sum + (inv.confidence || 0),
          0
        );
        const accuracy = totalConfidence / invoices.length;

        // Calculate GST compliance (percentage with valid GSTIN)
        const validGST = invoices.filter((inv) => inv.gstin && inv.gstin.length === 15).length;
        const gstCompliance = (validGST / invoices.length) * 100;

        // Calculate cost savings (assuming ₹50 per manual entry)
        const costSavings = invoices.length * 50;

        // Time saved: 90% reduction from 5 minutes to 5 seconds
        const timeSaved = 90;

        // Average processing time (mock: ~4-5 seconds)
        const avgProcessingTime = 4.2;

        set({
          metrics: {
            accuracy,
            timeSaved,
            gstCompliance,
            documentsProcessed: invoices.length,
            avgProcessingTime,
            costSavings,
          },
        });
      },
    }),
    {
      name: 'invoice-storage',
      partialize: (state) => ({
        invoices: state.invoices,
      }),
    }
  )
);
