import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import css from "./MovieReviews.module.css";

const API_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

function MovieReviews() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`,
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
          signal: controller.signal,
        },
      )
      .then((res) => setReviews(res.data.results || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [movieId]);

  if (isLoading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews available yet.</p>;

  return (
    <div className={css.container}>
      <h2>Reviews</h2>
      <ul className={css.list}>
        {reviews.map((review) => (
          <li key={review.id} className={css.item}>
            <strong>{review.author}</strong>
            <p>
              {review.content.substring(0, 400)}
              {review.content.length > 400 ? "..." : ""}
            </p>
            <small>{new Date(review.created_at).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieReviews;
