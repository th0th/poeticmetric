import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Modal as BsModal, ModalProps as BsModalProps, Spinner, Table } from "react-bootstrap";
import { useSiteCountryReport } from "../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "country", [router.query.detail]);

  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }, undefined, { scroll: false }),
    [router],
  );
  const { data } = useSiteCountryReport();

  return (
    <BsModal onHide={onHide} show={show}>
      <BsModal.Header closeButton>
        <BsModal.Title>Countries</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        {data === undefined ? (
          <Spinner />
        ) : (
          <Table borderless className="fs-sm table-layout-fixed" hover responsive striped>
            <thead>
              <tr>
                <th className="w-8rem">Country</th>

                <th />

                <th className="text-end w-7rem">Visitors</th>
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
                        <span className={`fi fi-${d.countryIsoAlpha2Code} fis me-1 rounded-circle shadow-sm text-decoration-none`} />

                        <span className="parent-hover-text-decoration-underline text-truncate">{d.country}</span>
                      </Link>
                    </div>
                  </td>

                  <td className="fw-medium text-end">
                    <span title={d.visitorCount.toString()}>{d.visitorCountDisplay}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </BsModal.Body>
    </BsModal>
  );
}
