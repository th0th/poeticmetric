import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Button, Modal as BsModal, ModalProps as BsModalProps, Spinner, Table } from "react-bootstrap";
import { useSiteCountryReport } from "../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "country", [router.query.detail]);

  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }, undefined, { scroll: false }),
    [router],
  );
  const { data: rawData, isValidating, setSize } = useSiteCountryReport();

  const data = useMemo<Array<HydratedSiteCountryDatum>>(() => {
    if (rawData === undefined) {
      return [];
    }

    return rawData.reduce<Array<HydratedSiteCountryDatum>>((a, v) => [...a, ...v.data], []);
  }, [rawData]);

  const hasMore = useMemo<boolean>(() => !!(rawData?.at(-1)?.paginationCursor), [rawData]);

  const handleLoadMoreClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => setSize((s) => s + 1), [setSize]);

  return (
    <BsModal onHide={onHide} show={show}>
      <BsModal.Header closeButton>
        <BsModal.Title>Countries</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        <Table borderless className="fs-sm table-layout-fixed" hover responsive striped>
          <thead>
            <tr>
              <th className="w-8rem">Country</th>

              <th />

              <th className="text-center w-7rem">Visitors</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.countryIsoCode}>
                <td className="parent-d" colSpan={2}>
                  <div className="d-flex flex-row">
                    <Link
                      className="align-items-center d-flex parent-text-decoration flex-row text-body text-decoration-none"
                      href={{ pathname: router.pathname, query: { ...router.query, countryIsoCode: d.countryIsoCode } }}
                      scroll={false}
                      title={d.country}
                    >
                      <span className={`fi fi-${d.countryIsoAlpha2Code} fis me-1 rounded-circle text-decoration-none`} />

                      <span className="parent-hover-text-decoration-underline text-truncate">{d.country}</span>
                    </Link>
                  </div>
                </td>

                <td className="fw-medium text-center">
                  <span title={d.visitorCount.toString()}>{d.visitorCountDisplay}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {isValidating ? (
          <div className="py-3">
            <Spinner className="d-block mx-auto" />
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
