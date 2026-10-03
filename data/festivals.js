export const FESTIVALS = [
  {
    id: 'navratri',
    name: 'Sharad Navratri',
    date: '2026-10-11',
    displayDate: '11 Oct',
    weekday: 'Sunday',
    month: 'October',
    tone: 'rose',
    accent: 'Nine nights of colour'
  },
  {
    id: 'dussehra',
    name: 'Dussehra',
    date: '2026-10-20',
    displayDate: '20 Oct',
    weekday: 'Tuesday',
    month: 'October',
    tone: 'saffron',
    accent: 'A celebration of courage'
  },
  {
    id: 'diwali',
    name: 'Diwali',
    date: '2026-11-08',
    displayDate: '08 Nov',
    weekday: 'Sunday',
    month: 'November',
    tone: 'violet',
    accent: 'Light, warmth, togetherness'
  },
  {
    id: 'guru-nanak-jayanti',
    name: 'Guru Nanak Jayanti',
    date: '2026-11-24',
    displayDate: '24 Nov',
    weekday: 'Tuesday',
    month: 'November',
    tone: 'teal',
    accent: 'A day of reflection'
  },
  {
    id: 'christmas',
    name: 'Christmas',
    date: '2026-12-25',
    displayDate: '25 Dec',
    weekday: 'Friday',
    month: 'December',
    tone: 'pine',
    accent: 'Gather in good cheer'
  }
];

export function getUpcomingFestivals(from = new Date()) {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  return FESTIVALS.filter((festival) => new Date(`${festival.date}T00:00:00`) >= date);
}

