import { FESTIVALS, getUpcomingFestivals } from './data/festivals.js';
import { CATEGORIES } from './data/catalog.js';
import { CatalogService } from './services/catalog-service.js';
import { Analytics } from './services/analytics.js';

const catalog = new CatalogService();
const state = { festival: 'all', category: 'all', query: '', saved: new Set() };

const el = {
  festivalRail: document.querySelector('#festivalRail'),
  festivalFilters: document.querySelector('#festivalFilters'),
  categoryFilters: document.querySelector('#categoryFilters'),
  productGrid: document.querySelector('#productGrid'),
  emptyState: document.querySelector('#emptyState'),
  resultsCount: document.querySelector('#resultsCount'),
  filterCount: document.querySelector('#filterCount'),
  savedCount: document.querySelector('#savedCount'),
  savedList: document.querySelector('#savedList'),
  searchDialog: document.querySelector('#searchDialog'),
  searchInput: document.querySelector('#searchInput'),
  savedDialog: document.querySelector('#savedDialog'),
  mobileMenu: document.querySelector('#mobileMenu'),
  menuButton: document.querySelector('#menuButton')
};

function getFestival(id) {
  return FESTIVALS.find((festival) => festival.id === id);
}

function pluralize(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function upcomingFestivalsForView() {
  // Keep the current seasonal launch useful after the 2026 window passes.
  const upcoming = getUpcomingFestivals(new Date('2026-10-03T00:00:00'));
  return upcoming.length ? upcoming : FESTIVALS;
}

function renderFestivalRail() {
  el.festivalRail.innerHTML = upcomingFestivalsForView().map((festival, index) => `
    <article class="festival-card ${festival.tone}" data-festival="${festival.id}" tabindex="0" role="button" aria-label="View ${festival.name} ideas">
      <div class="festival-number">0${index + 1}</div>
      <div><p>${festival.month} · ${festival.weekday}</p><h3>${festival.name}</h3><span>${festival.accent}</span></div>
      <time datetime="${festival.date}">${festival.displayDate}</time>
    </article>`).join('');
}

function makeFilter(label, value, type, active = false) {
  return `<button class="chip ${active ? 'is-active' : ''}" data-filter-type="${type}" data-filter-value="${value}" aria-pressed="${active}">${label}</button>`;
}

function renderFilters() {
  el.festivalFilters.innerHTML = [makeFilter('All festivals', 'all', 'festival', state.festival === 'all'), ...upcomingFestivalsForView().map((festival) => makeFilter(festival.name, festival.id, 'festival', state.festival === festival.id))].join('');
  el.categoryFilters.innerHTML = [makeFilter('Everything', 'all', 'category', state.category === 'all'), ...CATEGORIES.map((category) => makeFilter(`${category.icon} ${category.label}`, category.id, 'category', state.category === category.id))].join('');
  const applied = Number(state.festival !== 'all') + Number(state.category !== 'all') + Number(Boolean(state.query));
  el.filterCount.textContent = applied ? `(${applied})` : '';
}

function card(item) {
  const festival = getFestival(item.festival);
  const isSaved = state.saved.has(item.id);
  return `<article class="product-card">
    <div class="product-image ${item.hue} ${item.image ? 'has-photo' : ''}" aria-hidden="true">${item.image ? `<img src="${item.image}" alt="" />` : `<span>${item.visual}</span>`}<span class="image-grain"></span><p>${festival.name}</p></div>
    <div class="product-body">
      <p class="product-category">${CATEGORIES.find((category) => category.id === item.category).label}</p>
      <div class="product-title-line"><h3>${item.title}</h3><button class="save-card ${isSaved ? 'is-saved' : ''}" data-save="${item.id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${item.title}" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button></div>
      <p class="product-detail">${item.detail}</p>
      <div class="product-footer"><span class="source-status"><i></i>${item.price ?? item.sourceStatus}</span><button class="save-link" data-save="${item.id}">${isSaved ? 'Saved' : 'Save idea'} <span aria-hidden="true">↗</span></button></div>
    </div>
  </article>`;
}

function renderProducts() {
  const items = catalog.search(state);
  el.resultsCount.textContent = pluralize(items.length, 'idea');
  el.productGrid.innerHTML = items.map(card).join('');
  el.emptyState.hidden = Boolean(items.length);
}

function renderSaved() {
  const saved = [...state.saved].map((id) => catalog.getById(id)).filter(Boolean);
  el.savedCount.textContent = saved.length;
  el.savedList.innerHTML = saved.length ? saved.map((item) => `<div class="saved-item"><span class="saved-symbol ${item.hue}">${item.visual}</span><div><strong>${item.title}</strong><p>${item.sourceStatus}</p></div><button data-save="${item.id}" class="icon-button" aria-label="Remove ${item.title}">×</button></div>`).join('') : '<div class="saved-empty"><span>♡</span><p>Your favourites will wait here.</p></div>';
}

function render() {
  renderFilters();
  renderProducts();
  renderSaved();
}

function setFestival(id) {
  state.festival = id;
  render();
  document.querySelector('#discover').scrollIntoView({ behavior: 'smooth', block: 'start' });
  Analytics.track('festival_filter_changed', { id });
}

function toggleSaved(id) {
  state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
  render();
  Analytics.track('shortlist_toggled', { id, saved: state.saved.has(id) });
}

document.addEventListener('click', (event) => {
  const filter = event.target.closest('[data-filter-type]');
  const save = event.target.closest('[data-save]');
  const festivalCard = event.target.closest('.festival-card');
  if (filter) {
    state[filter.dataset.filterType] = filter.dataset.filterValue;
    render();
  }
  if (save) toggleSaved(save.dataset.save);
  if (festivalCard) setFestival(festivalCard.dataset.festival);
});

document.querySelector('#openSearch').addEventListener('click', () => {
  el.searchDialog.showModal();
  setTimeout(() => el.searchInput.focus(), 0);
});
el.searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  render();
});
document.querySelector('#savedButton').addEventListener('click', () => el.savedDialog.showModal());
document.querySelectorAll('.close-dialog').forEach((button) => button.addEventListener('click', () => el.savedDialog.close()));
document.querySelector('#clearFilters').addEventListener('click', () => {
  state.festival = 'all'; state.category = 'all'; state.query = ''; el.searchInput.value = ''; render();
});
document.querySelector('#filterButton').addEventListener('click', () => document.querySelector('#festivalFilters').scrollIntoView({ behavior: 'smooth', block: 'center' }));
el.menuButton.addEventListener('click', () => {
  const open = el.mobileMenu.classList.toggle('is-open');
  el.menuButton.setAttribute('aria-expanded', open);
  el.mobileMenu.setAttribute('aria-hidden', !open);
});
document.querySelector('.close-menu').addEventListener('click', () => el.menuButton.click());
document.querySelectorAll('.mobile-menu a').forEach((link) => link.addEventListener('click', () => el.menuButton.click()));
el.festivalRail.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { const card = event.target.closest('.festival-card'); if (card) setFestival(card.dataset.festival); } });

renderFestivalRail();
render();

