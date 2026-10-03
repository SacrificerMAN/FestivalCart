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

## Local order data

Google sign-in is configured with Firebase Authentication. The local-order flow only collects a mobile number and delivery details after the customer is signed in and explicitly agrees to the order-data notice.

Cloud Firestore is intended for the `orders` collection. Before deploying the order form, apply the production rule in `firestore.rules` from the Firebase Console's **Firestore Database → Rules** tab. It permits a signed-in customer to create only their own request and keeps every order private; Firebase Console administrators can still view requests.

## Festival-date sources

- [India Post: All India Holidays 2026](https://www.indiapost.gov.in/holidays-list)
- [National Portal of India: Holiday Calendar](https://www.india.gov.in/calendar)
- [Drik Panchang: 2026 Indian Calendar](https://www.drikpanchang.com/calendars/indian/indiancalendar.html?lang=en)

Dates for lunar festivals can vary by city and local tradition. Always confirm worship timing locally.

