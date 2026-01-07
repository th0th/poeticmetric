import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "react-router";
import Portal from "~/components/Portal";
import useSite from "~/hooks/api/useSite";
import useSites from "~/hooks/api/useSites";
import { api } from "~/lib/api";
import { NewError } from "~/lib/errors";

type State = {
  isHiding: boolean;
  isInProgress: boolean;
};

export default function DeleteModal() {
  const { showBoundary } = useErrorBoundary();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<State>({ isHiding: false, isInProgress: false });
  const siteID = useMemo(() => Number(searchParams.get("siteID")) || undefined, [searchParams]);
  const { data: site, error: siteError } = useSite(siteID);
  const { mutate } = useSites();

  async function confirm() {
    try {
      setState((s) => ({ ...s, isInProgress: true }));
      const response = await api.delete(`/sites/${siteID}`);

      if (response.ok) {
        await mutate();
        hide();
      }
    } catch (error) {
      showBoundary(NewError(error));
    } finally {
      setState((s) => ({ ...s, isInProgress: false }));
    }
  }

  function handleExited() {
    setSearchParams((searchParams) => {
      searchParams.delete("action");
      searchParams.delete("siteID");

      return searchParams;
    }, { preventScrollReset: true });
    setState((s) => ({ ...s, isHiding: false }));
  }

  function hide() {
    setState((s) => ({ ...s, isHiding: true }));
  }

  return (
    <Portal>
      <Modal centered onExited={handleExited} onHide={hide} show={siteID !== undefined && !state.isHiding}>
        <Modal.Header closeButton>
          <Modal.Title>Delete site</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {site !== undefined ? (
            <>
              Are you sure you want to delete team member
              {" "}
              <span className="fw-semi-bold">{site?.name}</span>
              ?
            </>
          ) : (
            <>
              {siteError !== undefined ? (
                <div>
                  <span className="fw-bold">An error occurred:</span>
                  {" "}
                  {siteError.message}
                </div>
              ) : (
                <div className="d-flex justify-content-center">
                  <div className="spinner spinner-border text-primary" role="status" />
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer as="fieldset" disabled={state.isInProgress}>
          <button className="btn btn-secondary" onClick={hide} type="button">Cancel</button>

          {siteError === undefined ? (
            <button
              className="align-items-center btn btn-danger d-flex gap-4"
              disabled={site === undefined}
              onClick={confirm}
              type="button"
            >
              {state.isInProgress ? (
                <span className="spinner-border spinner-border-sm" />
              ) : null}

              Delete
            </button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </Portal>
  );
}
