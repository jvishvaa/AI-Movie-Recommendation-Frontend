import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingReco, setLoadingReco] = useState(false);

  // 🔍 Search movies
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/search?query=${query}`
      );
      const data = await response.json();
      setResults(data?.results || []);
      setRecommendations([]); // reset previous recommendations
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // 🤖 Fetch AI Recommendations
  const getRecommendations = async (movieId) => {
    try {
      setLoadingReco(true);
      const response = await fetch(
        `http://127.0.0.1:8000/recommend?movie_id=${movieId}`
      );
      const data = await response.json();
      setRecommendations(data || []);
    } catch (err) {
      console.log("Recommendation Error:", err);
    } finally {
      setLoadingReco(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">

      {/* 🔹 HERO / LANDING */}
      <header className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          AI Movie Recommendation Engine
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
          Discover movies intelligently using semantic AI similarity.
          Powered by NLP embeddings & cosine similarity.
        </p>

        {/* 🔍 Search */}
        <div className="mt-10 flex justify-center gap-3 flex-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies like Interstellar..."
            className="px-4 py-3 w-80 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
          >
            Search
          </button>
        </div>
      </header>

      {/* 🔹 SEARCH RESULTS */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        {results.length > 0 && (
          <h2 className="text-2xl font-bold mb-6 text-center">
            Search Results
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:scale-105 transition"
            >
              {/* 🎬 Image */}
              <div className="relative">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />

                {/* ⭐ Rating */}
                <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </div>
              </div>

              {/* 📝 Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {movie.title}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                  {movie.overview || "No description available."}
                </p>

                {/* 🤖 Recommend Button */}
                <button
                  onClick={() => getRecommendations(movie.id)}
                  className="w-full py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 transition text-sm font-semibold"
                >
                  Get AI Recommendations
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 AI RECOMMENDATIONS */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        {loadingReco && (
          <p className="text-center text-gray-400">
            🤖 Generating AI recommendations...
          </p>
        )}

        {recommendations.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              AI Recommended Movies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendations.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {movie.title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-3">
                      {movie.overview || "No description available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
