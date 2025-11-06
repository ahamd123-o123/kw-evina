export interface LanguageContent {
  language_direction: 'ltr' | 'rtl';
  tagline: string;
  headline_step1: string;
  subtext_step1: string;
  cta_step1: string;
  headline_step2: string;
  subtext_step2: string;
  cta_step2: string;
  headline_thanks: string;
  subtext_thanks: string;
  cta_thanks: string;
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
  unsubscribe_text: string;
  company_name: string;
  company_email: string;
  company_address?: string; // Made optional since we're removing it from footer
  terms_link: string;
  privacy_link: string;
  contact_link: string;
}

export type StepType = 1 | 2 | 3;