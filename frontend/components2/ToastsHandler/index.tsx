"use client";

import { uniqueId } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import ToastsContext, { ToastsContextToast, ToastsContextValue } from "~contexts/ToastsContext";
import Portal from "../Portal";
import Toast from "../Toast";

type ToastsHandlerProps = {
  children: React.ReactNode;
};

type State = {
  toasts: Array<ToastsContextToast>;
};

export default function ToastsHandler({ children }: ToastsHandlerProps) {
  const [state, setState] = useState<State>({ toasts: [] });

  const addToast = useCallback<ToastsContextValue["addToast"]>((t) => setState((s) => ({
    ...s,
    toasts: [...s.toasts, { ...t, id: uniqueId("toast-") }],
  })), []);

  const deleteToast = useCallback<ToastsContextValue["deleteToast"]>((id) => setState((s) => ({
    ...s,
    toasts: s.toasts.filter((t) => t.id !== id),
  })), []);

  const value = useMemo<ToastsContextValue>(() => ({
    addToast,
    deleteToast,
    toasts: state.toasts,
  }), [addToast, deleteToast, state.toasts]);

  return (
    <ToastsContext.Provider value={value}>
      <Portal>
        <div className="p-4 position-fixed start-50 toast-container top-0 translate-middle-x">
          {state.toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      </Portal>

      {children}
    </ToastsContext.Provider>
  );
}
