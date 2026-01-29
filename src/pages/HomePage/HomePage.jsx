import { useEffect, useState } from "react";
import axios from "axios";
import MovieList from "../../components/MovieList/MovieList";
import css from "./HomePage.module.css";

const API_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrendingMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
          {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            signal: controller.signal,
          },
        );
        setMovies(response.data.results || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to load trending movies");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();

    return () => controller.abort();
  }, []);

  return (
    <div className={css.container}>
      <h1 className={css.title}>Trending Movies Today</h1>

      {isLoading && <p className={css.loading}>Loading...</p>}
      {error && <p className={css.error}>{error}</p>}

      {!isLoading && !error && <MovieList movies={movies} />}
    </div>
  );
}

export default HomePage;
