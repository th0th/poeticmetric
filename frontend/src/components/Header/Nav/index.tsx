import clsx from "clsx";
import { Link } from "wouter";

export default function Nav() {
  return (
    <div className="flex gap-5 text-sm font-medium text-foreground/60">
      <Link className={(active) => clsx(active && "text-foreground")} to="/">Home</Link>

      <Link to="/manifesto">Manifesto</Link>

      <Link to="/pricing">Pricing</Link>

      <Link to="/docs">Docs</Link>
    </div>
  );
}
