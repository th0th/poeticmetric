"use client";

import classNames from "classnames";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTimeoutFn } from "react-use";
import ToastsContext, { ToastsContextToast } from "~contexts/ToastsContext";

export type ToastProps = {
  toast: ToastsContextToast;
};

type State = {
  autoHide: boolean;
  isShown: boolean;
};

const closeButtonClassNames: Record<ToastsContextToast["variant"], string> = {
  danger: "btn-close-white",
  light: "",
  success: "btn-close-white",
};

const variantClassNames: Record<ToastsContextToast["variant"], string> = {
  danger: "bg-danger text-white",
  light: "bg-body text-body",
  success: "bg-success text-white",
};

export default function Toast({ toast }: ToastProps) {
  const { deleteToast } = useContext(ToastsContext);
  const [state, setState] = useState<State>({ autoHide: true, isShown: false });

  const handleClose = useCallback(() => {
    setState((s) => ({ ...s, isShown: false }));

    window.setTimeout(() => deleteToast(toast.id), 400);
  }, [deleteToast, toast.id]);

  const [, cancel, reset] = useTimeoutFn(() => {
    handleClose();
  }, 3000);

  const handleMouseEnter = useCallback(() => cancel(), [cancel]);
  const handleMouseLeave = useCallback(() => reset(), [reset]);

  useEffect(() => setState((s) => ({ ...s, isShown: true })), []);

  return (
    <div
      className={classNames(
        "fade show toast",
        !state.isShown && "showing",
        variantClassNames[toast.variant],
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body">{toast.body}</div>

        <button
          className={classNames("btn-close me-2 ms-2 mt-2", closeButtonClassNames[toast.variant])}
          onClick={handleClose}
          type="button"
        />
      </div>
    </div>
  );
}
