import { Link } from "react-router-dom";
import css from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <h2 className={css.subtitle}>Page Not Found</h2>
      <p className={css.message}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className={css.homeLink}>
        Return to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
