import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, Copy, UploadCloud, CheckCircle2 } from 'lucide-react';
import { seedSampleCardsToTrello } from '../services/trelloService';

export default function TrelloConfigModal({
  isOpen,
  onClose,
  credentials,
  onSaveCredentials
}) {
  const [apiKey, setApiKey] = useState(credentials.apiKey || '');
  const [apiToken, setApiToken] = useState(credentials.apiToken || '');
  const [targetListId, setTargetListId] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveCredentials({ apiKey, apiToken });
    onClose();
  };

  const handleSeedToTrello = async () => {
    if (!apiKey || !apiToken || !targetListId.trim()) {
      setSeedError('API Key, Token, aur Target List ID teeno zaroori hain.');
      return;
    }

    try {
      setIsSeeding(true);
      setSeedError(null);
      await seedSampleCardsToTrello(targetListId.trim(), { apiKey, apiToken });
      
      // Disable local mock data after pushing to Trello so only real cards show!
      localStorage.setItem('trello_disable_mock', 'true');
      setSeedSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setSeedError(err.message || 'Cards push karne me error aayi.');
    } finally {
      setIsSeeding(false);
    }
  };

  const connectorUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/connector.html` 
    : 'https://your-domain.com/connector.html';

  const copyConnector = () => {
    navigator.clipboard.writeText(connectorUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="config-dialog">
        <div className="config-dialog-header">
          <div className="config-dialog-title-group">
            <Key size={18} className="text-primary" />
            <h3>Trello Power-Up Settings & Integration</h3>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="config-dialog-body">
          {/* Section 1: Power-Up Manifest & Connector URL */}
          <div className="config-section">
            <h4 className="config-section-title">
              1. Trello Power-Ups Admin me Add Karein
            </h4>
            <p className="config-section-desc">
              Live Trello board me use karne ke liye Power-Up register karein:
            </p>
            <ol className="config-steps-list">
              <li>Open <a href="https://trello.com/power-ups/admin" target="_blank" rel="noreferrer" className="inline-link">trello.com/power-ups/admin <ExternalLink size={12} /></a></li>
              <li><strong>New Power-Up</strong> create karein aur name dein <strong>Schedule Shifter</strong></li>
              <li><strong>Iframe connector URL</strong> me ye link dalein:</li>
            </ol>

            <div className="copy-url-box">
              <code>{connectorUrl}</code>
              <button 
                type="button" 
                className="btn-copy" 
                onClick={copyConnector}
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: REST API Credentials */}
          <form onSubmit={handleSave} className="config-section">
            <h4 className="config-section-title">
              2. Trello REST API Credentials
            </h4>

            <div className="form-field">
              <label htmlFor="trello-api-key">Trello API Key</label>
              <input
                id="trello-api-key"
                type="text"
                placeholder="Enter API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="trello-api-token">Trello API Token</label>
              <input
                id="trello-api-token"
                type="password"
                placeholder="Enter Trello User Token"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="text-input"
              />
            </div>

            {/* Section 3: Seed mock data to Trello board then remove it */}
            <div className="seed-section">
              <h4 className="config-section-title">
                3. Mock Data Trello me Daal Kar Hata dein
              </h4>
              <p className="config-section-desc">
                Agar aap sample cards ko apne real Trello list me push karna chahte hain aur phir mock data hata dena chahte hain:
              </p>

              <div className="form-field">
                <label htmlFor="target-list-id">Target Trello List ID</label>
                <input
                  id="target-list-id"
                  type="text"
                  placeholder="e.g. 5a6b... (List ID from Trello card/list URL .json)"
                  value={targetListId}
                  onChange={(e) => setTargetListId(e.target.value)}
                  className="text-input"
                />
              </div>

              {seedError && <p className="seed-error-text">{seedError}</p>}
              {seedSuccess && (
                <div className="seed-success-text">
                  <CheckCircle2 size={15} />
                  <span>Cards Trello me create ho gaye aur local mock data remove kar diya gaya!</span>
                </div>
              )}

              <div className="seed-actions-row">
                <button
                  type="button"
                  className="btn-seed"
                  disabled={isSeeding || !apiKey || !apiToken || !targetListId}
                  onClick={handleSeedToTrello}
                >
                  <UploadCloud size={14} />
                  <span>{isSeeding ? 'Pushing to Trello...' : 'Push Mock Cards to Trello & Remove'}</span>
                </button>
              </div>
            </div>

            <div className="config-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
