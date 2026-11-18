import React from 'react';
import { CreditCard, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function UpdatingView({
  totalCards,
  days,
  direction,
  cardsStatus
}) {
  const completedCount = cardsStatus.filter(c => c.status === 'success').length;
  const progressPercent = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;

  return (
    <div className="step-view updating-view">
      {/* Central Illustration */}
      <div className="status-hero-graphic">
        <div className="icon-circle-bg bg-blue-subtle">
          <div className="cal-sync-icon-wrapper">
            <div className="cal-mini-box">
              <div className="cal-mini-header"></div>
              <div className="cal-mini-grid">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="sync-arrows-spin">
              <RefreshCw size={24} className="spin-icon" />
            </div>
          </div>
        </div>
      </div>

      <h2 className="status-hero-title">Updating Card Schedules...</h2>
      <p className="status-hero-subtitle">
        Shifting dates for {totalCards} {totalCards === 1 ? 'card' : 'cards'} by {days} {days === 1 ? 'day' : 'days'} {direction}.
      </p>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-count-text">
          {completedCount} of {totalCards} cards updated
        </div>
      </div>

      {/* Real-time Status Card List */}
      <div className="updating-status-list">
        {cardsStatus.map((card) => {
          const isDone = card.status === 'success';
          const isUpdating = card.status === 'updating';

          return (
            <div key={card.id} className="status-list-row">
              <div className="status-card-identity">
                <CreditCard size={15} className="card-glyph" />
                <span className="status-card-name">{card.name}</span>
              </div>

              <div className="status-state-col">
                {isDone && (
                  <div className="badge-status badge-success">
                    <CheckCircle2 size={14} className="status-icon-check" />
                    <span>Updated</span>
                  </div>
                )}
                {isUpdating && (
                  <div className="badge-status badge-updating">
                    <Loader2 size={14} className="status-icon-spinner spin" />
                    <span>Updating...</span>
                  </div>
                )}
                {!isDone && !isUpdating && (
                  <div className="badge-status badge-pending">
                    <span>Pending...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
