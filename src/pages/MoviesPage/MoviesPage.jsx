import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MovieList from "../../components/MovieList/MovieList";
import css from "./MoviesPage.module.css";

const API_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = searchParams.get("query")?.trim() || "";

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const searchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
          {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            signal: controller.signal,
          },
        );
        setMovies(response.data.results || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Search failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();

    return () => controller.abort();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuery = e.target.elements.query.value.trim();
    setSearchParams(newQuery ? { query: newQuery } : {});
  };

  return (
    <div className={css.container}>
      <div className={css.searchSection}>
        <h1 className={css.title}>Search Movies</h1>

        <form onSubmit={handleSubmit} className={css.form}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Enter movie title..."
            className={css.input}
            autoComplete="off"
          />
          <button type="submit" className={css.button}>
            Search
          </button>
        </form>
      </div>

      {isLoading && <p className={css.loading}>Searching...</p>}

      {error && <p className={css.error}>{error}</p>}

      {query && !isLoading && movies.length === 0 && !error && (
        <p className={css.noResults}>No results found for "{query}"</p>
      )}

      {movies.length > 0 && <MovieList movies={movies} />}
    </div>
  );
}

export default MoviesPage;
