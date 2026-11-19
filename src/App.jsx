import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import WelcomeView from './components/WelcomeView';
import SelectCardsView from './components/SelectCardsView';
import SetShiftView from './components/SetShiftView';
import PreviewView from './components/PreviewView';
import UpdatingView from './components/UpdatingView';
import SuccessView from './components/SuccessView';
import PartialIssuesView from './components/PartialIssuesView';
import ErrorView from './components/ErrorView';
import DevToolbar from './components/DevToolbar';
import TrelloConfigModal from './components/TrelloConfigModal';

import {
  fetchBoardCards,
  fetchUserBoards,
  updateCardDates,
  closeModal,
  isRunningInTrello,
  DEFAULT_CREDENTIALS
} from './services/trelloService';
import { shiftDate } from './utils/dateHelper';
import './App.css';

export default function App() {
  // Step tracker: 0 = Welcome, 1 = Select Cards, 2 = Set Shift, 3 = Preview, 4 = Execution
  const [currentStep, setCurrentStep] = useState(0);

  // Cards and board state
  const [cards, setCards] = useState([]);
  const [lists, setLists] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [isLiveTrello, setIsLiveTrello] = useState(false);
  const [isMockDisabled, setIsMockDisabled] = useState(() => {
    return localStorage.getItem('trello_disable_mock') === 'true';
  });

  // Selected card IDs
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  // Shift configuration (forward, 5 days, both dates)
  const [shiftConfig, setShiftConfig] = useState({
    direction: 'forward',
    days: 5,
    updateStart: true,
    updateDue: true
  });

  // Step 4 Execution state: 'idle' | 'updating' | 'success' | 'partial' | 'error'
  const [executionState, setExecutionState] = useState('idle');
  const [cardsStatus, setCardsStatus] = useState([]);

  // Simulation mode for testing: 'success' | 'partial' | 'error'
  const [simulationMode, setSimulationMode] = useState('success');

  // Config modal & API credentials
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('trello_shifter_creds');
    return saved ? JSON.parse(saved) : DEFAULT_CREDENTIALS;
  });

  // Fetch user boards list for switcher
  useEffect(() => {
    let ignore = false;
    fetchUserBoards(credentials).then((userBoards) => {
      if (!ignore && Array.isArray(userBoards)) {
        setBoards(userBoards);
      }
    });
    return () => {
      ignore = true;
    };
  }, [credentials]);

  // Initial and reactive board cards loading
  useEffect(() => {
    let ignore = false;

    fetchBoardCards(selectedBoardId, credentials).then((data) => {
      if (!ignore) {
        setCards(data.cards);
        setLists(data.lists);
        const isLive = data.isLive || isRunningInTrello();
        setIsLiveTrello(isLive);

        if (isLive || selectedBoardId) {
          const cardsWithDates = data.cards.filter((c) => c.hasDates).map((c) => c.id);
          setSelectedCardIds(
            cardsWithDates.length > 0 ? cardsWithDates : data.cards.map((c) => c.id)
          );
        } else {
          if (data.cards.length > 0) {
            const ids = data.cards.slice(0, 5).map((c) => c.id);
            setSelectedCardIds(ids);
          } else {
            setSelectedCardIds([]);
          }
        }
      }
    });

    return () => {
      ignore = true;
    };
  }, [selectedBoardId, credentials, isMockDisabled]);

  const saveCredentials = (newCreds) => {
    setCredentials(newCreds);
    localStorage.setItem('trello_shifter_creds', JSON.stringify(newCreds));
  };

  const handleToggleMockData = () => {
    const newVal = !isMockDisabled;
    setIsMockDisabled(newVal);
    localStorage.setItem('trello_disable_mock', newVal ? 'true' : 'false');
  };

  // Toggle single card selection
  const handleToggleCard = (cardId) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  // Toggle select all cards
  const handleToggleSelectAll = (targetCards) => {
    const allSelected = targetCards.every((c) => selectedCardIds.includes(c.id));
    if (allSelected) {
      const targetIds = new Set(targetCards.map((c) => c.id));
      setSelectedCardIds((prev) => prev.filter((id) => !targetIds.has(id)));
    } else {
      const newSelected = new Set([...selectedCardIds, ...targetCards.map((c) => c.id)]);
      setSelectedCardIds(Array.from(newSelected));
    }
  };

  // Update shift settings
  const handleUpdateConfig = (updates) => {
    setShiftConfig((prev) => ({ ...prev, ...updates }));
  };

  // Selected cards array
  const selectedCards = useMemo(() => {
    return cards.filter((c) => selectedCardIds.includes(c.id));
  }, [cards, selectedCardIds]);

  // Execute schedule shift with real or simulated Trello updates
  const handleConfirmUpdate = async () => {
    setCurrentStep(4);
    setExecutionState('updating');

    const total = selectedCards.length;
    const dayDelta = shiftConfig.direction === 'forward' ? shiftConfig.days : -shiftConfig.days;

    const initialStatus = selectedCards.map((c) => ({
      id: c.id,
      name: c.name,
      status: 'pending',
      error: null
    }));
    setCardsStatus(initialStatus);

    const isSimulatingError = !isLiveTrello && !selectedBoardId && simulationMode === 'error';
    if (isSimulatingError) {
      setTimeout(() => {
        setExecutionState('error');
      }, 1000);
      return;
    }

    const updatedCardsList = [...cards];
    let hasAnyFailure = false;
    let allFailed = true;

    for (let i = 0; i < total; i++) {
      const currentCard = selectedCards[i];

      setCardsStatus((prev) =>
        prev.map((c, idx) => (idx === i ? { ...c, status: 'updating' } : c))
      );

      const isFailedInSim =
        !isLiveTrello &&
        !selectedBoardId &&
        simulationMode === 'partial' &&
        (i === total - 1 || currentCard.name.toLowerCase().includes('deploy'));

      try {
        if (isFailedInSim) {
          await new Promise((r) => setTimeout(r, 600));
          throw new Error('No start or due date found.');
        }

        const newStart = shiftConfig.updateStart && currentCard.start
          ? shiftDate(currentCard.start, dayDelta)
          : currentCard.start;

        const newDue = shiftConfig.updateDue && currentCard.due
          ? shiftDate(currentCard.due, dayDelta)
          : currentCard.due;

        await updateCardDates(
          currentCard.id,
          {
            start: shiftConfig.updateStart ? newStart : undefined,
            due: shiftConfig.updateDue ? newDue : undefined
          },
          credentials
        );

        const targetIdx = updatedCardsList.findIndex((c) => c.id === currentCard.id);
        if (targetIdx !== -1) {
          updatedCardsList[targetIdx] = {
            ...updatedCardsList[targetIdx],
            start: newStart ? new Date(newStart).toISOString() : updatedCardsList[targetIdx].start,
            due: newDue ? new Date(newDue).toISOString() : updatedCardsList[targetIdx].due,
            hasDates: Boolean(newStart || newDue)
          };
        }

        allFailed = false;
        setCardsStatus((prev) =>
          prev.map((c, idx) => (idx === i ? { ...c, status: 'success' } : c))
        );
      } catch (err) {
        hasAnyFailure = true;
        setCardsStatus((prev) =>
          prev.map((c, idx) =>
            idx === i ? { ...c, status: 'failed', error: err.message || 'Update failed' } : c
          )
        );
      }

      await new Promise((r) => setTimeout(r, 200));
    }

    setCards(updatedCardsList);

    if (allFailed && total > 0) {
      setExecutionState('error');
    } else if (hasAnyFailure) {
      setExecutionState('partial');
    } else {
      setExecutionState('success');
    }
  };

  const handleShiftMore = () => {
    setExecutionState('idle');
    setCurrentStep(1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setExecutionState('idle');
    fetchBoardCards(selectedBoardId, credentials).then((data) => {
      setCards(data.cards);
      setLists(data.lists);
    });
  };

  const handleClose = () => {
    closeModal();
  };

  const inIframe = typeof window !== 'undefined' && (window.self !== window.top || isRunningInTrello());

  return (
    <div className={`app-viewport ${inIframe ? 'in-trello-iframe' : ''}`}>
      {/* Dev toolbar (hidden inside live Trello iframe) */}
      {!isLiveTrello && !inIframe && (
        <DevToolbar
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
          onReset={handleReset}
          onOpenConfig={() => setIsConfigOpen(true)}
          isLiveTrello={isLiveTrello}
          isMockDisabled={isMockDisabled}
          onToggleMockData={handleToggleMockData}
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
        />
      )}

      {/* Main Modal Dialog */}
      <div className="shifter-modal-dialog">
        {/* Header with Calendar Icon, 'Schedule Shifter' title, and close button (shown across all screens) */}
        <Header onClose={handleClose} />

        {/* Stepper only visible during steps 1 through 4 */}
        {currentStep > 0 && (
          <Stepper
            currentStep={currentStep}
            onStepClick={(stepId) => {
              if (currentStep !== 4 || executionState !== 'updating') {
                setCurrentStep(stepId);
              }
            }}
          />
        )}

        <div className="modal-content-area">
          {/* STEP 0: Welcome Screen (Image 1) */}
          {currentStep === 0 && (
            <WelcomeView onGetStarted={() => setCurrentStep(1)} />
          )}

          {/* STEP 1: Select Cards (Image 2) */}
          {currentStep === 1 && (
            <SelectCardsView
              cards={cards}
              lists={lists}
              selectedCardIds={selectedCardIds}
              onToggleCard={handleToggleCard}
              onToggleSelectAll={handleToggleSelectAll}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {/* STEP 2: Set Shift (Image 3) */}
          {currentStep === 2 && (
            <SetShiftView
              shiftConfig={shiftConfig}
              onUpdateConfig={handleUpdateConfig}
              selectedCardsCount={selectedCardIds.length}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {/* STEP 3: Preview Changes (Image 4) */}
          {currentStep === 3 && (
            <PreviewView
              selectedCards={selectedCards}
              shiftConfig={shiftConfig}
              onBack={() => setCurrentStep(2)}
              onConfirm={handleConfirmUpdate}
            />
          )}

          {/* STEP 4: Confirm / Execution (Images 5, 6, 7, 8) */}
          {currentStep === 4 && (
            <>
              {/* Updating Animation & Live Status (Image 5) */}
              {executionState === 'updating' && (
                <UpdatingView
                  totalCards={selectedCards.length}
                  days={shiftConfig.days}
                  direction={shiftConfig.direction}
                  cardsStatus={cardsStatus}
                />
              )}

              {/* Full Success Screen (Image 7) */}
              {executionState === 'success' && (
                <SuccessView
                  cardsCount={selectedCards.length}
                  days={shiftConfig.days}
                  direction={shiftConfig.direction}
                  updateStart={shiftConfig.updateStart}
                  updateDue={shiftConfig.updateDue}
                  onShiftMore={handleShiftMore}
                  onViewCards={handleClose}
                />
              )}

              {/* Partial Success with Issues Screen (Image 6) */}
              {executionState === 'partial' && (
                <PartialIssuesView
                  cardsStatus={cardsStatus}
                  days={shiftConfig.days}
                  direction={shiftConfig.direction}
                  onShiftMore={handleShiftMore}
                  onViewCards={handleClose}
                />
              )}

              {/* Error / No Cards Updated Screen (Image 8) */}
              {executionState === 'error' && (
                <ErrorView
                  onGoBack={() => {
                    setExecutionState('idle');
                    setCurrentStep(1);
                  }}
                  onTryAgain={() => {
                    handleConfirmUpdate();
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Trello Configuration / Installation Modal */}
      <TrelloConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        credentials={credentials}
        onSaveCredentials={saveCredentials}
      />
    </div>
  );
}
