import Link from "next/link";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>I Remember</div>
      <nav>
        <ul>
          <li>
            <Link href="/login">Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
