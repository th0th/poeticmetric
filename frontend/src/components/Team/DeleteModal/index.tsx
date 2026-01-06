import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import Portal from "~/components/Portal";
import useUser from "~/hooks/api/useUser";
import useUsers from "~/hooks/api/useUsers";
import { api } from "~/lib/api";
import { NewError } from "~/lib/errors";
import { getUpdatedLocation } from "~/lib/router";

type State = {
  isHiding: boolean;
  isInProgress: boolean;
};

export default function DeleteModal() {
  const { showBoundary } = useErrorBoundary();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<State>({ isHiding: false, isInProgress: false });
  const userID = useMemo(() => Number(searchParams.get("userID")) || undefined, [searchParams]);
  const { data: user, error: userError } = useUser(userID);
  const { mutate } = useUsers();

  async function confirm() {
    try {
      setState((s) => ({ ...s, isInProgress: true }));
      const response = await api.delete(`/users/${userID}`);

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
    navigate(getUpdatedLocation(location, { search: { action: null, userID: null } }), { replace: true });
    setState((s) => ({ ...s, isHiding: false }));
  }

  function hide() {
    setState((s) => ({ ...s, isHiding: true }));
  }

  useEffect(() => {
    if (user?.isOrganizationOwner) {
      hide();
    }
  }, [user?.isOrganizationOwner]);

  return (
    <Portal>
      <Modal centered onExited={handleExited} onHide={hide} show={userID !== undefined && !state.isHiding}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {user !== undefined ? (
            <>
              Are you sure you want to delete
              {" "}
              {user.name.trim() === "" ? "this team member" : (
                <>
                  team member
                  {" "}
                  <span className="fw-semi-bold">{user?.name}</span>
                </>
              )}
              ?
            </>
          ) : (
            <>
              {userError !== undefined ? (
                <div>
                  <span className="fw-bold">An error occurred:</span>
                  {" "}
                  {userError.message}
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

          {userError === undefined ? (
            <button
              className="align-items-center btn btn-danger d-flex gap-4"
              disabled={user === undefined}
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
