import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOG } from '../data/catalog.js';
import { FESTIVALS, getUpcomingFestivals } from '../data/festivals.js';
import { CatalogService } from '../services/catalog-service.js';

test('upcoming festival calendar is ordered after 3 October 2026', () => {
  const upcoming = getUpcomingFestivals(new Date('2026-10-03T00:00:00'));
  assert.equal(upcoming[0].id, 'navratri');
  assert.equal(upcoming.at(-1).id, 'christmas');
  assert.deepEqual([...FESTIVALS].map((festival) => festival.date), [...FESTIVALS].map((festival) => festival.date).sort());
});

test('catalog filtering supports festival, category and free-text query together', () => {
  const service = new CatalogService();
  const results = service.search({ festival: 'diwali', category: 'decor', query: 'rangoli' });
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'rangoli-path');
});

test('prototype catalog never claims unverified market prices', () => {
  for (const item of CATALOG) {
    assert.equal(item.price, null);
    assert.match(item.sourceStatus, /verified/i);
  }
});

