// IDEX Gateway error code mapping
export interface ErrorMapping {
  en: string;
  ar: string;
}

export const IDEX_ERROR_CODES: Record<string, ErrorMapping> = {
  // Send OTP errors
  'CURRENT_OTP_NOT_EXPIRED': {
    en: 'A code was already sent. Please wait a moment before trying again',
    ar: 'تم إرسال الرمز بالفعل. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى'
  },
  'INVALID_REQUEST': {
    en: 'Something went wrong. Please check your number and try again',
    ar: 'حدث خطأ ما. يرجى التحقق من رقمك والمحاولة مرة أخرى'
  },
  'CHANNEL_NOT_FOUND': {
    en: 'Service unavailable. Please try again later',
    ar: 'الخدمة غير متوفرة. يرجى المحاولة لاحقاً'
  },
  'REQUEST_FAILED': {
    en: 'Network error. Please try again in a moment',
    ar: 'خطأ في الشبكة. يرجى المحاولة بعد قليل'
  },
  'OTP_ATTEMPT_LIMIT_REACHED': {
    en: 'You\'ve reached the maximum attempts. Please request a new code',
    ar: 'لقد وصلت إلى الحد الأقصى من المحاولات. يرجى طلب رمز جديد'
  },
  
  // Subscribe/PIN errors
  '8001022': {
    en: 'Invalid PIN. Please try again',
    ar: 'رمز PIN غير صحيح. يرجى المحاولة مرة أخرى'
  },
  '8001023': {
    en: 'Your code has expired. Please request a new one',
    ar: 'انتهت صلاحية الرمز. يرجى طلب رمز جديد'
  },
  '8001017': {
    en: 'Network error. Please try again in a moment',
    ar: 'خطأ في الشبكة. يرجى المحاولة بعد قليل'
  },
  
  // Subscription errors
  '5201004': {
    en: 'You\'re already subscribed to this service',
    ar: 'أنت مشترك بالفعل في هذه الخدمة'
  },
  '5201008': {
    en: 'Your number is not eligible for this service',
    ar: 'رقمك غير مؤهل لهذه الخدمة'
  },
  '5202037': {
    en: 'You don\'t have enough balance to complete the subscription',
    ar: 'ليس لديك رصيد كافٍ لإكمال الاشتراك'
  },
  'OPERATOR_NOT_SUPPORTED': {
    en: 'This service is not available for your operator',
    ar: 'هذه الخدمة غير متاحة لمشغل شبكتك'
  },
  
  // Generic errors
  'NETWORK_ERROR': {
    en: 'Network error. Please check your connection and try again',
    ar: 'خطأ في الشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى'
  },
  'UNKNOWN_ERROR': {
    en: 'An error occurred. Please try again',
    ar: 'حدث خطأ. يرجى المحاولة مرة أخرى'
  }
};

export function getErrorMessage(errorCode: string | number, language: 'en' | 'ar' = 'en'): string {
  const code = String(errorCode);
  const mapping = IDEX_ERROR_CODES[code];
  
  if (mapping) {
    return mapping[language];
  }
  
  // Default error message
  return IDEX_ERROR_CODES['UNKNOWN_ERROR'][language];
}
