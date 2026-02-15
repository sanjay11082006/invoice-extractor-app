// src/lib/parsers/gst-validator.ts

/**
 * Validates Indian GSTIN (Goods and Services Tax Identification Number)
 * Format: 2 digits state code + 10 digit PAN + 1 digit entity number + Z + 1 check digit
 * Example: 29AABCT1332L1ZU
 */

export function validateGSTIN(gstin: string): boolean {
  if (!gstin || typeof gstin !== 'string') {
    return false;
  }

  // Remove spaces and convert to uppercase
  const cleanGSTIN = gstin.replace(/\s/g, '').toUpperCase();

  // Check length
  if (cleanGSTIN.length !== 15) {
    return false;
  }

  // Validate format: 2 digits + 10 chars (PAN) + 1 digit + Z + 1 char
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstinRegex.test(cleanGSTIN)) {
    return false;
  }

  // Validate state code (01-37 are valid Indian state codes)
  const stateCode = parseInt(cleanGSTIN.substring(0, 2));
  if (stateCode < 1 || stateCode > 37) {
    return false;
  }

  // Validate PAN structure (positions 2-11)
  const pan = cleanGSTIN.substring(2, 12);
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  
  if (!panRegex.test(pan)) {
    return false;
  }

  // Validate checksum (optional but recommended)
  return validateGSTINChecksum(cleanGSTIN);
}

/**
 * Validates GSTIN checksum using Luhn algorithm variant
 */
function validateGSTINChecksum(gstin: string): boolean {
  const checksumChar = gstin.charAt(14);
  const calculatedChecksum = calculateGSTINChecksum(gstin.substring(0, 14));
  
  return checksumChar === calculatedChecksum;
}

/**
 * Calculates GSTIN checksum
 */
function calculateGSTINChecksum(gstinWithoutChecksum: string): string {
  const factor = 2;
  let sum = 0;
  const codePointChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const mod = codePointChars.length;

  for (let i = gstinWithoutChecksum.length - 1; i >= 0; i--) {
    let codePoint = -1;
    for (let j = 0; j < codePointChars.length; j++) {
      if (codePointChars[j] === gstinWithoutChecksum[i]) {
        codePoint = j;
        break;
      }
    }

    let digit = factor * codePoint;
    const addend = Math.floor(digit / mod) + (digit % mod);
    sum += addend;
  }

  const checkCodePoint = (mod - (sum % mod)) % mod;
  return codePointChars[checkCodePoint];
}

/**
 * Extracts state code from GSTIN
 */
export function getStateFromGSTIN(gstin: string): string {
  if (!validateGSTIN(gstin)) {
    return 'Invalid GSTIN';
  }

  const stateCode = gstin.substring(0, 2);
  const stateCodes: Record<string, string> = {
    '01': 'Jammu and Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '25': 'Daman and Diu',
    '26': 'Dadra and Nagar Haveli',
    '27': 'Maharashtra',
    '28': 'Andhra Pradesh (Old)',
    '29': 'Karnataka',
    '30': 'Goa',
    '31': 'Lakshadweep',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman and Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh (New)',
  };

  return stateCodes[stateCode] || 'Unknown State';
}

/**
 * Formats GSTIN for display
 */
export function formatGSTIN(gstin: string): string {
  if (!gstin) return '';
  
  const clean = gstin.replace(/\s/g, '').toUpperCase();
  
  if (clean.length !== 15) return gstin;
  
  // Format: 29 AABCT 1332L 1Z U
  return `${clean.substring(0, 2)} ${clean.substring(2, 7)} ${clean.substring(7, 12)} ${clean.substring(12, 14)} ${clean.substring(14)}`;
}

/**
 * Check if GSTIN is active (mock implementation)
 * In production, this would call GST API
 */
export async function checkGSTINStatus(gstin: string): Promise<{
  valid: boolean;
  active: boolean;
  businessName?: string;
  registrationDate?: string;
}> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!validateGSTIN(gstin)) {
    return {
      valid: false,
      active: false,
    };
  }

  // Mock response
  return {
    valid: true,
    active: true,
    businessName: 'Sample Business Pvt Ltd',
    registrationDate: '2020-01-15',
  };
}
