import Link from "next/link";
import { Breadcrumb } from "../..";

export function Header() {
  return (
    <>
      <Breadcrumb title="Sites" />

      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <div className="flex-grow-1" />

        <div className="d-grid">
          <Link className="btn btn-primary" href="/sites/add">Add new site</Link>
        </div>
      </div>
    </>
  );
}
