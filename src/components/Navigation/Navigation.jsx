import { NavLink } from "react-router-dom";
import clsx from "clsx";
import css from "./Navigation.module.css";

function Navigation() {
  return (
    <nav className={css.nav}>
      <ul className={css.list}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(css.link, { [css.active]: isActive })
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              clsx(css.link, { [css.active]: isActive })
            }
          >
            Movies
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
