'use client';

import { useEffect, useState } from 'react';
import { LandingPageConfig, StepType, LanguageContent } from '@/types/config';
import { ConfigLoader } from '@/utils/ConfigLoader';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import StepForm from '@/components/StepForm';
import ThankYou from '@/components/ThankYou';
import Footer from '@/components/Footer';
import styles from "./page.module.css";

export default function Home() {
  const [config, setConfig] = useState<LandingPageConfig | null>(null);
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [currentContent, setCurrentContent] = useState<LanguageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        // Initialize Pyxis SDK first
        const { pyxisSDK } = await import('@/sdk');
        await pyxisSDK.initialize();
        
        // Load base configuration
        const loadedConfig = await ConfigLoader.loadConfig();
        
        // Get campaign data from SDK
        const campaignData = pyxisSDK.getCampaign();
        
        // Merge campaign data with config
        if (campaignData) {
          loadedConfig.service_name = campaignData.name;
          
          // Keep the numeric country code format from config.json
          // Don't overwrite with campaign's country_code (which might be "SA")
          // loadedConfig.country_code stays as "+966" from config.json
          
          // Update price text (you can customize this based on your pricing model)
          const currency = campaignData.country_code === 'SA' ? 'SAR' : 'USD';
          loadedConfig.price_text = `${campaignData.target_cpa} ${currency}/week`;
        }
        
        setConfig(loadedConfig);
        
        // Auto-detect browser language
        const browserLang = navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'
        const detectedLang = loadedConfig.languages[browserLang] ? browserLang : loadedConfig.default_language || 'en';
        
        setCurrentLanguage(detectedLang);
        setCurrentContent(loadedConfig.languages[detectedLang]);
        
        // Apply theme color to CSS variables
        document.documentElement.style.setProperty('--theme-color', loadedConfig.theme_color);
        document.documentElement.style.setProperty('--theme-color-dark', adjustBrightness(loadedConfig.theme_color, -20));
        
        // Apply language direction
        document.documentElement.dir = loadedConfig.languages[detectedLang].language_direction;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  const handleLanguageChange = (lang: string) => {
    if (config && config.languages[lang]) {
      setCurrentLanguage(lang);
      setCurrentContent(config.languages[lang]);
      document.documentElement.dir = config.languages[lang].language_direction;
    }
  };

  const adjustBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16)
      .slice(1);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as StepType);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !config || !currentContent) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h1>Configuration Error</h1>
          <p>{error || 'Failed to load page configuration'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header 
        config={config}
        currentLanguage={currentLanguage}
        currentContent={currentContent}
        onLanguageChange={handleLanguageChange}
      />
      
      {currentStep < 3 && (
        <ProgressBar 
          step={currentStep} 
          totalSteps={2}
          isRTL={currentContent.language_direction === 'rtl'}
        />
      )}
      
      <main className={styles.main}>
        {currentStep < 3 ? (
          <StepForm 
            config={config}
            currentContent={currentContent}
            currentStep={currentStep}
            onNextStep={handleNextStep}
          />
        ) : (
          <ThankYou config={config} currentContent={currentContent} />
        )}
      </main>
      
      <Footer config={config} />
    </div>
  );
}