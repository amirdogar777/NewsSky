# NewsSky — Professional React News & Weather Dashboard

A redesigned version of the supplied React project. Includes Home / News / Weather routes, editorial styling, responsive layouts, dark-mode toggle, category browsing, search, saved articles, recent searches, current weather, °C/°F switch, and 4-day weather outlook.

## How to run (VS Code)

1. Open this folder in VS Code.
2. Open the integrated terminal and run `npm install`.
3. Copy `.env.example` to `.env`, then replace `your_gnews_api_key_here` with your **own** GNews API key.
4. Run `npm run dev` and open the localhost address printed in the terminal.

## Main files

- `src/App.jsx` — routes and footer.
- `src/components/Header.jsx` — logo, responsive navigation, dark-mode toggle.
- `src/pages/Home.jsx` — rich landing page.
- `src/components/News.jsx` — GNews integration, search, categories, bookmarks, recent searches.
- `src/components/NewsCard.jsx` — responsive article display and favorite button.
- `src/components/Weather.jsx` — Open-Meteo location and weather APIs, current conditions and 4-day forecast.
- `src/index.css` — the entire responsive visual design.

## Notes

- Weather works without an API key, subject to Open-Meteo's availability. News requires your valid GNews key, quota, and permitted browser access.
- Vite's `VITE_` environment variables are exposed in client-side code. For production, use a backend API proxy if your GNews plan requires keeping the key secret.
- No external stock photos: news article images come from GNews. The home hero art is built with CSS and UI elements.
- Navigation uses React Router; refreshes on nested routes may require your hosting provider's SPA fallback rewrite to `index.html`.
- On some file systems capitalization matters. Component imports use exact file names in this project.
