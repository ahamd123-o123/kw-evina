/**
 * SDK Configuration
 * Environment-aware API configuration
 */

export const SDK_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://13.49.0.231:3000/api',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
  isDevelopment: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
};

export const API_ENDPOINTS = {
  campaign: `${SDK_CONFIG.apiBaseUrl}/campaign/check`,  // Backend uses /api/campaign/check
  session: `${SDK_CONFIG.apiBaseUrl}/session`,
  sessionUpdate: `${SDK_CONFIG.apiBaseUrl}/u`,  // Backend uses /api/u (was /api/session/update)
  track: `${SDK_CONFIG.apiBaseUrl}/e`,  // Backend uses /api/e (was /api/track)
  sale: `${SDK_CONFIG.apiBaseUrl}/c`,  // Backend uses /api/c (was /api/sale)
};

export const STORAGE_KEYS = {
  suid: 'pyxis_suid',
  campaign: 'pyxis_campaign',
  sessionData: 'pyxis_session',
};

export const EVENT_TYPES = {
  IMPRESSION: 'impression',
  CLICK_SUBMIT_MSISDN: 'click_submit_msisdn',
  VALID_MSISDN: 'valid_msisdn',
  IMPRESSION_PIN: 'impression_pin',
  PIN_SUBMIT: 'pin_submit',
  VALID_PIN: 'validpin',
  FIRST_BILLING: 'firstbilling',
  OPT_OUT: 'optout',
  FAILED_SALE: 'failedsale',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];