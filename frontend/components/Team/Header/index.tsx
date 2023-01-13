import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useMemo } from "react";
import { Form } from "react-bootstrap";
import { Breadcrumb } from "../..";
import { AuthAndApiContext } from "../../../contexts";
import { useUsers } from "../../../hooks";

type Status = {
  label: string;
  value: string;
};

export function Header() {
  const router = useRouter();
  const { organization } = useContext(AuthAndApiContext);
  const { data: users } = useUsers();

  const handleStatusFilterChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(async (event) => {
    const query = omit(router.query, "status");

    if (event.target.value !== "") {
      query.status = event.target.value;
    }

    await router.push({ pathname: router.pathname, query });
  }, [router]);

  const statusFilterNode = useMemo<React.ReactNode>(() => {
    const statuses: Array<Status> = Array.from(new Set(users?.map((u) => ({
      label: u.isActive ? "Active" : "Pending",
      value: u.isActive ? "active" : "pending",
    }))));

    if (statuses.length < 2) {
      return null;
    }

    return (
      <Form.Select onChange={handleStatusFilterChange}>
        <option value="">All statuses</option>

        {statuses.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </Form.Select>
    );
  }, [handleStatusFilterChange, users]);

  return (
    <>
      <Breadcrumb title={`${organization?.name} team`} />

      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <div className="d-flex flex-column">
          {statusFilterNode}
        </div>

        <div className="flex-grow-1" />

        <div className="d-grid">
          <Link className="btn btn-primary" href="/team/invite">Invite new team member</Link>
        </div>
      </div>
    </>
  );
}
