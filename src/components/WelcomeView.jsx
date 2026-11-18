import React from 'react';
import { ArrowRight, Layers, ArrowLeftRight, Eye } from 'lucide-react';

export default function WelcomeView({ onGetStarted }) {
  return (
    <div className="welcome-view">
      {/* Hero Illustration */}
      <div className="hero-illustration">
        <div className="calendar-shift-graphic">
          {/* Previous / Muted Calendar */}
          <div className="cal-card cal-old">
            <div className="cal-pin-left"></div>
            <div className="cal-pin-right"></div>
            <div className="cal-header-old"></div>
            <div className="cal-grid">
              <div className="cal-dot"></div>
              <div className="cal-dot"></div>
              <div className="cal-dot"></div>
              <div className="cal-dot"></div>
              <div className="cal-dot"></div>
              <div className="cal-dot"></div>
            </div>
          </div>

          {/* Curved Shift Arrow */}
          <div className="shift-arrow-curved">
            <svg width="60" height="34" viewBox="0 0 60 34" fill="none">
              <path
                d="M4 28 C 16 8, 40 6, 52 14"
                stroke="#0065FF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polygon points="56,12 44,8 48,22" fill="#0065FF" />
            </svg>
          </div>

          {/* New / Active Calendar with Sparkles */}
          <div className="cal-card cal-new">
            <div className="cal-sparkles">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="cal-pin-left"></div>
            <div className="cal-pin-right"></div>
            <div className="cal-header-new"></div>
            <div className="cal-grid">
              <div className="cal-dot active"></div>
              <div className="cal-dot active"></div>
              <div className="cal-dot active"></div>
              <div className="cal-dot active"></div>
              <div className="cal-dot active"></div>
              <div className="cal-dot active"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Copy */}
      <h1 className="welcome-title">Shift card schedules in bulk</h1>
      <p className="welcome-subtitle">
        Quickly update the start and due dates of multiple cards by a fixed number of days.
      </p>

      {/* Feature Badges Container */}
      <div className="feature-badges-container">
        <div className="feature-badge-item">
          <div className="feature-badge-icon">
            <Layers size={18} className="text-primary" />
          </div>
          <span className="feature-badge-text">Select multiple cards</span>
        </div>

        <div className="feature-divider"></div>

        <div className="feature-badge-item">
          <div className="feature-badge-icon">
            <ArrowLeftRight size={18} className="text-primary" />
          </div>
          <span className="feature-badge-text">Shift dates forward or backward</span>
        </div>

        <div className="feature-divider"></div>

        <div className="feature-badge-item">
          <div className="feature-badge-icon">
            <Eye size={18} className="text-primary" />
          </div>
          <span className="feature-badge-text">Preview and apply changes</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="welcome-action">
        <button
          type="button"
          className="btn-primary btn-large"
          onClick={onGetStarted}
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
