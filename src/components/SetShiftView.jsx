import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Minus, 
  Plus, 
  Calendar, 
  Layers, 
  Check 
} from 'lucide-react';

export default function SetShiftView({
  shiftConfig,
  onUpdateConfig,
  selectedCardsCount,
  onBack,
  onNext
}) {
  const { direction, days, updateStart, updateDue } = shiftConfig;

  const handleDaysChange = (newDays) => {
    const val = Math.max(1, Math.min(365, newDays));
    onUpdateConfig({ days: val });
  };

  const getUpdateSummaryText = () => {
    if (updateStart && updateDue) return 'Start Date & Due Date';
    if (updateStart) return 'Start Date';
    if (updateDue) return 'Due Date';
    return 'None selected';
  };

  const canProceed = (updateStart || updateDue) && days > 0;

  return (
    <div className="step-view set-shift-view">
      <div className="step-header">
        <h2 className="step-title">Set Schedule Shift</h2>
        <p className="step-subtitle">
          Choose the shift direction, number of days and which dates to update.
        </p>
      </div>

      <div className="set-shift-grid">
        {/* Left Column: Shift Inputs */}
        <div className="set-shift-controls">
          {/* Shift Direction */}
          <div className="control-section">
            <h3 className="section-label">Shift Direction</h3>
            <div className="direction-cards-grid">
              {/* Shift Forward */}
              <label 
                className={`direction-card ${direction === 'forward' ? 'selected' : ''}`}
                onClick={() => onUpdateConfig({ direction: 'forward' })}
              >
                <div className="radio-circle">
                  {direction === 'forward' && <div className="radio-dot" />}
                </div>
                <div className="direction-info">
                  <div className="direction-title-row">
                    <span className="direction-title">Shift Forward</span>
                    <ArrowRight size={16} className="direction-arrow" />
                  </div>
                  <span className="direction-desc">Push dates later</span>
                </div>
              </label>

              {/* Shift Backward */}
              <label 
                className={`direction-card ${direction === 'backward' ? 'selected' : ''}`}
                onClick={() => onUpdateConfig({ direction: 'backward' })}
              >
                <div className="radio-circle">
                  {direction === 'backward' && <div className="radio-dot" />}
                </div>
                <div className="direction-info">
                  <div className="direction-title-row">
                    <span className="direction-title">Shift Backward</span>
                    <ArrowLeft size={16} className="direction-arrow" />
                  </div>
                  <span className="direction-desc">Bring dates earlier</span>
                </div>
              </label>
            </div>
          </div>

          {/* Number of Days */}
          <div className="control-section">
            <h3 className="section-label">Number of Days</h3>
            <div className="days-counter-row">
              <div className="stepper-input-group">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleDaysChange(days - 1)}
                  disabled={days <= 1}
                  aria-label="Decrease days"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  className="counter-value-input"
                  value={days}
                  min={1}
                  max={365}
                  onChange={(e) => handleDaysChange(parseInt(e.target.value, 10) || 1)}
                />
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => handleDaysChange(days + 1)}
                  aria-label="Increase days"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Dynamic tag badge */}
              <div className="shift-summary-tag">
                <Calendar size={14} className="tag-icon" />
                <span>
                  Shift by {days} {days === 1 ? 'day' : 'days'} {direction}
                </span>
              </div>
            </div>
          </div>

          {/* Dates to Update */}
          <div className="control-section">
            <h3 className="section-label">Dates to Update</h3>
            <div className="dates-checkboxes">
              <label className="checkbox-card">
                <input
                  type="checkbox"
                  className="custom-checkbox-input"
                  checked={updateStart}
                  onChange={(e) => onUpdateConfig({ updateStart: e.target.checked })}
                />
                <span className="checkbox-custom">
                  {updateStart && <Check size={12} strokeWidth={3} />}
                </span>
                <Calendar size={15} className="checkbox-icon" />
                <span className="checkbox-text">Start Date</span>
              </label>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  className="custom-checkbox-input"
                  checked={updateDue}
                  onChange={(e) => onUpdateConfig({ updateDue: e.target.checked })}
                />
                <span className="checkbox-custom">
                  {updateDue && <Check size={12} strokeWidth={3} />}
                </span>
                <Calendar size={15} className="checkbox-icon" />
                <span className="checkbox-text">Due Date</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Summary Card */}
        <div className="summary-sidebar">
          <div className="summary-card">
            <div className="summary-card-header">
              <Layers size={18} className="summary-icon text-primary" />
              <h4 className="summary-card-title">Summary</h4>
            </div>

            <div className="summary-rows-list">
              <div className="summary-row">
                <div className="summary-row-label">
                  <div className="row-icon-bullet" />
                  <span>Cards Selected</span>
                </div>
                <span className="summary-row-value">{selectedCardsCount}</span>
              </div>

              <div className="summary-row">
                <div className="summary-row-label">
                  <ArrowRight size={14} className="row-icon-arrow" />
                  <span>Shift</span>
                </div>
                <span className="summary-row-value capitalize">{direction}</span>
              </div>

              <div className="summary-row">
                <div className="summary-row-label">
                  <Calendar size={14} className="row-icon-cal" />
                  <span>By</span>
                </div>
                <span className="summary-row-value">{days} {days === 1 ? 'day' : 'days'}</span>
              </div>

              <div className="summary-row summary-row-stacked">
                <div className="summary-row-label">
                  <Calendar size={14} className="row-icon-cal" />
                  <span>Update</span>
                </div>
                <span className="summary-row-value text-right font-medium">
                  {getUpdateSummaryText()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="step-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          className="btn-primary"
          disabled={!canProceed}
          onClick={onNext}
        >
          <span>Preview Changes</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
