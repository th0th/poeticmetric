import Link from "next/link";
import React from "react";
import { Chart } from "./Chart";

export function Version() {
  return (
    <>
      <div className="d-flex flex-column flex-grow-1 flex-shrink-1 pe-3 ps-3">
        <Chart />
      </div>

      <Link
        className="bg-light-hover border-1 border-top d-block fw-semibold mt-auto py-2 text-center text-decoration-none"
        href="/"
        scroll={false}
      >
        See more
      </Link>
    </>
  );
}
