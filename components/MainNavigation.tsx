import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const { data: session } = useSession();

  const logoutHandler = async () => {
    const data = await signOut({ redirect: false });

    signIn();
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>iRemember</div>
      {session && (
        <nav>
          <ul>
            <li>
              <Link href="/add-bookmark">Add</Link>
            </li>
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default MainNavigation;
