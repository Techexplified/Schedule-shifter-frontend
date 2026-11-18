import React, { useState, useMemo } from 'react';
import { Search, Calendar, ArrowRight, Check } from 'lucide-react';
import { formatDate } from '../utils/dateHelper';

export default function SelectCardsView({
  cards,
  lists,
  selectedCardIds,
  onToggleCard,
  onToggleSelectAll,
  onNext
}) {
  const [selectedListId, setSelectedListId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cards by list & search query
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesList = selectedListId === 'all' || card.listId === selectedListId;
      const matchesSearch = !searchQuery.trim() || 
        card.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesList && matchesSearch;
    });
  }, [cards, selectedListId, searchQuery]);

  const allFilteredSelected = 
    filteredCards.length > 0 &&
    filteredCards.every((c) => selectedCardIds.includes(c.id));

  const someFilteredSelected =
    filteredCards.some((c) => selectedCardIds.includes(c.id)) && !allFilteredSelected;

  return (
    <div className="step-view select-cards-view">
      <div className="step-header">
        <h2 className="step-title">Select Cards to Reschedule</h2>
        <p className="step-subtitle">
          Choose the cards whose start and/or due dates you want to shift.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-row">
        <div className="filter-group">
          <label htmlFor="list-filter" className="filter-label">List</label>
          <div className="select-wrapper">
            <select
              id="list-filter"
              className="select-input"
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-group">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cards Table */}
      <div className="cards-table-container">
        <table className="cards-table">
          <thead>
            <tr>
              <th className="th-card">
                <label className="checkbox-label table-checkbox-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox-input"
                    checked={allFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someFilteredSelected;
                    }}
                    onChange={() => onToggleSelectAll(filteredCards)}
                  />
                  <span className="checkbox-custom">
                    {allFilteredSelected && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="th-text">
                    Card ({selectedCardIds.length} selected)
                  </span>
                </label>
              </th>
              <th className="th-date">Start Date</th>
              <th className="th-date">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty-table-cell">
                  {cards.length === 0 ? (
                    <div className="empty-board-notice">
                      <p className="empty-board-title">No cards found on this board.</p>
                      <p className="empty-board-desc">Create cards with start or due dates in Trello to shift them.</p>
                    </div>
                  ) : (
                    'No cards match your filter.'
                  )}
                </td>
              </tr>
            ) : (
              filteredCards.map((card) => {
                const isSelected = selectedCardIds.includes(card.id);
                const startDateStr = formatDate(card.start);
                const dueDateStr = formatDate(card.due);

                return (
                  <tr
                    key={card.id}
                    className={`card-row ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => onToggleCard(card.id)}
                  >
                    <td className="td-card">
                      <label 
                        className="checkbox-label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="custom-checkbox-input"
                          checked={isSelected}
                          onChange={() => onToggleCard(card.id)}
                        />
                        <span className="checkbox-custom">
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span className="card-name-text">{card.name}</span>
                      </label>
                    </td>
                    <td className="td-date">
                      {startDateStr ? (
                        <div className="date-badge">
                          <Calendar size={14} className="date-icon" />
                          <span>{startDateStr}</span>
                        </div>
                      ) : (
                        <span className="no-date-text">—</span>
                      )}
                    </td>
                    <td className="td-date">
                      {dueDateStr ? (
                        <div className="date-badge">
                          <Calendar size={14} className="date-icon" />
                          <span>{dueDateStr}</span>
                        </div>
                      ) : (
                        <span className="no-date-text">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="step-footer select-cards-footer">
        <label className="checkbox-label select-all-footer">
          <input
            type="checkbox"
            className="custom-checkbox-input"
            checked={allFilteredSelected}
            onChange={() => onToggleSelectAll(filteredCards)}
          />
          <span className="checkbox-custom">
            {allFilteredSelected && <Check size={12} strokeWidth={3} />}
          </span>
          <span className="select-all-label">
            Select All ({filteredCards.length} cards)
          </span>
        </label>

        <button
          type="button"
          className="btn-primary"
          disabled={selectedCardIds.length === 0}
          onClick={onNext}
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
