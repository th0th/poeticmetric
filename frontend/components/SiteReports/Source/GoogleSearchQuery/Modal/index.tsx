import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Button, Modal as BsModal, ModalProps as BsModalProps, OverlayTrigger, Spinner, Table, Tooltip } from "react-bootstrap";
import { pagination } from "../../../../../helpers";
import { useSiteGoogleSearchQueryReport } from "../../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "google-search-query", [router.query.detail]);

  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }, undefined, { scroll: false }),
    [router],
  );

  const { data: rawData, isValidating, setSize } = useSiteGoogleSearchQueryReport();

  const data = useMemo<HydratedSiteGoogleSearchQueryReport>(() => {
    if (rawData === undefined) {
      return [];
    }

    return rawData.reduce<HydratedSiteGoogleSearchQueryReport>((a, v) => [...a, ...v], []);
  }, [rawData]);

  const hasMore = useMemo<boolean>(() => {
    if (rawData === undefined) {
      return false;
    }

    return rawData.slice(-1)[0].length === pagination.pageSize;
  }, [rawData]);

  const handleLoadMoreClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => setSize((s) => s + 1), [setSize]);

  return (
    <BsModal onHide={onHide} show={show} size="lg">
      <BsModal.Header closeButton>
        <BsModal.Title>Google search terms</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        <Table borderless className="fs-sm table-layout-fixed" hover responsive striped>
          <thead>
            <tr>
              <th className="w-8rem">Term</th>

              <th />

              <th className="text-center w-7rem">Position</th>

              <th className="text-center w-7rem">
                CTR

                <OverlayTrigger
                  overlay={(
                    <Tooltip className="fs-xs fw-medium">
                      Click-through rate: Calculated as clicks / impressions * 100.
                    </Tooltip>
                  )}
                  placement="bottom"
                  trigger={["focus", "hover"]}
                >
                  <button className="bg-transparent border-0" type="button">
                    <i className="bi bi-question-circle-fill text-muted" />
                  </button>
                </OverlayTrigger>
              </th>

              <th className="text-center w-7rem">Impressions</th>

              <th className="text-end w-4rem">Clicks</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.query}>
                <td className="parent-d" colSpan={2}>
                  <div className="d-flex flex-row">
                    {d.query}
                  </div>
                </td>

                <td className="fw-medium text-center">
                  <span>{d.position}</span>
                </td>

                <td className="fw-medium text-center">
                  <span>{d.ctr}</span>
                </td>

                <td className="fw-medium text-center">
                  <span title={`${d.impressions} impressions`}>{d.impressionsDisplay}</span>
                </td>

                <td className="fw-medium text-end">
                  <span title={`${d.clicks} visitors`}>{d.clicksDisplay}</span>
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
