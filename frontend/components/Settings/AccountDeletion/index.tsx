import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Card } from "react-bootstrap";
import { Modal } from "./Modal";

export function AccountDeletion() {
  const router = useRouter();

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Account deletion</Card.Title>

          <p>
            {"Here you can delete your PoeticMetric account and all the related data. "}

            <span className="fw-bold">
            But be careful, this process is undoable and all the data related to your account will be deleted irreversibly.
          </span>
          </p>

          <p>
            Before continuing, you can always contact us if there is anything we can help.
          </p>

          <div className="d-flex flex-column flex-md-row gap-2">
            <a
              className="btn btn-primary"
              href="mailto:support@poeticmetric.com?subject=Support%20request%20(I%20am%20considering%20to%20delete%20my%20account)"
            >
              Contact support
            </a>

            <Link
              className="btn btn-outline-danger"
              href={{ pathname: router.pathname, query: { ...router.query, action: "account-deletion" } }}
            >
              Delete my account
            </Link>
          </div>
        </Card.Body>
      </Card>

      <Modal />
    </>
  );
}