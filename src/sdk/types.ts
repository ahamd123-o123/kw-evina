/**
 * SDK Types
 * TypeScript interfaces for SDK data structures
 */

export interface CampaignData {
  id: number;
  cid: string;
  name: string;
  country_code: string;
  status: string;
  budget: number;
  target_cpa: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  gateway_id: number;
  service_id: number;
  traffic_type_id: number;
  affiliate_id: number;
  affiliate_name: string;
  scenario_name: string;
}

export interface SessionData {
  SUID: string;
  page_id: string;
  country_code: string;
  operator_code?: string;
  landing_page_url: string;
  referer?: string;
  gclid?: string;
  click_id?: string;
  binom_cid?: string;
  ad_name?: string;
  flow_name?: string;
  cid?: string;  // Changed from campaign_id to cid
  affiliate_id?: string;
  platform?: string;
  ip?: string;
  form_factor?: string;
  browser_name?: string;
  browser_version?: string;
  os_name?: string;
  os_version?: string;
  device_class?: string;
  brand_name?: string;
  model_name?: string;
}

export interface TrackEventPayload {
  SUID: string;
  event_type: string;
  timestamp: string;
  country_code?: string;
  operator_code?: string;
  cid?: string;  // Changed from campaign_id to cid
  affiliate_id?: string;
  flow_name?: string;
  ad_name?: string;
  msisdn?: string;
  pin?: string;
  system_message?: string;
  operator_reason?: string;
}

export interface URLParams {
  cid?: string;
  pid?: string;
  
  // Google tracking IDs (iOS vs Android/Web)
  gclid?: string;      // Google Click ID (web/Android)
  wbraid?: string;     // Google web attribution (iOS 14.5+)
  gbraid?: string;     // Google app attribution (iOS 14.5+)
  gad_source?: string; // Google Ads source
  
  // Google Ads campaign parameters
  gad_campaignid?: string;  // Google Ads campaign ID (alternative param)
  campaignid?: string;
  adgroupid?: string;
  creative?: string;
  device?: string;
  keyword?: string;
  
  // UTM parameters
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  
  click_id?: string;
  binom_cid?: string;
  affiliate_id?: string;
  ad_name?: string;
  flow_name?: string;
  sub_id?: string;
  pubid?: string;
  offer_id?: string;
  platform?: string;
  traffic_type?: string;
}