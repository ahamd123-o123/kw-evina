'use client';

import { useState, useRef } from 'react';
import { LandingPageConfig, StepType, LanguageContent } from '@/types/config';
import { pyxisSDK } from '@/sdk';
import { getErrorMessage } from '@/utils/errorMessages';
import styles from './StepForm.module.css';

interface StepFormProps {
  config: LandingPageConfig;
  currentContent: LanguageContent;
  currentStep: StepType;
  onNextStep: () => void;
  isSDKReady: boolean; // Track if SDK initialization is complete
}

export default function StepForm({ config, currentContent, currentStep, onNextStep, isSDKReady }: StepFormProps) {
  const [msisdn, setMsisdn] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isFocusPulse, setIsFocusPulse] = useState(false);
  const [isValidMsisdnInput, setIsValidMsisdnInput] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle click/touch outside the card - trigger focus pulse
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Check if click is outside the card
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setIsFocusPulse(true);
      setTimeout(() => setIsFocusPulse(false), 2000); // Remove after 2 seconds
    }
  };

  // Format and validate Saudi mobile number
  // Always returns: 966 + 5 + 8 digits (total 12 digits)
  // Handles: 49176434, 549176434, 0549176434, 966549176434, +966549176434
  const formatSaudiMsisdn = (input: string): { isValid: boolean; fullMsisdn: string; errorMessage?: string } => {
    // Remove all non-digits
    const cleanInput = input.replace(/\D/g, '');
    
    // If empty
    if (!cleanInput) {
      return { isValid: false, fullMsisdn: '', errorMessage: 'Please enter a mobile number' };
    }
    
    let mainDigits = cleanInput;
    
    // Remove country code if present (966)
    if (mainDigits.startsWith('966')) {
      mainDigits = mainDigits.substring(3);
    }
    
    // Remove leading 0 if present (0549176434 -> 549176434)
    if (mainDigits.startsWith('0')) {
      mainDigits = mainDigits.substring(1);
    }
    
    // Add 5 prefix if not present (49176434 -> 549176434)
    if (!mainDigits.startsWith('5')) {
      mainDigits = '5' + mainDigits;
    }
    
    // Validate: should be exactly 9 digits starting with 5 (5xxxxxxxx)
    if (mainDigits.length !== 9) {
      return { 
        isValid: false, 
        fullMsisdn: '966' + mainDigits, 
        errorMessage: 'Mobile number must be 9 digits (5xxxxxxxx)' 
      };
    }
    
    // Final validation: must start with 5 and be 9 digits
    if (!mainDigits.startsWith('5') || !/^5\d{8}$/.test(mainDigits)) {
      return { 
        isValid: false, 
        fullMsisdn: '966' + mainDigits, 
        errorMessage: 'Mobile number must start with 5 (e.g., 549176434)' 
      };
    }
    
    // Return valid formatted number: 966 + 5xxxxxxxx
    return { 
      isValid: true, 
      fullMsisdn: '966' + mainDigits 
    };
  };

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
    
    // Format and validate MSISDN
    const { isValid, fullMsisdn, errorMessage } = formatSaudiMsisdn(msisdn);
    
    if (!isValid) {
      // Track invalid MSISDN event (format validation failed)
      await pyxisSDK.trackInvalidMsisdn(fullMsisdn, 'format_validation_failed');
      setError(errorMessage || 'Please enter a valid mobile number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send OTP via IDEX API
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
        // Track invalid MSISDN event (API rejected)
        // API returns: {"error":"8001xxx","errorCode":400}
        const errorCode = otpData.error || otpData.code || 'UNKNOWN_ERROR';
        await pyxisSDK.trackInvalidMsisdn(fullMsisdn, `api_rejected_${errorCode}`);
        
        // Handle IDEX error codes
        const currentLang = config.default_language as 'en' | 'ar';
        setError(getErrorMessage(errorCode, currentLang));
        return;
      }

      // Track valid MSISDN event (API accepted)
      await pyxisSDK.trackValidMsisdn(fullMsisdn);
      
      // Store trxId in sessionStorage for Step 2
      if (otpData.trxId) {
        sessionStorage.setItem('idex_trxId', otpData.trxId);
        
        // Update session with IDEX trxId as pubid
        await pyxisSDK.updatePubId(otpData.trxId);
      }
      
      // Track PIN SENT event
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
      // Format and validate MSISDN
      const { isValid, fullMsisdn } = formatSaudiMsisdn(msisdn);
      
      if (!isValid) {
        setError('Invalid mobile number format');
        return;
      }
      
      // 4️⃣ Track PIN SUBMITTED event (when user enters PIN, before validation)
      await pyxisSDK.trackPinSubmitted(fullMsisdn, pin);
      
      // Get trxId from sessionStorage
      const trxId = sessionStorage.getItem('idex_trxId');
      if (!trxId) {
        setError('Session expired. Please request a new PIN code.');
        return;
      }
      
      // 5️⃣ Verify PIN with IDEX API
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
        // API returns: {"error":"8001023","errorCode":400}
        // The actual IDEX error code is in the "error" field, not "errorCode"
        const errorCode = subscribeData.error || subscribeData.code || 'UNKNOWN_ERROR';
        const currentLang = config.default_language as 'en' | 'ar';
        
        setError(getErrorMessage(errorCode, currentLang));
        
        // Track invalid PIN event (wrong PIN, expired, already subscribed, etc.)
        await pyxisSDK.trackInvalidPin(fullMsisdn, pin);
        
        // Note: failed_sale is tracked separately when PIN is correct but sale fails for other reasons
        return;
      }

      // 6️⃣ Track VALID PIN event (subscription successful)
      await pyxisSDK.trackValidPin(fullMsisdn, pin);
      
      // 7️⃣ Track SALE event (automatically after valid PIN)
      // This also updates user_sessions with sale=true and sale_timestamp
      await pyxisSDK.trackSale(fullMsisdn);
      
      // 8️⃣ Record sale to google_sales_recorded table
      // This logs sale with gclid/wbraid/gbraid for Google Ads conversion tracking
      // SDK will automatically pull service_id, country_code from campaign data
      await pyxisSDK.recordSale(fullMsisdn);
      
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
      <div className={`${styles.container} ${isFocusPulse ? styles.blurBackdrop : ''}`} onClick={handleOutsideClick} onTouchEnd={handleOutsideClick}>
        <div ref={cardRef} className={`${styles.card} ${isFocusPulse ? styles.focusPulse : ''}`}>
          <h1 className={styles.headline}>{currentContent.headline_step1}</h1>
          <p className={styles.subtext}>{currentContent.subtext_step1}</p>
          
          <div className={styles.iconContainer}>
            <img src="/assets/secure.png" alt="Secure" className={styles.secureIcon} />
          </div>
          
          {/* Step Indicators */}
          <div className={styles.stepIndicators}>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>1</div>
              <span className={styles.stepText}>{currentContent.step1_label}</span>
            </div>
            <div className={`${styles.stepItem} ${styles.stepInactive}`}>
              <div className={styles.stepNumber}>2</div>
              <span className={styles.stepText}>{currentContent.step2_label}</span>
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
                  <img src="/assets/phone.png" alt="Phone" width="20" height="20" />
                </div>
                <span className={styles.countryCode}>05</span>
                <input
                  type="tel"
                  value={msisdn}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setMsisdn(inputValue);
                    setError(''); // Clear error on input change
                    
                    // Check if input is valid as user types
                    const validation = formatSaudiMsisdn(inputValue);
                    setIsValidMsisdnInput(validation.isValid);
                  }}
                  placeholder={currentContent.mobile_placeholder}
                  className={styles.input}
                  required
                  autoFocus
                />
                {isValidMsisdnInput && (
                  <div className={styles.validCheckmark}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#22c55e" />
                      <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !msisdn.trim()}
              className={styles.ctaButton}
            >
              {isLoading ? (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                  <span>Sending PIN...</span>
                </div>
              ) : currentContent.cta_step1}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className={`${styles.container} ${isFocusPulse ? styles.blurBackdrop : ''}`} onClick={handleOutsideClick} onTouchEnd={handleOutsideClick}>
        <div ref={cardRef} className={`${styles.card} ${isFocusPulse ? styles.focusPulse : ''}`}>
          <h1 className={styles.headline}>{currentContent.headline_step2}</h1>
          <p className={styles.subtext}>{currentContent.subtext_step2}</p>
          
          {/* Step Indicators */}
          <div className={styles.stepIndicators}>
            <div className={`${styles.stepItem} ${styles.stepInactive}`}>
              <div className={styles.stepNumber}>1</div>
              <span className={styles.stepText}>{currentContent.step1_label}</span>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>2</div>
              <span className={styles.stepText}>{currentContent.step2_label}</span>
            </div>
          </div>
          
          <form onSubmit={handleStep2Submit} className={styles.form}>
            {successMessage && (
              <div className={styles.successMessage}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}
            {error && (
              <div className={styles.errorMessage}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <div className={styles.inputGroup}>
              <div className={styles.pinInputWrapper}>
                <div className={styles.pinIconInput}>
                  <img src="/assets/pincon.png" alt="PIN" width="20" height="20" />
                </div>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError(''); // Clear error on input change
                  }}
                  placeholder="Enter PIN code"
                  className={styles.pinInput}
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !pin.trim()}
              className={styles.ctaButton}
            >
              {isLoading ? (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                  <span>Verifying...</span>
                </div>
              ) : currentContent.cta_step2}
            </button>
            
            <button 
              type="button" 
              className={styles.resendButton}
              onClick={async () => {
                if (isLoading) return;
                
                setIsLoading(true);
                setError('');
                
                try {
                  // Format and validate MSISDN
                  const { isValid, fullMsisdn } = formatSaudiMsisdn(msisdn);
                  
                  if (!isValid) {
                    setError('Invalid mobile number format');
                    setIsLoading(false);
                    return;
                  }
                  
                  // Resend OTP via IDEX API
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
                    const currentLang = config.default_language as 'en' | 'ar';
                    const errorCode = otpData.error || otpData.code || 'UNKNOWN_ERROR';
                    setError(getErrorMessage(errorCode, currentLang));
                    return;
                  }

                  // Store new trxId
                  if (otpData.trxId) {
                    sessionStorage.setItem('idex_trxId', otpData.trxId);
                    await pyxisSDK.updatePubId(otpData.trxId);
                  }
                  
                  // Track PIN SENT event
                  await pyxisSDK.trackPinSent(fullMsisdn);
                  
                  // Show success message
                  const currentLang = config.default_language as 'en' | 'ar';
                  const successMsg = currentLang === 'ar' ? 'تم إرسال الرمز مرة أخرى' : 'PIN sent successfully';
                  setSuccessMessage(successMsg);
                  setError(''); // Clear any errors
                  
                  // Clear success message after 5 seconds
                  setTimeout(() => setSuccessMessage(''), 5000);
                } catch (error) {
                  console.error('Error resending PIN:', error);
                  const currentLang = config.default_language as 'en' | 'ar';
                  setError(getErrorMessage('NETWORK_ERROR', currentLang));
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              {currentContent.resend_pin}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}