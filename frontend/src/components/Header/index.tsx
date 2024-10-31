import clsx from "clsx";
import { Link } from "wouter";
import Nav from "~/components/Header/Nav";
import Logo from "~/components/Logo";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={clsx("container", styles.container)}>
        <Link to="/">
          <Logo className={styles.logo} />
        </Link>

        <Nav />
      </div>
    </header>
  );
}
