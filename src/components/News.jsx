import { useCallback, useEffect, useState } from "react";

import {
  ArrowRight,
  Bookmark,
  Clock3,
  Compass,
  Inbox,
  RefreshCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import NewsCard from "./NewsCard.jsx";

const categories = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

const safeRead = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export default function News() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() =>
    safeRead("favoriteNews", [])
  );

  const [recent, setRecent] = useState(() =>
    safeRead("newssky-recent-searches", [])
  );

  const [savedOnly, setSavedOnly] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState("");

  // FETCH NEWS USING VITE PROXY

  const fetchNews = useCallback(
    async (
      keyword = "",
      selectedCategory = "general",
      signal
    ) => {
      setLoading(true);
      setError("");

      const apiKey =
        import.meta.env.VITE_GNEWS_API_KEY;

      if (
        !apiKey ||
        apiKey === "your_gnews_api_key_here"
      ) {
        setArticles([]);
        setError(
          "Add your GNews API key to the .env file."
        );
        setLoading(false);
        return;
      }

      try {
        // IMPORTANT:
        // Direct GNews URL removed.
        // Requests now go through the Vite proxy.

        const url = keyword
          ? `/api/news/search?q=${encodeURIComponent(
              keyword
            )}&lang=en&max=10&apikey=${encodeURIComponent(
              apiKey
            )}`
          : `/api/news/top-headlines?category=${encodeURIComponent(
              selectedCategory
            )}&lang=en&country=pk&max=10&apikey=${encodeURIComponent(
              apiKey
            )}`;

        const response = await fetch(url, {
          signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Invalid API key. Please check your GNews key."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "Access denied. Check your GNews API permissions."
            );
          }

          if (response.status === 429) {
            throw new Error(
              "GNews request limit reached. Please try again later."
            );
          }

          throw new Error(
            "Could not load news. Please try again."
          );
        }

        const data = await response.json();

        if (!signal?.aborted) {
          setArticles(
            (data.articles || []).map((a) => ({
              id: a.url,
              title: a.title,
              description: a.description,
              date: new Date(
                a.publishedAt
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              image: a.image,
              url: a.url,
              category: keyword
                ? "SEARCH RESULT"
                : selectedCategory.toUpperCase(),
            }))
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Something went wrong."
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  // FETCH ON CATEGORY OR SEARCH CHANGE

  useEffect(() => {
    const controller = new AbortController();

    if (!savedOnly) {
      fetchNews(
        activeKeyword,
        category,
        controller.signal
      );
    }

    return () => controller.abort();
  }, [
    category,
    activeKeyword,
    savedOnly,
    fetchNews,
  ]);

  // SAVE FAVORITES

  useEffect(() => {
    localStorage.setItem(
      "favoriteNews",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // SAVE RECENT SEARCHES

  useEffect(() => {
    localStorage.setItem(
      "newssky-recent-searches",
      JSON.stringify(recent)
    );
  }, [recent]);

  // SEARCH FUNCTION

  function doSearch(term) {
    const value = term.trim();

    setSearch(value);
    setSavedOnly(false);
    setActiveKeyword(value);

    if (value) {
      setRecent((old) =>
        [
          value,
          ...old.filter(
            (v) =>
              v.toLowerCase() !==
              value.toLowerCase()
          ),
        ].slice(0, 5)
      );
    }
  }

  // CATEGORY FUNCTION

  function chooseCategory(item) {
    setCategory(item);
    setSearch("");
    setActiveKeyword("");
    setSavedOnly(false);
  }

  // FAVORITES FUNCTION

  function toggleFavorite(article) {
    setFavorites((old) =>
      old.some((a) => a.id === article.id)
        ? old.filter(
            (a) => a.id !== article.id
          )
        : [article, ...old]
    );
  }

  // RETRY FUNCTION

  function retryNews() {
    fetchNews(activeKeyword, category);
  }

  const displayArticles = savedOnly
    ? favorites
    : articles;

  return (
    <div className="news-page shell page-enter">

      {/* PAGE HEADER */}

      <section className="page-heading">
        <span className="eyebrow dark-eyebrow">
          <span className="live-pulse" />
          YOUR DAILY BRIEFING
        </span>

        <div className="heading-line">
          <div>
            <h1>
              Stay in the <em>know.</em>
            </h1>

            <p>
              Good stories. Fresh perspectives.
              All in one place.
            </p>
          </div>

          <div className="heading-mark">
            <Compass
              size={49}
              strokeWidth={1}
            />
          </div>
        </div>
      </section>

      {/* SEARCH TOOLBAR */}

      <div className="news-toolbar">

        <form
          className="news-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            doSearch(search);
          }}
        >
          <Search size={20} />

          <input
            aria-label="Search news"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search stories, topics, anything..."
          />

          <button
            className="search-action"
            type="submit"
          >
            Search
            <ArrowRight size={17} />
          </button>
        </form>

        <button
          className={
            "saved-toggle " +
            (savedOnly ? "selected" : "")
          }
          onClick={() =>
            setSavedOnly((v) => !v)
          }
        >
          <Bookmark
            size={18}
            fill={
              savedOnly
                ? "currentColor"
                : "none"
            }
          />

          Saved
          <span>{favorites.length}</span>
        </button>
      </div>

      {/* RECENT SEARCHES */}

      {recent.length > 0 && !savedOnly && (
        <div className="recent-bar">

          <Clock3 size={15} />

          <span>RECENT:</span>

          {recent.map((term) => (
            <button
              key={term}
              onClick={() =>
                doSearch(term)
              }
            >
              {term}
            </button>
          ))}

          <button
            className="clear-recent"
            title="Clear recent searches"
            aria-label="Clear recent searches"
            onClick={() =>
              setRecent([])
            }
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* NEWS SECTION HEADING */}

      <div className="news-section-head">

        <div>
          <span className="eyebrow dark-eyebrow">

            {savedOnly
              ? "YOUR COLLECTION"
              : activeKeyword
              ? "SEARCH RESULTS"
              : "EXPLORE BY INTEREST"}

          </span>

          <h2>
            {savedOnly
              ? "Saved for later"
              : activeKeyword
              ? `Results for “${activeKeyword}”`
              : "The latest stories"}
          </h2>
        </div>

        <span className="results-note">
          {savedOnly
            ? `${favorites.length} saved articles`
            : "Curated for the curious"}
        </span>

      </div>

      {/* CATEGORY FILTER */}

      {!savedOnly && (
        <div
          className="category-pills"
          aria-label="News categories"
        >

          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item &&
                !activeKeyword
                  ? "selected"
                  : ""
              }
              onClick={() =>
                chooseCategory(item)
              }
            >
              {item[0].toUpperCase() +
                item.slice(1)}
            </button>
          ))}

        </div>
      )}

      {/* LOADING STATE */}

      {loading && !savedOnly ? (

        <div
          className="news-grid"
          aria-label="Loading news"
        >

          {Array.from(
            { length: 6 },
            (_, i) => (
              <div
                key={i}
                className={
                  "skeleton-card " +
                  (i === 0
                    ? "skeleton-featured"
                    : "")
                }
              >
                <div className="skeleton-image shimmer" />

                <div className="skeleton-detail">
                  <div className="skeleton-line short shimmer" />
                  <div className="skeleton-line shimmer" />
                  <div className="skeleton-line shimmer" />
                  <div className="skeleton-line medium shimmer" />
                </div>
              </div>
            )
          )}

        </div>

      ) : error && !savedOnly ? (

        /* ERROR STATE */

        <div className="state-card">

          <span className="state-icon">
            <RefreshCcw size={26} />
          </span>

          <h3>
            We hit a little turbulence.
          </h3>

          <p>{error}</p>

          <button
            className="primary-btn"
            onClick={retryNews}
          >
            Try again
            <ArrowRight size={17} />
          </button>

        </div>

      ) : displayArticles.length === 0 ? (

        /* EMPTY STATE */

        <div className="state-card">

          <span className="state-icon">
            <Inbox size={30} />
          </span>

          <h3>
            {savedOnly
              ? "Nothing saved just yet."
              : "No stories found."}
          </h3>

          <p>
            {savedOnly
              ? "Tap the bookmark on any article to keep it here."
              : "Try another keyword or explore a different category."}
          </p>

          {savedOnly && (
            <button
              className="primary-btn"
              onClick={() =>
                setSavedOnly(false)
              }
            >
              Explore stories
              <ArrowRight size={17} />
            </button>
          )}

        </div>

      ) : (

        /* NEWS ARTICLES */

        <>
          <div className="feed-meta">

            <span>
              <Sparkles size={15} />

              {displayArticles.length}

              {savedOnly
                ? " saved stories"
                : " stories to explore"}
            </span>

            <span>
              NEWSSKY EDITION
            </span>

          </div>

          <div className="news-grid">

            {displayArticles.map(
              (article, i) => (

                <NewsCard
                  key={article.id}
                  article={article}
                  featured={i === 0}
                  isFavorite={favorites.some(
                    (a) =>
                      a.id === article.id
                  )}
                  onFavorite={
                    toggleFavorite
                  }
                />

              )
            )}

          </div>
        </>

      )}

    </div>
  );
}