import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Button, Modal as BsModal, ModalProps as BsModalProps, Spinner, Table } from "react-bootstrap";
import { useSiteOperatingSystemVersionReport } from "../../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "operating-system-version", [router.query.detail]);

  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }, undefined, { scroll: false }),
    [router],
  );

  const { data: rawData, isValidating, setSize } = useSiteOperatingSystemVersionReport();

  const data = useMemo<Array<HydratedSiteOperatingSystemVersionDatum>>(() => {
    if (rawData === undefined) {
      return [];
    }

    return rawData.reduce<Array<HydratedSiteOperatingSystemVersionDatum>>((a, v) => [...a, ...v.data], []);
  }, [rawData]);

  const hasMore = useMemo<boolean>(() => !!(rawData?.at(-1)?.paginationCursor), [rawData]);

  const handleLoadMoreClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => setSize((s) => s + 1), [setSize]);

  return (
    <BsModal onHide={onHide} show={show}>
      <BsModal.Header closeButton>
        <BsModal.Title>Operating system versions</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        <Table borderless className="fs-sm table-layout-fixed" hover responsive striped>
          <thead>
            <tr>
              <th className="w-8rem">Version</th>

              <th />

              <th className="text-end w-7rem">Visitors</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.operatingSystemVersion}>
                <td className="parent-d" colSpan={2}>
                  <div className="d-flex flex-row">
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      href={{ pathname: router.pathname, query: { ...router.query, operatingSystemVersion: d.operatingSystemVersion } }}
                      scroll={false}
                      title={d.operatingSystemVersion}
                    >
                      {d.operatingSystemVersion}
                    </Link>
                  </div>
                </td>

                <td className="fw-medium text-end">
                  <span title={`${d.visitorCount} visitors`}>{d.visitorCountDisplay}</span>
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
