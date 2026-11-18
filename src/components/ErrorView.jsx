import React from 'react';
import { 
  X, 
  Info, 
  Check, 
  ArrowLeft, 
  RefreshCw 
} from 'lucide-react';

export default function ErrorView({
  onGoBack,
  onTryAgain
}) {
  return (
    <div className="step-view completion-view error-view">
      {/* Central Illustration */}
      <div className="status-hero-graphic">
        <div className="icon-circle-bg bg-red-subtle">
          <div className="cal-error-graphic">
            <div className="cal-red-box">
              <div className="cal-red-header"></div>
              <div className="cal-red-body">
                <div className="red-x-circle">
                  <X size={28} strokeWidth={3.5} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="status-hero-title">No Cards Updated</h2>
      <p className="status-hero-subtitle">
        We couldn't update any cards. Here's why:
      </p>

      {/* Red Callout Box */}
      <div className="error-callout-box">
        <div className="callout-icon-col">
          <div className="callout-info-circle">
            <Info size={18} className="text-danger" />
          </div>
        </div>
        <div className="callout-content-col">
          <ul className="callout-bullets-list">
            <li>The selected cards don't have a Start Date or Due Date, or</li>
            <li>You don't have permission to update one or more cards.</li>
          </ul>
        </div>
      </div>

      {/* What You Can Do Section */}
      <div className="suggestions-section">
        <h4 className="suggestions-title">What you can do:</h4>
        <ul className="suggestions-list">
          <li className="suggestion-item">
            <Check size={16} className="text-success check-glyph" strokeWidth={2.5} />
            <span>Select cards with a Start Date and/or Due Date.</span>
          </li>
          <li className="suggestion-item">
            <Check size={16} className="text-success check-glyph" strokeWidth={2.5} />
            <span>Make sure you have edit permission on the selected cards.</span>
          </li>
        </ul>
      </div>

      {/* Footer Actions */}
      <div className="completion-footer">
        <button
          type="button"
          className="btn-secondary btn-has-icon"
          onClick={onGoBack}
        >
          <ArrowLeft size={16} />
          <span>Go Back & Review</span>
        </button>

        <button
          type="button"
          className="btn-primary btn-has-icon"
          onClick={onTryAgain}
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
