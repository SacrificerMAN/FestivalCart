import { CATALOG } from '../data/catalog.js?v=20261005-2';

/**
 * UI-facing catalog boundary. Replace the in-memory records with normalized,
 * source-attributed provider offers when marketplace integrations are approved.
 */
export class CatalogService {
  constructor(items = CATALOG) {
    this.items = items;
  }

  search({ query = '', festival = 'all', category = 'all' } = {}) {
    const normalizedQuery = query.trim().toLocaleLowerCase('en-IN');
    return this.items.filter((item) => {
      const matchesFestival = festival === 'all' || item.festival === festival;
      const matchesCategory = category === 'all' || item.category === category;
      const searchable = [item.title, item.detail, item.festival, item.category, ...item.tags].join(' ').toLocaleLowerCase('en-IN');
      return matchesFestival && matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }

  getById(id) {
    return this.items.find((item) => item.id === id) ?? null;
  }
}

