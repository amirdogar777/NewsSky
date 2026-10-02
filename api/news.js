
export default async function handler(req, res) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GNews API key missing",
    });
  }

  const { mode, q, category } = req.query;

  const endpoint =
    mode === "search" ? "search" : "top-headlines";

  const params = new URLSearchParams({
    lang: "en",
    max: "10",
    apikey: apiKey,
  });

  if (mode === "search") {
    if (!q) {
      return res.status(400).json({
        error: "Search keyword required",
      });
    }
    params.set("q", q);
  } else {
    params.set("category", category || "general");
    params.set("country", "pk");
  }

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/${endpoint}?${params}`
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Unable to fetch news",
    });
  }
}
