"use client";

import React from "react";
import useAuthUser from "~hooks/useAuthUser";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { data } = useAuthUser();

  return data === undefined ? (
    <div className="m-auto spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  ) : (
    <>
      {!data.isEmailVerified ? (
        <div className="align-items-center d-flex flex-column flex-grow-1 justify-content-center py-5">
          <div className="text-center">
            <i className="bi bi-envelope-at bis-5rem text-primary" />

            <h3>Please verify your e-mail address</h3>

            <div className="fs-5 fw-medium text-muted">You need to verify your e-mail address to continue.</div>
          </div>
        </div>
      ) : children}
    </>
  );
}
