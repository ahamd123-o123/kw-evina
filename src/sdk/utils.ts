/**
 * SDK Utilities
 * Helper functions for SUID generation, storage, and URL parsing
 */

import { STORAGE_KEYS } from './config';
import { URLParams } from './types';

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return ((Math.random() * 16) | 0).toString(16);
  });
}

/**
 * Get or create SUID (Session Unique ID)
 * SUID persists during funnel journey (step1 → step2 → success)
 * but generates NEW SUID on page refresh/new entry
 */
export function getOrCreateSUID(): string {
  if (typeof window === 'undefined') return '';
  
  // Check if SUID already exists in sessionStorage (same funnel session)
  let suid = sessionStorage.getItem(STORAGE_KEYS.suid);
  
  if (!suid) {
    // Generate new SUID only if not exists
    suid = generateUUID();
    sessionStorage.setItem(STORAGE_KEYS.suid, suid);
  }
  
  return suid;
}

/**
 * Parse URL parameters
 */
export function getURLParams(): URLParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    cid: params.get('cid') || undefined,
    pid: params.get('pid') || undefined,
    
    // Google tracking IDs (send whichever we have - might have 1, 2, or all 3)
    gclid: params.get('gclid') || undefined,        // Google Click ID (web/Android)
    wbraid: params.get('wbraid') || undefined,      // Google web attribution (iOS 14.5+)
    gbraid: params.get('gbraid') || undefined,      // Google app attribution (iOS 14.5+)
    gad_source: params.get('gad_source') || undefined,  // Google Ads source
    
    // Google Ads campaign parameters
    gad_campaignid: params.get('gad_campaignid') || undefined,  // Google Ads campaign ID (alternative)
    campaignid: params.get('campaignid') || undefined,
    adgroupid: params.get('adgroupid') || undefined,
    creative: params.get('creative') || undefined,
    device: params.get('device') || undefined,
    keyword: params.get('keyword') || undefined,
    
    // UTM parameters (standard tracking)
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
    
    click_id: params.get('click_id') || params.get('clickid') || undefined,
    binom_cid: params.get('binom_cid') || params.get('binomcid') || undefined,
    affiliate_id: params.get('affiliate_id') || params.get('aff_id') || undefined,
    ad_name: params.get('ad_name') || params.get('ad') || undefined,
    flow_name: params.get('flow_name') || params.get('flow') || undefined,
    sub_id: params.get('sub_id') || params.get('subid') || undefined,
    pubid: params.get('pubid') || params.get('pub_id') || undefined,
    offer_id: params.get('offer_id') || params.get('offerid') || undefined,
    platform: params.get('platform') || undefined,
    traffic_type: params.get('traffic_type') || params.get('traffictype') || undefined,
  };
}

/**
 * Get device information from user agent
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined' || !navigator.userAgent) {
    return {};
  }

  const ua = navigator.userAgent;
  
  // Simple device detection (can be enhanced with a library like ua-parser-js)
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const isDesktop = !isMobile && !isTablet;
  
  // Browser detection
  let browserName = 'Unknown';
  if (ua.includes('Chrome')) browserName = 'Chrome';
  else if (ua.includes('Safari')) browserName = 'Safari';
  else if (ua.includes('Firefox')) browserName = 'Firefox';
  else if (ua.includes('Edge')) browserName = 'Edge';
  
  // OS detection
  let osName = 'Unknown';
  if (ua.includes('Windows')) osName = 'Windows';
  else if (ua.includes('Mac')) osName = 'MacOS';
  else if (ua.includes('Linux')) osName = 'Linux';
  else if (ua.includes('Android')) osName = 'Android';
  else if (ua.includes('iOS')) osName = 'iOS';
  
  return {
    form_factor: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    browser_name: browserName,
    os_name: osName,
    device_class: isMobile ? 'smartphone' : isTablet ? 'tablet' : 'desktop',
  };
}

/**
 * Store data in sessionStorage
 */
export function setSessionData(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store session data:', error);
  }
}

/**
 * Get data from sessionStorage
 */
export function getSessionData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve session data:', error);
    return null;
  }
}