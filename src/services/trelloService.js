/**
 * Trello Power-Up integration and API helper
 */

import { INITIAL_CARDS, AVAILABLE_LISTS } from '../data/mockCards';

let trelloInstance = null;

export function getTrelloInstance() {
  if (typeof window !== 'undefined' && window.TrelloPowerUp && !trelloInstance) {
    try {
      trelloInstance = window.TrelloPowerUp.iframe();
    } catch {
      // Not running inside a Trello iframe
      trelloInstance = null;
    }
  }
  return trelloInstance;
}

export function isRunningInTrello() {
  const urlParams = new URLSearchParams(window.location.search);
  return Boolean(getTrelloInstance() || urlParams.get('trello') === 'true');
}

/**
 * Fetch cards from active Trello board.
 * NOTE: When running inside Trello, strictly returns real Trello cards (NEVER falls back to mock data).
 */
export async function fetchBoardCards() {
  const t = getTrelloInstance();

  if (t) {
    try {
      const [cards, lists] = await Promise.all([
        t.cards('id', 'name', 'due', 'start', 'idList', 'url'),
        t.lists('id', 'name')
      ]);

      const listMap = (lists || []).reduce((acc, l) => {
        acc[l.id] = l.name;
        return acc;
      }, {});

      const formatted = (cards || []).map(c => ({
        id: c.id,
        name: c.name,
        listId: c.idList,
        listName: listMap[c.idList] || 'List',
        start: c.start || null,
        due: c.due || null,
        hasDates: Boolean(c.start || c.due),
        url: c.url
      }));

      // Strictly return real cards from Trello board without mock data
      return {
        cards: formatted,
        lists: [{ id: 'all', name: 'All Lists' }, ...(lists || [])],
        isLive: true
      };
    } catch (err) {
      console.warn('Could not read cards from Trello iframe:', err);
      return {
        cards: [],
        lists: [{ id: 'all', name: 'All Lists' }],
        isLive: true
      };
    }
  }

  // Standalone preview fallback:
  // Check if user has explicitly disabled or cleared mock data
  const isMockDisabled = localStorage.getItem('trello_disable_mock') === 'true';

  return {
    cards: isMockDisabled ? [] : INITIAL_CARDS,
    lists: isMockDisabled ? [{ id: 'all', name: 'All Lists' }] : AVAILABLE_LISTS,
    isLive: false
  };
}

/**
 * Seed sample cards into a real Trello board list (if user wants to push sample cards to Trello)
 */
export async function seedSampleCardsToTrello(targetListId, credentials = {}) {
  const { apiKey, apiToken } = credentials;
  if (!apiKey || !apiToken) {
    throw new Error('Trello API Key and Token are required to create cards.');
  }

  const results = [];
  for (const sample of INITIAL_CARDS) {
    const params = new URLSearchParams({
      key: apiKey,
      token: apiToken,
      idList: targetListId,
      name: sample.name,
      start: sample.start,
      due: sample.due
    });

    const res = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, {
      method: 'POST'
    });

    if (res.ok) {
      const card = await res.json();
      results.push(card);
    }
  }
  return results;
}

/**
 * Update card dates via Trello REST API or mock
 */
export async function updateCardDates(cardId, { start, due }, credentials = {}) {
  const { apiKey, apiToken } = credentials;

  // If credentials are provided, use real Trello REST API
  if (apiKey && apiToken) {
    const params = new URLSearchParams({
      key: apiKey,
      token: apiToken
    });

    if (start !== undefined) params.append('start', start ? new Date(start).toISOString() : '');
    if (due !== undefined) params.append('due', due ? new Date(due).toISOString() : '');

    const res = await fetch(`https://api.trello.com/1/cards/${cardId}?${params.toString()}`, {
      method: 'PUT'
    });

    if (!res.ok) {
      throw new Error(`Trello API error: ${res.statusText}`);
    }
    return await res.json();
  }

  // Simulated delay for realism when running in demo/mock mode
  await new Promise(r => setTimeout(r, 400));
  return { success: true };
}

/**
 * Close modal
 */
export function closeModal() {
  const t = getTrelloInstance();
  if (t && typeof t.closeModal === 'function') {
    try {
      t.closeModal();
      return;
    } catch (e) {
      console.warn('t.closeModal failed', e);
    }
  }
}
