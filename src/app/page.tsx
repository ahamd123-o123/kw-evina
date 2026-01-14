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
  const [isSDKReady, setIsSDKReady] = useState(false); // Track SDK initialization separately
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        // 1. Load config.json FIRST (fast, non-blocking)
        const loadedConfig = await ConfigLoader.loadConfig();
        
        setConfig(loadedConfig);
        
        // Update document title dynamically based on service name
        document.title = `${loadedConfig.service_name} - Subscribe to Premium Services`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', `Subscribe to ${loadedConfig.service_name}. ${loadedConfig.price_text}. Available for ${loadedConfig.operators.join(', ')}.`);
        }
        
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
        
        // Apply language attribute to HTML element
        document.documentElement.lang = detectedLang;
        
        // Show page structure immediately
        setIsLoading(false);
        
        // 2. Initialize SDK in background (non-blocking for UI)
        const { pyxisSDK } = await import('@/sdk');
        await pyxisSDK.initialize();
        
        // SDK ready - user can now interact with form
        setIsSDKReady(true);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const step = event.state?.step || 1;
      setCurrentStep(step as StepType);
    };

    // Set initial history state
    window.history.replaceState({ step: currentStep }, '');

    // Listen for back/forward button
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update history when step changes
  useEffect(() => {
    if (currentStep > 1 && currentStep < 3) {
      window.history.pushState({ step: currentStep }, '');
    }
  }, [currentStep]);

  const handleLanguageChange = (lang: string) => {
    if (config && config.languages[lang]) {
      setCurrentLanguage(lang);
      setCurrentContent(config.languages[lang]);
      document.documentElement.dir = config.languages[lang].language_direction;
      document.documentElement.lang = lang; // Update lang attribute when language changes
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

  // Only show error page if config loading fails
  if (error) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.error}>
            <h1>Configuration Error</h1>
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  // If config not loaded yet, show minimal loading (should be very fast)
  if (!config || !currentContent) {
    return null; // Or return a minimal loader - config.json loads in milliseconds
  }

  // Show full page skeleton while SDK initializes
  if (!isSDKReady) {
    return (
      <div className={styles.page}>
        {/* Header Skeleton */}
        <div className={styles.skeletonHeader}>
          <div className={styles.skeletonLogo}></div>
          <div className={styles.skeletonLanguageBtn}></div>
        </div>
        
        {/* Progress Bar Skeleton */}
        {currentStep < 3 && (
          <div className={styles.skeletonProgressBar}>
            <div className={styles.skeletonProgressFill}></div>
          </div>
        )}
        
        {/* Main Content Skeleton */}
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.card}>
              {/* Headline skeleton */}
              <div className={styles.skeletonHeadline}></div>
              
              {/* Subtext skeleton */}
              <div className={styles.skeletonSubtext}></div>
              
              {/* Icon skeleton */}
              <div className={styles.iconContainer}>
                <div className={styles.skeletonIcon}></div>
              </div>
              
              {/* Input skeleton */}
              <div className={styles.skeletonInputWrapper}>
                <div className={styles.skeletonInput}></div>
              </div>
              
              {/* Button skeleton */}
              <div className={styles.skeletonButton}></div>
            </div>
          </div>
        </main>
        
        {/* Footer Skeleton */}
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonFooterText}></div>
          <div className={styles.skeletonFooterText}></div>
          <div className={styles.skeletonFooterText}></div>
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
            isSDKReady={true}
          />
        ) : (
          <ThankYou config={config} currentContent={currentContent} />
        )}
      </main>
      
      <Footer config={config} currentContent={currentContent} />
    </div>
  );
}