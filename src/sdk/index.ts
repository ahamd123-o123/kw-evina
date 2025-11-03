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

    console.log('[Pyxis SDK] Initializing...', SDK_CONFIG);

    // Get or create SUID
    this.suid = getOrCreateSUID();
    console.log('[Pyxis SDK] SUID:', this.suid);

    // Check for cached campaign
    const cachedCampaign = getSessionData<CampaignData>(STORAGE_KEYS.campaign);
    
    if (cachedCampaign) {
      this.campaign = cachedCampaign;
      console.log('[Pyxis SDK] Using cached campaign from sessionStorage:', this.campaign);
    } else {
      // Fetch campaign data from backend
      console.log('[Pyxis SDK] No cached campaign, fetching from backend...');
      await this.fetchCampaign();
    }

    // Create/update session
    await this.createSession();

    // Track impression event
    await this.trackEvent('impression');
    
    this.sessionInitialized = true;
    console.log('[Pyxis SDK] Initialized successfully');
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
      console.log('[Pyxis SDK] 🔍 Fetching campaign from REAL backend:', backendUrl);
      
      const response = await fetch(backendUrl, {
        headers: {
          'X-API-Key': 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op'
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
      
      console.log('[Pyxis SDK] ✅ Campaign fetched from REAL backend database:', this.campaign);
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

    console.log('[DEBUG] Campaign data:', JSON.stringify(this.campaign, null, 2));
    console.log('[DEBUG] URL params:', urlParams);
    console.log('[DEBUG] Device info:', deviceInfo);

    const sessionData = {
      // ✅ REQUIRED FIELDS (ONLY 3!) - Per FRONTEND_GUIDE.md
      suid: this.suid,
      ip: 'unknown',  // Backend overrides with real IP
      userAgent: navigator.userAgent,
      
      // ✅ CAMPAIGN DATA - Common fields from campaigns table (see campaign_user_sessions_schema.md)
      campaign_id: (this.campaign as any)?.id || undefined,              // campaigns.id → user_sessions.campaign_id
      campaignId: this.campaign?.cid || urlParams.cid || undefined,      // campaigns.cid (for tracking)
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
      
      // ✅ MARKETING DATA
      platform: urlParams.platform || 'web',
      traffic_type: urlParams.traffic_type || undefined,
      ad_name: urlParams.ad_name || undefined,
      pubid: urlParams.pubid || undefined,
      sub_id: urlParams.sub_id || undefined,
      offer_id: urlParams.offer_id || undefined,
      
      // ❌ DO NOT SEND device/browser info - Backend extracts from userAgent automatically
    };

    console.log('[Pyxis SDK] 🔍 SESSION DATA BEING SENT:', JSON.stringify(sessionData, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.session, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[Pyxis SDK] Session created:', result);
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
      
      // ✅ CAMPAIGN DATA - Common fields from campaigns table
      campaign_id: (this.campaign as any)?.cid || undefined,
      service_id: (this.campaign as any)?.service_id || undefined,
      service_name: (this.campaign as any)?.service_name || undefined,
      
      // ✅ SPREAD ADDITIONAL DATA (includes msisdn, pin, etc.)
      ...additionalData,
    };

    console.log('========================================');
    console.log(`📊 TRACKING EVENT: ${eventType.toUpperCase()}`);
    console.log('========================================');
    console.log(JSON.stringify(eventData, null, 2));
    console.log('========================================');

    try {
      const response = await fetch(API_ENDPOINTS.track, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op',  // TODO: Get from config
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[Pyxis SDK] Event tracked:', eventType, result);
    } catch (error) {
      console.error('[Pyxis SDK] Failed to track event:', error);
    }
  }

  /**
   * Track VALID MSISDN event when user enters a valid phone number
   */
  async trackValidMsisdn(msisdn: string): Promise<void> {
    console.log('[Pyxis SDK] 📱 Valid MSISDN entered:', msisdn);
    await this.trackEvent('valid_msisdn', { msisdn });
  }

  /**
   * Track PIN SENT event
   * Call this after successfully requesting PIN from gateway
   */
  async trackPinSent(msisdn: string): Promise<void> {
    console.log('[Pyxis SDK] 📨 PIN sent to:', msisdn);
    await this.trackEvent('pin_sent', { msisdn });
  }

  /**
   * Track PIN SUBMITTED event when user enters PIN (before validation)
   */
  async trackPinSubmitted(msisdn: string, pin: string): Promise<void> {
    console.log('[Pyxis SDK] 🔑 PIN submitted:', pin);
    await this.trackEvent('pin_submitted', { msisdn, pin });
  }

  /**
   * Track VALID PIN event
   * Call this after successfully verifying PIN with gateway
   */
  async trackValidPin(msisdn: string, pin: string): Promise<void> {
    console.log('[Pyxis SDK] ✅ Valid PIN confirmed');
    await this.trackEvent('valid_pin', { msisdn, pin });
  }

  /**
   * Track SALE event (automatically called after valid PIN)
   * Also updates user_sessions table with sale=true and sale_timestamp
   */
  async trackSale(msisdn: string): Promise<void> {
    console.log('[Pyxis SDK] 💰 SALE event tracked!');
    
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
    console.log('[Pyxis SDK] ❌ Invalid PIN entered');
    await this.trackEvent('invalid_pin', { msisdn, pin });
  }

  /**
   * Track FAILED SALE event (when PIN is correct but sale fails for other reasons)
   * Updates user_sessions table with failedsale=true
   */
  async trackFailedSale(msisdn: string): Promise<void> {
    console.log('[Pyxis SDK] ❌ FAILED SALE tracked');
    
    // Track failed sale event
    await this.trackEvent('failed_sale', { msisdn });
    
    // Update session with failed sale flag
    await this.updateSession({ failedsale: true });
  
    // NOTE: Session update disabled until backend creates /api/session/update endpoint  
    // await this.updateSession({ failedsale: true });
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

    console.log('========================================');
    console.log('💰 RECORDING SALE TO GOOGLE_SALES_RECORDED');
    console.log('========================================');
    console.log(JSON.stringify(saleData, null, 2));
    console.log('========================================');

    try {
      const response = await fetch(API_ENDPOINTS.sale, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'pyxis_live_xU3PtFVrlg3QTF5W7htWqWUBgkTpN1op',
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[Pyxis SDK] ✅ Sale recorded successfully:', result);
    } catch (error) {
      console.error('[Pyxis SDK] ❌ Failed to record sale:', error);
    }
  }

  /**
   * Update user session (for sale, failedsale, etc.)
   */
  private async updateSession(updates: { sale?: boolean; failedsale?: boolean }): Promise<void> {
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

      console.log('[Pyxis SDK] ✅ Session updated:', updates);
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