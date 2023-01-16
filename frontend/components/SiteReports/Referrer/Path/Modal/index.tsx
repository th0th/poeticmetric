import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Button, Modal as BsModal, ModalProps as BsModalProps, Spinner, Table } from "react-bootstrap";
import { FavIcon } from "../../../..";
import { useSiteReferrerPathReport } from "../../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "referrer-path", [router.query.detail]);

  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }, undefined, { scroll: false }),
    [router],
  );
  const { data: rawData, isValidating, setSize } = useSiteReferrerPathReport();

  const data = useMemo<Array<HydratedSiteReferrerPathDatum>>(() => {
    if (rawData === undefined) {
      return [];
    }

    return rawData.reduce<Array<HydratedSiteReferrerPathDatum>>((a, v) => [...a, ...v.data], []);
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

              <th className="text-end w-7rem">Visitors</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent-d" key={d.referrerPath}>
                <td colSpan={2}>
                  <div className="align-items-center d-flex flex-grow-1 flex-row min-w-0 pe-1">
                    <Link
                      className="align-items-center d-flex flex-row min-w-0 text-body text-decoration-none text-decoration-underline-hover"
                      href={{ pathname: router.pathname, query: { ...router.query, referrer: d.referrer } }}
                      scroll={false}
                      title={d.referrer}
                    >
                      <FavIcon alt={d.domain} className="d-block flex-shrink-0 me-1" domain={d.domain} size={16} />

                      <span className="text-truncate">{d.referrer}</span>
                    </Link>

                    <a
                      className="parent-d-block flex-grow-0 flex-shrink-0 lh-1 ms-2 text-black text-primary-hover"
                      href={d.referrer}
                      rel="noreferrer"
                      target="_blank"
                      title="Go to the page"
                    >
                      <i className="bi-box-arrow-up-right h-1rem" />
                    </a>
                  </div>
                </td>

                <td className="fw-medium text-end">
                  <span title={`${d.visitorCount.toString()} visitors`}>{d.visitorCountDisplay}</span>
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
