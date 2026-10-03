export const CATEGORIES = [
  { id: 'decor', label: 'Home & décor', icon: '✦' },
  { id: 'gifting', label: 'Gifting', icon: '⌁' },
  { id: 'wear', label: 'Festive wear', icon: '◒' },
  { id: 'hosting', label: 'Hosting', icon: '◌' },
  { id: 'ritual', label: 'Ritual essentials', icon: '◈' }
];

// Idea records are deliberately provider-neutral. Live price / seller fields are null
// until a marketplace adapter returns a verified, attributed offer.
export const CATALOG = [
  { id: 'diya-evening', title: 'A softly lit diya evening', festival: 'diwali', category: 'decor', hue: 'ember', visual: '🪔', detail: 'Clay diyas, gentle lighting and a warm entryway.', tags: ['diyas', 'lights', 'home', 'deepavali'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'marigold-entry', title: 'Marigold entry moment', festival: 'dussehra', category: 'decor', hue: 'marigold', visual: '✿', detail: 'Garlands and foliage for an easy, welcoming threshold.', tags: ['flowers', 'garland', 'entryway'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'navratri-colour', title: 'Nine nights, one colour story', festival: 'navratri', category: 'wear', hue: 'berry', visual: '◒', detail: 'A starting point for colour-led festive dressing.', tags: ['outfit', 'colour', 'clothing'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'sweet-gesture', title: 'A sweet gesture, beautifully packed', festival: 'diwali', category: 'gifting', hue: 'sugar', visual: '◆', detail: 'Reusable boxes, handwritten notes and treats worth sharing.', tags: ['gift', 'sweets', 'box'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'tablescape', title: 'The long-table invitation', festival: 'christmas', category: 'hosting', hue: 'wine', visual: '◌', detail: 'Layered linens and little details for a lingering dinner.', tags: ['table', 'dinner', 'hosting'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'quiet-prayer', title: 'A quiet prayer corner', festival: 'guru-nanak-jayanti', category: 'ritual', hue: 'sage', visual: '◈', detail: 'A respectful, minimal setting for reflection and gathering.', tags: ['prayer', 'reflection', 'home'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'rangoli-path', title: 'Colour underfoot', festival: 'diwali', category: 'decor', hue: 'ultramarine', visual: '✳', detail: 'A rangoli-inspired welcome with considered colour and texture.', tags: ['rangoli', 'floor', 'welcome'], price: null, sourceStatus: 'Awaiting verified listings' },
  { id: 'host-gift', title: 'The host gift edit', festival: 'christmas', category: 'gifting', hue: 'pine', visual: '✦', detail: 'Small, practical gestures that feel personal, not generic.', tags: ['gift', 'host', 'present'], price: null, sourceStatus: 'Awaiting verified listings' }
];

