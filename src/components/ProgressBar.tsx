import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  isRTL?: boolean;
}

export default function ProgressBar({ step, totalSteps, isRTL = false }: ProgressBarProps) {
  return (
    <div className={styles.container}>
      <p className={styles.stepText}>
        {isRTL ? `الخطوة ${step}/${totalSteps}` : `STEP ${step}/${totalSteps}`}
      </p>
      
      <div className={styles.stepsContainer}>
        <div className={`${styles.stepBar} ${step >= 1 ? styles.activeStep : styles.inactiveStep}`} />
        <div className={`${styles.stepBar} ${step >= 2 ? styles.activeStep : styles.inactiveStep}`} />
      </div>
    </div>
  );
}