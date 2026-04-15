import React from 'react';

const steps = [
  { label: 'Purpose', desc: 'Define Agreement' },
  { label: 'Verify', desc: 'Party Details' },
  { label: 'Analyze', desc: 'Document AI' },
  { label: 'Blockchain', desc: 'Finalize RWA' }
];

const Stepper = ({ currentStep }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="container">
      <div className="stepper-container">
        <div className="step-line"></div>
        <div className="step-line-progress" style={{ width: `${progressWidth}%` }}></div>
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div 
              key={index} 
              className={`stepper-item ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
            >
              <div className="step-circle">
                {isCompleted ? '✓' : stepNumber}
              </div>
              <div className="step-label">
                <div style={{ fontWeight: isActive ? '700' : '400' }}>{step.label}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
export { steps };
