export interface LanguageContent {
  language_direction: "ltr" | "rtl";
  tagline: string;
  headline_step1: string;
  subtext_step1: string;
  step1_label: string;
  step2_label: string;
  mobile_label: string;
  mobile_placeholder: string;
  resend_pin: string;
  cta_step1: string;
  headline_step2: string;
  subtext_step2: string;
  cta_step2: string;
  headline_thanks: string;
  subtext_thanks: string;
  cta_thanks: string;
  footer_legal_prefix: string;
  footer_terms: string;
  footer_and: string;
  footer_privacy: string;
  footer_service: string;
  footer_service_description: string;
  footer_price: string;
  footer_available: string;
  footer_unsubscribe: string;
  footer_vat_notice: string;
  footer_about_service: string;
}

export interface LandingPageConfig {
  brand_logo_url: string;
  theme_color: string;
  default_language: string;
  languages: {
    [key: string]: LanguageContent;
  };
  country_code: string;
  service_name: string;
  operators: string[];
  price_text: string;
  price_text_ar: string;
  unsubscribe_text: string;
  company_name: string;
  company_email: string;
  company_address?: string; // Made optional since we're removing it from footer
  terms_link: string;
  privacy_link: string;
  contact_link: string;
}

export type StepType = 1 | 2 | 3;