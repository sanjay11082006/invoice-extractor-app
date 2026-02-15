// src/lib/export/exporters.ts

import * as XLSX from 'xlsx';
import { InvoiceData, ExportSettings, ExportFormat } from '@/types/invoice';

/**
 * Export invoices to JSON format
 */
export function exportToJSON(
  invoices: InvoiceData[],
  settings: ExportSettings
): string {
  const data = invoices.map(invoice => {
    const exported: any = {
      merchant: invoice.merchant,
      invoiceNumber: invoice.invoiceNumber,
      date: formatDate(invoice.date, settings.dateFormat),
      totalAmount: formatCurrency(invoice.totalAmount, settings.currencyFormat),
      status: invoice.status,
    };

    if (settings.includeGST) {
      exported.gstin = invoice.gstin;
      exported.taxAmount = formatCurrency(invoice.taxAmount, settings.currencyFormat);
    }

    if (settings.includeLineItems && invoice.lineItems) {
      exported.lineItems = invoice.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: formatCurrency(item.price, settings.currencyFormat),
      }));
    }

    return exported;
  });

  return JSON.stringify(data, null, 2);
}

/**
 * Export invoices to CSV format
 */
export function exportToCSV(
  invoices: InvoiceData[],
  settings: ExportSettings
): string {
  const headers: string[] = [
    'Merchant',
    'Invoice Number',
    'Date',
    'Total Amount',
    'Status',
  ];

  if (settings.includeGST) {
    headers.push('GSTIN', 'Tax Amount');
  }

  if (settings.includeLineItems) {
    headers.push('Line Items', 'Items Count');
  }

  const rows = invoices.map(invoice => {
    const row: any[] = [
      invoice.merchant,
      invoice.invoiceNumber,
      formatDate(invoice.date, settings.dateFormat),
      invoice.totalAmount.toFixed(2),
      invoice.status || 'pending',
    ];

    if (settings.includeGST) {
      row.push(invoice.gstin, invoice.taxAmount.toFixed(2));
    }

    if (settings.includeLineItems && invoice.lineItems) {
      const itemsText = invoice.lineItems
        .map(item => `${item.description} (${item.quantity}x₹${item.price})`)
        .join('; ');
      row.push(itemsText, invoice.lineItems.length);
    }

    return row;
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Export invoices to Excel format
 */
export function exportToExcel(
  invoices: InvoiceData[],
  settings: ExportSettings
): ArrayBuffer {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Prepare summary data
  const summaryData = [
    ['Invoice Summary Report'],
    ['Generated on', new Date().toLocaleString()],
    ['Total Invoices', invoices.length],
    ['Total Amount', `₹${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}`],
    ['Total Tax', `₹${invoices.reduce((sum, inv) => sum + inv.taxAmount, 0).toFixed(2)}`],
    [],
  ];

  // Prepare invoice data
  const invoiceHeaders = [
    'Merchant',
    'Invoice Number',
    'Date',
    'Subtotal',
    'Tax',
    'Total Amount',
    'Status',
  ];

  if (settings.includeGST) {
    invoiceHeaders.splice(3, 0, 'GSTIN');
  }

  const invoiceRows = invoices.map(invoice => {
    const row: any[] = [
      invoice.merchant,
      invoice.invoiceNumber,
      formatDate(invoice.date, settings.dateFormat),
    ];

    if (settings.includeGST) {
      row.push(invoice.gstin);
    }

    row.push(
      invoice.subtotal || invoice.totalAmount - invoice.taxAmount,
      invoice.taxAmount,
      invoice.totalAmount,
      invoice.status || 'pending'
    );

    return row;
  });

  // Create summary sheet
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  // Create invoices sheet
  const invoiceData = [invoiceHeaders, ...invoiceRows];
  const invoiceSheet = XLSX.utils.aoa_to_sheet(invoiceData);

  // Apply styling to headers
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '3B82F6' } },
  };

  // Apply column widths
  const columnWidths = invoiceHeaders.map(() => ({ wch: 15 }));
  invoiceSheet['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(wb, invoiceSheet, 'Invoices');

  // Add line items sheet if enabled
  if (settings.includeLineItems) {
    const lineItemsData: any[][] = [
      ['Invoice Number', 'Item Description', 'Quantity', 'Price', 'Total'],
    ];

    invoices.forEach(invoice => {
      if (invoice.lineItems) {
        invoice.lineItems.forEach(item => {
          lineItemsData.push([
            invoice.invoiceNumber,
            item.description,
            item.quantity,
            item.price,
            item.quantity * item.price,
          ]);
        });
      }
    });

    const lineItemsSheet = XLSX.utils.aoa_to_sheet(lineItemsData);
    XLSX.utils.book_append_sheet(wb, lineItemsSheet, 'Line Items');
  }

  // Write to buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return excelBuffer;
}

/**
 * Download file to user's computer
 */
export function downloadFile(
  content: string | ArrayBuffer,
  filename: string,
  format: ExportFormat
) {
  const mimeTypes = {
    json: 'application/json',
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  const blob = new Blob(
    [content],
    { type: mimeTypes[format] }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Main export function
 */
export async function exportInvoices(
  invoices: InvoiceData[],
  format: ExportFormat,
  settings: ExportSettings
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `invoices_${format}_${timestamp}`;

  let content: string | ArrayBuffer;
  let fullFilename: string;

  switch (format) {
    case 'json':
      content = exportToJSON(invoices, settings);
      fullFilename = `${filename}.json`;
      break;

    case 'csv':
      content = exportToCSV(invoices, settings);
      fullFilename = `${filename}.csv`;
      break;

    case 'excel':
      content = exportToExcel(invoices, settings);
      fullFilename = `${filename}.xlsx`;
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  downloadFile(content, fullFilename, format);
}

// Helper functions

function formatDate(date: string, format: string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  switch (format) {
    case 'DD-MM-YYYY':
      return `${day}-${month}-${year}`;
    case 'MM-DD-YYYY':
      return `${month}-${day}-${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return date;
  }
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') {
    return `₹${amount.toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}
