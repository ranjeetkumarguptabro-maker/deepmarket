// Comprehensive Security Utility Module for DeepMarket
// Implements XSS Escaping, Input Sanitization, Rate Limiting, File Upload Safeguards & Audit Redaction

// 1. XSS Protection & HTML Sanitization
export const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// 2. Input Validation (Email, Name, Amount)
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const isValidAmount = (amount, min = 1, max = 500000) => {
  const num = Number(amount);
  return !isNaN(num) && num >= min && num <= max;
};

// 3. File Upload Security Validator (Strict MIME Types & Max Size Limit)
export const validateFileUpload = (file, maxSizeMB = 2) => {
  if (!file) return { valid: false, message: 'No file selected.' };
  
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Security Alert: Invalid file format. Only JPEG, PNG, and WebP images are allowed.' 
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      message: `Security Alert: File size exceeds maximum limit of ${maxSizeMB} MB.` 
    };
  }

  return { valid: true };
};

// 4. Client-Side Rate Limiting Helper (In-memory token bucket)
const rateLimitMap = new Map();

export const checkRateLimit = (actionKey, limit = 5, windowMs = 60000) => {
  const now = Date.now();
  const record = rateLimitMap.get(actionKey) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(actionKey, record);

  if (record.count > limit) {
    const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { 
      allowed: false, 
      message: `Rate Limit Exceeded: Too many requests. Please wait ${waitSeconds} seconds.` 
    };
  }

  return { allowed: true };
};

// 5. Sensitive Data Redaction for Audit Logs (Redacts card numbers, CVVs, passwords)
export const sanitizeAuditLog = (data) => {
  if (!data || typeof data !== 'object') return data;
  const sanitized = { ...data };

  if (sanitized.cardNumber) {
    sanitized.cardNumber = sanitized.cardNumber.replace(/\d(?=\d{4})/g, "*");
  }
  if (sanitized.cvv) delete sanitized.cvv;
  if (sanitized.password) delete sanitized.password;

  return sanitized;
};
