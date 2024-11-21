import CustomerDashboard from '@/components/customer/customer-dashboard'
import { useState } from 'react';
import ProgressBar from '@/components/ProgressBar'
import ServiceSelection from '@/components/booking/service-selection'
import TimeSelection from '@/components/booking/TimeSelection'
import Confirmation from '@/components/booking/Confirmation'

export default function CustomerDashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div>
      <ProgressBar step={currentStep} totalSteps={3} />
      {currentStep === 1 && <ServiceSelection onNext={nextStep} />}
      {currentStep === 2 && <TimeSelection onNext={nextStep} onBack={prevStep} />}
      {currentStep === 3 && <Confirmation onBack={prevStep} />}
    </div>
  );
}