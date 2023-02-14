import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { mutate } from "swr";
import { ToastsContext } from "../../../contexts";
import { api } from "../../../helpers";
import { useQueryParameter, useUser } from "../../../hooks";

const routerQueryKey = "newOrganizationOwnerId";

type State = {
  user: User | undefined;
};

export function OrganizationOwnershipTransferModal() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const { hasError: hasIdError, value: id } = useQueryParameter(routerQueryKey, "number");
  const { data: user, error: userError } = useUser(id);
  const [state, setState] = useState<State>({ user: undefined });

  const handleExited = useCallback(() => setState((s) => ({ ...s, user: undefined })), []);

  const handleHide = useCallback(
    () => router.push({ pathname: router.pathname, query: omit(router.query, [routerQueryKey]) }),
    [router],
  );

  const handleDelete = useCallback(async () => {
    if (user === undefined) {
      return;
    }

    const response = await api.post("/users/make-owner", { id: user.id });

    if (!response.ok) {
      const responseJson = await response.json();
      addToast({ body: responseJson || "An error has occurred.", variant: "danger" });

      return;
    }

    addToast({ body: "Organization ownership is transferred.", variant: "success" });
    await handleHide();
    await mutate("/users");
  }, [addToast, handleHide, user]);

  useEffect(() => {
    if (hasIdError || userError !== undefined) {
      addToast({ body: userError?.message || "Not found.", variant: "danger" });
      router.replace("/team");
    }
  }, [addToast, hasIdError, router, userError]);

  useEffect(() => {
    if (user !== undefined) {
      setState((s) => ({ ...s, user }));
    }
  }, [user]);

  return (
    <Modal onExited={handleExited} onHide={handleHide} show={user !== undefined}>
      <Modal.Header closeButton>
        <Modal.Title>Transfer organization ownership</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="fw-bold">
          Beware! There can only be one organization owner. Transferring the ownership to this team member will revoke your owner role.
        </p>

        {"Are you sure you want to transfer the organization ownership to "}

        <span className="fw-semibold">{state.user?.name}</span>

        ?
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleHide} variant="secondary">Cancel</Button>

        <Button onClick={handleDelete} variant="danger">Transfer the ownership</Button>
      </Modal.Footer>
    </Modal>
  );
}
