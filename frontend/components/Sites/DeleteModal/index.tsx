import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { mutate } from "swr";
import { ToastsContext } from "../../../contexts";
import { api } from "../../../helpers";
import { useQueryParameter, useSite } from "../../../hooks";

const routerQueryKey = "deleteSiteId";

type State = {
  site: Site | undefined;
};

export function DeleteModal() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const { hasError: hasIdError, value: id } = useQueryParameter(routerQueryKey, "number");
  const { data: site, error: siteError } = useSite(id);
  const [state, setState] = useState<State>({ site: undefined });

  const handleExited = useCallback(() => setState((s) => ({ ...s, site: undefined })), []);

  const handleHide = useCallback(
    () => router.push({ pathname: router.pathname, query: omit(router.query, [routerQueryKey]) }),
    [router],
  );

  const handleDelete = useCallback(async () => {
    if (site === undefined) {
      return;
    }

    const response = await api.delete(`/sites/${site.id}`);

    if (!response.ok) {
      const responseJson = await response.json();
      addToast({ body: responseJson || "An error has occurred.", variant: "danger" });

      return;
    }

    addToast({ body: "Site is deleted.", variant: "success" });
    await handleHide();
    await mutate("/sites");
  }, [addToast, handleHide, site]);

  useEffect(() => {
    if (hasIdError || siteError !== undefined) {
      addToast({ body: siteError?.message || "Not found.", variant: "danger" });
      router.replace("/team");
    }
  }, [addToast, hasIdError, router, siteError]);

  useEffect(() => {
    if (site !== undefined) {
      setState((s) => ({ ...s, site }));
    }
  }, [site]);

  return (
    <Modal onExited={handleExited} onHide={handleHide} show={site !== undefined}>
      <Modal.Header closeButton>
        <Modal.Title>Delete site</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {"Are you sure you want to delete the site "}

        <span className="fw-semibold">{state.site?.name}</span>

        ?
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleHide} variant="secondary">Cancel</Button>

        <Button onClick={handleDelete} variant="danger">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
