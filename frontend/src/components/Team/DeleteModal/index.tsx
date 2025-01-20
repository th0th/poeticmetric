import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import Portal from "~/components/Portal";
import useUsers from "~/hooks/api/useUsers";
import useSearchParams from "~/hooks/useSearchParams";
import { api } from "~/lib/api";

type State = {
  isInProgress: boolean;
  isShown: boolean;
  user: HydratedUser | null;
};

export default function DeleteModal() {
  const { showBoundary } = useErrorBoundary();
  const { navigateWithSearchParams, searchParams } = useSearchParams();
  const [state, setState] = useState<State>({ isInProgress: false, isShown: false, user: null });
  const isEnabled = useMemo(() => searchParams.get("action") === "delete", [searchParams]);
  const userID = useMemo(() => Number(searchParams.get("userID")) || undefined, [searchParams]);
  const { mutate } = useUsers();

  async function confirmDeletion() {
    try {
      setState((s) => ({ ...s, isInProgress: true }));
      const response = await api.delete(`/users/${userID}`);

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
    navigateWithSearchParams({ action: null, userID: null });
  }

  function hide() {
    setState((s) => ({ ...s, isShown: false }));
  }

  useEffect(() => {
    if (isEnabled && userID !== undefined) {
      setState((s) => ({ ...s, isShown: true }));
    }
  }, [isEnabled, userID]);

  useEffect(() => {
    async function getUser() {
      try {
        if (userID === null) {
          return;
        }

        const response = await api.get(`/users/${userID}`);

        if (response.ok) {
          const user = await response.json();
          setState((s) => ({ ...s, user }));
        }
      } catch (e) {
        showBoundary(e);
      }
    }

    getUser().catch((e) => {
      showBoundary(e);
    });
  }, [showBoundary, userID]);

  return (
    <Portal>
      <Modal centered onExited={handleExited} onHide={hide} show={state.isShown}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete team member
          {" "}
          <span className="fw-semi-bold">{state.user?.name}</span>
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

  // const { data: user } = useUser(userID || undefined);
  // const { mutate: mutateUsers } = useUsers();
  //
  // async function confirmDeletion() {
  //   try {
  //     const response = await api.delete(`/users/${userID}`);
  //
  //     if (response.ok) {
  //       await mutateUsers();
  //
  //       hide();
  //     }
  //   } catch (e) {
  //     showBoundary(e);
  //   }
  // }
  //
  // function hide() {
  //   navigateWithSearchParams({ action: null, userID: null });
  // }
  //
  // return (
  //   <Portal>
  //     <Modal centered onHide={hide} show={user !== undefined}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Delete user</Modal.Title>
  //       </Modal.Header>
  //
  //       <Modal.Body>
  //         Are you sure you want to delete team member
  //         {" "}
  //         <span className="fw-semi-bold">{user?.name}</span>
  //         ?
  //       </Modal.Body>
  //
  //       <Modal.Footer>
  //         <button className="btn btn-secondary" onClick={hide} type="button">Cancel</button>
  //
  //         <button className="align-items-center btn btn-danger d-flex gap-4" onClick={confirmDeletion} type="button">
  //           {/*{state.isInProgress ? (*/}
  //           {/*  <>*/}
  //           {/*    <span className="spinner-border spinner-border-sm" />*/}
  //           {/*    {" "}*/}
  //           {/*  </>*/}
  //           {/*) : null}*/}
  //
  //           Delete
  //         </button>
  //       </Modal.Footer>
  //     </Modal>
  //   </Portal>
  // );
}
