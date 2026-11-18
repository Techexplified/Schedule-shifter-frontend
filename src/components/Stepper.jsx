import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Select Cards' },
  { id: 2, label: 'Set Shift' },
  { id: 3, label: 'Preview' },
  { id: 4, label: 'Confirm' }
];

export default function Stepper({ currentStep, onStepClick }) {
  return (
    <div className="stepper-container">
      <div className="stepper-track">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          let stepClass = 'step-item';
          if (isActive) stepClass += ' active';
          else if (isCompleted) stepClass += ' completed';
          else stepClass += ' pending';

          const canClick = isCompleted && onStepClick;

          return (
            <div
              key={step.id}
              className={stepClass}
              onClick={() => canClick && onStepClick(step.id)}
              role={canClick ? 'button' : undefined}
              tabIndex={canClick ? 0 : undefined}
            >
              <span className="step-badge">
                {isCompleted ? <Check size={12} strokeWidth={3} /> : step.id}
              </span>
              <span className="step-label">{step.label}</span>
              <div className="step-arrow-tail"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
