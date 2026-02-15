'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Eye,
  Settings,
  ArrowLeft,
  Building2,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { exportInvoices } from '@/lib/export/exporters';
import { ExportFormat, ExportSettings, InvoiceData } from '@/types/invoice';

export default function ExportFlow() {
  const router = useRouter();
  const { invoices: storeInvoices, deleteInvoice } = useInvoiceStore();

  // State Management: dynamic invoice state
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  // Initialize state from store triggers
  useEffect(() => {
    setInvoices(storeInvoices);
  }, [storeInvoices]);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    includeLineItems: true,
    includeGST: true,
    dateFormat: 'DD-MM-YYYY',
    currencyFormat: 'INR'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const exportFormats = [
    {
      id: 'json' as ExportFormat,
      name: 'JSON',
      description: 'For API integration and developers',
      icon: FileJson,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      extension: '.json',
      popular: true
    },
    {
      id: 'csv' as ExportFormat,
      name: 'CSV',
      description: 'For Excel, Sheets, and databases',
      icon: FileSpreadsheet,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      extension: '.csv',
      popular: true
    },
    {
      id: 'excel' as ExportFormat,
      name: 'Excel',
      description: 'Formatted spreadsheet with formulas',
      icon: FileSpreadsheet,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      extension: '.xlsx',
      popular: false
    }
  ];

  // Dynamic Calculations
  const totalCount = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalGST = invoices.reduce((sum, inv) => sum + inv.taxAmount, 0);

  // Delete Action
  const handleDelete = (indexToRemove: number, id: string) => {
    // Update local state
    setInvoices(prev => prev.filter((_, index) => index !== indexToRemove));

    // Also delete from global store to persist the change
    if (id) {
      deleteInvoice(id);
    }
  };

  const handleExport = async () => {
    if (!selectedFormat) return;

    setIsExporting(true);

    try {
      await exportInvoices(invoices, selectedFormat, exportSettings);

      setTimeout(() => {
        setIsExporting(false);
        setExportComplete(true);
        setTimeout(() => setExportComplete(false), 3000);
      }, 2000);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  const getPreviewContent = () => {
    if (!selectedFormat || invoices.length === 0) return 'No data to preview';

    const previewInvoices = invoices.slice(0, 2);

    if (selectedFormat === 'json') {
      return JSON.stringify({
        invoices: previewInvoices.map(inv => ({
          merchant: inv.merchant,
          gstin: inv.gstin,
          invoiceNumber: inv.invoiceNumber,
          date: inv.date,
          totalAmount: inv.totalAmount,
          taxAmount: inv.taxAmount,
          status: inv.status
        })),
        summary: {
          total_invoices: totalCount,
          total_amount: totalAmount,
          total_tax: totalGST
        }
      }, null, 2);
    }

    if (selectedFormat === 'csv') {
      const headers = exportSettings.includeGST
        ? 'Merchant,GSTIN,Invoice Number,Date,Total Amount,Tax Amount,Status'
        : 'Merchant,Invoice Number,Date,Total Amount,Status';

      const rows = previewInvoices.map(inv => {
        const row = exportSettings.includeGST
          ? `"${inv.merchant}","${inv.gstin}","${inv.invoiceNumber}","${inv.date}",${inv.totalAmount},${inv.taxAmount},"${inv.status}"`
          : `"${inv.merchant}","${inv.invoiceNumber}","${inv.date}",${inv.totalAmount},"${inv.status}"`;
        return row;
      });

      return `${headers}\n${rows.join('\n')}\n...`;
    }

    return 'Excel file with formatted cells, formulas, and charts';
  };

  const handleCopy = () => {
    const content = getPreviewContent();
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </motion.button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Export Data</h1>
                <p className="text-xs text-slate-500">Choose format and download your data</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Success Animation */}
        <AnimatePresence>
          {exportComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="bg-white rounded-3xl p-12 shadow-2xl text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Export Complete!</h2>
                <p className="text-slate-600">Your file is ready to download</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-2xl mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Ready to Export</h2>
            <Sparkles className="w-8 h-8 text-blue-200" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Invoices</p>
              <p className="text-3xl font-bold">{totalCount}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Total GST</p>
              <p className="text-3xl font-bold">₹{totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Building2 className="w-24 h-24 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No invoices available for export</h3>
            <p className="text-slate-600 mb-6">Upload and process some invoices first</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/extract')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload Invoice
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column - Format Selection */}
            <div className="lg:col-span-2 space-y-6">

              {/* Format Cards */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Select Export Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exportFormats.map((format, index) => {
                    const Icon = format.icon;
                    const isSelected = selectedFormat === format.id;

                    return (
                      <motion.button
                        key={format.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFormat(format.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all text-left ${isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                          }`}
                      >
                        {format.popular && (
                          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Popular
                          </span>
                        )}

                        <div className={`${format.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${format.iconColor}`} />
                        </div>

                        <h4 className="font-bold text-slate-900 mb-1">{format.name}</h4>
                        <p className="text-sm text-slate-600 mb-3">{format.description}</p>
                        <p className="text-xs text-slate-500 font-mono">{format.extension}</p>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Export Settings */}
              <AnimatePresence>
                {selectedFormat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-900">Export Settings</h3>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="font-medium text-slate-700">Include Line Items</span>
                        <input
                          type="checkbox"
                          checked={exportSettings.includeLineItems}
                          onChange={(e) => setExportSettings({ ...exportSettings, includeLineItems: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="font-medium text-slate-700">Include GST Details</span>
                        <input
                          type="checkbox"
                          checked={exportSettings.includeGST}
                          onChange={(e) => setExportSettings({ ...exportSettings, includeGST: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                        <select
                          value={exportSettings.dateFormat}
                          onChange={(e) => setExportSettings({ ...exportSettings, dateFormat: e.target.value as any })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DD-MM-YYYY">DD-MM-YYYY (Indian)</option>
                          <option value="MM-DD-YYYY">MM-DD-YYYY (US)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preview */}
              <AnimatePresence>
                {selectedFormat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-900">Preview</h3>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-96">
                      <pre className="text-xs text-green-400 font-mono">
                        {getPreviewContent()}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Data Summary & Action */}
            <div className="space-y-6">

              {/* Data Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
              >
                <h3 className="font-bold text-slate-900 mb-4">Data Summary</h3>

                <div className="space-y-4 max-h-96 overflow-auto">
                  <AnimatePresence mode="popLayout">
                    {invoices.slice(0, 10).map((invoice, index) => (
                      <motion.div
                        key={invoice.id || index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        layout
                        className="p-4 bg-slate-50 rounded-xl group relative hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-900">{invoice.merchant}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                              }`}>
                              {invoice.status}
                            </span>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (invoice.id) handleDelete(index, invoice.id);
                              }}
                              className="p-1 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete Invoice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">{invoice.date}</span>
                          <span className="font-bold text-slate-900">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {invoices.length > 10 && (
                    <p className="text-center text-slate-500 text-sm">
                      +{invoices.length - 10} more invoices
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Export Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
              >
                <h3 className="font-bold text-slate-900 mb-4">Ready to Download</h3>

                {selectedFormat ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExport}
                      disabled={isExporting || invoices.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Download className="w-5 h-5" />
                          </motion.div>
                          <span>Exporting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download {exportFormats.find(f => f.id === selectedFormat)?.name}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-slate-500 mt-4 text-center break-all">
                      File: invoices_{selectedFormat}_{new Date().toISOString().split('T')[0]}{exportFormats.find(f => f.id === selectedFormat)?.extension}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Select a format to continue</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
