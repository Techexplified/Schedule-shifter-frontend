import React from 'react';
import { Calendar, X } from 'lucide-react';

export default function Header({ onClose }) {
  return (
    <div className="modal-header">
      <div className="header-brand">
        <div className="header-icon-box">
          <Calendar className="header-icon" size={20} />
        </div>
        <h2 className="header-title">Schedule Shifter</h2>
      </div>
      <button 
        type="button" 
        className="close-button" 
        onClick={onClose}
        aria-label="Close modal"
      >
        <X size={18} />
      </button>
    </div>
  );
}
