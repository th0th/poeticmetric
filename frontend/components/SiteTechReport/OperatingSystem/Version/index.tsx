import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Chart } from "./Chart";
import { Modal } from "./Modal";

export function Version() {
  const router = useRouter();

  return (
    <>
      <div className="d-flex flex-column flex-grow-1 flex-shrink-1 pe-3 ps-3">
        <Chart />
      </div>

      <Link
        className="bg-light-hover border-1 border-top d-block fw-semibold mb-n3 mt-auto mx-n3 p-2 rounded-bottom text-center text-decoration-none"
        href={{ pathname: router.pathname, query: { ...router.query, detail: "operating-system-version" } }}
        scroll={false}
      >
        See more
      </Link>

      <Modal />
    </>
  );
}
