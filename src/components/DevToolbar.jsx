import React from 'react';
import { Settings, RotateCcw, ShieldCheck, Sparkles, Trash2, Eye } from 'lucide-react';

export default function DevToolbar({
  simulationMode,
  setSimulationMode,
  onReset,
  onOpenConfig,
  isLiveTrello,
  isMockDisabled,
  onToggleMockData,
  boards = [],
  selectedBoardId,
  onSelectBoard
}) {
  return (
    <div className="dev-toolbar">
      <div className="dev-toolbar-left">
        <div className="dev-badge">
          {isLiveTrello ? (
            <span className="live-pill">
              <ShieldCheck size={12} /> Connected to Trello (Live)
            </span>
          ) : selectedBoardId ? (
            <span className="live-pill">
              <ShieldCheck size={12} /> Live Trello Board
            </span>
          ) : (
            <span className="demo-pill">
              <Sparkles size={12} /> Trello Power-Up Dev / Preview
            </span>
          )}
        </div>

        {/* Live Board Selector when API credentials are active */}
        {!isLiveTrello && boards.length > 0 && (
          <div className="dev-select-group">
            <label className="dev-label">Board:</label>
            <select
              className="dev-select"
              value={selectedBoardId || ''}
              onChange={(e) => onSelectBoard(e.target.value || null)}
            >
              <option value="">Demo / Sample Data</option>
              {boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isLiveTrello && !selectedBoardId && (
          <div className="dev-select-group">
            <label className="dev-label">Step 4 Test:</label>
            <select
              className="dev-select"
              value={simulationMode}
              onChange={(e) => setSimulationMode(e.target.value)}
            >
              <option value="success">Success (Image 7)</option>
              <option value="partial">Partial Issues (Image 6)</option>
              <option value="error">No Cards / Error (Image 8)</option>
            </select>
          </div>
        )}
      </div>

      <div className="dev-toolbar-right">
        {!isLiveTrello && !selectedBoardId && (
          <button
            type="button"
            className="dev-btn"
            onClick={onToggleMockData}
            title={isMockDisabled ? 'Enable sample mock cards' : 'Remove mock data completely'}
          >
            {isMockDisabled ? <Eye size={13} /> : <Trash2 size={13} />}
            <span>{isMockDisabled ? 'Restore Mock Data' : 'Remove Mock Data'}</span>
          </button>
        )}

        <button
          type="button"
          className="dev-btn"
          onClick={onOpenConfig}
          title="Trello Power-Up Manifest & API Settings"
        >
          <Settings size={13} />
          <span>Trello Settings</span>
        </button>

        <button
          type="button"
          className="dev-btn"
          onClick={onReset}
          title="Reset flow to Step 0 (Welcome Screen)"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
