/**
 * Default sample cards matching the design screenshots
 */

export const INITIAL_CARDS = [
  {
    id: 'card-1',
    name: 'Design Homepage',
    listName: 'To Do',
    listId: 'list-1',
    start: '2026-03-10T09:00:00.000Z',
    due: '2026-03-14T18:00:00.000Z',
    hasDates: true
  },
  {
    id: 'card-2',
    name: 'Develop Components',
    listName: 'In Progress',
    listId: 'list-2',
    start: '2026-03-11T09:00:00.000Z',
    due: '2026-03-16T18:00:00.000Z',
    hasDates: true
  },
  {
    id: 'card-3',
    name: 'Testing & QA',
    listName: 'In Progress',
    listId: 'list-2',
    start: '2026-03-13T09:00:00.000Z',
    due: '2026-03-17T18:00:00.000Z',
    hasDates: true
  },
  {
    id: 'card-4',
    name: 'Content Update',
    listName: 'Ready for Review',
    listId: 'list-3',
    start: '2026-03-15T09:00:00.000Z',
    due: '2026-03-19T18:00:00.000Z',
    hasDates: true
  },
  {
    id: 'card-5',
    name: 'Deploy to Production',
    listName: 'Deployment',
    listId: 'list-4',
    start: '2026-03-18T09:00:00.000Z',
    due: '2026-03-20T18:00:00.000Z',
    hasDates: true
  },
  {
    id: 'card-6',
    name: 'Project Review',
    listName: 'Done',
    listId: 'list-5',
    start: '2026-03-20T09:00:00.000Z',
    due: '2026-03-24T18:00:00.000Z',
    hasDates: true
  }
];

export const AVAILABLE_LISTS = [
  { id: 'all', name: 'All Lists' },
  { id: 'list-1', name: 'To Do' },
  { id: 'list-2', name: 'In Progress' },
  { id: 'list-3', name: 'Ready for Review' },
  { id: 'list-4', name: 'Deployment' },
  { id: 'list-5', name: 'Done' }
];
