import { uniqueId } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import { ToastsContext, ToastsContextToast, ToastsContextValue } from "../../contexts";
import { Portal } from "../Portal";
import { Toast } from "./Toast";

type ToastsHandlerProps = {
  children: React.ReactNode;
};

type State = {
  toasts: Array<ToastsContextToast>;
};

export function ToastsHandler({ children }: ToastsHandlerProps) {
  const [state, setState] = useState<State>({ toasts: [] });

  const addToast = useCallback<ToastsContextValue["addToast"]>((t) => setState((s) => ({
    ...s,
    toasts: [...s.toasts, { ...t, key: uniqueId("toast-") }],
  })), []);

  const deleteToast = useCallback<ToastsContextValue["deleteToast"]>((key) => setState((s) => ({
    ...s,
    toasts: s.toasts.filter((t) => t.key !== key),
  })), []);

  const value = useMemo<ToastsContextValue>(() => ({
    addToast,
    deleteToast,
    toasts: state.toasts,
  }), [addToast, deleteToast, state.toasts]);

  return (
    <ToastsContext.Provider value={value}>
      <Portal>
        <ToastContainer className="p-4" position="top-center">
          {state.toasts.map((t) => (
            <Toast deleteToast={deleteToast} key={t.key} toast={t} />
          ))}
        </ToastContainer>
      </Portal>

      {children}
    </ToastsContext.Provider>
  );
}
