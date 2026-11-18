import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Calendar, 
  CreditCard 
} from 'lucide-react';
import { formatDate, shiftDate } from '../utils/dateHelper';

export default function PreviewView({
  selectedCards,
  shiftConfig,
  onBack,
  onConfirm
}) {
  const { direction, days, updateStart, updateDue } = shiftConfig;
  const dayDelta = direction === 'forward' ? days : -days;

  const getUpdateSummaryText = () => {
    if (updateStart && updateDue) return 'Updating Start & Due Date';
    if (updateStart) return 'Updating Start Date';
    if (updateDue) return 'Updating Due Date';
    return 'None';
  };

  return (
    <div className="step-view preview-view">
      <div className="step-header">
        <h2 className="step-title">Preview Changes</h2>
        <p className="step-subtitle">
          Review how the dates will be updated for the selected cards.
        </p>
      </div>

      {/* Summary Banner Bar */}
      <div className="preview-summary-banner">
        <div className="banner-item">
          <Layers size={16} className="banner-icon" />
          <span>{selectedCards.length} Cards</span>
        </div>
        <div className="banner-divider" />
        <div className="banner-item">
          <ArrowRight size={16} className="banner-icon" />
          <span>Shift {direction === 'forward' ? 'Forward' : 'Backward'}</span>
        </div>
        <div className="banner-divider" />
        <div className="banner-item">
          <Calendar size={16} className="banner-icon" />
          <span>By {days} days</span>
        </div>
        <div className="banner-divider" />
        <div className="banner-item">
          <Calendar size={16} className="banner-icon" />
          <span>{getUpdateSummaryText()}</span>
        </div>
      </div>

      {/* Diff Table */}
      <div className="cards-table-container preview-table-container">
        <table className="cards-table preview-table">
          <thead>
            <tr className="header-primary-row">
              <th className="th-card" rowSpan={2}>Card</th>
              <th className="th-date-group" colSpan={2}>Start Date</th>
              <th className="th-date-group" colSpan={2}>Due Date</th>
            </tr>
            <tr className="header-secondary-row">
              <th className="th-sub">Current</th>
              <th className="th-sub">New</th>
              <th className="th-sub">Current</th>
              <th className="th-sub">New</th>
            </tr>
          </thead>
          <tbody>
            {selectedCards.map((card) => {
              const currentStart = formatDate(card.start);
              const currentDue = formatDate(card.due);

              const newStart = (updateStart && card.start) 
                ? formatDate(shiftDate(card.start, dayDelta)) 
                : null;

              const newDue = (updateDue && card.due) 
                ? formatDate(shiftDate(card.due, dayDelta)) 
                : null;

              return (
                <tr key={card.id} className="preview-row">
                  <td className="td-card preview-card-name">
                    <div className="card-identity-cell">
                      <CreditCard size={15} className="card-glyph" />
                      <span className="card-name-text">{card.name}</span>
                    </div>
                  </td>

                  {/* Start Date: Current */}
                  <td className="td-date-sub">
                    {currentStart || <span className="no-date-text">—</span>}
                  </td>

                  {/* Start Date: New */}
                  <td className="td-date-sub td-new-date">
                    {newStart ? (
                      <div className="date-transition">
                        <span className="arrow-transition">→</span>
                        <span className="new-date-pill">{newStart}</span>
                      </div>
                    ) : (
                      <span className="no-change-text">
                        {currentStart ? 'No change' : '—'}
                      </span>
                    )}
                  </td>

                  {/* Due Date: Current */}
                  <td className="td-date-sub">
                    {currentDue || <span className="no-date-text">—</span>}
                  </td>

                  {/* Due Date: New */}
                  <td className="td-date-sub td-new-date">
                    {newDue ? (
                      <div className="date-transition">
                        <span className="arrow-transition">→</span>
                        <span className="new-date-pill">{newDue}</span>
                      </div>
                    ) : (
                      <span className="no-change-text">
                        {currentDue ? 'No change' : '—'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
          onClick={onConfirm}
        >
          <span>Confirm & Update</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
