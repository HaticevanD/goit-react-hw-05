import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import css from "./MovieCast.module.css";

const API_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

function MovieCast() {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
          signal: controller.signal,
        },
      )
      .then((res) => setCast(res.data.cast.slice(0, 12) || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [movieId]);

  if (isLoading) return <p>Loading cast...</p>;
  if (cast.length === 0) return <p>No cast information available.</p>;

  return (
    <div className={css.container}>
      <h2>Cast</h2>
      <ul className={css.list}>
        {cast.map((actor) => (
          <li key={actor.id} className={css.actor}>
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/200x300?text=No+Photo"
              }
              alt={actor.name}
              className={css.photo}
            />
            <div className={css.info}>
              <strong>{actor.name}</strong>
              <br />
              <small>as {actor.character || "—"}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieCast;
