import { useState } from "react";
import CanonicalLink from "~/components/CanonicalLink";
import Title from "~/components/Title";
import Modal from "./Modal";

type State = {
  isModalShown: boolean;
};

export default function AccountDeletion() {
  const [state, setState] = useState<State>({ isModalShown: false });

  function hideModal() {
    setState((s) => ({ ...s, isModalShown: false }));
  }

  function showModal() {
    setState((s) => ({ ...s, isModalShown: true }));
  }

  return (
    <>
      <Title>Settings - Account deletion</Title>
      <CanonicalLink path="/settings/account-deletion" />

      <div className="card">
        <div className="card-body position-relative">
          <h2 className="fs-5">Account deletion</h2>

          <p>
            {"Here you can delete your PoeticMetric account and all the related data. "}

            <span className="fw-bold">
            But be careful, this process is undoable and all the data related to your account will be deleted irreversibly.
          </span>
          </p>

          <p>Before continuing, you can always contact us if there is anything we can help.</p>

          <div className="d-flex flex-column flex-md-row gap-4">
            <a
              className="btn btn-primary"
              href="mailto:support@poeticmetric.com?subject=Support%20request%20(I%20am%20considering%20to%20delete%20my%20account)"
            >
              Contact support
            </a>

            <button className="btn btn-outline-danger" onClick={showModal} type="button">
              Delete my account
            </button>
          </div>
        </div>
      </div>

      <Modal onHide={hideModal} show={state.isModalShown} />
    </>
  );
}

export const Component = AccountDeletion;
