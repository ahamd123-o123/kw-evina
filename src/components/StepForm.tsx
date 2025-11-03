'use client';

import { useState } from 'react';
import { LandingPageConfig, StepType, LanguageContent } from '@/types/config';
import { pyxisSDK } from '@/sdk';
import { getErrorMessage } from '@/utils/errorMessages';
import styles from './StepForm.module.css';

interface StepFormProps {
  config: LandingPageConfig;
  currentContent: LanguageContent;
  currentStep: StepType;
  onNextStep: () => void;
}

export default function StepForm({ config, currentContent, currentStep, onNextStep }: StepFormProps) {
  const [msisdn, setMsisdn] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Get Saudi mobile format (5xxxxxxxx)
  const getSaudiMobileFormat = (): string => {
    if (config.country_code === '+966') {
      return '5xxxxxxxx'; // 9 digits starting with 5
    }
    return 'xxxxxxxxx'; // Default format
  };

  // Validate MSISDN based on country
  const isValidMsisdn = (phone: string): boolean => {
    // Remove any spaces or special characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Saudi Arabia: 9 digits starting with 5
    if (config.country_code === '+966') {
      return cleanPhone.length === 9 && cleanPhone.startsWith('5');
    }
    
    // Default: at least 9 digits
    return cleanPhone.length >= 9;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!msisdn.trim()) return;
    
    // Validate MSISDN
    if (!isValidMsisdn(msisdn)) {
      setError('Please enter a valid mobile number (e.g., ' + getSaudiMobileFormat() + ')');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1️⃣ Track valid MSISDN event
      // Get numeric country code (remove + prefix)
      const numericCountryCode = config.country_code.replace('+', '');
      
      // Clean user input: remove non-digits
      const cleanInput = msisdn.replace(/\D/g, '');
      
      // Build full MSISDN: only add country code if user didn't include it
      const fullMsisdn = cleanInput.startsWith(numericCountryCode) 
        ? cleanInput 
        : numericCountryCode + cleanInput;
      
      await pyxisSDK.trackValidMsisdn(fullMsisdn);
      
      // 2️⃣ Send OTP via IDEX API
      console.log('📤 Sending OTP to:', fullMsisdn);
      const otpResponse = await fetch('/api/idex/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: fullMsisdn,
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        // Handle IDEX error codes
        const errorCode = otpData.errorCode || otpData.error;
        const currentLang = config.default_language as 'en' | 'ar';
        setError(getErrorMessage(errorCode, currentLang));
        return;
      }

      // Store trxId in sessionStorage for Step 2
      if (otpData.trxId) {
        sessionStorage.setItem('idex_trxId', otpData.trxId);
        console.log('✅ OTP sent successfully, trxId:', otpData.trxId);
      }
      
      // 3️⃣ Track PIN SENT event
      await pyxisSDK.trackPinSent(fullMsisdn);
      onNextStep();
      
    } catch (error) {
      console.error('Error submitting MSISDN:', error);
      const currentLang = config.default_language as 'en' | 'ar';
      setError(getErrorMessage('NETWORK_ERROR', currentLang));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!pin.trim() || pin.length < 4 || pin.length > 6) {
      setError('Please enter a 4-6 digit PIN code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get numeric country code (remove + prefix)
      const numericCountryCode = config.country_code.replace('+', '');
      
      // Clean user input: remove non-digits
      const cleanInput = msisdn.replace(/\D/g, '');
      
      // Build full MSISDN: only add country code if user didn't include it
      const fullMsisdn = cleanInput.startsWith(numericCountryCode) 
        ? cleanInput 
        : numericCountryCode + cleanInput;
      
      // 4️⃣ Track PIN SUBMITTED event (when user enters PIN, before validation)
      await pyxisSDK.trackPinSubmitted(fullMsisdn, pin);
      
      // Get trxId from sessionStorage
      const trxId = sessionStorage.getItem('idex_trxId');
      if (!trxId) {
        setError('Session expired. Please request a new PIN code.');
        return;
      }
      
      // 5️⃣ Verify PIN with IDEX API
      console.log('📤 Verifying PIN with IDEX...');
      const subscribeResponse = await fetch('/api/idex/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: fullMsisdn,
          authCode: pin,
          trxId: trxId,
        }),
      });

      const subscribeData = await subscribeResponse.json();

      if (!subscribeResponse.ok) {
        // Handle IDEX error codes
        const errorCode = subscribeData.errorCode || subscribeData.error;
        const currentLang = config.default_language as 'en' | 'ar';
        setError(getErrorMessage(errorCode, currentLang));
        
        // Track invalid PIN event (wrong PIN, expired, already subscribed, etc.)
        await pyxisSDK.trackInvalidPin(fullMsisdn, pin);
        
        // Note: failed_sale is tracked separately when PIN is correct but sale fails for other reasons
        return;
      }

      // 6️⃣ Track VALID PIN event (subscription successful)
      await pyxisSDK.trackValidPin(fullMsisdn, pin);
      console.log('✅ PIN verified successfully');
      
      // 7️⃣ Track SALE event (automatically after valid PIN)
      // This also updates user_sessions with sale=true and sale_timestamp
      await pyxisSDK.trackSale(fullMsisdn);
      console.log('💰 SALE event tracked!');
      
      // 8️⃣ Record sale to google_sales_recorded table
      // This logs sale with gclid/wbraid/gbraid for Google Ads conversion tracking
      // SDK will automatically pull service_id, country_code from campaign data
      await pyxisSDK.recordSale(fullMsisdn);
      console.log('📊 Sale recorded to google_sales_recorded table!');
      
      // Clear trxId from sessionStorage
      sessionStorage.removeItem('idex_trxId');
      
      onNextStep();
      
    } catch (error) {
      console.error('Error verifying PIN:', error);
      const currentLang = config.default_language as 'en' | 'ar';
      setError(getErrorMessage('NETWORK_ERROR', currentLang));
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.headline}>{currentContent.headline_step1}</h1>
          <p className={styles.subtext}>{currentContent.subtext_step1}</p>
          
          <div className={styles.iconContainer}>
            <div className={styles.downloadIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
                <path 
                  className={styles.downloadContainer} 
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
                <polyline 
                  className={styles.downloadArrow} 
                  points="7,10 12,15 17,10" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
                <line 
                  className={styles.downloadLine} 
                  x1="12" 
                  y1="15" 
                  x2="12" 
                  y2="3" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          
          <form onSubmit={handleStep1Submit} className={styles.form}>
            {error && (
              <div className={styles.errorMessage}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <div className={styles.inputGroup}>
              <div className={styles.phoneInput}>
                <div className={styles.phoneIconInput}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52c-.12-1.01-.97-1.77-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"/>
                  </svg>
                </div>
                <span className={styles.countryCode}>{config.country_code}</span>
                <input
                  type="tel"
                  value={msisdn}
                  onChange={(e) => {
                    setMsisdn(e.target.value);
                    setError(''); // Clear error on input change
                  }}
                  placeholder={getSaudiMobileFormat()}
                  className={styles.input}
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !msisdn.trim()}
              className={styles.ctaButton}
            >
              {isLoading ? 'Loading...' : currentContent.cta_step1}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.headline}>{currentContent.headline_step2}</h1>
          <p className={styles.subtext}>{currentContent.subtext_step2}</p>
          
          <form onSubmit={handleStep2Submit} className={styles.form}>
            {error && (
              <div className={styles.errorMessage}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError(''); // Clear error on input change
                }}
                placeholder="Enter PIN code (4-6 digits)"
                className={styles.input}
                maxLength={6}
                required
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !pin.trim()}
              className={styles.ctaButton}
            >
              {isLoading ? 'Verifying...' : currentContent.cta_step2}
            </button>
            
            <button 
              type="button" 
              className={styles.resendButton}
              onClick={() => {/* Implement resend logic */}}
            >
              Resend PIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}