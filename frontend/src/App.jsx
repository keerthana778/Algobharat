import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Stepper from './components/Stepper';
import Step1Purpose from './steps/Step1Purpose';
import Step2Details from './steps/Step2Details';
import Step3Analyze from './steps/Step3Analyze';
import Step4Blockchain from './steps/Step4Blockchain';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [account, setAccount] = useState(null);
  const [data, setData] = useState({
    purpose: '',
    suggestedDocs: [],
    partyA: { pan: '', name: '', amount: 0 },
    partyB: { pan: '', name: '', amount: 0 },
    verification: null,
    analysis: null,
    fileName: ''
  });

  const updateData = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Purpose data={data} updateData={updateData} onNext={nextStep} />;
      case 2:
        return <Step2Details data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3Analyze data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4Blockchain data={data} account={account} onBack={prevStep} />;
      default:
        return <Step1Purpose data={data} updateData={updateData} onNext={nextStep} />;
    }
  };

  return (
    <div className="App">
      <Navbar account={account} setAccount={setAccount} />
      
      <main className="container" style={{ paddingBottom: '5rem' }}>
        <Stepper currentStep={currentStep} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', opacity: 0.5, fontSize: '0.8rem' }}>
        © 2024 AlgoBharat — AI-Powered RWA Verification on Algorand
      </footer>
    </div>
  );
}

export default App;
