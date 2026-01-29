import { Link, useLocation } from "react-router-dom";
import css from "./MovieList.module.css";

function MovieList({ movies }) {
  const location = useLocation();

  return (
    <ul className={css.list}>
      {movies.slice(0, 25).map((movie) => (
        <li key={movie.id} className={css.item}>
          <Link
            to={`/movies/${movie.id}`}
            state={{ from: location }}
            className={css.link}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Poster"
              }
              alt={movie.title}
              className={css.poster}
            />

            {movie.vote_average > 0 && (
              <div className={css.ratingBox}>
                <span className={css.star}>★</span>{" "}
                {movie.vote_average.toFixed(1)}
              </div>
            )}

            <div className={css.infoBox}>
              <h3 className={css.title}>{movie.title}</h3>
              <p className={css.year}>
                {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default MovieList;
