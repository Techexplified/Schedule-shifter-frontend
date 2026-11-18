/**
 * Trello Power-Up integration and API helper
 */

import { INITIAL_CARDS, AVAILABLE_LISTS } from '../data/mockCards';

export const DEFAULT_CREDENTIALS = {
  apiKey: '763a132092afaa60ccc65a32cb73125a',
  apiToken: 'ATTA7f49c80fc44f5d6e8ee84577f970cf81f90c9536a3e750b4c50ce704efc98fd7BDB22303'
};

let trelloInstance = null;

export function getTrelloInstance() {
  if (typeof window !== 'undefined' && window.TrelloPowerUp && !trelloInstance) {
    try {
      trelloInstance = window.TrelloPowerUp.iframe();
    } catch {
      trelloInstance = null;
    }
  }
  return trelloInstance;
}

export function isRunningInTrello() {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return Boolean(getTrelloInstance() || urlParams.get('trello') === 'true');
}

/**
 * Fetch all boards for user via REST API
 */
export async function fetchUserBoards(credentials = DEFAULT_CREDENTIALS) {
  const { apiKey, apiToken } = credentials;
  if (!apiKey || !apiToken) return [];

  try {
    const res = await fetch(
      `https://api.trello.com/1/members/me/boards?fields=name,id&key=${apiKey}&token=${apiToken}`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch user boards:', err);
    return [];
  }
}

/**
 * Fetch cards and lists for a specific board ID via REST API
 */
export async function fetchBoardDataById(boardId, credentials = DEFAULT_CREDENTIALS) {
  const { apiKey, apiToken } = credentials;
  if (!boardId || !apiKey || !apiToken) return null;

  try {
    const [cardsRes, listsRes] = await Promise.all([
      fetch(
        `https://api.trello.com/1/boards/${boardId}/cards?fields=id,name,due,start,idList,url&key=${apiKey}&token=${apiToken}`
      ),
      fetch(
        `https://api.trello.com/1/boards/${boardId}/lists?fields=id,name&key=${apiKey}&token=${apiToken}`
      )
    ]);

    if (!cardsRes.ok || !listsRes.ok) return null;

    const cards = await cardsRes.json();
    const lists = await listsRes.json();

    const listMap = (lists || []).reduce((acc, l) => {
      acc[l.id] = l.name;
      return acc;
    }, {});

    const formatted = (cards || []).map((c) => ({
      id: c.id,
      name: c.name,
      listId: c.idList,
      listName: listMap[c.idList] || 'List',
      start: c.start || null,
      due: c.due || null,
      hasDates: Boolean(c.start || c.due),
      url: c.url
    }));

    return {
      cards: formatted,
      lists: [{ id: 'all', name: 'All Lists' }, ...(lists || [])],
      isLive: true
    };
  } catch (err) {
    console.warn('Failed to fetch board data by ID:', err);
    return null;
  }
}

/**
 * Fetch cards from active Trello board iframe or REST API
 */
export async function fetchBoardCards(activeBoardId = null, credentials = DEFAULT_CREDENTIALS) {
  const t = getTrelloInstance();

  // 1. Running inside Trello Power-Up iframe
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

      const formatted = (cards || []).map((c) => ({
        id: c.id,
        name: c.name,
        listId: c.idList,
        listName: listMap[c.idList] || 'List',
        start: c.start || null,
        due: c.due || null,
        hasDates: Boolean(c.start || c.due),
        url: c.url
      }));

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

  // 2. If boardId is specified or credentials exist, fetch live data from Trello REST API
  if (activeBoardId && credentials.apiKey && credentials.apiToken) {
    const liveData = await fetchBoardDataById(activeBoardId, credentials);
    if (liveData) return liveData;
  }

  // 3. Fallback to mock data if user hasn't disabled it
  const isMockDisabled = localStorage.getItem('trello_disable_mock') === 'true';

  return {
    cards: isMockDisabled ? [] : INITIAL_CARDS,
    lists: isMockDisabled ? [{ id: 'all', name: 'All Lists' }] : AVAILABLE_LISTS,
    isLive: false
  };
}

/**
 * Seed sample cards into a real Trello board list
 */
export async function seedSampleCardsToTrello(targetListId, credentials = DEFAULT_CREDENTIALS) {
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
 * Update card dates via Trello REST API
 */
export async function updateCardDates(cardId, { start, due }, credentials = DEFAULT_CREDENTIALS) {
  const { apiKey, apiToken } = credentials;

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

  // Simulated delay for demo/mock mode
  await new Promise((r) => setTimeout(r, 400));
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
