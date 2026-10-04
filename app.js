import { FESTIVALS, getUpcomingFestivals } from './data/festivals.js';
import { CATEGORIES } from './data/catalog.js?v=20261005-2';
import { CatalogService } from './services/catalog-service.js?v=20261005-2';
import { Analytics } from './services/analytics.js';
import { AuthService } from './services/auth-service.js';
import { OrdersService } from './services/orders-service.js';

const catalog = new CatalogService();
const auth = new AuthService();
const orders = new OrdersService(auth);
const state = { festival: 'chhath-puja', category: 'all', query: '', saved: new Set(), localOrder: { apple: 0, banana: 0, pomegranate: 0, singhara: 0, seasonalFruit: 0, pujaBasic: false, catalogItems: [] } };

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
  cartDialog: document.querySelector('#cartDialog'),
  cartCount: document.querySelector('#cartCount'),
  cartDialogItems: document.querySelector('#cartDialogItems'),
  mobileMenu: document.querySelector('#mobileMenu'),
  menuButton: document.querySelector('#menuButton'),
  comboCount: document.querySelector('#comboCount'),
  localArea: document.querySelector('#localArea'),
  areaStatus: document.querySelector('#areaStatus'),
  orderStatus: document.querySelector('#orderStatus'),
  localCart: document.querySelector('#localCart'),
  signInButton: document.querySelector('#signInButton'),
  authDialog: document.querySelector('#authDialog'),
  googleSignIn: document.querySelector('#googleSignIn'),
  authStatus: document.querySelector('#authStatus'),
  customerDetails: document.querySelector('#customerDetails'),
  customerPhone: document.querySelector('#customerPhone'),
  customerAddress: document.querySelector('#customerAddress'),
  deliveryDate: document.querySelector('#deliveryDate'),
  orderConsent: document.querySelector('#orderConsent')
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
  const isLocalChhathItem = item.festival === 'chhath-puja' && !item.id.startsWith('affiliate-');
  const affiliateOffer = item.affiliateOffers?.[0];
  const affiliateAction = affiliateOffer
    ? `<a class="affiliate-link" href="${affiliateOffer.url}" target="_blank" rel="sponsored noopener noreferrer">Buy on ${affiliateOffer.marketplace}</a>`
    : '<span class="affiliate-pending">Affiliate link pending</span>';
  const orderAction = isLocalChhathItem
    ? `<button class="local-add-link" data-local-add="${item.id}">${state.localOrder.catalogItems.includes(item.id) ? 'Added to cart' : 'Add to cart'}</button>`
    : affiliateAction;
  const saveAction = isLocalChhathItem ? '' : `<button class="save-link" data-save="${item.id}">${isSaved ? 'Saved' : 'Save idea'}</button>`;
  return `<article class="product-card">
    <div class="product-image ${item.hue} ${item.image ? 'has-photo' : ''}" aria-hidden="true">${item.image ? `<img src="${item.image}" alt="" />` : `<span>${item.visual}</span>`}<span class="image-grain"></span><p>${festival.name}</p></div>
    <div class="product-body">
      <p class="product-category">${CATEGORIES.find((category) => category.id === item.category).label}</p>
      <div class="product-title-line"><h3>${item.title}</h3><button class="save-card ${isSaved ? 'is-saved' : ''}" data-save="${item.id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${item.title}" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button></div>
      <p class="product-detail">${item.detail}</p>
      <div class="product-footer"><span class="source-status"><i></i>${item.price ?? item.sourceStatus}</span><div class="product-actions">${orderAction}${saveAction}</div></div>
    </div>
  </article>`;
}

