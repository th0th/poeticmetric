import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CloseButton, CloseButtonProps, Toast as BsToast, ToastProps as BsToastProps } from "react-bootstrap";
import { ToastsContextToast, ToastsContextValue } from "../../../contexts";

type ToastProps = Overwrite<Omit<BsToastProps, "autohide" | "children">, {
  deleteToast: ToastsContextValue["deleteToast"];
  toast: ToastsContextToast;
}>;

type State = {
  autoHide: boolean;
  isShown: boolean;
};

const toastBgs: Record<ToastsContextToast["variant"], BsToastProps["bg"]> = {
  danger: "danger",
  light: "light",
  success: "success",
};

const bodyClassNames: Record<ToastsContextToast["variant"], string | undefined> = {
  danger: "text-white",
  light: undefined,
  success: "text-white",
};

const closeButtonVariants: Record<ToastsContextToast["variant"], CloseButtonProps["variant"]> = {
  danger: "white",
  light: undefined,
  success: "white",
};

export function Toast({ deleteToast, toast, ...props }: ToastProps) {
  const [state, setState] = useState<State>({ autoHide: true, isShown: false });

  const bg = useMemo(() => toastBgs[toast.variant], [toast.variant]);
  const bodyClassName = useMemo(() => bodyClassNames[toast.variant], [toast.variant]);
  const closeButtonVariant = useMemo(() => closeButtonVariants[toast.variant], [toast.variant]);

  const handleClose = useCallback(() => {
    setState((s) => ({ ...s, isShown: false }));

    window.setTimeout(() => deleteToast(toast.key), 1000);
  }, [deleteToast, toast.key]);

  const handleMouseEnter = useCallback(() => setState((s) => ({ ...s, autoHide: false })), []);
  const handleMouseLeave = useCallback(() => setState((s) => ({ ...s, autoHide: true })), []);

  useEffect(() => setState((s) => ({ ...s, isShown: true })), []);

  return (
    <BsToast
      {...props}
      autohide={state.autoHide}
      bg={bg}
      onClose={handleClose}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      show={state.isShown}
    >
      <BsToast.Body className={classNames("d-flex flex-row", bodyClassName)}>
        <div className="flex-grow-1 me-auto fw-semibold">{toast.body}</div>

        <CloseButton className="ms-3" onClick={handleClose} variant={closeButtonVariant} />
      </BsToast.Body>
    </BsToast>
  );
}
