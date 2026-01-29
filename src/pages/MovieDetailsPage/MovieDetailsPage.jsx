import { useEffect, useState, useRef } from "react";
import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import css from "./MovieDetailsPage.module.css";

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

  if (isLoading) {
    return <div className={css.loading}>Loading movie details...</div>;
  }

  if (error) {
    return <div className={css.error}>{error}</div>;
  }

  if (!movie) {
    return <div className={css.notFound}>Movie not found</div>;
  }

  return (
    <div className={css.container}>
      <Link to={backLinkRef.current} className={css.backButton}>
        ← Back
      </Link>

      <div className={css.movieWrapper}>
        <div className={css.posterContainer}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/400x600?text=No+Poster"
            }
            alt={movie.title}
            className={css.poster}
          />
        </div>

        <div className={css.detailsContainer}>
          <h1 className={css.title}>{movie.title}</h1>

          <p className={css.overview}>
            {movie.overview || "No overview available."}
          </p>

          <div className={css.meta}>
            <div className={css.metaItem}>
              <strong>Release Date:</strong> {movie.release_date || "N/A"}
            </div>
            <div className={css.metaItem}>
              <strong>Rating:</strong> {movie.vote_average?.toFixed(1) || "N/A"}{" "}
              / 10
            </div>
            <div className={css.metaItem}>
              <strong>Genres:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
            </div>
            <div className={css.metaItem}>
              <strong>Runtime:</strong>{" "}
              {movie.runtime ? `${movie.runtime} min` : "N/A"}
            </div>
          </div>
        </div>
      </div>

      <nav className={css.subNav}>
        <Link to="cast" className={css.subLink}>
          Cast
        </Link>
        <Link to="reviews" className={css.subLink}>
          Reviews
        </Link>
      </nav>

      <div className={css.outletWrapper}>
        <Outlet />
      </div>
    </div>
  );
}

export default MovieDetailsPage;
