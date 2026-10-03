# FestivalCart

FestivalCart is a mobile-first, static front end for discovering thoughtful shopping ideas around Indian festivals. It intentionally ships with **no marketplace prices, seller claims, or affiliate links**: those need verified live-source integrations.

## What is included

- Upcoming 2026 festival dates from official Indian holiday calendars, with a local-panchang caveat for regional observances.
- Search plus festival and category filters.
- Responsive navigation, mobile filter sheet, shortlist interactions, and accessible keyboard controls.
- An original AI-generated cinematic hero visual, committed locally at `assets/images/festival-evening-hero.png`.
- A small service boundary so verified marketplace discovery, price comparison, profit tools, advertising generation, affiliate routing, and analytics can be added without replacing the UI.

## Run and test

```bash
npm test
npm run check
npm start
```

Open `http://localhost:4173` after starting the local server.

## Future modules

| Module | Integration point |
| --- | --- |
| Verified marketplace discovery | `CatalogService.search()` and a provider adapter |
| Price comparison | normalized offer records attached to catalog items |
| Profit calculations | a pricing service consuming normalized offers |
| Ads generation | a campaign adapter consuming shortlisted item metadata |
| Affiliate links | a source-link resolver after disclosure and compliance review |
| Analytics | `Analytics.track()` event boundary |

## Festival-date sources

- [India Post: All India Holidays 2026](https://www.indiapost.gov.in/holidays-list)
- [National Portal of India: Holiday Calendar](https://www.india.gov.in/calendar)
- [Drik Panchang: 2026 Indian Calendar](https://www.drikpanchang.com/calendars/indian/indiancalendar.html?lang=en)

Dates for lunar festivals can vary by city and local tradition. Always confirm worship timing locally.
