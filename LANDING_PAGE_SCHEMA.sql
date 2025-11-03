-- =====================================================
-- LANDING PAGE CONFIGURATIONS DATABASE SCHEMA
-- =====================================================
-- This schema stores all landing page design, content, 
-- branding, legal, and configuration data
-- =====================================================

-- =====================================================
-- MAIN CONFIGURATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pyxis.landing_page_configs
(
    -- Primary Identifiers
    id INTEGER NOT NULL DEFAULT "identity"(100000, 0, ('1,1'::character varying)::text) ENCODE az64,
    config_id VARCHAR(64) NOT NULL UNIQUE ENCODE lzo, -- e.g., "LP001"
    campaign_id VARCHAR(64) ENCODE lzo, -- Links to campaigns table
    service_id VARCHAR(64) ENCODE lzo,
    
    -- Basic Info
    service_name VARCHAR(255) ENCODE lzo,
    country_code VARCHAR(5) ENCODE lzo, -- e.g., "+966"
    operators VARCHAR(500) ENCODE lzo, -- JSON array: ["STC","Mobily","Zain"]
    
    -- Language Settings
    default_language VARCHAR(5) ENCODE lzo, -- e.g., "en"
    available_languages VARCHAR(100) ENCODE lzo, -- JSON array: ["en","ar"]
    
    -- Branding
    brand_logo_url VARCHAR(1024) ENCODE lzo,
    brand_favicon_url VARCHAR(1024) ENCODE lzo,
    brand_name VARCHAR(255) ENCODE lzo,
    
    -- Color Scheme (JSON object)
    color_primary VARCHAR(20) ENCODE lzo, -- e.g., "#4285F4"
    color_secondary VARCHAR(20) ENCODE lzo,
    color_accent VARCHAR(20) ENCODE lzo,
    color_background VARCHAR(20) ENCODE lzo,
    color_text_primary VARCHAR(20) ENCODE lzo,
    color_text_secondary VARCHAR(20) ENCODE lzo,
    color_button_bg VARCHAR(20) ENCODE lzo,
    color_button_text VARCHAR(20) ENCODE lzo,
    color_button_hover VARCHAR(20) ENCODE lzo,
    color_error VARCHAR(20) ENCODE lzo,
    color_success VARCHAR(20) ENCODE lzo,
    color_border VARCHAR(20) ENCODE lzo,
    color_input_bg VARCHAR(20) ENCODE lzo,
    color_card_bg VARCHAR(20) ENCODE lzo,
    color_footer_bg VARCHAR(20) ENCODE lzo,
    
    -- Typography
    font_primary VARCHAR(255) ENCODE lzo, -- e.g., "Roboto, sans-serif"
    font_secondary VARCHAR(255) ENCODE lzo,
    font_heading_size VARCHAR(20) ENCODE lzo, -- e.g., "28px"
    font_body_size VARCHAR(20) ENCODE lzo,
    font_small_size VARCHAR(20) ENCODE lzo,
    
    -- Pricing
    price_amount VARCHAR(20) ENCODE lzo,
    price_currency VARCHAR(10) ENCODE lzo, -- e.g., "SAR"
    price_period VARCHAR(20) ENCODE lzo, -- e.g., "day", "week", "month"
    vat_included BOOLEAN ENCODE RAW,
    free_trial_days INTEGER ENCODE az64,
    
    -- Company/Legal Info
    company_name VARCHAR(255) ENCODE lzo,
    company_registration VARCHAR(100) ENCODE lzo,
    vat_number VARCHAR(100) ENCODE lzo,
    company_address_en VARCHAR(500) ENCODE lzo,
    company_address_ar VARCHAR(500) ENCODE lzo,
    support_email VARCHAR(255) ENCODE lzo,
    support_phone VARCHAR(50) ENCODE lzo,
    
    -- Legal URLs
    terms_url VARCHAR(1024) ENCODE lzo,
    privacy_url VARCHAR(1024) ENCODE lzo,
    contact_url VARCHAR(1024) ENCODE lzo,
    refund_policy_url VARCHAR(1024) ENCODE lzo,
    
    -- Unsubscribe Info
    unsubscribe_method VARCHAR(20) ENCODE lzo, -- e.g., "SMS", "WEB"
    unsubscribe_code VARCHAR(20) ENCODE lzo, -- e.g., "U27"
    unsubscribe_shortcode VARCHAR(20) ENCODE lzo, -- e.g., "600860"
    unsubscribe_instructions_en VARCHAR(500) ENCODE lzo,
    unsubscribe_instructions_ar VARCHAR(500) ENCODE lzo,
    
    -- Feature Flags
    show_language_selector BOOLEAN ENCODE RAW,
    show_logo BOOLEAN ENCODE RAW,
    show_footer BOOLEAN ENCODE RAW,
    show_legal_links BOOLEAN ENCODE RAW,
    show_price BOOLEAN ENCODE RAW,
    show_operators BOOLEAN ENCODE RAW,
    enable_animations BOOLEAN ENCODE RAW,
    enable_progress_bar BOOLEAN ENCODE RAW,
    
    -- Redirect Settings
    redirect_after_success BOOLEAN ENCODE RAW,
    redirect_url VARCHAR(1024) ENCODE lzo,
    redirect_delay_seconds INTEGER ENCODE az64,
    
    -- SEO
    seo_keywords VARCHAR(500) ENCODE lzo,
    seo_og_image VARCHAR(1024) ENCODE lzo,
    seo_og_type VARCHAR(50) ENCODE lzo,
    seo_twitter_card VARCHAR(50) ENCODE lzo,
    
    -- Tracking Pixels
    google_analytics_id VARCHAR(50) ENCODE lzo,
    facebook_pixel_id VARCHAR(50) ENCODE lzo,
    tiktok_pixel_id VARCHAR(50) ENCODE lzo,
    
    -- Status & Metadata
    status VARCHAR(20) DEFAULT 'active' ENCODE lzo, -- active, inactive, draft
    version INTEGER DEFAULT 1 ENCODE az64,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT getdate() ENCODE az64,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT getdate() ENCODE az64,
    created_by VARCHAR(100) ENCODE lzo,
    updated_by VARCHAR(100) ENCODE lzo,
    
    PRIMARY KEY (id)
)
DISTSTYLE AUTO;