function renderProducts() {
  const items = catalog.search(state).filter((item) => !item.id.startsWith('affiliate-'));
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

function getLocalCartLines() {
  const fruitNames = { apple: 'Apple', banana: 'Banana', pomegranate: 'Pomegranate', singhara: 'Singhara', seasonalFruit: 'Seasonal fruit' };
  const portions = Object.entries(fruitNames)
    .filter(([id]) => state.localOrder[id] > 0)
    .map(([id, title]) => ({ id, title: `${title} · ${state.localOrder[id]} kg`, removable: false }));
  const pujaBasic = state.localOrder.pujaBasic ? [{ id: 'puja-basic', title: 'Puja essentials basic set', removable: false }] : [];
  const catalogItems = state.localOrder.catalogItems
    .map((id) => catalog.getById(id))
    .filter(Boolean)
    .map((item) => ({ id: item.id, title: item.title, removable: true }));
  return [...portions, ...pujaBasic, ...catalogItems];
}

function renderLocalOrder() {
  const fruits = Object.entries(state.localOrder).filter(([key]) => key !== 'pujaBasic' && key !== 'catalogItems').reduce((sum, [, quantity]) => sum + quantity, 0);
  const extras = state.localOrder.pujaBasic ? 1 : 0;
  const total = fruits + extras + state.localOrder.catalogItems.length;
  el.comboCount.textContent = `${total} ${total === 1 ? 'item' : 'items'}`;
  el.cartCount.textContent = total;
  Object.entries(state.localOrder).filter(([key]) => key !== 'pujaBasic' && key !== 'catalogItems').forEach(([item, quantity]) => {
    document.querySelector(`#qty-${item}`).textContent = `${quantity} kg`;
  });
  document.querySelector('[data-combo="puja-basic"]').classList.toggle('is-selected', state.localOrder.pujaBasic);
  const lines = getLocalCartLines();
  const lineMarkup = lines.map((item) => `<div class="local-cart-row"><span>${item.title}</span>${item.removable ? `<button data-local-remove="${item.id}" aria-label="Remove ${item.title}">Remove</button>` : '<span class="cart-portion">Adjust below</span>'}</div>`).join('');
  el.localCart.innerHTML = lines.length ? `<p class="quantity-label">Your local cart</p>${lineMarkup}` : '';
  el.cartDialogItems.innerHTML = lines.length
    ? lineMarkup
    : '<div class="saved-empty"><span>🛒</span><p>Your cart is empty. Add Chhath items or build a fruit combo first.</p></div>';
}

function addFruitCombo() {
  ['apple', 'banana', 'pomegranate', 'singhara', 'seasonalFruit'].forEach((item) => { state.localOrder[item] += 1; });
  renderLocalOrder();
  Analytics.track('local_combo_selected', { combo: 'fruit-five' });
}

document.addEventListener('click', (event) => {
  const filter = event.target.closest('[data-filter-type]');
  const save = event.target.closest('[data-save]');
  const festivalCard = event.target.closest('.festival-card');
  const quantity = event.target.closest('[data-quantity]');
  const combo = event.target.closest('[data-combo]');
  const localAdd = event.target.closest('[data-local-add]');
  const localRemove = event.target.closest('[data-local-remove]');
  if (filter) {
    state[filter.dataset.filterType] = filter.dataset.filterValue;
    render();
  }
  if (save) toggleSaved(save.dataset.save);
  if (festivalCard) setFestival(festivalCard.dataset.festival);
  if (quantity) {
    const item = quantity.dataset.quantity;
    state.localOrder[item] = Math.max(0, state.localOrder[item] + Number(quantity.dataset.change));
    renderLocalOrder();
  }
  if (combo?.dataset.combo === 'fruit-five') addFruitCombo();
  if (combo?.dataset.combo === 'puja-basic') { state.localOrder.pujaBasic = !state.localOrder.pujaBasic; renderLocalOrder(); }
  if (localAdd) {
    const id = localAdd.dataset.localAdd;
    if (!state.localOrder.catalogItems.includes(id)) state.localOrder.catalogItems.push(id);
    renderLocalOrder();
    renderProducts();
    el.orderStatus.textContent = 'Item added to your cart. Open Cart when you are ready for COD details.';
  }
  if (localRemove) {
    state.localOrder.catalogItems = state.localOrder.catalogItems.filter((id) => id !== localRemove.dataset.localRemove);
    renderLocalOrder();
    renderProducts();
  }
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
document.querySelector('#cartButton').addEventListener('click', () => el.cartDialog.showModal());
document.querySelectorAll('.close-dialog').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelector('#goToCheckout').addEventListener('click', () => {
  el.cartDialog.close();
  document.querySelector('#local-order').scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.localArea.focus({ preventScroll: true });
});
document.querySelector('#clearFilters').addEventListener('click', () => {
  state.festival = 'chhath-puja'; state.category = 'all'; state.query = ''; el.searchInput.value = ''; render();
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
document.querySelector('#checkArea').addEventListener('click', () => {
  const area = el.localArea.value.trim();
  el.areaStatus.textContent = area ? `${area}: local delivery availability will be confirmed by the FestivalCart team.` : 'Enter Chhapra city, your village, or pincode first.';
});
document.querySelector('#orderDraft').addEventListener('click', async () => {
  if (!auth.isSignedIn()) {
    el.authDialog.showModal();
    el.orderStatus.textContent = 'Please sign in with Google before preparing a local order request.';
    Analytics.track('sign_in_required_for_order');
    return;
  }
  const selected = Object.entries(state.localOrder).filter(([key, value]) => key === 'pujaBasic' ? value : key === 'catalogItems' ? value.length > 0 : value > 0);
  const phone = el.customerPhone.value.replace(/\s|-/g, '');
  if (!selected.length) { el.orderStatus.textContent = 'Choose a combo or at least one 1 kg fruit portion first.'; return; }
  if (!/^\d{10}$/.test(phone)) { el.orderStatus.textContent = 'Enter a valid 10-digit mobile number.'; el.customerPhone.focus(); return; }
  if (!el.customerAddress.value.trim()) { el.orderStatus.textContent = 'Enter delivery address or village details.'; el.customerAddress.focus(); return; }
  if (!el.orderConsent.checked) { el.orderStatus.textContent = 'Please confirm consent before sending your order request.'; el.orderConsent.focus(); return; }
  try {
    el.orderStatus.textContent = 'Saving your local order request…';
    await orders.submit({ localOrder: state.localOrder, area: el.localArea.value.trim(), phone, address: el.customerAddress.value.trim(), deliveryDate: el.deliveryDate.value });
    el.orderStatus.textContent = 'Order request saved. FestivalCart team will confirm stock, rate and delivery slot before any payment.';
    Analytics.track('local_order_request_saved', { selected: selected.map(([key]) => key) });
  } catch (error) {
    el.orderStatus.textContent = 'Order database is not enabled yet. Please try again after the FestivalCart team completes setup.';
    Analytics.track('local_order_request_failed', { reason: error.code || 'database_unavailable' });
  }
});

function openAuthDialog() {
  el.authStatus.textContent = auth.isConfigured()
    ? 'Sign in securely with Google to continue.'
    : 'Google sign-in needs the FestivalCart Firebase web configuration before it can be turned on.';
  el.googleSignIn.disabled = !auth.isConfigured();
  el.authDialog.showModal();
}

function updateAuthUi(user) {
  if (user) {
    el.signInButton.textContent = `Hi, ${user.displayName?.split(' ')[0] || 'there'}`;
    el.signInButton.classList.add('is-signed-in');
    el.signInButton.setAttribute('aria-label', 'You are signed in with Google');
    el.orderStatus.textContent = 'Signed in. Choose your combo, then prepare your local order request.';
    el.customerDetails.hidden = false;
    document.querySelector('#orderDraft').textContent = 'Save local order request ↗';
    orders.initialize().catch(() => { el.orderStatus.textContent = 'Order database is being prepared.'; });
  } else {
    el.signInButton.textContent = 'Sign in';
    el.signInButton.classList.remove('is-signed-in');
    el.customerDetails.hidden = true;
    document.querySelector('#orderDraft').textContent = 'Sign in to prepare order ↗';
  }
}

el.signInButton.addEventListener('click', openAuthDialog);
document.querySelector('#closeAuth').addEventListener('click', () => el.authDialog.close());
el.googleSignIn.addEventListener('click', async () => {
  try {
    el.googleSignIn.disabled = true;
    el.authStatus.textContent = 'Opening secure Google sign-in…';
    await auth.signIn();
    el.authDialog.close();
    Analytics.track('google_sign_in_completed');
  } catch (error) {
    el.authStatus.textContent = error.message || 'Google sign-in could not be completed. Please try again.';
    el.googleSignIn.disabled = false;
    Analytics.track('google_sign_in_failed');
  }
});

renderFestivalRail();
render();
renderLocalOrder();
auth.initialize(updateAuthUi).catch(() => {
  el.authStatus.textContent = 'Google sign-in configuration could not be loaded.';
});

