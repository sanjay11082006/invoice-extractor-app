'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  Eye,
  Download,
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Scan,
  IndianRupee,
  Calendar,
  Building2,
  Hash,
  ShoppingCart,
  X,
  ArrowLeft
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useOCR } from '@/hooks/useOCR';
import { useInvoiceStore } from '@/store/invoiceStore';
import { InvoiceData } from '@/types/invoice';

export default function ExtractionWorkbench() {
  const router = useRouter();
  const { isProcessing, progress, extractedData, error, processImage, reset } = useOCR();
  const { addInvoice } = useInvoiceStore();

  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [editedData, setEditedData] = useState<InvoiceData | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadedFile(file);
    setDocumentUploaded(true);

    // Process with OCR
    await processImage(file);
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  const handleSave = () => {
    if (editedData || extractedData) {
      const dataToSave = editedData || extractedData;
      if (dataToSave) {
        addInvoice(dataToSave);
        alert('Invoice saved successfully!');
        router.push('/');
      }
    }
  };

  const handleReset = () => {
    reset();
    setDocumentUploaded(false);
    setUploadedFile(null);
    setEditedData(null);
    setZoom(100);
    setShowRawText(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    const currentData = editedData || extractedData;
    if (currentData) {
      setEditedData({
        ...currentData,
        [field]: value
      });
    }
  };

  const displayData = editedData || extractedData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                  <Scan className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Extraction Workbench</h1>
                  <p className="text-xs text-slate-500">Upload and verify invoice data</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {displayData && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRawText(true)}
                    className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-all flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Raw Text</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/export')}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Approve</span>
                  </motion.button>
                </>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </motion.button>
              <div className="ml-2">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Processing Status Bar */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Processing invoice...</span>
                </div>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-blue-100 mt-2">
                Using Gemini 2.5 Flash Lite • Extracting fields • Validating GST
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <X className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Processing Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <button onClick={reset} className="text-red-600 hover:text-red-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Split View Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">

          {/* LEFT: Document Previewer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 p-4 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Document Preview</span>
              </h2>
              {documentUploaded && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="text-sm text-slate-600 font-medium min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-50">
              {!documentUploaded ? (
                /* Upload Area */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <div {...getRootProps()} className="text-center max-w-md w-full cursor-pointer">
                    <input {...getInputProps()} />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${isDragActive ? 'from-blue-200 to-indigo-300' : 'from-blue-100 to-indigo-100'
                        } rounded-3xl flex items-center justify-center transition-all`}
                    >
                      <Upload className="w-16 h-16 text-blue-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {isDragActive ? 'Drop file here' : 'Upload Invoice'}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Supports PDF, JPG, PNG formats. Optimized for Indian invoices with GST.
                    </p>
                    <div className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg inline-block">
                      Choose File
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                      Or drag and drop your file here (Max 10MB)
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Document Preview */
                <div className="relative h-full">
                  {uploadedFile && (
                    <div
                      className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-slate-200 mx-auto"
                      style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'top center',
                        maxWidth: '100%'
                      }}
                    >
                      {uploadedFile.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(uploadedFile)}
                          alt="Invoice preview"
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="p-8 text-center">
                          <FileText className="w-24 h-24 mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-600">PDF Preview</p>
                          <p className="text-sm text-slate-500 mt-2">{uploadedFile.name}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scanning Laser Effect */}
                  {isProcessing && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: '100vh' }}
                        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                        className="relative w-full h-1"
                      >
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70" />
                        <div className="absolute w-full h-8 -top-4 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-xl opacity-50" />
                      </motion.div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Extraction Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 p-4 bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Extracted Data</span>
                {displayData?.confidence && (
                  <span className="ml-auto flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>{displayData.confidence.toFixed(1)}% Confidence</span>
                  </span>
                )}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {!displayData ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">
                      Upload a document to begin extraction
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Merchant Info */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>Merchant Name</span>
                    </label>
                    <input
                      type="text"
                      value={displayData.merchant}
                      onChange={(e) => handleFieldChange('merchant', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                    />
                  </div>

                  {/* GSTIN */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                      <Hash className="w-4 h-4 text-blue-600" />
                      <span>GSTIN</span>
                      {displayData.gstin && displayData.gstin.length === 15 && (
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Verified ✓
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={displayData.gstin}
                      onChange={(e) => handleFieldChange('gstin', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${displayData.gstin && displayData.gstin.length === 15
                        ? 'border-green-200 bg-green-50 focus:border-green-500'
                        : 'border-slate-200 bg-white focus:border-blue-500'
                        }`}
                    />
                  </div>

                  {/* Invoice Number & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Invoice Number</span>
                      </label>
                      <input
                        type="text"
                        value={displayData.invoiceNumber}
                        onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Date</span>
                      </label>
                      <input
                        type="date"
                        value={displayData.date}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                      />
                    </div>
                  </div>

                  {/* Line Items */}
                  {displayData.lineItems && displayData.lineItems.length > 0 && (
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        <span>Line Items</span>
                      </label>
                      <div className="space-y-2">
                        {displayData.lineItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-900">{item.description}</span>
                              <span className="font-bold text-slate-900">₹{item.price.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Quantity: {item.quantity}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amounts */}
                  <div className="border-t border-slate-200 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium text-slate-900">₹{displayData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Tax (GST)</span>
                        <input
                          type="number"
                          step="0.01"
                          value={displayData.taxAmount}
                          onChange={(e) => handleFieldChange('taxAmount', parseFloat(e.target.value) || 0)}
                          className="w-32 px-3 py-1 text-right border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-lg font-bold text-slate-900">Total Amount</span>
                        <input
                          type="number"
                          step="0.01"
                          value={displayData.totalAmount}
                          onChange={(e) => handleFieldChange('totalAmount', parseFloat(e.target.value) || 0)}
                          className="w-40 px-3 py-2 text-right text-2xl font-bold border-2 border-blue-500 rounded-lg focus:border-blue-600 focus:outline-none bg-gradient-to-r from-blue-50 to-indigo-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {displayData.paymentMethod && (
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                        <IndianRupee className="w-4 h-4 text-blue-600" />
                        <span>Payment Method</span>
                      </label>
                      <input
                        type="text"
                        value={displayData.paymentMethod}
                        onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Raw Text Modal */}
      <AnimatePresence>
        {showRawText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Raw OCR Output</h3>
                <button
                  onClick={() => setShowRawText(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-slate-50 font-mono text-sm whitespace-pre-wrap">
                {displayData?.rawText || 'No raw text available.'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
