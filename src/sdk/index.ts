/**
 * Pyxis Tracking SDK
 * SDK for fetching campaign data and tracking user sessions and events
 */

import { API_ENDPOINTS, STORAGE_KEYS, SDK_CONFIG, EVENT_TYPES } from './config';
import { CampaignData } from './types';
import { getURLParams, setSessionData, getSessionData, getOrCreateSUID, getDeviceInfo } from './utils';

class PyxisSDK {
  private campaign: CampaignData | null = null;
  private suid: string = '';
  private sessionInitialized: boolean = false;

  /**
   * Initialize the SDK - Fetch campaign, create session, track impression
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Get or create SUID
    this.suid = getOrCreateSUID();

    // Check for cached campaign
    const cachedCampaign = getSessionData<CampaignData>(STORAGE_KEYS.campaign);
    
    if (cachedCampaign) {
      this.campaign = cachedCampaign;
    } else {
      // Fetch campaign data from backend
      await this.fetchCampaign();
    }

    // Create/update session
    await this.createSession();

    // Track impression event
    await this.trackEvent('impression');
    
    this.sessionInitialized = true;
  }

  /**
   * Fetch campaign data from API
   * Per FRONTEND_GUIDE.md: Call backend directly, NOT through Next.js API route
   */
  private async fetchCampaign(): Promise<void> {
    const urlParams = getURLParams();
    
    if (!urlParams.cid) {
      console.warn('[Pyxis SDK] No campaign ID (cid) found in URL');
      return;
    }

    try {
      // ✅ Call backend directly (per FRONTEND_GUIDE.md section 3)
      const backendUrl = `${SDK_CONFIG.apiBaseUrl}/campaign/${urlParams.cid}`;
      
      const response = await fetch(backendUrl, {
        headers: {
          'X-API-Key': SDK_CONFIG.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Backend returns { success: true, campaign: {...}, traceId: "..." }
      const campaignData = data.campaign || data;
      
      this.campaign = campaignData;
      setSessionData(STORAGE_KEYS.campaign, campaignData);
    } catch (error) {
      console.error('[Pyxis SDK] ❌ Failed to fetch campaign:', error);
    }
  }

  /**
   * Create or update user session
   */
  private async createSession(): Promise<void> {
    const urlParams = getURLParams();
    const deviceInfo = getDeviceInfo();

    const sessionData = {
      // ✅ REQUIRED FIELDS (ONLY 3!) - Per FRONTEND_GUIDE.md
      suid: this.suid,
      ip: 'unknown',  // Backend overrides with real IP
      userAgent: navigator.userAgent,
      
      // ✅ CAMPAIGN DATA - Backend now uses 'cid' instead of 'campaign_id'
      cid: this.campaign?.cid || urlParams.cid || undefined,             // campaigns.cid → user_sessions.cid
      service_id: (this.campaign as any)?.service_id || undefined,       // campaigns.service_id → user_sessions.service_id
      service_name: (this.campaign as any)?.service_name || undefined,   // campaigns.service_name → user_sessions.service_name
      country_code: this.campaign?.country_code || undefined,             // campaigns.country_code → user_sessions.country_code
      gateway: (this.campaign as any)?.gateway_name || undefined,        // campaigns.gateway_name → user_sessions.gateway
      
      // ✅ PAGE CONTEXT
      landing_page_url: window.location.href,
      referer: document.referrer || undefined,
      
      // ✅ URL TRACKING PARAMETERS (affiliate_id from URL overrides campaign.affiliate_id)
      affiliate_id: urlParams.affiliate_id || (this.campaign as any)?.affiliate_id || undefined,  // campaigns.affiliate_id → user_sessions.affiliate_id
      click_id: urlParams.click_id || undefined,
      binom_cid: urlParams.binom_cid || undefined,
      
      // ✅ GOOGLE ATTRIBUTION IDs (send whichever we have - iOS uses wbraid/gbraid, Android/Web uses gclid)
      gclid: urlParams.gclid || undefined,      // Google Click ID (Android/Web)
      wbraid: urlParams.wbraid || undefined,    // Google Web Attribution (iOS 14.5+)
      gbraid: urlParams.gbraid || undefined,    // Google App Attribution (iOS 14.5+)
      
      // ✅ GOOGLE ADS CAMPAIGN PARAMETERS
      campaignid: urlParams.campaignid || undefined,
      adgroupid: urlParams.adgroupid || undefined,
      creative: urlParams.creative || undefined,
      device: urlParams.device || undefined,
      keyword: urlParams.keyword || undefined,
      
      // ✅ UTM PARAMETERS (standard tracking)
      utm_source: urlParams.utm_source || undefined,
      utm_medium: urlParams.utm_medium || undefined,
      utm_campaign: urlParams.utm_campaign || undefined,
      utm_content: urlParams.utm_content || undefined,
      utm_term: urlParams.utm_term || undefined,
      
      // ✅ MARKETING DATA
      platform: urlParams.platform || 'web',
      traffic_type: urlParams.traffic_type || undefined,
      ad_name: urlParams.ad_name || undefined,
      pubid: urlParams.pubid || undefined,
      sub_id: urlParams.sub_id || undefined,
      offer_id: urlParams.offer_id || undefined,
      
      // ❌ DO NOT SEND device/browser info - Backend extracts from userAgent automatically
    };

    try {
      const response = await fetch(API_ENDPOINTS.session, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': SDK_CONFIG.apiKey,
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error('[Pyxis SDK] Failed to create session:', error);
    }
  }

  /**
   * Track an event to user_events table
   * NOTE: All events in a session use the SAME suid
   * user_id (if needed) should be set after user identification
   */
  async trackEvent(eventType: string, additionalData?: Record<string, any>): Promise<void> {
    if (!this.suid) {
      console.warn('[Pyxis SDK] Cannot track event: SUID not initialized');
      return;
    }

    const eventData = {
      // ✅ REQUIRED FIELDS (per user_events table schema)
      suid: this.suid,  // Same SUID for all events in this session
      event_type: eventType,
      
      // ✅ CAMPAIGN DATA - Backend now uses 'cid' instead of 'campaign_id'
      cid: this.campaign?.cid || undefined,
      service_id: (this.campaign as any)?.service_id || undefined,
      service_name: (this.campaign as any)?.service_name || undefined,
      
      // ✅ SPREAD ADDITIONAL DATA (includes msisdn, pin, etc.)
      ...additionalData,
    };

    try {
      const response = await fetch(API_ENDPOINTS.track, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': SDK_CONFIG.apiKey,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error('[Pyxis SDK] Failed to track event:', error);
    }
  }

  /**
   * Track VALID MSISDN event when user enters a valid phone number
   */
  async trackValidMsisdn(msisdn: string): Promise<void> {
    await this.trackEvent('valid_msisdn', { msisdn });
  }

  /**
   * Track INVALID MSISDN event when user enters an invalid phone number
   * Call this when validation fails (format error or API rejection)
   */
  async trackInvalidMsisdn(msisdn: string, reason?: string): Promise<void> {
    await this.trackEvent('invalid_msisdn', { msisdn, reason });
  }

  /**
   * Track PIN SENT event
   * Call this after successfully requesting PIN from gateway
   */
  async trackPinSent(msisdn: string): Promise<void> {
    await this.trackEvent('pin_sent', { msisdn });
  }

  /**
   * Track PIN SUBMITTED event when user enters PIN (before validation)
   */
  async trackPinSubmitted(msisdn: string, pin: string): Promise<void> {
    await this.trackEvent('pin_submitted', { msisdn, pin });
  }

  /**
   * Track VALID PIN event
   * Call this after successfully verifying PIN with gateway
   */
  async trackValidPin(msisdn: string, pin: string): Promise<void> {
    await this.trackEvent('valid_pin', { msisdn, pin });
  }

  /**
   * Track SALE event (automatically called after valid PIN)
   * Also updates user_sessions table with sale=true and sale_timestamp
   */
  async trackSale(msisdn: string): Promise<void> {
    // Track sale event
    await this.trackEvent('sale', { msisdn });
    
    // Update session with sale flag
    await this.updateSession({ sale: true });
  }

  /**
   * Track INVALID PIN event
   * Call this when user enters wrong PIN or PIN verification fails
   */
  async trackInvalidPin(msisdn: string, pin: string): Promise<void> {
    await this.trackEvent('invalid_pin', { msisdn, pin });
  }

  /**
   * Track FAILED SALE event (when PIN is correct but sale fails for other reasons)
   * Updates user_sessions table with failedsale=true
   */
  async trackFailedSale(msisdn: string): Promise<void> {
    // Track failed sale event
    await this.trackEvent('failed_sale', { msisdn });
    
    // Update session with failed sale flag
    await this.updateSession({ failedsale: true });
  
    // NOTE: Session update disabled until backend creates /api/session/update endpoint  
    // await this.updateSession({ failedsale: true });
  }

  /**
   * Update pubid in user session
   * Call this after receiving trxId from IDEX to link session with gateway transaction
   * 
   * @param pubid - The publisher/transaction ID from IDEX (trxId)
   */
  async updatePubId(pubid: string): Promise<void> {
    await this.updateSession({ pubid });
  }

  /**
   * Record SALE to google_sales_recorded table
   * Call this after a successful subscription/conversion
   * This records the sale with gclid/wbraid/gbraid for Google Ads conversion tracking
   * 
   * @param msisdn - User's phone number
   * @param options - Optional additional data (service_id, country_code, affiliate_name)
   */
  async recordSale(msisdn: string, options?: {
    service_id?: string;
    country_code?: string;
    affiliate_name?: string;
  }): Promise<void> {
    if (!this.suid) {
      console.warn('[Pyxis SDK] Cannot record sale: SUID not initialized');
      return;
    }

    // Get URL params for tracking IDs
    const urlParams = getURLParams();

    const saleData = {
      suid: this.suid,
      msisdn: msisdn,
      gclid: urlParams.gclid || undefined,
      wbraid: urlParams.wbraid || undefined,
      gbraid: urlParams.gbraid || undefined,
      service_id: options?.service_id || (this.campaign as any)?.service_id || undefined,
      country_code: options?.country_code || (this.campaign as any)?.country_code || undefined,
      affiliate_name: options?.affiliate_name || undefined,
    };

    try {
      const response = await fetch(API_ENDPOINTS.sale, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': SDK_CONFIG.apiKey,
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error('[Pyxis SDK] ❌ Failed to record sale:', error);
    }
  }

  /**
   * Update user session (for sale, failedsale, pubid, etc.)
   */
  private async updateSession(updates: { sale?: boolean; failedsale?: boolean; pubid?: string }): Promise<void> {
    try {
      const response = await fetch(API_ENDPOINTS.sessionUpdate, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suid: this.suid,
          ...updates,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Pyxis SDK] Failed to update session:', error);
        // Don't throw - just log the error to prevent infinite loops
        return;
      }
    } catch (error) {
      console.error('[Pyxis SDK] Error updating session:', error);
      // Don't throw - just log the error to prevent infinite loops
    }
  }

  /**
   * Get current SUID
   */
  getSUID(): string {
    return this.suid;
  }

  /**
   * Get current campaign
   */
  getCampaign(): CampaignData | null {
    return this.campaign;
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.sessionInitialized;
  }
}

// Export singleton instance
export const pyxisSDK = new PyxisSDK();

// Export event types and types
export { EVENT_TYPES };
export type { CampaignData };