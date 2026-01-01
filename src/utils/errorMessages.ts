// IDEX Gateway error code mapping
export interface ErrorMapping {
  en: string;
  ar: string;
}

export const IDEX_ERROR_CODES: Record<string, ErrorMapping> = {
  // Session & Authentication Errors
  '8001006': {
    en: 'Session expired. Please try again',
    ar: 'انتهت الجلسة. يرجى المحاولة مرة أخرى'
  },
  '8001007': {
    en: 'Authorization failed. Please try again',
    ar: 'فشل التفويض. يرجى المحاولة مرة أخرى'
  },
  '8001001': {
    en: 'Service configuration error. Please contact support',
    ar: 'خطأ في إعدادات الخدمة. يرجى التواصل مع الدعم'
  },
  
  // OTP & PIN Verification Errors
  '8001022': {
    en: 'Invalid phone number. Please enter a valid mobile number',
    ar: 'رقم هاتف غير صحيح. يرجى إدخال رقم جوال صحيح'
  },
  '8001023': {
    en: 'Your PIN has expired. Please request a new one',
    ar: 'انتهت صلاحية رمز PIN. يرجى طلب رمز جديد'
  },
  '8001099': {
    en: 'Failed to generate PIN. Please try again',
    ar: 'فشل إنشاء رمز PIN. يرجى المحاولة مرة أخرى'
  },
  
  // Subscriber Status Errors
  '5201004': {
    en: 'You are already subscribed to this service',
    ar: 'أنت مشترك بالفعل في هذه الخدمة'
  },
  '5201008': {
    en: 'Mobile number not found. Please check and try again',
    ar: 'رقم الهاتف غير موجود. يرجى التحقق والمحاولة مرة أخرى'
  },
  
  // Balance & Billing Errors
  '5202037': {
    en: 'Insufficient balance. Please recharge your account',
    ar: 'رصيد غير كافٍ. يرجى إعادة شحن حسابك'
  },
  '5202036': {
    en: 'Unable to check your balance. Please try again',
    ar: 'تعذر التحقق من رصيدك. يرجى المحاولة مرة أخرى'
  },
  
  // System & Network Errors
  '5200000': {
    en: 'System error. Please try again later',
    ar: 'خطأ في النظام. يرجى المحاولة لاحقاً'
  },
  '8001004': {
    en: 'Communication error. Please try again',
    ar: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى'
  },
  '8001017': {
    en: 'Request timeout. Please try again',
    ar: 'انتهى وقت الطلب. يرجى المحاولة مرة أخرى'
  },
  '8001009': {
    en: 'Too many requests. Please wait a moment',
    ar: 'طلبات كثيرة جداً. يرجى الانتظار قليلاً'
  },
  
  // Legacy error codes (keeping for backwards compatibility)
  'CURRENT_OTP_NOT_EXPIRED': {
    en: 'A code was already sent. Please wait before trying again',
    ar: 'تم إرسال الرمز بالفعل. يرجى الانتظار قبل المحاولة مرة أخرى'
  },
  'INVALID_REQUEST': {
    en: 'Invalid request. Please check your information',
    ar: 'طلب غير صحيح. يرجى التحقق من معلوماتك'
  },
  'CHANNEL_NOT_FOUND': {
    en: 'Service unavailable. Please try again later',
    ar: 'الخدمة غير متوفرة. يرجى المحاولة لاحقاً'
  },
  'REQUEST_FAILED': {
    en: 'Request failed. Please try again',
    ar: 'فشل الطلب. يرجى المحاولة مرة أخرى'
  },
  'OTP_ATTEMPT_LIMIT_REACHED': {
    en: 'Maximum attempts reached. Please request a new code',
    ar: 'تم الوصول للحد الأقصى. يرجى طلب رمز جديد'
  },
  'OPERATOR_NOT_SUPPORTED': {
    en: 'This service is not available for your operator',
    ar: 'هذه الخدمة غير متاحة لمشغل شبكتك'
  },
  
  // Generic fallback errors
  'NETWORK_ERROR': {
    en: 'Network error. Please check your connection',
    ar: 'خطأ في الشبكة. يرجى التحقق من الاتصال'
  },
  'UNKNOWN_ERROR': {
    en: 'An error occurred. Please try again',
    ar: 'حدث خطأ. يرجى المحاولة مرة أخرى'
  }
};

export function getErrorMessage(errorCode: string | number, language: 'en' | 'ar' = 'en', context?: 'phone' | 'pin'): string {
  const code = String(errorCode);
  
  // Special handling for 8001022 based on context
  if (code === '8001022') {
    if (context === 'pin') {
      return language === 'en' 
        ? 'Wrong PIN. The code you entered is incorrect'
        : 'رمز PIN خاطئ. الرمز الذي أدخلته غير صحيح';
    }
    // Default to phone context
    return language === 'en'
      ? 'Invalid phone number. Please enter a valid mobile number'
      : 'رقم هاتف غير صحيح. يرجى إدخال رقم جوال صحيح';
  }
  
  const mapping = IDEX_ERROR_CODES[code];
  
  if (mapping) {
    return mapping[language];
  }
  
  // Default error message
  return IDEX_ERROR_CODES['UNKNOWN_ERROR'][language];
}