-- Create index on config_id for fast lookups
CREATE INDEX idx_landing_page_configs_config_id ON pyxis.landing_page_configs(config_id);
CREATE INDEX idx_landing_page_configs_campaign_id ON pyxis.landing_page_configs(campaign_id);
CREATE INDEX idx_landing_page_configs_status ON pyxis.landing_page_configs(status);

ALTER TABLE pyxis.landing_page_configs owner to pyxis_admin;

-- =====================================================
-- CONTENT/TRANSLATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pyxis.landing_page_content
(
    id INTEGER NOT NULL DEFAULT "identity"(200000, 0, ('1,1'::character varying)::text) ENCODE az64,
    config_id VARCHAR(64) NOT NULL ENCODE lzo, -- Links to landing_page_configs
    language_code VARCHAR(5) NOT NULL ENCODE lzo, -- e.g., "en", "ar"
    
    -- Language Settings
    language_direction VARCHAR(3) ENCODE lzo, -- "ltr" or "rtl"
    
    -- Page Meta
    page_title VARCHAR(255) ENCODE lzo,
    meta_description VARCHAR(500) ENCODE lzo,
    tagline VARCHAR(255) ENCODE lzo,
    
    -- Step 1 Content
    headline_step1 VARCHAR(255) ENCODE lzo,
    subtext_step1 VARCHAR(500) ENCODE lzo,
    cta_step1 VARCHAR(100) ENCODE lzo,
    input_placeholder_step1 VARCHAR(100) ENCODE lzo,
    
    -- Step 2 Content
    headline_step2 VARCHAR(255) ENCODE lzo,
    subtext_step2 VARCHAR(500) ENCODE lzo,
    cta_step2 VARCHAR(100) ENCODE lzo,
    input_placeholder_step2 VARCHAR(100) ENCODE lzo,
    
    -- Thank You Page Content
    headline_thanks VARCHAR(255) ENCODE lzo,
    subtext_thanks VARCHAR(500) ENCODE lzo,
    cta_thanks VARCHAR(100) ENCODE lzo,
    
    -- Pricing Display
    price_display_text VARCHAR(255) ENCODE lzo,
    
    -- Legal Text
    disclaimer_text VARCHAR(1000) ENCODE lzo,
    copyright_text VARCHAR(255) ENCODE lzo,
    
    -- Metadata
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT getdate() ENCODE az64,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT getdate() ENCODE az64,
    
    PRIMARY KEY (id),
    UNIQUE (config_id, language_code)
)
DISTSTYLE AUTO;

