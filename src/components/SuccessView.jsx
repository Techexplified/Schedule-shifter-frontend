import React from 'react';
import { 
  Check, 
  Layers, 
  ArrowRight, 
  Calendar, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';

export default function SuccessView({
  cardsCount,
  days,
  direction,
  updateStart,
  updateDue,
  onShiftMore,
  onViewCards
}) {
  const getDatesText = () => {
    if (updateStart && updateDue) return 'Start Date & Due Date';
    if (updateStart) return 'Start Date';
    if (updateDue) return 'Due Date';
    return 'Dates';
  };

  const sign = direction === 'forward' ? '+' : '-';

  return (
    <div className="step-view completion-view success-view">
      {/* Central Illustration */}
      <div className="status-hero-graphic">
        <div className="icon-circle-bg bg-green-subtle">
          <div className="cal-success-graphic">
            <div className="cal-green-box">
              <div className="cal-green-header"></div>
              <div className="cal-green-body">
                <div className="green-checkmark-circle">
                  <Check size={28} strokeWidth={3.5} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="status-hero-title">Schedule Updated!</h2>
      <p className="status-hero-subtitle">
        Successfully shifted dates for {cardsCount} {cardsCount === 1 ? 'card' : 'cards'} by {days} {days === 1 ? 'day' : 'days'} {direction}.
      </p>

      {/* Mint Green Summary Card */}
      <div className="success-metrics-card">
        <div className="success-metric-item">
          <Layers size={18} className="metric-icon" />
          <div className="metric-details">
            <span className="metric-primary-text">{cardsCount}</span>
            <span className="metric-secondary-text">Cards Updated</span>
          </div>
        </div>

        <div className="metric-card-divider" />

        <div className="success-metric-item">
          <ArrowRight size={18} className="metric-icon" />
          <div className="metric-details">
            <span className="metric-primary-text">{sign}{days} Days</span>
            <span className="metric-secondary-text">Shift Applied</span>
          </div>
        </div>

        <div className="metric-card-divider" />

        <div className="success-metric-item">
          <Calendar size={18} className="metric-icon" />
          <div className="metric-details">
            <span className="metric-primary-text">{getDatesText()}</span>
            <span className="metric-secondary-text">Updated</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="completion-footer">
        <button
          type="button"
          className="btn-secondary btn-has-icon"
          onClick={onShiftMore}
        >
          <RefreshCw size={16} />
          <span>Shift More Cards</span>
        </button>

        <button
          type="button"
          className="btn-primary btn-has-icon"
          onClick={onViewCards}
        >
          <span>View Updated Cards</span>
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
