import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { useLocation } from "wouter";
import Portal from "~/components/Portal";
import useSites from "~/hooks/api/useSites";
import useSearchParams from "~/hooks/useSearchParams";
import { api } from "~/lib/api";
import { getUpdatedSearch } from "~/lib/router";

type State = {
  isInProgress: boolean;
  isShown: boolean;
  site: HydratedSite | null;
};

export default function DeleteModal() {
  const { showBoundary } = useErrorBoundary();
  const [location, navigate] = useLocation();
  const [search, searchParams] = useSearchParams();
  const [state, setState] = useState<State>({ isInProgress: false, isShown: false, site: null });
  const isEnabled = useMemo(() => searchParams.get("action") === "delete", [searchParams]);
  const siteID = useMemo(() => Number(searchParams.get("siteID")) || undefined, [searchParams]);
  const { mutate } = useSites();

  async function confirmDeletion() {
    try {
      setState((s) => ({ ...s, isInProgress: true }));
      const response = await api.delete(`/sites/${siteID}`);

      if (response.ok) {
        await mutate();

        hide();
      }
    } catch (e) {
      showBoundary(e);
    } finally {
      setState((s) => ({ ...s, isInProgress: false }));
    }
  }

  function handleExited() {
    navigate(`${location}${getUpdatedSearch(search, { action: null, siteID: null })}`, { replace: true });
  }

  function hide() {
    setState((s) => ({ ...s, isShown: false }));
  }

  useEffect(() => {
    if (isEnabled && siteID !== undefined) {
      setState((s) => ({ ...s, isShown: true }));
    }
  }, [isEnabled, siteID]);

  useEffect(() => {
    async function getSite() {
      try {
        if (siteID === null) {
          return;
        }

        const response = await api.get(`/sites/${siteID}`);

        if (response.ok) {
          const site = await response.json();
          setState((s) => ({ ...s, site }));
        }
      } catch (e) {
        showBoundary(e);
      }
    }

    getSite().catch((e) => {
      showBoundary(e);
    });
  }, [showBoundary, siteID]);

  return (
    <Portal>
      <Modal centered onExited={handleExited} onHide={hide} show={state.isShown}>
        <Modal.Header closeButton>
          <Modal.Title>Delete site</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete site
          {" "}
          <span className="fw-semi-bold">{state.site?.name}</span>
          ?
        </Modal.Body>

        <Modal.Footer as="fieldset" disabled={state.isInProgress}>
          <button className="btn btn-secondary" onClick={hide} type="button">Cancel</button>

          <button className="align-items-center btn btn-danger d-flex gap-4" onClick={confirmDeletion} type="button">
            {state.isInProgress ? (
              <span className="spinner-border spinner-border-sm" />
            ) : null}

            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </Portal>
  );
}