-- Create indexes
CREATE INDEX idx_landing_page_content_config_id ON pyxis.landing_page_content(config_id);
CREATE INDEX idx_landing_page_content_language ON pyxis.landing_page_content(language_code);

ALTER TABLE pyxis.landing_page_content owner to pyxis_admin;

-- =====================================================
-- SAMPLE DATA INSERT
-- =====================================================

-- Insert main configuration
INSERT INTO pyxis.landing_page_configs (
    config_id, campaign_id, service_id, service_name, country_code, operators,
    default_language, available_languages,
    brand_logo_url, brand_favicon_url, brand_name,
    color_primary, color_secondary, color_accent, color_background,
    color_text_primary, color_text_secondary, color_button_bg, color_button_text,
    color_button_hover, color_error, color_success, color_border, color_input_bg,
    color_card_bg, color_footer_bg,
    font_primary, font_secondary, font_heading_size, font_body_size, font_small_size,
    price_amount, price_currency, price_period, vat_included, free_trial_days,
    company_name, company_registration, vat_number,
    company_address_en, company_address_ar,
    support_email, support_phone,
    terms_url, privacy_url, contact_url, refund_policy_url,
    unsubscribe_method, unsubscribe_code, unsubscribe_shortcode,
    unsubscribe_instructions_en, unsubscribe_instructions_ar,
    show_language_selector, show_logo, show_footer, show_legal_links,
    show_price, show_operators, enable_animations, enable_progress_bar,
    redirect_after_success, redirect_url, redirect_delay_seconds,
    seo_keywords, seo_og_image, seo_og_type, seo_twitter_card,
    google_analytics_id, facebook_pixel_id, tiktok_pixel_id,
    status, version, created_by
) VALUES (
    'LP001', 'CAMP001', '1', 'AI Chef Premium', '+966', '["STC","Mobily","Zain"]',
    'en', '["en","ar"]',
    'https://example.com/logo.png', 'https://example.com/favicon.ico', 'AI Chef',
    '#4285F4', '#34A853', '#FBBC04', '#FFFFFF',
    '#202124', '#5F6368', '#4285F4', '#FFFFFF',
    '#3367D6', '#EA4335', '#34A853', '#E0E0E0', '#F8F9FA',
    '#FFFFFF', '#F8F9FA',
    'Roboto, sans-serif', 'Arial, sans-serif', '28px', '16px', '14px',
    '3', 'SAR', 'day', true, 0,
    'Overseas Solutions LLC', 'CR-12345678', 'VAT-987654321',
    '123 Business Bay, Beirut, Lebanon', '123 الخليج التجاري، بيروت، لبنان',
    'support@aichef.com', '+961-1-234567',
    'https://aichef.com/terms', 'https://aichef.com/privacy', 'https://aichef.com/contact', 'https://aichef.com/refund',
    'SMS', 'U27', '600860',
    'To cancel, send U27 to 600860', 'للإلغاء، أرسل U27 إلى 600860',
    true, true, true, true,
    true, true, true, true,
    true, 'https://aichef.com/dashboard', 3,
    'AI chef, cooking recipes, meal plans, cooking assistant', 'https://example.com/og-image.jpg', 'website', 'summary_large_image',
    'G-XXXXXXXXXX', '1234567890', 'ABCDEFGHIJ',
    'active', 1, 'system'
);

