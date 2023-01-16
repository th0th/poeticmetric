import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useSiteBrowserNameReport } from "../../../../../hooks";
import { NoData } from "../../../NoData";
import { Chart } from "./Chart";
import { Modal } from "./Modal";

export function Name() {
  const router = useRouter();
  const { data } = useSiteBrowserNameReport();

  const contentNode = useMemo<React.ReactNode>(() => {
    if (data === undefined) {
      return (
        <Spinner className="m-auto" variant="primary" />
      );
    }

    if (data[0].data.length === 0) {
      return (
        <NoData />
      );
    }

    return (
      <>
        <div className="d-flex flex-column flex-grow-1 flex-shrink-1">
          <Chart />
        </div>

        <Link
          className="bg-light-hover border-1 border-top d-block fw-semibold mb-n3 mt-auto mx-n3 p-2 rounded-bottom text-center text-decoration-none"
          href={{ pathname: router.pathname, query: { ...router.query, detail: "browser-name" } }}
          scroll={false}
        >
          See more
        </Link>

        <Modal />
      </>
    );
  }, [data, router.pathname, router.query]);

  return (
    <>{contentNode}</>
  );
}
