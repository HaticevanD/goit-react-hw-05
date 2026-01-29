import { useEffect, useState, useRef } from "react";
import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./MovieDetailsPage.module.css";

const API_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

function MovieDetailsPage() {
  const { movieId } = useParams();
  const location = useLocation();
  const backLinkRef = useRef(location.state?.from ?? "/movies");

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            signal: controller.signal,
          },
        );
        setMovie(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to load movie details. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();

    return () => controller.abort();
  }, [movieId]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!movie) return <div className={styles.notFound}>Movie not found</div>;

  return (
    <div className={styles.container}>
      <Link to={backLinkRef.current} className={styles.backButton}>
        ← Back
      </Link>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/400x600?text=No+Poster"
            }
            alt={movie.title}
            className={styles.poster}
          />

          <div className={styles.details}>
            <h1 className={styles.title}>{movie.title}</h1>

            <p className={styles.overview}>
              {movie.overview || "No overview available."}
            </p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <strong>Release:</strong> {movie.release_date || "N/A"}
              </div>
              <div className={styles.metaItem}>
                <strong>Rating:</strong>{" "}
                {movie.vote_average?.toFixed(1) || "N/A"} / 10
              </div>
              <div className={styles.metaItem}>
                <strong>Genres:</strong>{" "}
                {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
              </div>
              <div className={styles.metaItem}>
                <strong>Runtime:</strong>{" "}
                {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className={styles.subNav}>
        <Link to="cast" className={styles.subLink}>
          Cast
        </Link>
        <Link to="reviews" className={styles.subLink}>
          Reviews
        </Link>
      </nav>

      <div className={styles.outletWrapper}>
        <Outlet />
      </div>
    </div>
  );
}

export default MovieDetailsPage;