-- Insert English content
INSERT INTO pyxis.landing_page_content (
    config_id, language_code, language_direction,
    page_title, meta_description, tagline,
    headline_step1, subtext_step1, cta_step1, input_placeholder_step1,
    headline_step2, subtext_step2, cta_step2, input_placeholder_step2,
    headline_thanks, subtext_thanks, cta_thanks,
    price_display_text, disclaimer_text, copyright_text
) VALUES (
    'LP001', 'en', 'ltr',
    'AI Chef - Your Personal Cooking Assistant',
    'Get access to thousands of recipes, personalized meal plans, and cooking tips',
    'Your Personal AI Cooking Assistant',
    'Start Your Culinary Journey',
    'Enter your mobile number to unlock thousands of recipes and cooking tips.',
    'SUBSCRIBE NOW', '5xxxxxxxx',
    'Verify Your Number',
    'We sent a verification code to your phone.',
    'CONFIRM', 'Enter PIN (4-6 digits)',
    'Welcome to AI Chef!',
    'Your subscription is now active. Start cooking delicious meals today!',
    'START COOKING',
    'SAR 3/day (incl. VAT)',
    'By subscribing, you agree to our Terms of Service and Privacy Policy. Charges will appear on your mobile bill.',
    '© 2025 Overseas Solutions. All rights reserved.'
);

-- Insert Arabic content
INSERT INTO pyxis.landing_page_content (
    config_id, language_code, language_direction,
    page_title, meta_description, tagline,
    headline_step1, subtext_step1, cta_step1, input_placeholder_step1,
    headline_step2, subtext_step2, cta_step2, input_placeholder_step2,
    headline_thanks, subtext_thanks, cta_thanks,
    price_display_text, disclaimer_text, copyright_text
) VALUES (
    'LP001', 'ar', 'rtl',
    'الطاهي الذكي - مساعدك الشخصي في الطبخ',
    'احصل على آلاف الوصفات وخطط الوجبات المخصصة ونصائح الطبخ',
    'مساعدك الذكي للطبخ',
    'ابدأ رحلتك في عالم الطبخ',
    'أدخل رقم الجوال للوصول إلى آلاف الوصفات ونصائح الطبخ',
    'اشترك الآن', '5xxxxxxxx',
    'تحقق من رقمك',
    'تم إرسال رمز التحقق إلى هاتفك',
    'تأكيد', 'أدخل الرمز (4-6 أرقام)',
    'مرحباً بك في الطاهي الذكي!',
    'اشتراكك الآن نشط. ابدأ بطهي وجبات لذيذة اليوم!',
    'ابدأ الطبخ',
    '3 ريال/يوم (شامل الضريبة)',
    'بالاشتراك، أنت توافق على شروط الخدمة وسياسة الخصوصية. ستظهر الرسوم على فاتورة هاتفك المحمول.',
    '© 2025 شركة الحلول الخارجية. جميع الحقوق محفوظة.'
);

-- =====================================================
-- QUERY EXAMPLES
-- =====================================================

-- Get complete landing page configuration
SELECT 
    c.*,
    en.page_title as page_title_en,
    en.headline_step1 as headline_step1_en,
    ar.page_title as page_title_ar,
    ar.headline_step1 as headline_step1_ar
FROM pyxis.landing_page_configs c
LEFT JOIN pyxis.landing_page_content en ON c.config_id = en.config_id AND en.language_code = 'en'
LEFT JOIN pyxis.landing_page_content ar ON c.config_id = ar.config_id AND ar.language_code = 'ar'
WHERE c.config_id = 'LP001'
AND c.status = 'active';

-- Get all content for specific config and language
SELECT * FROM pyxis.landing_page_content
WHERE config_id = 'LP001'
AND language_code = 'en';

-- Get all active landing page configs
SELECT config_id, service_name, country_code, status, created_at
FROM pyxis.landing_page_configs
WHERE status = 'active'
ORDER BY created_at DESC;

-- Update color scheme
UPDATE pyxis.landing_page_configs
SET 
    color_primary = '#FF0000',
    color_button_bg = '#FF0000',
    updated_at = getdate(),
    updated_by = 'admin'
WHERE config_id = 'LP001';

-- Update content for specific language
UPDATE pyxis.landing_page_content
SET 
    headline_step1 = 'New Headline',
    updated_at = getdate()
WHERE config_id = 'LP001'
AND language_code = 'en';
