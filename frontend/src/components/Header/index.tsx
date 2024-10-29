import { Link } from "wouter";
import Nav from "~/components/Header/Nav";
import Logo from "~/components/Logo";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container-default flex items-center gap-6 py-4">
        <Link to="/">
          <Logo className="block h-8" />
        </Link>

        <Nav />
      </div>
    </header>
  );
}
