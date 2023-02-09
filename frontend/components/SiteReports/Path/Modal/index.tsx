import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Button, Modal as BsModal, ModalProps as BsModalProps, Spinner, Table } from "react-bootstrap";
import { useSitePathReport } from "../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "path", [router.query.detail]);

  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }, undefined, { scroll: false }),
    [router],
  );
  const { data: rawData, isValidating, setSize } = useSitePathReport();

  const data = useMemo<Array<HydratedSitePathDatum>>(() => {
    if (rawData === undefined) {
      return [];
    }

    return rawData.reduce<Array<HydratedSitePathDatum>>((a, v) => [...a, ...v.data], []);
  }, [rawData]);

  const hasMore = useMemo<boolean>(() => !!(rawData?.at(-1)?.paginationCursor), [rawData]);

  const handleLoadMoreClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => setSize((s) => s + 1), [setSize]);

  return (
    <BsModal onHide={onHide} show={show} size="lg">
      <BsModal.Header closeButton>
        <BsModal.Title>Pages</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        <Table borderless className="fs-sm table-layout-fixed" hover responsive striped>
          <thead>
            <tr>
              <th className="w-8rem">Page</th>

              <th />

              <th className="text-center w-7rem">Visitors</th>

              <th className="text-center w-7rem">Views</th>

              <th className="text-center w-5rem">Duration</th>

              <th className="text-end w-7rem">Bounce rate</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.path}>
                <td className="parent-d" colSpan={2}>
                  <div className="d-flex flex-row">
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      href={{ pathname: router.pathname, query: { ...router.query, path: d.path } }}
                      scroll={false}
                      title={d.path}
                    >
                      {d.path}
                    </Link>

                    <a
                      className="parent-d-block flex-grow-0 flex-shrink-0 lh-1 ms-2 text-black text-primary-hover"
                      href={d.url}
                      rel="noreferrer"
                      target="_blank"
                      title="Go to the page"
                    >
                      <i className="bi bi-box-arrow-up-right h-1rem" />
                    </a>
                  </div>
                </td>
                <td className="fw-medium text-center">
                  <span title={d.visitorCount.toString()}>{d.visitorCountDisplay}</span>
                </td>

                <td className="fw-medium text-center">
                  <span title={d.viewCount.toString()}>{d.viewCountDisplay}</span>
                </td>

                <td className="fw-medium text-center">
                  <span>{d.averageDurationDisplay}</span>
                </td>

                <td className="fw-medium text-end">
                  <span>{d.bouncePercentageDisplay}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {isValidating ? (
          <div className="py-3">
            <Spinner className="d-block mx-auto" variant="primary" />
          </div>
        ) : null}

        {hasMore ? (
          <Button className="d-block mx-auto" disabled={isValidating} onClick={handleLoadMoreClick}>
            Load more
          </Button>
        ) : null}
      </BsModal.Body>
    </BsModal>
  );
}
