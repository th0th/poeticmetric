import React, { createContext } from "react";

export type ToastsContextToast = {
  body: React.ReactNode;
  key: string;
  variant: "light" | "danger" | "success";
};

export type ToastsContextValue = {
  addToast: (toast: Omit<ToastsContextToast, "key">) => any;
  deleteToast: (key: ToastsContextToast["key"]) => any;
  toasts: Array<ToastsContextToast>;
};

export const ToastsContext = createContext<ToastsContextValue>({
  addToast: (_: Omit<ToastsContextToast, "key">) => null,
  deleteToast: (_: ToastsContextToast["key"]) => null,
  toasts: [],
});
