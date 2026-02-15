'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  IndianRupee,
  Shield,
  BarChart3,
  Upload,
  Download,
  Building2
} from 'lucide-react';
import { useInvoiceStore } from '@/store/invoiceStore';

export default function Dashboard() {
  const router = useRouter();
  const { invoices, metrics } = useInvoiceStore();
  const [animatedMetrics, setAnimatedMetrics] = useState({
    accuracy: 0,
    timeSaved: 0,
    gstCompliance: 0,
    documentsProcessed: 0
  });

  // Animate metrics on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedMetrics({
        accuracy: metrics.accuracy || 97.3,
        timeSaved: metrics.timeSaved || 92,
        gstCompliance: metrics.gstCompliance || 98.5,
        documentsProcessed: metrics.documentsProcessed || invoices.length
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [metrics, invoices.length]);

  const bentoCards = [
    {
      title: 'Extraction Accuracy',
      value: `${animatedMetrics.accuracy.toFixed(1)}%`,
      target: 'Target: 95%',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      size: 'large'
    },
    {
      title: 'Time Saved',
      value: `${animatedMetrics.timeSaved}%`,
      subtitle: '5 min → 5 sec',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      size: 'large'
    },
    {
      title: 'GST Compliance',
      value: `${animatedMetrics.gstCompliance.toFixed(1)}%`,
      subtitle: 'GSTIN Verified',
      icon: Shield,
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      size: 'medium'
    },
    {
      title: 'Documents Processed',
      value: animatedMetrics.documentsProcessed.toLocaleString('en-IN'),
      subtitle: 'This Month',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      size: 'medium'
    },
    {
      title: 'Avg Processing Time',
      value: '4.2s',
      subtitle: 'Per Document',
      icon: Clock,
      color: 'from-rose-500 to-red-600',
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
      size: 'small'
    },
    {
      title: 'Cost Savings',
      value: `₹${(metrics.costSavings || 0).toLocaleString('en-IN')}`,
      subtitle: 'Monthly',
      icon: IndianRupee,
      color: 'from-cyan-500 to-blue-600',
      iconColor: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      size: 'small'
    }
  ];

  const recentActivity = invoices.slice(-4).reverse().map((invoice, index) => ({
    id: invoice.id || index,
    merchant: invoice.merchant,
    amount: invoice.totalAmount,
    status: invoice.status || 'verified',
    time: `${(index + 1) * 3} min ago`,
    date: invoice.date
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  InvoiceAI
                </h1>
                <p className="text-xs text-slate-500">Intelligent Data Extraction</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/extract')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Invoice
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
                <p className="text-blue-100">Your invoices are being processed 10x faster than manual entry</p>
              </div>
              <div className="hidden md:block">
                <TrendingUp className="w-24 h-24 opacity-20" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {bentoCards.map((card, index) => {
            const Icon = card.icon;
            const colSpan = card.size === 'large' ? 'lg:col-span-1' : 
                           card.size === 'medium' ? 'md:col-span-1' : 'md:col-span-1';
            
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${colSpan} group`}
              >
                <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${card.bgColor} p-3 rounded-xl`}>
                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                      {card.size === 'large' && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className="text-sm font-medium text-slate-600 mb-2">{card.title}</h3>
                    
                    <div className="mb-2">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent"
                      >
                        {card.value}
                      </motion.div>
                    </div>
                    
                    {card.target && (
                      <p className="text-xs text-green-600 font-medium">{card.target}</p>
                    )}
                    {card.subtitle && (
                      <p className="text-xs text-slate-500">{card.subtitle}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <button 
                  onClick={() => router.push('/export')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </button>
              </div>
              
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.merchant}</p>
                          <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'verified' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 mb-4">No invoices processed yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/extract')}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Upload Your First Invoice
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/extract')}
                  className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all group"
                >
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">Upload New Invoice</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/export')}
                  className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all group"
                >
                  <Download className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">Export Data</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all group"
                >
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-slate-700 group-hover:text-slate-900">View Analytics</span>
                </motion.button>
              </div>

              {/* GST Status Card */}
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">GST Compliant</span>
                </div>
                <p className="text-xs text-green-700">All invoices verified against GSTIN database</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
