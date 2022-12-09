import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { Button, Modal as BsModal, ModalProps as BsModalProps, Table } from "react-bootstrap";
import { useSitePathVisitorCountReport } from "../../../../hooks";

export function Modal() {
  const router = useRouter();
  const show = useMemo<BsModalProps["show"]>(() => router.query.detail === "path-visitor", [router.query.detail]);
  const onHide = useCallback<Exclude<BsModalProps["onHide"], undefined>>(
    () => router.push({ pathname: router.pathname, query: omit(router.query, "detail") }),
    [router],
  );
  const { data: rawData, setSize, size } = useSitePathVisitorCountReport();
  const data = useMemo<Array<HydratedSitePathVisitorCountDatum>>(() => {
    if (rawData === undefined) {
      return [];
    }

    return rawData.reduce<Array<HydratedSitePathVisitorCountDatum>>((a, v) => [...a, ...v.data], []);
  }, [rawData]);

  const handleLoadMoreClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => setSize((s) => s + 1), []);

  return (
    <BsModal onHide={onHide} show={show}>
      <BsModal.Header closeButton>
        <BsModal.Title>Page visitor counts</BsModal.Title>
      </BsModal.Header>

      <BsModal.Body>
        <Table className="fss-1" responsive striped>
          <thead>
            <tr>
              <th>Page</th>

              <th className="w-7rem">Visitor count</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, i) => (
              <tr key={d.path}>
                <td>{d.path}</td>

                <td>{d.visitorCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button className="d-block mx-auto" onClick={handleLoadMoreClick}>
          Load more
        </Button>
      </BsModal.Body>
    </BsModal>
  );
}
