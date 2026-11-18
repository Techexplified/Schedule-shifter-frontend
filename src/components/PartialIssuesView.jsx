import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';

export default function PartialIssuesView({
  cardsStatus,
  days,
  direction,
  onShiftMore,
  onViewCards
}) {
  const [activeTab, setActiveTab] = useState('updated');

  const updatedCards = cardsStatus.filter(c => c.status === 'success');
  const failedCards = cardsStatus.filter(c => c.status === 'failed');

  const sign = direction === 'forward' ? '+' : '-';

  return (
    <div className="step-view completion-view partial-view">
      {/* Central Illustration */}
      <div className="status-hero-graphic">
        <div className="icon-circle-bg bg-amber-subtle">
          <div className="cal-warning-graphic">
            <div className="cal-amber-box">
              <div className="cal-amber-header"></div>
              <div className="cal-amber-body">
                <AlertTriangle size={28} className="text-amber" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="status-hero-title">Update Completed with Issues</h2>
      <p className="status-hero-subtitle">
        Dates were updated for {updatedCards.length} of {cardsStatus.length} cards.
      </p>

      {/* 3 Metrics Row */}
      <div className="issues-metrics-grid">
        <div className="issue-metric-box metric-warning">
          <Layers size={18} className="metric-box-icon" />
          <div className="metric-box-info">
            <span className="metric-box-num">{updatedCards.length}</span>
            <span className="metric-box-lbl">Cards Updated</span>
          </div>
        </div>

        <div className="issue-metric-box metric-danger">
          <AlertTriangle size={18} className="metric-box-icon" />
          <div className="metric-box-info">
            <span className="metric-box-num">{failedCards.length}</span>
            <span className="metric-box-lbl">{failedCards.length === 1 ? 'Card Not Updated' : 'Cards Not Updated'}</span>
          </div>
        </div>

        <div className="issue-metric-box metric-neutral">
          <ArrowRight size={18} className="metric-box-icon" />
          <div className="metric-box-info">
            <span className="metric-box-num">{sign}{days} Days</span>
            <span className="metric-box-lbl">Shift Applied</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="partial-tabs-row">
        <button
          type="button"
          className={`partial-tab-btn ${activeTab === 'updated' ? 'active' : ''}`}
          onClick={() => setActiveTab('updated')}
        >
          Updated ({updatedCards.length})
        </button>
        <button
          type="button"
          className={`partial-tab-btn ${activeTab === 'failed' ? 'active' : ''}`}
          onClick={() => setActiveTab('failed')}
        >
          Not Updated ({failedCards.length})
        </button>
      </div>

      {/* Card Status Table / List */}
      <div className="partial-status-list">
        {activeTab === 'updated' && (
          updatedCards.map((card) => (
            <div key={card.id} className="status-list-row">
              <div className="status-card-identity">
                <CreditCard size={15} className="card-glyph" />
                <span className="status-card-name">{card.name}</span>
              </div>
              <div className="status-state-col">
                <div className="badge-status badge-success">
                  <CheckCircle2 size={14} className="status-icon-check" />
                  <span>Updated</span>
                </div>
              </div>
            </div>
          ))
        )}

        {activeTab === 'failed' && (
          failedCards.map((card) => (
            <div key={card.id} className="status-list-row row-failed-highlight">
              <div className="status-card-identity">
                <CreditCard size={15} className="card-glyph text-danger" />
                <span className="status-card-name">{card.name}</span>
              </div>
              <div className="status-state-col error-details-col">
                <div className="badge-status badge-danger">
                  <AlertCircle size={14} className="status-icon-danger" />
                  <span>Not Updated</span>
                </div>
                <div className="error-reason-tag">
                  <Info size={13} className="info-icon" />
                  <span>{card.error || 'No start or due date found.'}</span>
                </div>
              </div>
            </div>
          ))
        )}
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
